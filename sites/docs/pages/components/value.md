---
title: Value
sidebar_position: 1
---

The Value component accepts a query and displays a formatted value inline in text.

By default, `Value` will display the value from the first row of the first column of the referenced data.

```markdown
<Value data={query_name} /> <!-- First row from the first column -->
```

## Specifying Rows and Columns

Optionally supply a `column` and/or a `row` argument to display other values from `data`. 

<Alert status=info>

**Row Index**

`row` is zero-indexed, so `row=0` displays the first row.

</Alert>

```markdown
<!-- Show the **7th row** from column_name -->

<Value 
    data={query_name}
    column=column_name 
    row=6
/>
```

## Example

**Markdown:**

```markdown
The most recent month of data began <Value data={monthly_orders} />,
when there were <Value data={monthly_orders} column=orders/> orders.
```

**Results:**
![summary-sentence](/img/tutorial-img/needful-things-value-in-text-nowindow.png)

## Adding a Placeholder

Override errors with the optional `placeholder` argument. This is useful for drafting reports _before_ writing your queries.

```markdown
<Value placeholder="sales last year"/>
```

Sales in the last fiscal year were <Value placeholder="sales last year"/>, a change of <Value placeholder="X%"/> vs. the prior year.
 

## Formatting Values
Evidence supports a variety of formats - see [value formatting](/core-concepts/formatting) and the `fmt` prop below for more info.

## Aggregated Values

Values support basic aggregations such as, `min`, `max`, `median`, `sum`, `avg`


```sql orders
SELECT 
    email, item, sales
FROM 
    needful_things.orders
```
```markdown
<Value data={orders} column="sales" agg="avg" fmt="usd0" />
```

<div>
    <Value data={orders} column="sales" agg="avg" fmt="usd0" />
</div>

## Linking to other pages

The link property makes the Value component clickable, allowing navigation to other pages.

```sql total_sales
SELECT 
 sum(sales) as total_sales
```
    
`
## Customize Color Values

<div>
    <Value data={orders} column="sales" agg="avg" fmt="usd0" color="#85BB65" />
</div>

```markdown
<Value data={orders} column="sales" agg="avg" fmt="usd0" color="#85BB65" />
```
<div>
    <Value data={orders} column="sales" agg="avg" fmt="usd0" color="blue" />
</div>

```markdown
<Value data={orders} column="sales" agg="avg" fmt="usd0" color="blue" />
```
<div>
    <Value data={orders} column="sales" agg="avg" fmt="usd0" color="rgb(200,5,200)" />
</div>

```markdown
<Value data={orders} column="sales" agg="avg" fmt="usd0" color="rgb(200,5,200)" />
```

## Red Negative Values

```sql NegativeSales
SELECT 
      MAX(sales)*-1 as max_sales
FROM 
    needful_things.orders
```

```markdown
<Value data={total_sales} column="total_sales" agg="avg" fmt="usd0" link='/components/value' />
```

<div>
    <Value data={total_sales} column="total_sales" agg="avg" fmt="usd0" link='/components/value' />
</div>

=======
If the value is negative, the font color will automatically change to red, overriding any color specified by the color prop.

<div>
    <Value data={NegativeSales} column="max_sales" agg="avg" fmt="usd0" redNegatives="true" />
</div>

```markdown
<Value data={NegativeSales} column="max_sales" agg="avg" fmt="usd0" redNegatives="true" />
```

## Options

<PropListing
    name="data"
    required
    options="query name"
>

Query name, wrapped in curly braces

</PropListing>
<PropListing
    name="column"
    options="column name"
    defaultValue="First column"
>

Column to pull values from

</PropListing>
<PropListing
    name="row"
    options="number"
    defaultValue="0"
>

Row number to display. 0 is the first row.

</PropListing>
<PropListing
    name="placeholder"
    options="string"
>

Text to display in place of an error

</PropListing>
<PropListing
    name="fmt"
    options="Excel-style format | built-in format | custom format"
>

Format to use for the value ([see available formats](/core-concepts/formatting))

</PropListing>
<PropListing
    name="emptySet"
    options={['error', 'warn', 'pass']}
    defaultValue="error"
>

Sets behaviour for empty datasets. Can throw an error, a warning, or allow empty. When set to 'error', empty datasets will block builds in `build:strict`. Note this only applies to initial page load - empty datasets caused by input component changes (dropdowns, etc.) are allowed.

</PropListing>
<PropListing
    name="emptyMessage"
    options="string"
    defaultValue="No records"
>

Text to display when an empty dataset is received - only applies when `emptySet` is 'warn' or 'pass', or when the empty dataset is a result of an input component change (dropdowns, etc.).

</PropListing>
<PropListing
    name="agg"
    options={['sum', 'avg', 'min', 'median', 'max']}
    defaultValue="null"
>

Adds aggregation to query, column name required.

</PropListing>
<PropListing name="link">

Used to navigate to other pages. Can be a full external link like `https://google.com` or an internal link like `/sales/avg-sales`
</PropListing>
<PropListing
        name=color
        options="CSS name | hexademical | RGB | HSL"
>

Specifies the font color of the Value.

</PropListing>
<PropListing
    name="redNegatives"
    options={[`true`, `false`]}
    defaultValue="false"
>

Conditionally sets the font color to red based on whether the selected value is less than 0

</PropListing>
