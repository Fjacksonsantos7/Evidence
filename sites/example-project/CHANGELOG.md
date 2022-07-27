# @evidence-dev/components

## 1.3.2

### Patch Changes

- bc62401: Add testIds to support e2e testing
- 9275cda: Fixed the hms format to have two digits all the time for mm and ss
- 07971d8: Ensure the version of Vite stays belows 3.0
- b5d4f28: adding currency 0 suffix tag eg usd0, increased threshold for applying units (k,M,B,T)

## 1.3.1

### Patch Changes

- 87fd331: Fix formatting for <currency-code>2k format
- 9d2726b: issue-343 auto formatting for unformatted number columns, auto formatted currencies. Introduced Jest unit tests for ES6 Modules.
- 6ed9a37: GA new formatting system without feature flags
- 4702901: Adds support for static folder that users can put files in
- e5a3eb7: Minor changes to formatting settings panel
- 77c205d: Made `pct` an auto format showing 3 significant digits from the median's leading digit

## 1.3.0

### Minor Changes

- 51c65c5: Fixed a dependency issue with the ssf library

## 1.2.0

### Minor Changes

- 6a7fb35: Update to how the built-in formatting works and custom formats behind feature flag
- 06cc44a: Remove support for value and fmt props in <Value /> tag
- 9f894e7: Adds value and column title formatting to chart tooltips, with revised tooltips for scatter, bubble, and histogram charts

### Patch Changes

- 23d0234: Adds legacy FLOAT type to BigQuery connector types
- 7a87d0b: Add support for native database types to all components
- 04ad3b9: Indicate the data type that evidence has identified in the queryviewer data table
- f6d00c3: Bug fix for settings page when gitignore file is missing
- e2c7319: Adds formatting to query viewer data table
- 23f90b7: Bug fix for tooltips in composable charts with multiple y columns
- 6fd2f57: Avoids creating gitignore file when gitignore not selected

## 1.1.4

### Patch Changes

- 1fead9d: Exposed queries as their own variable (data={queryName}, in addition to existing data={data.queryname}) and exposed native Postgres/BigQuery types to components
- f651bda: Adding a database and warehouse field to the Snowflake connector. Without these it is difficult to run queries in a Snowflake DB.
- d225abf: Provide images of charts when users are attempting to copy and paste

## 1.1.3

### Patch Changes

- 44ebd1a: Update the telemetry settings panel to show the correct state on initial startup, and provide more environment variable friendly alternatives ("yes"/ "no") to opt out of telemetry in production.

## 1.1.2

### Patch Changes

- e8ceec3: Fix sorting bug that caused side effects from components sorting datasets

## 1.1.1

### Patch Changes

- 6a078e6: Dependency fix and minor bug fixes

## 1.1.0

### Minor Changes

- 3b5f1af: Adds download to CSV feature to query viewer and DataTables
- fc45df2: Adds chart download feature to generate a PNG of a chart

### Patch Changes

- 8170b66: Add telemetry options to the development mode settings page.
- 80d38a5: Fixes scroll and spacing issues in DataTable

## 1.0.3

### Patch Changes

- 174a626: Fixing default showQueries behaviour to be true by default in dev

## 1.0.2

### Patch Changes

- 2e483e4: Support passing arguments to svelte-kit through the CLI
- eeabad3: Add vercel deployment instructions to the development-mode settings page, and to the project docs.

## 1.0.1

### Patch Changes

- 8c125c5: Allow for a missing git repo

## 1.0.0

### Major Changes

- 1b81b58: Hides most of the front-end experience from analysts, introduces a new side-bar navigation scheme, adds a development mode settings page to configure database connections

### Patch Changes

- 54044fa: Update packaging mechanics
- 3d0d93c: Various UI changes
- 9d6417e: Fixed version control panel
- a50f8c2: fix sqlite gitignore error, settings optionals, and misc UI fixes
- 36dcd68: Fix import error for show hide queries button
- 644963c: Add deployment instructions and a check on the status of the user's git repo to the dev mode settings panel
- e45a29a: Add a deployment panel to settings

## 1.0.0-next.7

### Patch Changes

- Fixed version control panel

## 1.0.0-next.6

### Patch Changes

- 644963c: Add deployment instructions and a check on the status of the user's git repo to the dev mode settings panel

## 1.0.0-next.5

### Patch Changes

- e45a29a: Add a deployment panel to settings

## 1.0.0-next.4

### Patch Changes

- Fix import error for show hide queries button

## 1.0.0-next.3

### Patch Changes

- 3d0d93c: Various UI changes

## 1.0.0-next.2

### Patch Changes

- Fixes sqlite gitignore error, settings optionals, and misc UI bugs

## 1.0.0-next.1

### Patch Changes

- Update packaging mechanics

## 1.0.0-next.0

### Major Changes

- Hides most of the front-end experience from analysts, introduces a new side-bar navigation scheme, adds a development mode settings page to configure database connections

## 0.1.21

### Patch Changes

- b1bd12f: Patch to test @next release

## 0.1.20

### Patch Changes

- 6f74e1c: Another patch for the release process

## 0.1.19

### Patch Changes

- Patch bump to bring this back to a public release.

## 0.1.18

### Patch Changes

- 0713a5d: take these back to public

## 0.1.17

### Patch Changes

- e540391: Updating the packaging process to support pre-releases

## 0.1.16

### Patch Changes

- c75b082: Fix BubbleChart's treatment of multiple y columns

## 0.1.15

### Patch Changes

- bd66abe: Fix BubbleChart scaling function

## 0.1.14

### Patch Changes

- 478de2c: testing changesets
