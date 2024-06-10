---
title: US Map
sidebar_position: 1
queries:
- state_population.sql
---

<USMap
    data={state_population}
    state=state_name
    value=population
/>

```html
<USMap
    data={state_population}
    state=state_name
    value=population
/>
```

## Examples

### Color Scales

`colorScale=blue`

<USMap
    data={state_population}
    state=state_name
    value=population
    colorScale=blue
/>

`colorScale=green`

<USMap
    data={state_population}
    state=state_name
    value=population
    colorScale=green
/>

`colorScale=red`

<USMap
    data={state_population}
    state=state_name
    value=population
    colorScale=red
/>

`colorScale=bluegreen`

<USMap
    data={state_population}
    state=state_name
    value=population
    colorScale=bluegreen
/>

### Custom Color Scale

```html
<USMap
    data={state_population}
    state=state_name
    value=population
    colorPalette={['maroon','white','#1c0d80']}
    legend=true
/>
```

<USMap
    data={state_population}
    state=state_name
    value=population
    colorPalette={['maroon','white','#1c0d80']}
    legend=true
/>

### Legend

#### Default

```html
<USMap
    data={state_population}
    state=state_name
    value=population
    legend=true
/>
```

<USMap
    data={state_population}
    state=state_name
    value=population
    legend=true
/>


#### With Filter

```html
<USMap
    data={state_population}
    state=state_name
    value=population
    colorPalette={['maroon','white','#1c0d80']}
    legend=true
    filter=true
/>
```

<USMap
    data={state_population}
    state=state_name
    value=population
    colorPalette={['maroon','white','#1c0d80']}
    legend=true
    filter=true
/>

### Links

```html
<USMap
	data={state_current}
	state=state
	value=value
	abbreviations=true
	link=state_link
	title="Sales by State"
	subtitle="{most_recent_month[0].month}"
/>
```

<img src='/img/map-links.gif' width='500px'/>

### State Abbreviations

```html
<USMap data={map_data} state=state_abbrev value=sales_usd abbreviations=true />
```

<USMap data={state_population} state=state_abbrev value=population abbreviations=true />


## Options

### Data

<PropListing
    name="data"
    required
    options="query name"
>

Query name, wrapped in curly braces

</PropListing>
<PropListing
    name="state"
    required
    options="column name"
>

Column to be used as the name for each state

</PropListing>
<PropListing
    name="abbreviations"
    options={['false','true']}
    defaultValue='false'
>

If true, map will look for two letter abbreviations rather than full names

</PropListing>
<PropListing
    name="value"
    required
    options="column name"
>

Column to be used as the value determining the colour of each state

</PropListing>
<PropListing
    name="colorScale"
    options={['blue','green','red','bluegreen']}
    defaultValue='blue'
>

Colour scale to be used. To use a custom color palette, see the `colorPalette` prop

</PropListing>
<PropListing
    name="colorPalette"
    options="array of color codes (can be CSS, hex, RGB, HSL)"
>

Custom color palette to use for setting state colors. Overrides `colorScale`. E.g., `{['#cf0d06','#eb5752','#e88a87']}`

</PropListing>
<PropListing
    name="min"
    options="number"
>

Minimum value for the colour scale. Anything below the minimum will be shown in the same colour as the min value

</PropListing>
<PropListing
    name="max"
    options="number"
>

Maximum value for the colour scale. Anything above the maximum will be shown in the same colour as the max value

</PropListing>
<PropListing
    name="title"
    options="string"
>

Title appearing above the map. Is included when you click to save the map image

</PropListing>
<PropListing
    name="subtitle"
    options="string"
>

Subtitle appearing just above the map. Is included when you click to save the map image

</PropListing>
<PropListing
    name="link"
    options="column name"
>

Column containing links. When supplied, allows you to click each state on the map and navigate to the link

</PropListing>
<PropListing
    name="fmt"
    options="Excel-style format | built-in format | custom format"
>

Format to use for values ([see available formats](/core-concepts/formatting))

</PropListing>
<PropListing
    name="legend"
    options={['true','false']}
    defaultValue='false'
>

Whether to show a legend at the top of the map

</PropListing>
<PropListing
    name="filter"
    options={['true','false']}
    defaultValue='false'
>

Whether to include filter controls on the legend. Can only be used when legend = true

</PropListing>
<PropListing
    name="emptySet"
    options={['error','warn','pass']}
    defaultValue='error'
>

Sets behaviour for empty datasets. Can throw an error, a warning, or allow empty. When set to `error`, empty datasets will block builds in `build:strict`. Note this only applies to initial page load - empty datasets caused by input component changes (dropdowns, etc.) are allowed.

</PropListing>
<PropListing
    name="emptyMessage"
    options="string"
    defaultValue="No records"
>

Text to display when an empty dataset is received - only applies when `emptySet` is `warn` or `pass`, or when the empty dataset is a result of an input component change (dropdowns, etc.).

</PropListing>
<PropListing
    name="renderer"
    options={['canvas','svg']}
    defaultValue='canvas'
>

Which chart renderer type (canvas or SVG) to use. See ECharts' [documentation on renderers](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/).

</PropListing>

### Custom Echarts Options

<PropListing
    name="echartsOptions"
    options="{`{{exampleOption:'exampleValue'}}`}"
>

Custom Echarts options to override the default options. See [reference page](/components/echarts-options/) for available options.

</PropListing>
<PropListing
    name="seriesOptions"
    options="{`{{exampleSeriesOption:'exampleValue'}}`}"
>

Custom Echarts options to override the default options for all series in the chart. This loops through the series to apply the settings rather than having to specify every series manually using `echartsOptions` See [reference page](/components/echarts-options/) for available options.

</PropListing>
<PropListing
    name="printEchartsConfig"
    options={['true', 'false']}
    defaultValue="false"
>

Helper prop for custom chart development - inserts a code block with the current echarts config onto the page so you can see the options used and debug your custom options

</PropListing>

### Interactivity

<PropListing
    name="connectGroup"
>

Group name to connect this chart to other charts for synchronized tooltip hovering. Charts with the same `connectGroup` name will become connected

</PropListing>