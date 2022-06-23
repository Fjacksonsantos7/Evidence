<script>
    let complaints_by_category_filtered = data.complaints_by_category.filter(d => d.dept === $page.params.department);
    let complaints_by_day_dept_filtered = data.complaints_by_day_dept.filter(d => d.dept === $page.params.department);
    let complaints_by_day_cat_filtered = data.complaints_by_day_cat.filter(d => d.dept === $page.params.department);
</script>


# {$page.params.department}
The last complaint call for {$page.params.department} was on <Value data={last_complaint} column=date fmt=date/>

## Distribution of Daily Calls
<Histogram data={complaints_by_day_dept_filtered} x=complaints binCount=50 xAxisTitle="Daily Calls"/>

```last_complaint
select owning_department as dept,
max(created_date) as date
    from `bigquery-public-data.austin_311.311_service_requests` 
group by 1
```
 
```complaints_by_category
    select 
        owning_department as dept,
        complaint_description as category,
        count(*) as complaints 
    from `bigquery-public-data.austin_311.311_service_requests` 
    group by 1,2 
    order by 3 desc
```

## Calls by Category
<BarChart data={complaints_by_category} x=category y=complaints swapXY=true yAxisTitle="Calls Received" sort=false/>

```complaints_by_day_dept
    select 
        owning_department as dept,
        date_trunc(created_date, day) as date,
        count(*) as complaints 
    from `bigquery-public-data.austin_311.311_service_requests` 
    group by 1,2 
    order by 3 desc
```


```complaints_by_day_cat
   
select a.*, b.complaints  from (     
   
    select distinct
        owning_department as dept,
        complaint_description as category,
        cal.date
    from `bigquery-public-data.austin_311.311_service_requests`
     d

    cross join 
    
    (SELECT * FROM (SELECT date
    FROM UNNEST(
    GENERATE_DATE_ARRAY(DATE("2014-01-01"), CURRENT_DATE(), INTERVAL 1 DAY)
    ) as date)) cal 

) a

left join

     (select 
        owning_department as dept,
        complaint_description as category,
        date(created_date) as date,
        count(*) as complaints 
    from `bigquery-public-data.austin_311.311_service_requests` 
    group by 1,2,3 
    ) b

on a.date = b.date
and a.category = b.category
and a.dept = b.dept 

order by date asc
```

## Category Breakdown
{#each complaints_by_category_filtered as row}
### {row.category}
<Histogram data={complaints_by_day_cat_filtered.filter(d => d.category === row.category)} x=complaints/>
{/each}


