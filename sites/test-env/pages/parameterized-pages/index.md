

```federal_reserve_districts
select 
    fed_reserve_district as name, 
    "/parameterized-pages/" || fed_reserve_district || "/" as link,
    count(distinct institution_name) as distinct_institutions,
from `bigquery-public-data.fdic_banks.institutions`
group by 1,2
```

# Federal reserve districts 

<DataTable data={federal_reserve_districts} link=link/>

{#each federal_reserve_districts as district}
    
    - [district.name](district.link)

{/each}