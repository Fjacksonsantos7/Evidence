---
sidebar_position: 5
hide_table_of_contents: false
title: Rendering Modes
---

Evidence supports two rendering modes:

1. Static Site Generation (Default)
2. Single Page App (SPA)


```sql rendering_modes
select 'Content Rendering' as rendering_mode, 'Pre-rendered at build time' as static_site_generation, 'Rendered on the client side' as single_page_app, 1 as row_number union all
select 'Page Generation', 'Each page generated ahead of time', 'Only one HTML file generated', 2 union all
select 'Built Output', 'All pages have corresponding HTML files', 'Pages rendered using JavaScript', 3 union all
select 'Build Duration', 'Slower as builds all pages', 'Faster as only one page is built', 4 union all
select 'Performance', 'Faster initial page loads', 'Faster interactions after initial load', 5
order by row_number
```

## Choosing a Rendering Mode

You should generally only use the SPA rendering mode if one of the following is true:
- **You have a large number of pages**, >1000+ is a good rule of thumb
- **You want to update your data frequently**, so short build times are desirable
- **Your data sources are large** (in which case you may want to combine this with Evidence's Cloud Execution Engine)

## Comparison

<DataTable data={rendering_modes} wrapTitles>
    <Column id=rendering_mode />
    <Column id=static_site_generation wrap/>
    <Column id=single_page_app wrap/>
</DataTable>

## Enabling SPA Mode

SPA rendering mode is disabled by default.

To enable SPA rendering mode:

1. Update the build command in `package.json`:

```json
"build": "VITE_EVIDENCE_SPA=true evidence build"
```

2. Add svelte adapter-static as a dev dependency:

```bash
npm install --save-dev @sveltejs/adapter-static
```

3. Add a `svelte.config.js` file to the root of your project containing the following:

```javascript
import adapter from '@sveltejs/adapter-static';

/** @type {import("@sveltejs/kit").Config} */
export default {
    preprocess: [],
    compilerOptions: {
        dev: true
    },
    kit: {
        adapter: adapter({
            fallback: 'index.html'
        })
    },
    vite: {
        server: {
            watch: {
            usePolling: true
            }
        }
    }
};
```



