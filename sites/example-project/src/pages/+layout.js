import { browser } from '$app/environment';
import { Type } from 'apache-arrow';

/** @type {import("@duckdb/duckdb-wasm").AsyncDuckDB} */
let db;

async function initDB() {
	if (!browser) return;
	if (db) return;

	// Instantiate worker
	const duckdb_worker = (
		await import('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker')
	).default;
	const { ConsoleLogger, AsyncDuckDB } = await import('@duckdb/duckdb-wasm');
	const duckdb_wasm = (await import('@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url')).default;

	const logger = new ConsoleLogger();
	const worker = new duckdb_worker();

	// and asynchronous database
	db = new AsyncDuckDB(logger, worker);
	await db.instantiate(duckdb_wasm);
	await db.open({ query: { castBigIntToDouble: true, castTimestampToDate: true } });
}

/**
 * Adds a new view to the database, pointing to the provided parquet URL.
 *
 * @param {string} table
 * @param {string} url
 * @param {string} schema
 * @returns {Promise<void>}
 */
async function setParquetURL(table, url, schema) {
	if (!browser) return;
	if (!db) await initDB();

	const connection = await db.connect();

	const file_name = `${table}.parquet`;
	await db.registerFileURL(file_name, url, 4, false);
	await connection.query(
		`CREATE OR REPLACE VIEW ${schema}.${table} AS SELECT * FROM read_parquet('${file_name}');`
	);

	await connection.close();
}

/**
 * Updates the duckdb search path to include only the list of included schemas
 * @param {string[]} schemas
 * @returns {Promise<void>}
 */
async function updateSearchPath(schemas) {
	if (!browser) return;
	if (!db) await initDB();

	const connection = await db.connect();

	await connection.query(`PRAGMA search_path='${schemas.join(',')}'`);

	await connection.close();
}

/**
 * Creates a new DuckDB Schema
 * @param {string} name
 * @returns {Promise<void>}
 */
async function createSchema(name) {
	if (!browser) return;
	if (!name) {
		console.warn(`Cannot create schema, name was not provided`);
		return;
	}
	if (!db) await initDB();

	const connection = await db.connect();

	await connection.query(`CREATE SCHEMA IF NOT EXISTS ${name};`);
	await connection.close();
}

/**
 * Queries the database with the given SQL statement.
 *
 * @param {string} sql
 * @returns {Promise<ReturnType<import("@duckdb/duckdb-wasm").AsyncDuckDBConnection['query']> | null>}
 */
async function query(sql) {
	if (!browser) return null;
	if (!db) await initDB();

	const connection = await db.connect();
	const res = await connection.query(sql).then(arrowTableToJSON);
	await connection.close();

	return res;
}

/**
 * Converts an Apache Arrow type to an Evidence type.
 *
 * @param {import("apache-arrow").Type} type
 */
function apacheToEvidenceType(type) {
	switch (
		type.typeId // maybe just replace with `typeof`
	) {
		case Type.Date:
			return 'date';
		case Type.Float:
		case Type.Int:
			return 'number';
		case Type.Bool:
			return 'boolean';
		case Type.Dictionary:
		default:
			return 'string';
	}
}

/**
 *
 * @param {import("apache-arrow").Table} table
 * @returns
 */
function arrowTableToJSON(table) {
	if (table == null) return [];
	const arr = table.toArray();

	Object.defineProperty(arr, '_evidenceColumnTypes', {
		enumerable: false,
		value: table.schema.fields.map((field) => ({
			name: field.name,
			evidenceType: apacheToEvidenceType(field.type),
			typeFidelity: 'precise'
		}))
	});

	return arr;
}

/** @type {import("./$types").LayoutLoad} */
export const load = async ({
	fetch,
	data: { customFormattingSettings, routeHash, renderedFiles, isUserPage }
}) => {
	let data = {};
	if (isUserPage) {
		const res = await fetch(`/api/${routeHash}.json`);
		// has to be cloned to bypass the proxy https://github.com/sveltejs/kit/blob/master/packages/kit/src/runtime/server/page/load_data.js#L297
		({ data } = await res.clone().json());
	}

	for (const source in renderedFiles) {
		await createSchema(source);
		for (const url of renderedFiles[source]) {
			await setParquetURL(url.split('/').at(-1).slice(0, -'.parquet'.length), url, source);
		}
	}
	await updateSearchPath(Object.keys(renderedFiles));

	// await setParquetURL('taxis', '/taxis.parquet');

	return {
		__db: { query },
		data,
		customFormattingSettings,
		isUserPage
	};
};
