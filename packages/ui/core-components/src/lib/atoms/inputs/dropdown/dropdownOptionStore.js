import { derived, get, readonly, writable } from 'svelte/store';
import { batchUp } from '@evidence-dev/sdk/utils';
// TODO use lodash/merge not lodash.merge
import merge from 'lodash.merge';

/*

- have a dropdown in tabs / accordion
- on initial render you don't render the dropdown
- the dropdown is unset
*/

/** @template T @typedef {import("svelte/store").Readable<T>} Readable<T> */
/** @template T @typedef {import("svelte/store").Writable<T>} Writable<T> */

/**
 * @typedef {Object} DropdownOption
 * @property {string | undefined | null} label
 * @property {string | undefined | null} value
 * @property {number} idx
 * @property {boolean} selected
 * @property {boolean} [__auto]
 * @property {boolean} [__removeOnDeselect]
 */

/*
	When do defaults get applied?
	  - When we have created the store
	  - After the waitFor conditions
*/

/**
 * @typedef {Object} DropdownOptionStoreOpts
 * @property {boolean} [multiselect=false]
 * @property {DropdownOption[]} [initialOptions] This should be pulled from $inputs[name].rawValues
 * @property {((string | number)[])} defaultValues
 * @property {boolean} [noDefault=false] Does not select the first value by default
 */

/** @type {DropdownOptionStoreOpts} */
const defaultOpts = {
	multiselect: false,
	initialOptions: [],
	defaultValues: [],
	noDefault: false
};

/**
 * @param {DropdownOptionStoreOpts} opts
 */
export const dropdownOptionStore = (opts = {}) => {
	const config = merge({}, defaultOpts, opts);

	/** @type {Writable<DropdownOption[]>} */
	const options = writable(hygiene(config.initialOptions));

	const getSelected = ($options) => $options.filter((option) => option.selected);
	/** @type {Readable<DropdownOption[]>} */
	const selectedOptions = derived(
		options,
		($value) => getSelected($value),
		getSelected(config.initialOptions)
	);

	options.update = (updater) => {
		// Enforce hygiene
		const result = updater(get(options));
		options.set(hygiene(result));
	};

	const defaults = new Set(config.defaultValues);
	if (!config.multiselect && defaults.size > 1) {
		defaults.clear();
		defaults.add(config.defaultValues[0]);
		console.debug("Single-select dropdowns only accept one default value.")
	} if (config.initialOptions.length > 0) {
		// We don't apply anything with defaults
		defaults.clear();
	}
	let selectFirst = !config.multiselect && !config.noDefault && config.defaultValues.length === 0;

	return {
		/**
		 * @param {...DropdownOption} option
		 */
		addOptions: batchUp(
			/**
			 * @param  {...(DropdownOption[] | DropdownOption)} newOptions
			 */
			(...newOptions) => {
				const opts = newOptions.flat();
				options.update(($options) => {
					opts.forEach((option) => {
						if (!option) return;
						
						if (selectFirst) {
							option.selected = true;
							selectFirst = false;
						}

						// Apply defaults
						if (defaults.has(option.value)) {
							option.selected = true;
							defaults.delete(option.value);
						}

						// Apply defaults for option
						if (!('__auto' in option)) option.__auto = false;
						if (!('selected' in option)) option.selected = false;
						if (!('idx' in option)) option.idx = -1; // non-auto options float to the top

						const exists = $options.find((other) => optEq(other, option));
						if (!exists) $options.push(option);
					});
					return $options;
				});
			},
			100
		),
		/**
		 * @param  {...DropdownOption} removeOptions
		 */
		removeOptions: batchUp(
			/** @param {...(DropdownOption[] | DropdownOption)} removeOptions */
			(...removeOptions) => {
				const opts = removeOptions.flat();
				options.update(($options) => {
					return $options.reduce((a, v) => {
						if (!v) return a;
						if (opts.find((x) => optEq(x, v))) {
							if (v.selected) v.__removeOnDeselect = true;
							else return a;
						}
						a.push(v);
						return a;
					}, /** @type {DropdownOption[]} */ ([]));
				});
			},
			100
		),
		/**
		 * @param  {...DropdownOption} toggleOptions
		 * @returns {void}
		 */
		toggleSelected: batchUp(
			/** @param {...(DropdownOption[] | DropdownOption)} removeOptions */
			(...toggleOptions) => {
				const toToggle = toggleOptions.flat();
				options.update(($options) => {
					if (config.multiselect) {
						// For multi-select, toggle each option
						return $options.reduce((a, v) => {
							if (!v) return a;
							if (toToggle.find((x) => optEq(x, v))) {
								v.selected = !v.selected;
							}
							a.push(v);
							return a;
						}, /** @type {DropdownOption[]} */ ([]));
					} else {
						// For single-select, deselect everything and select only the last option
						$options.forEach((o) => (o.selected = false));

						const toSelect = toToggle.at(-1);

						const output = $options.reduce((a, v) => {
							if (optEq(v, toSelect)) {
								v.selected = true;
							}

							a.push(v);
							return a;
						}, /** @type {DropdownOption[]} */ ([]));

						return output;
					}
				});
			},
			100
		),
		selectAll: () => options.update((o) => o.map((o) => ({ ...o, selected: true }))),
		deselectAll: () => options.update((o) => o.map((o) => ({ ...o, selected: false }))),
		options: readonly(options),
		selectedOptions
	};
};

const hygiene = ($options) => {
	// Process __removeOnDeselect
	$options = $options.filter(o => !(o.__removeOnDeselect && !o.selected));

	// Uniqueify
	const knownValues = new Set();
	$options = $options.reduce((a, c) => {
		if (!knownValues.has(optStr(c))) {
			knownValues.add(optStr(c));
			a.push(c);
		}
		return a;
	}, /** @type {DropdownOption[]} */ ([]));

	// Sort
	$options = $options.sort((a, b) => {
		// Selected options go to the top
		if (a.selected && !b.selected) return -1;
		if (b.selected && !a.selected) return 1;

		// Auto options go to the bottom
		if (a.__auto && !b.__auto) return 1;
		if (b.__auto && !a.__auto) return -1;

		// Sort by index
		if (a.idx !== b.idx) {
			return a.idx - b.idx;
		}

		// Sort by label
		// Nulls go to the bottom
		if (a.label === null && b.label !== null) return 1;
		if (b.label === null && a.label !== null) return -1;
		if (a.label === null && b.label === null) return 0;
		// Compare numbers
		if (typeof a.label === 'number' && typeof b.label === 'number' && a.label !== b.label) {
			return a.label - b.label;
		}
		// Compare strings
		const labelDiff = a.label.toString().localeCompare(b.label.toString());
		if (labelDiff !== 0) return labelDiff;

		// If labels are the same, sort by value
		return a.value.toString().localeCompare(b.value.toString());
	});

	return $options;
};

/**
 * @param {DropdownOption} a
 * @returns {string}
 */
const optStr = (a) => String(a.value) + String(a.label);

/**
 * @param {DropdownOption} a
 * @param {DropdownOption} b
 * @returns {boolean}
 */
const optEq = (a, b) => {
	return a.value === b.value && a.label === b.label;
};
