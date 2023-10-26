const runQuery = require('@evidence-dev/duckdb');

/** @type {import("@evidence-dev/db-commons").RunQuery<never>} */
module.exports = async (queryString, _, batchSize) => {
	return runQuery(queryString, { filename: ':memory:' }, batchSize);
};

/** @type {import("@evidence-dev/db-commons").GetRunner<never>} */
module.exports.getRunner = () => {
	return async (queryContent, queryPath, batchSize) => {
		// Filter out non-csv files
		if (!queryPath.endsWith('.csv')) return null;
		// Use DuckDBs auto CSV loading
		// https://duckdb.org/docs/data/csv/overview.html
		return runQuery(`SELECT * FROM '${queryPath}'`, { filename: ':memory:' }, batchSize);
	};
};
