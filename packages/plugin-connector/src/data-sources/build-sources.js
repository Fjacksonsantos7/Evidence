import chalk from 'chalk';
import fs from 'fs/promises';
import { getDatasourcePlugins } from './get-datasource-plugins';
import { getPastSourceHashes, getQueries, saveSourceHashes } from './get-sources';
import path from 'path';
import { createHash } from 'crypto';
import { cleanZodErrors } from '../lib/clean-zod-errors';
import { z } from 'zod';
import { buildMultipartParquet } from '@evidence-dev/universal-sql';
import ora from 'ora';
/**
 * @param {string} directory
 * @returns {Promise<SourceDirectory>}
 */
const buildSourceDirectory = async (directory) => {
	/** @type {SourceDirectory} */
	const output = {};

	for (const f of await fs.readdir(directory, { withFileTypes: true })) {
		if (f.isDirectory()) {
			output[f.name] = await buildSourceDirectory(path.join(directory, f.name));
		} else {
			output[f.name] = () => fs.readFile(path.join(directory, f.name), { encoding: 'utf-8' });
		}
	}

	return output;
};

/**
 * @param {DatasourceSpec[]} sources
 * @param {string} dataPath
 * @param {string} metaPath
 * @param {{ sources: Set<string> | null, queries: Set<string> | null, only_changed: boolean }} [filters] `sources` or `queries` being null means no filter
 * @param {number} [batchSize]
 * @returns {Promise<Record<string, string[]>>}
 */
export const buildSources = async (
	sources,
	dataPath,
	metaPath,
	filters,
	batchSize = 1000 * 1000
) => {
	const plugins = await getDatasourcePlugins();
	const existingHashes = await getPastSourceHashes(metaPath);

	/** @type {Record<string, string[]>} */
	const manifest = {};

	/** @type {Record<string, Record<string, string>>} */
	const hashes = {};

	for (const source of sources) {
		console.log(chalk.bold(`Processing ${source.name}`));
		// For building the manifest
		/** @type {string[]} */
		const outputFilenames = [];
		hashes[source.name] = {};

		if (filters?.sources && !filters.sources.has(source.name)) {
			console.log(chalk.yellow(`[!] Skipping filtered source ${source.name}`));
			continue;
		}
		const targetPlugin = plugins[source.type];
		if (!targetPlugin) {
			console.log(
				chalk.yellow(
					`[!] Unable to process source ${source.name}; no source connector found for ${source.type}`
				)
			);
			continue;
		}

		const connectionValid = await targetPlugin.testConnection(
			source.options,
			source.sourceDirectory
		);
		if (connectionValid !== true) {
			throw new Error(
				chalk.red(`[!] ${chalk.bold(source.name)} failed to connect; ${connectionValid.reason}`)
			);
		}

		const utils = {
			/**
			 * @param {string} name
			 * @param {string} content
			 */
			isCached: (name, content) => {
				const hash = createHash('md5').update(content).digest('hex');
				return existingHashes[source.name][name] === hash;
			},
			/**
			 * @param {string} name
			 */
			isFiltered: (name) =>
				Boolean(filters?.queries?.has(name) || filters?.queries?.has(`${source.name}.${name}`)),
			/**
			 * @param {string} name
			 * @param {string} content
			 */
			shouldRun: (name, content) => !utils.isFiltered(name) && !utils.isCached(name, content),
			/**
			 * @param {string} name
			 * @param {string} content
			 */
			addToCache: (name, content) =>
				(hashes[source.name][name] = createHash('md5').update(content).digest('hex'))
		};

		if (targetPlugin.processSource) {
			// Advanced Source
			// TODO: Progress bar here. (or spinner)
			const sourceIterator = targetPlugin.processSource(
				source.options,
				await buildSourceDirectory(source.sourceDirectory),
				utils
			);

			for await (const table of sourceIterator) {
				// Flush this source
				const spinner = ora({
					prefixText: `  ${table.name}`,
					spinner: 'triangle',
					discardStdin: false,
					interval: 250
				});

				try {
					spinner.start('Processing...');
					const filename = await flushSource(
						source,
						{
							name: table.name,
							filepath: path.join(source.sourceDirectory, table.name),
							content: table.content,
							hash: createHash('md5').update(table.content).digest('hex')
						},
						table,
						dataPath,
						metaPath,
						batchSize,
						spinner
					);
					if (filename) outputFilenames.push(filename);
					continue;
				} catch (e) {
					if (typeof e === 'string') spinner.fail(e);
					else if (typeof e !== 'object' || !e) spinner.fail('Unknown error occured.');
					else if ('message' in e) spinner.fail(e.message?.toString());
				}
			}
		} else {
			// Simple Source
			// Load and iterate through query files
			const queries = await getQueries(
				source.sourceDirectory,
				await fs.readdir(source.sourceDirectory)
			);
			const runner = await targetPlugin.factory(source.options, source.sourceDirectory);

			// TODO: Progress bar here.

			for (const query of queries) {
				const spinner = ora({
					prefixText: `  ${query.name}`,
					spinner: 'triangle',
					discardStdin: false,
					interval: 250
				});

				spinner.start('Processing...');
				try {
					hashes[source.name][query.name] = createHash('md5')
						.update(query.content ?? '')
						.digest('hex');
					/** @type {QueryResult | null} */
					let result;
					try {
						const _r = runner(query.content, query.filepath, batchSize);
						if (_r instanceof Promise) {
							result = await _r.catch((e) => {
								if (e instanceof z.ZodError) console.log(e.format());
								else console.log(e);
								return null;
							});
						} else result = _r;
					} catch (e) {
						if (e instanceof z.ZodError) console.log(cleanZodErrors(e.format()));
						else console.log(e);
						result = null;
					}

					if (result === null) {
						spinner.warn(`Finished. Returned no results!`);
						continue;
					}

					if (result === null) {
						continue;
					}
					const filename = await flushSource(
						source,
						query,
						result,
						dataPath,
						metaPath,
						batchSize,
						spinner
					);

					if (filename) outputFilenames.push(filename);
					continue;
				} catch (e) {
					if (typeof e === 'string') spinner.fail(e);
					else if (typeof e !== 'object' || !e) spinner.fail('Unknown error occured.');
					else if ('message' in e) spinner.fail(e.message?.toString());
				}
			}
		}

		manifest[source.name] = outputFilenames;
	}

	await saveSourceHashes(metaPath, hashes);
	return manifest;
};

/**
 *
 * @param {DatasourceSpec} source
 * @param {DatasourceQuery} query
 * @param {QueryResult} result
 * @param {string} dataPath
 * @param {string} metaPath
 * @param {number} batchSize
 * @param {import("ora").Ora} [spinner]
 * @returns {Promise<null | string>}
 */
const flushSource = async (source, query, result, dataPath, metaPath, batchSize, spinner) => {
	const logOut = /** @param {string} t **/ (t) => (spinner ? (spinner.text = t) : console.log(t));

	const dataOutDir = path.join(dataPath, source.name, query.name, query.hash ?? '');

	const parquetFilename = path.join(dataOutDir, query.name + '.parquet');
	const schemaFilename = path.join(dataOutDir, query.name + '.schema.json');

	const tmpDir = path.join(metaPath, 'intermediate-parquet', query.name);

	// Make sure the directories exist
	await fs.mkdir(dataOutDir, { recursive: true });
	await fs.mkdir(tmpDir, { recursive: true });

	const rows = /** @type {any[] | Generator<any[]>} */ (result.rows);

	if ((result.expectedRowCount ?? -1) > 1000000)
		logOut(chalk.yellow(`Expected row count is ~${result.expectedRowCount?.toLocaleString()}`));
	else if (result.expectedRowCount)
		logOut(`Expected row count is ~${result.expectedRowCount?.toLocaleString()}`);

	// Spinner start
	// Disable the console for a moment, stack up and then print everything after?
	const writtenRows = await buildMultipartParquet(
		result.columnTypes,
		rows,
		tmpDir,
		dataOutDir,
		query.name + '.parquet',
		result.expectedRowCount,
		batchSize
	);
	// Spinner stop?
	if (!writtenRows) {
		(spinner?.warn.bind(spinner) ?? console.warn)(
			chalk.yellow(`Finished. 0 rows, did not create table`)
		);
		return null;
	} else {
		(spinner?.succeed.bind(spinner) ?? console.log)(`Finished. ${writtenRows} rows`);
	}

	await fs.writeFile(schemaFilename, JSON.stringify(result.columnTypes));

	return parquetFilename;
};
