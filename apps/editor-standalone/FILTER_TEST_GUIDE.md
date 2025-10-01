# Column Filtering - Test Guide

## ✅ Implementation Complete

The Column Filtering feature is now fully implemented with backend integration. All filters are applied via SQL WHERE clauses to the postgres-meta API.

## 🧪 Test Scenarios

### 1. Basic Filtering (Equals Operator)

**Steps**:

1. Navigate to any table (e.g., `workouts` or `exercises`)
2. Click the "Filter" button in the toolbar
3. Select a column (e.g., "name")
4. Keep operator as "equals" (default)
5. Enter a value (e.g., "TRICEPS" for exercises)
6. Click "Add Filter"

**Expected**:

- ✅ Filter chip appears showing "name equals TRICEPS"
- ✅ Grid shows only rows where name = "TRICEPS"
- ✅ Pagination total updates to match filtered count
- ✅ URL updates with `?filters=...` parameter

### 2. Comparison Operators (>, <, >=, <=)

**Steps**:

1. Add a filter on a numeric column
2. Select operator: "greater than" or "less than"
3. Enter a numeric value
4. Click "Add Filter"

**Expected**:

- ✅ Grid shows only rows matching the comparison
- ✅ Filter chip displays correctly

### 3. Pattern Matching (LIKE, ILIKE)

**Steps**:

1. Add a filter on a text column
2. Select operator: "contains" (ILIKE)
3. Enter partial text (e.g., "tri" to match "TRICEPS")
4. Click "Add Filter"

**Expected**:

- ✅ Grid shows rows with partial matches
- ✅ ILIKE is case-insensitive

**Advanced**:

- Use wildcards explicitly: "%tri%" in value field
- Try "starts with" (value: "TRI%")
- Try "ends with" (value: "%EPS")

### 4. IN Operator (Multiple Values)

**Steps**:

1. Add a filter on any column
2. Select operator: "in"
3. Enter comma-separated values: "TRICEPS, BICEPS, CHEST"
4. Click "Add Filter"

**Expected**:

- ✅ Grid shows rows matching ANY of the values
- ✅ Values are properly split and quoted in SQL

### 5. NULL Checking (IS NULL, IS NOT NULL)

**Steps**:

1. Add a filter on a nullable column
2. Select operator: "is null" or "is not null"
3. Value field should be ignored for these operators
4. Click "Add Filter"

**Expected**:

- ✅ Grid shows only NULL or non-NULL rows
- ✅ Value field is optional/ignored

### 6. Multi-Column Filtering (AND Logic)

**Steps**:

1. Add first filter (e.g., "name equals TRICEPS")
2. Click "Filter" again
3. Add second filter (e.g., "type equals STRENGTH")
4. Both filters should be active

**Expected**:

- ✅ Both filter chips appear
- ✅ Grid shows rows matching BOTH conditions (AND)
- ✅ Removing one filter updates results
- ✅ "Clear all" removes all filters

### 7. URL Persistence (Shareable Links)

**Steps**:

1. Add one or more filters
2. Copy the URL from browser address bar
3. Open URL in a new tab/window
4. Filters should be automatically applied

**Expected**:

- ✅ Filters appear in URL as `?filters=...`
- ✅ Filters are restored from URL on page load
- ✅ Grid shows filtered results immediately
- ✅ Filter chips appear for each filter

### 8. Filter Removal

**Steps**:

1. Add multiple filters
2. Click "×" on individual filter chip to remove
3. Verify grid updates
4. Click "Clear all" to remove all filters

**Expected**:

- ✅ Individual chip removal updates results
- ✅ "Clear all" removes all filters
- ✅ Grid returns to unfiltered state
- ✅ URL updates (removes `?filters=` param)

## 🐛 Known Edge Cases to Test

### SQL Injection Prevention

- Try entering single quotes in value: `O'Brien`
- Should be escaped as `O''Brien` in SQL
- ✅ Expected: No SQL errors

### Empty Values

- Try submitting filter with empty value
- ✅ Expected: Should handle gracefully or validate

### Special Characters

- Try values with: `%`, `_`, `\`, quotes
- ✅ Expected: Should escape properly

### Large Result Sets

- Filter to get 1000+ rows
- ✅ Expected: Pagination still works
- ✅ Expected: Performance is acceptable

## 📊 Test Matrix

| Operator    | Column Type | Test Value | Expected SQL                |
| ----------- | ----------- | ---------- | --------------------------- |
| =           | text        | "TRICEPS"  | `"name" = 'TRICEPS'`        |
| !=          | text        | "BICEPS"   | `"name" != 'BICEPS'`        |
| >           | integer     | "10"       | `"reps" > '10'`             |
| <           | integer     | "5"        | `"sets" < '5'`              |
| >=          | integer     | "3"        | `"sets" >= '3'`             |
| <=          | integer     | "12"       | `"reps" <= '12'`            |
| LIKE        | text        | "%TRI%"    | `"name" LIKE '%TRI%'`       |
| ILIKE       | text        | "%tri%"    | `"name" ILIKE '%tri%'`      |
| IN          | text        | "A,B,C"    | `"type" IN ('A', 'B', 'C')` |
| IS NULL     | any         | (empty)    | `"notes" IS NULL`           |
| IS NOT NULL | any         | (empty)    | `"notes" IS NOT NULL`       |

## 🎯 Success Criteria

- ✅ All 11 operators work correctly
- ✅ Multi-column filtering works (AND logic)
- ✅ URL persistence works (shareable links)
- ✅ Filter chips display correctly
- ✅ Pagination updates with filtered count
- ✅ No SQL errors with special characters
- ✅ Performance is acceptable (<500ms for most queries)

## 🚀 Next Steps After Testing

1. **Polish**:

   - Add loading spinner during filter changes
   - Add empty state when no results match filters
   - Add validation for numeric operators

2. **Enhancements** (Future):
   - Date picker for date columns
   - Range filters (between X and Y)
   - OR logic support (in addition to AND)
   - Save filter presets

## 📝 Implementation Details

**Files Modified**:

- `lib/types/filters.ts` - Filter types and URL utilities
- `hooks/use-table-filters.ts` - URL-based state management
- `hooks/use-table-rows.ts` - SQL WHERE clause generation
- `components/table/filter-popover.tsx` - Filter input UI
- `components/table/filter-chip.tsx` - Active filter display
- `components/table/table-toolbar.tsx` - Toolbar integration
- `components/table/data-grid.tsx` - Passes filters to hooks

**Key Functions**:

- `filtersToWhereClause(filters)` - Converts Filter[] to SQL WHERE clause
- `filtersToSearchParams(filters)` - Converts Filter[] to URL params
- `searchParamsToFilters(params)` - Converts URL params to Filter[]
