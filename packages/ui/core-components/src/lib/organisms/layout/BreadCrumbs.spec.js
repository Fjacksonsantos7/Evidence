import { describe, it } from 'vitest';
import { buildCrumbs } from './BreadCrumbs.svelte';
import { expect } from 'vitest';

function toPathArray(url) {
	return new URL(url).pathname.split('/').slice(1);
}

describe('BreadCrumbs', () => {
	it('should work for home page', () => {
		const crumbs = buildCrumbs(toPathArray('https://example.com/'), {
			label: 'Home',
			href: '/',
			children: {
				about: {
					label: 'About',
					href: '/about',
					children: {},
					frontMatter: {},
					isTemplated: false,
					isPage: true
				}
			},
			frontMatter: {},
			isTemplated: false,
			isPage: true
		});

		expect(crumbs).toEqual([{ title: 'Home', href: '/' }]);
	});

	it('should work for nested pages', () => {
		const crumbs = buildCrumbs(toPathArray('https://example.com/about/team'), {
			label: 'Home',
			href: '/',
			children: {
				about: {
					label: 'about',
					href: '/about',
					children: {
						team: {
							label: 'team',
							href: '/about/team',
							children: {},
							frontMatter: {},
							isTemplated: false,
							isPage: true
						}
					},
					frontMatter: {},
					isTemplated: false,
					isPage: true
				}
			},
			frontMatter: {},
			isTemplated: false,
			isPage: true
		});

		expect(crumbs).toEqual([
			{ title: 'Home', href: '/' },
			{ title: 'about', href: '/about' },
			{ title: 'team', href: '/about/team' }
		]);
	});

	it('should work with templated pages', () => {
		const crumbs = buildCrumbs(toPathArray('https://example.com/about/bluejays'), {
			label: 'Home',
			href: '/',
			children: {
				about: {
					label: 'about',
					href: '/about',
					children: {
						'[team]': {
							label: '[team]',
							href: undefined,
							children: {},
							frontMatter: {},
							isTemplated: true,
							isPage: true
						}
					},
					frontMatter: {},
					isTemplated: false,
					isPage: true
				}
			},
			frontMatter: {},
			isTemplated: false,
			isPage: true
		});

		expect(crumbs).toEqual([
			{ title: 'Home', href: '/' },
			{ title: 'about', href: '/about' },
			{ title: 'bluejays', href: '/about/bluejays' }
		]);
	});

	it("should work with templated pages that don't have an index page", () => {
		const crumbs = buildCrumbs(toPathArray('https://example.com/about/bluejays/info'), {
			label: 'Home',
			href: '/',
			children: {
				about: {
					label: 'about',
					href: '/about',
					children: {
						'[team]': {
							label: '[team]',
							href: undefined,
							children: {
								info: {
									label: 'info',
									href: undefined,
									children: {},
									frontMatter: {},
									isTemplated: false,
									isPage: true
								}
							},
							frontMatter: {},
							isTemplated: true,
							isPage: false
						}
					},
					frontMatter: {},
					isTemplated: false,
					isPage: true
				}
			},
			frontMatter: {},
			isTemplated: false,
			isPage: true
		});

		expect(crumbs).toEqual([
			{ title: 'Home', href: '/' },
			{ title: '...', href: '/about' },
			{ title: 'bluejays', href: null },
			{ title: 'info', href: '/about/bluejays/info' }
		]);
	});

	it("should work with normal pages that don't have an index page", () => {
		const crumbs = buildCrumbs(toPathArray('https://example.com/chart-examples/bar-chart'), {
			label: 'Home',
			href: '/',
			children: {
				'chart-examples': {
					label: 'chart-examples',
					href: '/chart-examples',
					children: {
						'bar-chart': {
							label: 'bar-chart',
							href: '/chart-examples/bar-chart',
							children: {},
							frontMatter: {},
							isTemplated: false,
							isPage: true
						}
					},
					frontMatter: {},
					isTemplated: false,
					isPage: false
				}
			},
			frontMatter: {},
			isTemplated: false,
			isPage: true
		});

		expect(crumbs).toEqual([
			{ title: 'Home', href: '/' },
			{ title: 'chart examples', href: null },
			{ title: 'bar chart', href: '/chart-examples/bar-chart' }
		]);
	});
});
