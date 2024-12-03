import { describe, it, expect } from 'vitest';
import { ThemeColorsSchema } from './colors';

describe('ThemeColorsSchema', () => {
	it('should copy color from alias to builtin and delete alias value', () => {
		const colors = {
			base: {
				light: 'base_light',
				dark: 'base_dark'
			}
		};
		const result = ThemeColorsSchema.parse(colors);
		expect(result['base-100']).toEqual({
			light: 'base_light',
			dark: 'base_dark'
		});
		expect(result['base']).toBeUndefined();
	});
});