---
title: Grid
sidebar_position: 1
---

```sql orders_by_category
select order_month, count(1) as orders from needful_things.orders
group by all
```

<Grid cols=2>
    <LineChart data={orders_by_category} x=order_month y=orders/>
    <BarChart data={orders_by_category} x=order_month y=orders fillColor=#00b4e0/>
    <ScatterPlot data={orders_by_category} x=order_month y=orders fillColor=#015c08/>
    <AreaChart data={orders_by_category} x=order_month y=orders fillColor=#b8645e lineColor=#b8645e/>
</Grid>

```svelte
<Grid cols=2>
    <LineChart data={orders_by_category} x=order_month y=orders/>
    <BarChart data={orders_by_category} x=order_month y=orders fillColor=#00b4e0/>
    <ScatterPlot data={orders_by_category} x=order_month y=orders fillColor=#015c08/>
    <AreaChart data={orders_by_category} x=order_month y=orders fillColor=#b8645e lineColor=#b8645e/>
</Grid>
```

## Options

<PropListing
    name=cols
    description="Number of columns in the grid on a full size screen"
    options={['1', '2', '3', '4', '5', '6']}
    defaultValue="2"
/>
<PropListing
    name=gapSize
    description="Space between grid elements"
    options={['none', 'sm', 'md', 'lg']}
    defaultValue="md"
/>