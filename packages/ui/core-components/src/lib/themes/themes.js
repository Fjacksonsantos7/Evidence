// @ts-check

import { getContext, setContext } from 'svelte';
import { derived, get, readable, readonly } from 'svelte/store';
import { browser } from '$app/environment';
import { localStorageStore } from '@evidence-dev/component-utilities/stores';
import { themes, themesConfig } from '$evidence/themes';
import { convertLightToDark } from './convertLightToDark.js';

/** @template T @typedef {import("svelte/store").Readable<T>} Readable */
/** @template T @typedef {import("svelte/store").Writable<T>} Writable */
/** @typedef {import('@evidence-dev/tailwind').Theme} Theme */
/** @typedef {import('@evidence-dev/tailwind').ThemesConfig} ThemesConfig */

/** @returns {Readable<'light' | 'dark'>} */
const createSystemThemeStore = () => {
	const initialValue =
		browser && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';

	/** @type {Readable<'light' | 'dark'>} */
	const store = readable(initialValue, (set) => {
		if (browser && window.matchMedia) {
			/** @param {MediaQueryList | MediaQueryListEvent} e */
			const onPrefersDarkColorSchemeChange = (e) => {
				set(e.matches ? 'dark' : 'light');
			};

			// Listen for changes to the system color scheme and update the store
			window
				.matchMedia('(prefers-color-scheme: dark)')
				.addEventListener('change', onPrefersDarkColorSchemeChange);

			// Cleanup
			return () => {
				window
					.matchMedia('(prefers-color-scheme: dark)')
					.removeEventListener('change', onPrefersDarkColorSchemeChange);
			};
		}
	});

	return store;
};

export class ThemeStores {
	/** @type {Readable<'light' | 'dark'>} */
	#systemTheme;

	get systemTheme() {
		return this.#systemTheme;
	}

	/** @type {Writable<'light' | 'dark' | 'system'>} */
	#selectedAppearance;

	get selectedAppearance() {
		return readonly(this.#selectedAppearance);
	}

	/** @type {Readable<'light' | 'dark'>} */
	#activeAppearance;

	get activeAppearance() {
		return this.#activeAppearance;
	}

	/** @type {Readable<Theme>} */
	#theme;

	get theme() {
		return this.#theme;
	}

	get themesConfig() {
		return themesConfig;
	}

	constructor() {
		this.#systemTheme = createSystemThemeStore();

		this.#selectedAppearance = localStorageStore(
			'evidence-theme',
			themesConfig.themes.defaultAppearance,
			{
				serialize: (value) => value,
				deserialize: (raw) =>
					['system', 'light', 'dark'].includes(raw)
						? /** @type {'light' | 'dark' | 'system'} */ (raw)
						: themesConfig.themes.defaultAppearance
			}
		);

		this.#activeAppearance = derived(
			[this.#systemTheme, this.#selectedAppearance],
			([$systemTheme, $selectedAppearance]) => {
				return $selectedAppearance === 'system' ? $systemTheme : $selectedAppearance;
			}
		);

		this.#theme = derived(this.#activeAppearance, ($activeAppearance) => themes[$activeAppearance]);
	}

	/** @param {HTMLElement} element */
	syncDataThemeAttribute = (element) => {
		// Sync activeAppearance -> html[data-theme]
		const unsubscribe = this.#activeAppearance.subscribe(($activeAppearance) => {
			const current = element.getAttribute('data-theme');
			if (current !== $activeAppearance) {
				element.setAttribute('data-theme', $activeAppearance);
			}
		});

		// Sync html[data-theme] -> activeAppearance
		const observer = new MutationObserver((mutations) => {
			const html = /** @type {HTMLHtmlElement} */ (mutations[0].target);
			const theme = html.getAttribute('data-theme');
			if (!theme || !['light', 'dark'].includes(theme)) return;
			const current = get(this.#activeAppearance);
			if (theme !== current) {
				this.#selectedAppearance.set(/** @type {'light' | 'dark'} */ (theme));
			}
		});
		observer.observe(element, { attributeFilter: ['data-theme'] });

		return () => {
			unsubscribe();
			observer.disconnect();
		};
	};

	/** @param {'light' | 'dark' | 'system'} appearance */
	setAppearance = (appearance) => {
		this.#selectedAppearance.set(appearance);
	};

	cycleAppearance = () => {
		this.#selectedAppearance.update((current) => {
			switch (current) {
				case 'system':
					return 'light';
				case 'light':
					return 'dark';
				case 'dark':
				default:
					return 'system';
			}
		});
	};

	/**
	 * @param {unknown} input
	 * @returns {Readable<string | undefined>}
	 */
	resolveColor = (input) => {
		if (typeof input === 'string') {
			return derived(this.#activeAppearance, ($activeAppearance) => {
				const lightColor = themes.light.colors[input.trim()];
				const darkColor = themes.dark.colors[input.trim()];

				if ($activeAppearance === 'light') {
					return lightColor ?? input;
				}
				if ($activeAppearance === 'dark') {
					return darkColor ?? convertLightToDark(lightColor ?? input) ?? input;
				}
			});
		}

		if (isStringTuple(input)) {
			const [light, dark] = input;
			return derived(this.#activeAppearance, ($activeAppearance) => {
				const lightColor = themes.light.colors[light.trim()];
				const darkColor = dark ? (themes.dark.colors[dark?.trim()] ?? dark) : undefined;

				if ($activeAppearance === 'light') {
					return lightColor ?? light;
				}
				if ($activeAppearance === 'dark') {
					return darkColor ?? convertLightToDark(lightColor ?? light) ?? dark;
				}
			});
		}

		return readable(undefined);
	};

	/**
	 * @template T
	 * @param {Record<string, T> | undefined} input
	 * @returns {Readable<Record<string, (string | T)[]> | undefined>}
	 */
	resolveColorsObject = (input) => {
		if (!input) return readable(undefined);

		return derived(this.#theme, ($theme) =>
			Object.fromEntries(
				Object.entries(input).map(([key, color]) => {
					if (typeof color !== 'string') return [key, color];
					return [key, $theme.colors[color.trim()] ?? color];
				})
			)
		);
	};

	/**
	 * @param {unknown} input
	 * @returns {Readable<string[] | undefined>}
	 */
	resolveColorPalette = (input) => {
		if (typeof input === 'string') {
			return derived(this.#theme, ($theme) => $theme.colorPalettes[input.trim()]);
		}

		if (isArrayOfStringTuples(input)) {
			return derived([this.#activeAppearance, this.#theme], ([$activeAppearance, $theme]) =>
				input.map(([light, dark]) => {
					const color = $activeAppearance === 'light' ? light : dark;
					return $theme.colors[color.trim()] ?? color;
				})
			);
		}

		if (isArrayOfStrings(input)) {
			return derived(this.#theme, ($theme) =>
				input.map((color) => $theme.colors[color.trim()] ?? color)
			);
		}

		return readable(undefined);
	};

	/**
	 * @param {unknown} input
	 * @returns {Readable<string[] | undefined>}
	 */
	resolveColorScale = (input) => {
		if (typeof input === 'string') {
			return derived(this.#theme, ($theme) => $theme.colorScales[input.trim()]);
		}

		if (isArrayOfStringTuples(input)) {
			return derived([this.#activeAppearance, this.#theme], ([$activeAppearance, $theme]) =>
				input.map(([light, dark]) => {
					const color = $activeAppearance === 'light' ? light : dark;
					return $theme.colors[color.trim()] ?? color;
				})
			);
		}

		if (isArrayOfStrings(input)) {
			return derived(this.#theme, ($theme) =>
				input.map((color) => $theme.colors[color.trim()] ?? color)
			);
		}

		return readable(undefined);
	};
}

const THEME_STORES_CONTEXT_KEY = Symbol('__EvidenceThemeStores__');

/** @returns {ThemeStores} */
export const getThemeStores = () => {
	let stores = getContext(THEME_STORES_CONTEXT_KEY);
	if (!stores) {
		stores = new ThemeStores();
		setContext(THEME_STORES_CONTEXT_KEY, stores);
	}
	return stores;
};

/** @typedef {[string] | [string, string]} StringTuple */

/**
 * @param {unknown} input
 * @returns {input is StringTuple}
 */
const isStringTuple = (input) =>
	Array.isArray(input) &&
	(input.length === 1 || input.length === 2) &&
	input.every((item) => typeof item === 'string');

/**
 * @param {unknown} input
 * @returns {input is StringTuple[]}
 */
const isArrayOfStringTuples = (input) => Array.isArray(input) && input.every(isStringTuple);

/**
 * @param {unknown} input
 * @returns {input is string[]}
 */
const isArrayOfStrings = (input) =>
	Array.isArray(input) && input.every((item) => typeof item === 'string');
