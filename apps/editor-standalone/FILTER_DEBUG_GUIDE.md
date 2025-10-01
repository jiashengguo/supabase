# Filter Debugging Guide

## Quick Verification

### 1. Check SQL Queries in Browser

**Open DevTools**:

1. Press F12 or Cmd+Option+I
2. Go to Network tab
3. Filter by "query" in the filter box
4. Add a filter in the UI
5. Look for POST request to `/api/platform/pg-meta/default/query?key=table-rows-*`

**Inspect Request**:

```javascript
// Click on the request
// Go to "Payload" or "Request" tab
// You'll see the SQL query:

{
  "query": "SELECT * FROM public.\"exercises\" WHERE \"name\" = 'TRICEPS' ORDER BY \"id\" ASC LIMIT 100 OFFSET 0"
}
```

### 2. Check Filter State in React DevTools

**Install React DevTools** (if not installed):

- Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
- Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

**Inspect Component State**:

1. Open React DevTools
2. Find `TableDataGrid` component
3. Check the `filters` prop
4. Should show array of Filter objects:

```javascript
;[
  {
    column: 'name',
    operator: '=',
    value: 'TRICEPS',
  },
]
```

### 3. Check URL Parameters

**Filter in URL**:

```
http://localhost:3001?filters=eyJjb2x1bW4iOiJuYW1lIiwib3BlcmF0b3IiOiI9IiwidmFsdWUiOiJUUklDRVBTIn0%3D
```

**Decode the filter**:

```javascript
// In browser console:
const filterParam = new URLSearchParams(window.location.search).get('filters')
const decoded = decodeURIComponent(filterParam)
const filter = JSON.parse(atob(decoded))
console.log(filter)
// Output: { column: "name", operator: "=", value: "TRICEPS" }
```

### 4. Console Logging

**Add temporary logging** to debug:

In `hooks/use-table-rows.ts`:

```typescript
export function useTableRows(...) {
  const { filters = [] } = options

  // Add this temporarily:
  console.log('🔍 Filters:', filters)
  console.log('📝 WHERE clause:', filtersToWhereClause(filters))

  return useQuery({
    // ...
  })
}
```

### 5. Check Query Keys

**Verify cache invalidation**:

```javascript
// In browser console:
// Access React Query devtools or check queryKey
// Should include filters in the key:
;['table-rows', 17377, 1, 100, 'id', 'asc', [{ column: 'name', operator: '=', value: 'TRICEPS' }]]
```

## Common Issues & Solutions

### Issue 1: Filters not applying

**Symptoms**:

- Add filter but grid doesn't update
- All rows still showing

**Debug**:

1. Check Network tab - is WHERE clause in SQL?
2. Check React DevTools - are filters in component state?
3. Check console for errors

**Possible Causes**:

- `filters` not passed to `useTableRows`
- `filtersToWhereClause` not being called
- SQL syntax error

### Issue 2: SQL errors

**Symptoms**:

- 500 error in Network tab
- Error toast appears
- Console shows error

**Debug**:

1. Check Network tab response for error message
2. Check SQL query in request payload
3. Look for unescaped quotes or special characters

**Possible Causes**:

- Single quotes not escaped
- Column name not quoted
- Invalid operator

### Issue 3: Wrong results

**Symptoms**:

- Filter applied but shows wrong rows
- Too many or too few results

**Debug**:

1. Check the WHERE clause syntax
2. Verify operator is correct
3. Check value is properly escaped
4. Test SQL directly in postgres-meta or SQL editor

**Possible Causes**:

- Operator mismatch (= vs LIKE)
- Case sensitivity (LIKE vs ILIKE)
- Missing wildcards for LIKE

### Issue 4: Filters don't persist in URL

**Symptoms**:

- Add filter but URL doesn't update
- Refresh page and filters disappear

**Debug**:

1. Check if `useTableFilters` hook is being used
2. Check `router.push()` is being called
3. Check URL encoding is correct

**Possible Causes**:

- `useTableFilters` not integrated
- Router not updating
- Filter serialization broken

### Issue 5: Multiple filters don't work together

**Symptoms**:

- Add second filter and first one disappears
- Only last filter applies

**Debug**:

1. Check `filters` array length
2. Check WHERE clause has multiple conditions
3. Verify `addFilter` appends, not replaces

**Possible Causes**:

- `addFilter` replacing instead of appending
- WHERE clause not joining with AND
- Filter state not accumulating

## SQL Query Examples

### Single Filter

```sql
select *
from public."exercises"
where "name" = 'TRICEPS'
order by "id" asc
limit 100 offset 0;
```

### Multiple Filters (AND)

```sql
select *
from public."exercises"
where "name" = 'TRICEPS' and "type" = 'STRENGTH'
order by "id" asc
limit 100 offset 0;
```

### LIKE Pattern

```sql
select *
from public."exercises"
where "name" like '%TRI%'
order by "id" asc
limit 100 offset 0;
```

### IN Operator

```sql
select *
from public."exercises"
where "type" in ('STRENGTH', 'CARDIO', 'FLEXIBILITY')
order by "id" asc
limit 100 offset 0;
```

### IS NULL

```sql
select *
from public."exercises"
where "notes" is null
order by "id" asc
limit 100 offset 0;
```

### With Pagination

```sql
select *
from public."exercises"
where "name" = 'TRICEPS'
order by "id" asc
limit 100 offset 100;
-- Page 2
```

### Row Count Query

```sql
select COUNT(*) as count
from public."exercises"
where "name" = 'TRICEPS';
```

## Performance Profiling

### Check Query Time

**In Network tab**:

1. Add filter
2. Find the query request
3. Check "Time" column
4. Should be <500ms for most queries

**Slow queries**:

- Check if column is indexed
- Check table size
- Consider adding database index

### Check Re-renders

**React DevTools Profiler**:

1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Add filter
5. Stop recording
6. Check component render times

**Look for**:

- Unnecessary re-renders
- Components rendering >50ms
- Re-render cascades

## Test Data Setup

### Create Test Data

If you need test data for filtering:

```sql
-- Insert test exercises
insert into exercises (name, type, sets, reps, notes)
values
  ('TRICEPS EXTENSION', 'STRENGTH', 3, 12, 'Use cable machine'),
  ('TRICEPS DIPS', 'STRENGTH', 3, 10, null),
  ('BICEPS CURLS', 'STRENGTH', 3, 12, 'Dumbbells'),
  ('CARDIO RUN', 'CARDIO', 1, 30, '30 minutes'),
  ('FLEXIBILITY STRETCH', 'FLEXIBILITY', 1, 10, null);

-- Verify data
select * from exercises;
```

### Test Each Operator

```sql
-- Equals
SELECT * FROM exercises WHERE name = 'TRICEPS EXTENSION';

-- Not Equals
SELECT * FROM exercises WHERE type != 'CARDIO';

-- Greater Than
SELECT * FROM exercises WHERE sets > 2;

-- LIKE
SELECT * FROM exercises WHERE name LIKE '%TRI%';

-- ILIKE (case-insensitive)
SELECT * FROM exercises WHERE name ILIKE '%tri%';

-- IN
SELECT * FROM exercises WHERE type IN ('STRENGTH', 'CARDIO');

-- IS NULL
SELECT * FROM exercises WHERE notes IS NULL;

-- IS NOT NULL
SELECT * FROM exercises WHERE notes IS NOT NULL;
```

## Quick Health Check

Run this in browser console after adding a filter:

```javascript
// Health check script
const checks = {
  url: window.location.href,
  hasFilters: window.location.search.includes('filters'),
  filterChips: document.querySelectorAll('[data-filter-chip]').length,
  gridRows: document.querySelectorAll('[role="row"]').length - 1, // -1 for header
}

console.table(checks)

// Check last network request
const lastRequest = performance
  .getEntriesByType('resource')
  .filter((r) => r.name.includes('table-rows'))
  .pop()

console.log('Last query time:', lastRequest?.duration + 'ms')
```

## Success Indicators

✅ **Everything working**:

- Network requests show WHERE clause
- Grid updates immediately (<500ms)
- Filter chips appear
- URL includes filters
- Row count updates
- No console errors
- Pagination works
- Sorting works

❌ **Something broken**:

- Network errors (500, 400)
- Grid doesn't update
- No WHERE clause in SQL
- Console errors
- Filters disappear on refresh
- Wrong results displayed
