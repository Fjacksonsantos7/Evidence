---
sidebar_position: 4
hide_table_of_contents: false
title: Developing Source Plugins 
---

Evidence includes a plugin system which can be used to add custom data sources to your project. 

## Starting from an Example

The [Evidence postgres source plugin](https://github.com/evidence-dev/evidence/tree/main/packages/postgres) is a good reference for a source plugin. 

Data source plugins are npm packages which export the following: 

1. `options` object which enumerates the credentials required to establish a connection to the data source. These will be used to construct the connection UI for users who are using the plugin
1. `runQuery` function which executes queries and returns an array of results 
1. `getRunner` function which can iterate over files in a sources directory (e.g. `.sql` files) and return the required query string for the 
1. `testConnection` function which executes a test query

In order to indicate to the Evidence plugin system that the package contains a data source (and what it should be called in the UI), add the following to the `package.json`: 

```
	"evidence": {
		"databases": [
			[
                db-alias-1,
                db-alias-2, 
                etc.  
			],
		],
		"icon": "Postgresql"
	}
```

## Options Specification

Evidence Datasources must provide an `options` export; this is used to
build UI and validation to ensure an excellent UX for Evidence users.

Options can have the following fields:

| Field            | Type                                                    | Required | Description |
|::|::|::|--|
| `title`          | string                                                  |  Yes        | Name or Title of the option                                                                                                                                                                         |
| `type`           | 'string' \| 'number' \| 'boolean' \| 'select' \| 'file' | Yes      | Control to show                                                                                                                                                                                     |
| `secret`         | boolean                                                 | -        | Secret values are placed in `connection.options.yaml`, which is not source controlled                                                                                                               |
| `shown`          | boolean                                                 | -        | Displays value in UI elements (e.g. for usernames, that should not be source controlled but are not "secret")                                                                                       |
| `virtual`        | boolean                                                 | -        | Disables saving a field, useful for credential files                                                                                                                                                |
| `references`     | string                                                  | -        | Indicates that the field should get its value from another field if it is available, useful for credential files. Formatted as a [json path](https://www.npmjs.com/package/@astronautlabs/jsonpath) |
| `forceReference` | boolean                                                 | -        | If true, the input is disabled and the value can only come from a reference                                                                                                                         |
| `fileFormat`     | 'json' \| 'yaml'                                        | -        | If `type` is `file`, set how it should be parsed. It will then be available to `references`                                                                                                         |
| `description`    | string                                                  | -        | Description of the option, shown as a hint in UI                                                                                                                                                    |
| `children`       | `Record<string\|number\|boolean, Options>`              | -        | See [children](#children)                                                                                                                                                                           |
| `required`       | boolean                                                 | -        | Indicates that the user must provide this option                                                                                                                                                    |
| `options`        | `Array<{label: string, value:string}>`                  | -        | Available options for `select` type                                                                                                                                                                 |
| `nest`           | boolean                                                 | -        | Determines behavior of `children`                                                                                                                                                                   |
| `default`        | 'string' \| 'number' \| 'boolean'                       | -        | Default Value                                                                                                                                                                                       |

### Children

Many datasources have variable configuration (e.g. if ssl is enabled for postgres, then an ssl mode can be selected), and Evidence
options support this workflow.

Consider this partial postgres ssl option:

```javascript
ssl: {
    type: 'boolean',
    // ...
    nest: true,
    children: {
        [true]: {
            sslmode: {
                // ...
            }
        }
    }
},
```

`ssl.children` is a record of possible values to an additional set of options that are exposed then the values match.
In this example, the `sslmode` option is only displayed when `ssl` is true.

The resulting type of this option is:
```typescript
{ ssl: false } | { ssl: { sslmode: string } }
```

In cases where you want a flat object, rather than a nested object; set `nest` to false.

This would produce

```typescript
{ ssl: false } | { ssl: true, sslmode: string }
```
