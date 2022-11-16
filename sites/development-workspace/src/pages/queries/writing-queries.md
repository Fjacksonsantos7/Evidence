# Writing Queries 

## A working query 

```working_query
select 
    100 as metric, 
    current_date() as today
```

## A broken query 

```broken_query

select 100/0 as whoops 

```
