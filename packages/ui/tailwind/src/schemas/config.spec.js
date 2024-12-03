import { describe, it, expect } from 'vitest';

import { ThemesConfigFileSchema } from './config.js';

describe('ThemesConfigFileSchema', () => {
	it('should parse themes=null to themes={}', () => {
		const result = ThemesConfigFileSchema.parse({ theme: null });
		expect(result).toEqual({ theme: {} });
	});

	it('should parse themes=undefined to themes={}', () => {
		const result = ThemesConfigFileSchema.parse({ theme: undefined });
		expect(result).toEqual({ theme: {} });
	});

	it('should allow themes={}', () => {
		const { success } = ThemesConfigFileSchema.safeParse({ theme: {} });
		expect(success).toBe(true);
	});

	describe('colors', () => {
		it('should parse theme.colors=null to theme.colors={}', () => {
			const result = ThemesConfigFileSchema.parse({ theme: { colors: null } });
			expect(result.theme.colors).toEqual({});
		});

		it('should parse theme.colors=undefined to theme.colors={}', () => {
			const result = ThemesConfigFileSchema.parse({ theme: { colors: undefined } });
			expect(result.theme.colors).toEqual({});
		});

		it('should allow theme.colors={}', () => {
			const { success } = ThemesConfigFileSchema.safeParse({ theme: { colors: {} } });
			expect(success).toBe(true);
		});

		it.each([
			{ whatIsUndefined: 'light' },
			{ whatIsUndefined: 'dark' },
			{ whatIsUndefined: 'both light and dark' }
		])(
			'should allow $whatIsUndefined to be undefined for builtin color tokens',
			({ whatIsUndefined }) => {
				const colors =
					whatIsUndefined === 'light'
						? { dark: '#abcdef' }
						: whatIsUndefined === 'dark'
							? { light: '#abcdef' }
							: {};
				const { success } = ThemesConfigFileSchema.safeParse({
					theme: {
						colors: {
							primary: colors
						}
					}
				});
				expect(success).toBe(true);
			}
		);

		it.each([
			{ whatIsUndefined: 'light' },
			{ whatIsUndefined: 'dark' },
			{ whatIsUndefined: 'both light and dark' }
		])(
			'should not allow $whatIsUndefined to be undefined for non-builtin color tokens',
			({ whatIsUndefined }) => {
				const colors =
					whatIsUndefined === 'light'
						? { dark: '#abcdef' }
						: whatIsUndefined === 'dark'
							? { light: '#abcdef' }
							: {};

				const { success } = ThemesConfigFileSchema.safeParse({
					theme: {
						colors: {
							foo: colors
						}
					}
				});
				expect(success).toBe(false);
			}
		);
	});

	it('should not allow unknown keys under theme:', () => {
		const config = {
			theme: {
				colors: {
					primary: {
						light: '#abcdef',
						dark: '#fedcba'
					}
				},
				colorPalette: {
					default: ['#abcdef', '#fedcba']
				}
			}
		};

		const { success } = ThemesConfigFileSchema.safeParse(config);
		expect(success).toBe(false);
	});
});
