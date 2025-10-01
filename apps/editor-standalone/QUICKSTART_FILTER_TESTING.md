# Quick Start - Testing Column Filtering

## 🚀 5-Minute Quick Test

### Prerequisites

- Dev server running on http://localhost:3001
- Browser with DevTools

### Quick Test Steps

#### 1️⃣ Basic Filter (30 seconds)

1. Open http://localhost:3001
2. Click any table in sidebar
3. Click **"Add Filter"** button
4. Select any column
5. Keep operator as "equals"
6. Enter any value you see in that column
7. Click **"Add Filter"**

✅ **Expected**: Grid shows only matching rows, filter chip appears

#### 2️⃣ Multi-Column Filter (30 seconds)

1. Click **"Add Filter"** again
2. Select different column
3. Enter another value
4. Click **"Add Filter"**

✅ **Expected**: Grid shows rows matching BOTH filters

#### 3️⃣ URL Persistence (30 seconds)

1. Copy URL from address bar
2. Open in new tab
3. Observe

✅ **Expected**: Filters auto-apply in new tab

#### 4️⃣ Remove Filter (15 seconds)

1. Click **×** on any filter chip

✅ **Expected**: That filter removes, grid updates

#### 5️⃣ Clear All (15 seconds)

1. Click **"Clear all"** button

✅ **Expected**: All filters remove, grid shows all rows

---

## 🔍 What to Check

### Visual Checks

- [ ] "Add Filter" button visible in toolbar
- [ ] Popover opens when clicking button
- [ ] Popover has 3 sections: Column, Operator, Value
- [ ] Filter chips appear after adding
- [ ] "Clear all" button appears when filters active
- [ ] Grid updates immediately when adding/removing filters

### Functional Checks

- [ ] Filters actually filter the data (not just UI)
- [ ] Multiple filters work together (AND logic)
- [ ] Removing one filter keeps others active
- [ ] "Clear all" removes all filters
- [ ] URL updates with each filter change
- [ ] Filters persist in URL (shareable)

### Technical Checks (Open DevTools)

- [ ] Network tab shows POST to `/query` with WHERE clause
- [ ] No console errors
- [ ] Query completes in <500ms
- [ ] Row count updates correctly

---

## 🐛 Common Issues

### Issue: Popover doesn't open

- **Fix**: Check console for errors, refresh page

### Issue: Grid doesn't update

- **Debug**: Open Network tab, check if SQL has WHERE clause
- **Fix**: Check filters are passed to useTableRows

### Issue: Filters disappear on refresh

- **Debug**: Check URL has `?filters=...`
- **Fix**: Ensure useTableFilters hook is working

---

## 📊 Quick SQL Check

Open **Network tab** → Find request to `/query` → Check payload:

**Without Filter**:

```sql
select * from public."exercises" order by "id" asc limit 100;
```

**With Filter** (should see WHERE clause):

```sql
select * from public."exercises" where "name" = 'TRICEPS' order by "id" asc limit 100;
```

---

## ✅ Success Checklist

- [ ] Can add filter
- [ ] Grid shows filtered results
- [ ] Filter chip appears
- [ ] Can add multiple filters
- [ ] Can remove individual filter
- [ ] Can clear all filters
- [ ] URL updates with filters
- [ ] Filters persist in URL
- [ ] No console errors
- [ ] Performance is good (<500ms)

**If all checked**: ✅ Feature working correctly!

**If any unchecked**: See FILTER_DEBUG_GUIDE.md for troubleshooting

---

## 🎓 Test All Operators (5 minutes)

Quick test of each operator type:

1. **Equals** (=): `name = "TRICEPS"`
2. **Not Equals** (!=): `type != "CARDIO"`
3. **Greater Than** (>): `sets > 2`
4. **Contains** (ILIKE): `name contains "tri"`
5. **In** (IN): `type in "STRENGTH, CARDIO"`
6. **Is Null**: `notes is null`

Try one from each category to verify all work.

---

## 📈 Full Test

For comprehensive testing, follow **FILTER_TEST_SCRIPT.md** (20 scenarios, ~30 minutes)

---

## 🆘 Need Help?

1. **Quick fixes**: FILTER_DEBUG_GUIDE.md
2. **Full test**: FILTER_TEST_SCRIPT.md
3. **Implementation**: FILTER_IMPLEMENTATION_SUMMARY.md
4. **Console errors**: Check browser console + Network tab

---

**Time Required**: 5-10 minutes for quick test, 30 minutes for full test  
**Difficulty**: Easy (just click and type)  
**Prerequisites**: Dev server running

Happy Testing! 🎉
