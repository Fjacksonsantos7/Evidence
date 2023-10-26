import { browser, building } from '$app/environment';
import {
	tableFromIPC,
	initDB,
	setParquetURLs,
	query,
	updateSearchPath,
	arrowTableToJSON
} from '@evidence-dev/universal-sql/client-duckdb';
import { profile } from '@evidence-dev/component-utilities/profile';

const initDb = async () => {
	let renderedFiles = {};

	if (!browser) {
		const { readFile } = await import('fs/promises');
		({ renderedFiles } = JSON.parse(
			await readFile(
				process.cwd().includes('.evidence')
					? '../../static/data/manifest.json'
					: './static/data/manifest.json',
				'utf-8'
			).catch(() => '{}')
		));
	} else {
		const res = await fetch('/data/manifest.json');
		if (res.ok) ({ renderedFiles } = await res.json());
	}

	if (!renderedFiles) {
		throw new Error('Unable to load source manifest. Do you need to run build:sources?');
	}

	await profile(initDB);
	await profile(setParquetURLs, renderedFiles);
	await profile(updateSearchPath, Object.keys(renderedFiles));
};

const database_initialization = profile(initDb);

/** @satisfies {import("./$types").LayoutLoad} */
export const load = async ({
	fetch,
	data: { customFormattingSettings, routeHash, isUserPage, evidencemeta }
}) => {
	if (!browser) await database_initialization;

	const data = {};

	// let SSR saturate the cache first
	if (browser && isUserPage) {
		await Promise.all(
			evidencemeta.queries?.map(async ({ id }) => {
				const res = await fetch(`/api/${routeHash}/${id}.arrow`);
				if (res.ok) {
					const table = await tableFromIPC(res);
					data[id] = arrowTableToJSON(table);
				}
			}) ?? []
		);
	}

	return {
		__db: {
			query(sql, query_name) {
				if (browser) {
					return database_initialization.then(() => query(sql));
				}

				return query(sql, { route_hash: routeHash, query_name, prerendering: building });
			},
			async updateParquetURLs(manifest) {
				// todo: maybe diff with old?
				const { renderedFiles } = JSON.parse(manifest);
				await profile(setParquetURLs, renderedFiles);
			}
		},
		data,
		customFormattingSettings,
		isUserPage,
		evidencemeta
	};
};
