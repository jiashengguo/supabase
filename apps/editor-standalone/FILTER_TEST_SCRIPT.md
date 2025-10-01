# Column Filtering - Manual Test Script

## Test Environment

- **URL**: http://localhost:3001
- **Test Date**: October 1, 2025
- **Feature**: Column Filtering with 11 operators

## Pre-Test Checklist

- [ ] Dev server running on port 3001
- [ ] Navigate to any table with data (e.g., `exercises` table)
- [ ] Open browser DevTools (Console + Network tabs)
- [ ] Clear any existing filters

---

## Test 1: Basic Equals Filter ✓

**Objective**: Test the most common filter operator

**Steps**:

1. Click "Add Filter" button in toolbar
2. Popover should open
3. Select column: "name"
4. Select operator: "equals" (default)
5. Enter value: "TRICEPS" (or any existing value)
6. Click "Add Filter" button

**Expected Results**:

- [x] Popover closes after adding filter
- [ ] Filter chip appears showing "name equals TRICEPS"
- [ ] Grid updates to show only matching rows
- [ ] Network tab shows POST to `/api/platform/pg-meta/default/query?key=table-rows-*` with WHERE clause
- [ ] Row count updates to match filtered results
- [ ] URL includes `?filters=` parameter

**SQL Generated** (check in Network tab request payload):

```sql
SELECT * FROM public."exercises" WHERE "name" = 'TRICEPS' ORDER BY ... LIMIT 100
```

**Pass/Fail**: **\_\_\_**

---

## Test 2: Not Equals Filter

**Steps**:

1. Clear existing filters (if any)
2. Click "Add Filter"
3. Column: "type"
4. Operator: "not equals"
5. Value: "CARDIO"
6. Add filter

**Expected Results**:

- [ ] Shows all rows except those where type = "CARDIO"
- [ ] Filter chip shows "type not equals CARDIO"

**SQL Generated**:

```sql
WHERE "type" != 'CARDIO'
```

**Pass/Fail**: **\_\_\_**

---

## Test 3: Comparison Operators (>, <, >=, <=)

**Steps**:

1. Clear filters
2. Add filter on numeric column (e.g., "sets" or "reps")
3. Operator: "greater than"
4. Value: "3"
5. Add filter

**Expected Results**:

- [ ] Shows only rows where numeric value > 3
- [ ] Filter chip displays correctly

**Try all 4**:

- [ ] Greater than (>)
- [ ] Less than (<)
- [ ] Greater than or equal (>=)
- [ ] Less than or equal (<=)

**Pass/Fail**: **\_\_\_**

---

## Test 4: LIKE Pattern Matching (Case-Sensitive)

**Steps**:

1. Clear filters
2. Add filter
3. Column: "name"
4. Operator: "like"
5. Value: "%TRI%" (pattern with wildcards)
6. Add filter

**Expected Results**:

- [ ] Shows rows matching pattern (case-sensitive)
- [ ] Works with leading/trailing wildcards

**SQL Generated**:

```sql
WHERE "name" LIKE '%TRI%'
```

**Pass/Fail**: **\_\_\_**

---

## Test 5: ILIKE Pattern Matching (Case-Insensitive)

**Steps**:

1. Clear filters
2. Add filter
3. Column: "name"
4. Operator: "contains" (ILIKE)
5. Value: "%tri%" (lowercase)
6. Add filter

**Expected Results**:

- [ ] Shows rows matching pattern (case-insensitive)
- [ ] Matches "TRICEPS", "Triceps", "triceps"

**SQL Generated**:

```sql
WHERE "name" ILIKE '%tri%'
```

**Pass/Fail**: **\_\_\_**

---

## Test 6: IN Operator (Multiple Values)

**Steps**:

1. Clear filters
2. Add filter
3. Column: "type"
4. Operator: "in"
5. Value: "STRENGTH, CARDIO, FLEXIBILITY" (comma-separated)
6. Add filter

**Expected Results**:

- [ ] Shows rows matching ANY of the values
- [ ] Values are properly split by comma
- [ ] Whitespace trimmed from each value

**SQL Generated**:

```sql
WHERE "type" IN ('STRENGTH', 'CARDIO', 'FLEXIBILITY')
```

**Pass/Fail**: **\_\_\_**

---

## Test 7: IS NULL Operator

**Steps**:

1. Clear filters
2. Add filter
3. Column: Any nullable column (e.g., "notes")
4. Operator: "is null"
5. Value: (should be disabled/ignored)
6. Add filter

**Expected Results**:

- [ ] Value input is disabled or hidden
- [ ] Shows only rows where column IS NULL
- [ ] Filter chip shows "notes is null"

**SQL Generated**:

```sql
WHERE "notes" IS NULL
```

**Pass/Fail**: **\_\_\_**

---

## Test 8: IS NOT NULL Operator

**Steps**:

1. Clear filters
2. Add filter
3. Column: Same nullable column
4. Operator: "is not null"
5. Value: (should be disabled/ignored)
6. Add filter

**Expected Results**:

- [ ] Value input is disabled or hidden
- [ ] Shows only rows where column IS NOT NULL
- [ ] Filter chip shows "notes is not null"

**SQL Generated**:

```sql
WHERE "notes" IS NOT NULL
```

**Pass/Fail**: **\_\_\_**

---

## Test 9: Multi-Column Filtering (AND Logic)

**Steps**:

1. Clear filters
2. Add first filter: name equals "TRICEPS"
3. Verify results
4. Click "Add Filter" again
5. Add second filter: type equals "STRENGTH"
6. Verify results

**Expected Results**:

- [ ] Both filter chips appear
- [ ] Grid shows rows matching BOTH conditions
- [ ] Network request shows both conditions joined with AND

**SQL Generated**:

```sql
WHERE "name" = 'TRICEPS' AND "type" = 'STRENGTH'
```

**Additional Tests**:

- [ ] Add third filter - all three should apply
- [ ] Remove middle filter - other two remain active
- [ ] Result count decreases with each filter added

**Pass/Fail**: **\_\_\_**

---

## Test 10: Filter Removal (Individual)

**Steps**:

1. Add 3 different filters
2. Note the filtered row count
3. Click "×" on the MIDDLE filter chip
4. Verify results update

**Expected Results**:

- [ ] Middle filter chip disappears
- [ ] Other two filter chips remain
- [ ] Grid updates to show results matching remaining filters
- [ ] Row count updates
- [ ] URL updates (removes that filter from query params)

**Pass/Fail**: **\_\_\_**

---

## Test 11: Clear All Filters

**Steps**:

1. Add 2-3 filters
2. Click "Clear all" button in toolbar
3. Verify results

**Expected Results**:

- [ ] All filter chips disappear
- [ ] Grid returns to unfiltered state (shows all rows)
- [ ] Row count returns to total
- [ ] URL removes `?filters=` parameter
- [ ] Pagination resets to page 1

**Pass/Fail**: **\_\_\_**

---

## Test 12: URL Persistence (Shareable Links)

**Steps**:

1. Add filter: name equals "TRICEPS"
2. Copy URL from address bar (should have `?filters=...`)
3. Open URL in new browser tab
4. Observe behavior

**Expected Results**:

- [ ] Filters appear in URL as query parameter
- [ ] New tab loads with filter already applied
- [ ] Filter chip appears automatically
- [ ] Grid shows filtered results
- [ ] No "flash" of unfiltered data

**URL Format**:

```
http://localhost:3001?filters=eyJjb2x1bW4iOiJuYW1lIiwib3BlcmF0b3IiOiI9IiwidmFsdWUiOiJUUklDRVBTIn0%3D
```

(Base64 encoded filter JSON)

**Pass/Fail**: **\_\_\_**

---

## Test 13: SQL Injection Prevention

**Objective**: Ensure user input is properly escaped

**Steps**:

1. Add filter
2. Column: "name"
3. Operator: "equals"
4. Value: `O'Brien` (contains single quote)
5. Add filter

**Expected Results**:

- [ ] No SQL error
- [ ] Query executes successfully
- [ ] Shows rows where name = "O'Brien"
- [ ] SQL properly escapes quote as `'O''Brien'`

**Additional Injection Tests**:

- [ ] Value: `'; DROP TABLE exercises; --`
- [ ] Value: `" OR 1=1 --`
- [ ] Value: `\' OR \'1\'=\'1`

All should be safely escaped and treated as literal strings.

**Pass/Fail**: **\_\_\_**

---

## Test 14: Special Characters

**Steps**:
Test filters with special characters:

1. Value: `100%` (percent sign)
2. Value: `test_value` (underscore)
3. Value: `path\to\file` (backslash)
4. Value: `"quoted"` (double quotes)

**Expected Results**:

- [ ] All special characters handled correctly
- [ ] No SQL errors
- [ ] Characters are properly escaped

**Pass/Fail**: **\_\_\_**

---

## Test 15: Empty and Whitespace Values

**Steps**:

1. Try to add filter with empty value (for operators that require value)
2. Try value with only spaces: " "
3. Try value with leading/trailing spaces: " TRICEPS "

**Expected Results**:

- [ ] Empty value: Should either prevent submission or handle gracefully
- [ ] Whitespace: Should trim or handle appropriately
- [ ] Leading/trailing spaces: Should trim before filtering

**Pass/Fail**: **\_\_\_**

---

## Test 16: Pagination with Filters

**Steps**:

1. Add filter that returns 150+ results
2. Verify pagination controls appear
3. Click "Next page"
4. Verify page 2 data loads
5. Filter chips remain visible
6. Remove filter

**Expected Results**:

- [ ] Pagination works with filters active
- [ ] Page number persists in URL
- [ ] Filter persists when changing pages
- [ ] Row count reflects filtered total
- [ ] Removing filter resets to page 1

**Pass/Fail**: **\_\_\_**

---

## Test 17: Sorting with Filters

**Steps**:

1. Add filter
2. Click column header to sort
3. Verify sort and filter both apply

**Expected Results**:

- [ ] Both sorting and filtering work together
- [ ] SQL includes both WHERE and ORDER BY
- [ ] Results are filtered AND sorted

**SQL Generated**:

```sql
WHERE "name" = 'TRICEPS' ORDER BY "type" ASC LIMIT 100
```

**Pass/Fail**: **\_\_\_**

---

## Test 18: Performance Test

**Objective**: Ensure filtering is reasonably fast

**Steps**:

1. Open Network tab
2. Add filter on indexed column
3. Note query time
4. Add filter on non-indexed column
5. Note query time

**Expected Results**:

- [ ] Queries complete in <500ms for most tables
- [ ] UI remains responsive during filtering
- [ ] No noticeable lag when adding filters
- [ ] Loading indicator appears briefly

**Measured Times**:

- Indexed column: **\_** ms
- Non-indexed column: **\_** ms

**Pass/Fail**: **\_\_\_**

---

## Test 19: Error Handling

**Steps**:

1. Try to filter on column that doesn't exist (manually edit URL)
2. Try invalid operator (manually edit URL)
3. Try malformed filter JSON in URL

**Expected Results**:

- [ ] Graceful error handling (no app crash)
- [ ] Error toast/message appears
- [ ] Grid shows unfiltered data or error state
- [ ] Console shows meaningful error

**Pass/Fail**: **\_\_\_**

---

## Test 20: UI/UX Polish

**Visual Checks**:

- [ ] Filter popover is properly styled
- [ ] Filter chips are visually distinct
- [ ] "Add Filter" button has icon
- [ ] "Clear all" button is visible when filters active
- [ ] Popover closes after adding filter
- [ ] Popover can be closed with ESC key
- [ ] Form can be submitted with ENTER key
- [ ] Operator dropdown shows clear labels
- [ ] Column dropdown shows column types
- [ ] Value input has appropriate placeholder

**Pass/Fail**: **\_\_\_**

---

## Summary

**Total Tests**: 20
**Passed**: **_ / 20
**Failed**: _** / 20
**Pass Rate**: \_\_\_%

**Critical Issues** (blocking):

1.
2.
3.

**Minor Issues** (non-blocking):

1.
2.
3.

**Performance Notes**:

-

**Browser Tested**:
**Date Completed**:
**Tester**:

---

## Next Steps

### If All Tests Pass (✓):

1. Update STATUS.md to 100% complete
2. Document any performance considerations
3. Add to CHANGELOG
4. Consider enhancements:
   - Date picker for date columns
   - Range filters (between X and Y)
   - OR logic support
   - Save filter presets

### If Tests Fail (✗):

1. Document failures in detail
2. Create bug tickets
3. Fix critical issues first
4. Retest after fixes
5. Update test results

---

## Test Results Log

### Test Run 1 - [Date]

- Tester:
- Browser:
- Results:
- Notes:

### Test Run 2 - [Date]

- Tester:
- Browser:
- Results:
- Notes:
