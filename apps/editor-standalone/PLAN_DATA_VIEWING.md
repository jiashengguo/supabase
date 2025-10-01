# Data Viewing Enhancement Plan

**Date**: October 1, 2025  
**Focus**: Complete core data viewing features before CRUD operations

---

## 🎯 Goal

Build out a complete, production-ready data viewing experience matching Supabase Studio's table editor, with filtering, sorting, foreign key navigation, and multi-table tabs.

---

## 📋 Feature Breakdown

### 1. Column Filtering (Priority: HIGH)

**Time Estimate**: 3-4 hours

#### What Users Need:

- Filter rows by column values
- Support multiple operators (equals, not equals, greater than, less than, LIKE, IN, IS NULL, etc.)
- Apply multiple filters (AND logic)
- Clear filters easily
- Persist filters in URL

#### Implementation:

**A. UI Components** (1.5 hours)

- [ ] Create `FilterPopover` component
  - Column selector dropdown
  - Operator selector dropdown
  - Value input (text, number, date picker)
  - Add/Remove filter buttons
- [ ] Add filter button to toolbar
- [ ] Show active filters as chips/badges
- [ ] Add "Clear all filters" button

**B. State Management** (1 hour)

- [ ] Define filter types: `Filter = { column: string, operator: string, value: any }`
- [ ] Add filter state to URL params
- [ ] Create `useTableFilters()` hook

**C. Backend Integration** (1 hour)

- [ ] Update `fetchTableRows()` in `lib/api-helpers.ts` to accept filters
- [ ] Convert filters to postgres-meta query format
- [ ] Update `useTableRows` hook to pass filters

**D. Testing** (0.5 hours)

- [ ] Test all operators
- [ ] Test multiple filters
- [ ] Test filter persistence in URL
- [ ] Test clear filters

**Files to Create/Modify**:

```
components/table/filter-popover.tsx       [NEW]
components/table/filter-chip.tsx          [NEW]
components/table/table-toolbar.tsx        [MODIFY]
lib/api-helpers.ts                        [MODIFY]
hooks/use-table-rows.ts                   [MODIFY]
lib/constants.ts                          [MODIFY - add operators]
```

---

### 2. Server-Side Sorting (Priority: HIGH)

**Time Estimate**: 2 hours

#### What Users Need:

- Click column headers to sort
- Toggle between ascending/descending
- Visual indicators for sort direction
- Multi-column sorting (Shift+Click)
- Persist sort in URL

#### Implementation:

**A. UI Components** (0.5 hours)

- [ ] Add sort indicators to column headers (↑↓)
- [ ] Handle click events on headers
- [ ] Show active sort columns

**B. State Management** (0.5 hours)

- [ ] Define sort types: `Sort = { column: string, direction: 'asc' | 'desc' }`
- [ ] Add sort state to URL params
- [ ] Create `useTableSorts()` hook

**C. Backend Integration** (0.5 hours)

- [ ] Update `fetchTableRows()` to accept sorts
- [ ] Convert sorts to postgres-meta query format
- [ ] Update `useTableRows` hook to pass sorts

**D. Testing** (0.5 hours)

- [ ] Test single column sort
- [ ] Test multi-column sort
- [ ] Test sort persistence
- [ ] Test sort with filters + pagination

**Files to Create/Modify**:

```
components/table/data-grid.tsx            [MODIFY - add sort handlers]
lib/api-helpers.ts                        [MODIFY]
hooks/use-table-rows.ts                   [MODIFY]
```

---

### 3. Foreign Key Navigation (Priority: MEDIUM)

**Time Estimate**: 4-5 hours

#### What Users Need:

- See which columns are foreign keys
- Hover to preview referenced record
- Click to navigate to referenced table
- Navigate back easily

#### Implementation:

**A. Foreign Key Detection** (1 hour)

- [ ] Use `table.relationships` from postgres-meta
- [ ] Create `isForeignKey()` utility function
- [ ] Format foreign key column values differently

**B. Reference Peek Popover** (2 hours)

- [ ] Create `ReferenceRecordPeek` component
- [ ] Fetch referenced record on hover
- [ ] Show preview of referenced record fields
- [ ] Add "View full record" button

**C. Navigation** (1 hour)

- [ ] Add click handler to foreign key cells
- [ ] Navigate to referenced table
- [ ] Pre-apply filter to show specific record
- [ ] Add breadcrumb navigation

**D. ForeignKeyFormatter Enhancement** (1 hour)

- [ ] Style foreign key cells distinctly
- [ ] Show arrow icon
- [ ] Add hover state
- [ ] Handle null foreign keys

**Files to Create/Modify**:

```
components/table/reference-peek.tsx       [NEW]
components/table/foreign-key-formatter.tsx [NEW/MODIFY]
components/table/data-grid.tsx            [MODIFY]
lib/utils.ts                              [ADD foreign key helpers]
```

---

### 4. Multiple Table Tabs (Priority: MEDIUM)

**Time Estimate**: 3-4 hours

#### What Users Need:

- Open multiple tables in tabs
- Switch between tabs
- Close individual tabs
- Persist tabs in URL
- Independent state per tab (filters, sorts, pagination)

#### Implementation:

**A. Tab State Management** (1.5 hours)

- [ ] Define tab structure: `Tab = { id: string, tableId: number, tableName: string, filters, sorts, page }`
- [ ] Use URL params for tab state
- [ ] Create `useTableTabs()` hook
- [ ] Handle tab switching

**B. Tab Bar UI** (1.5 hours)

- [ ] Create `TabBar` component
- [ ] Tab buttons with table names
- [ ] Close buttons (X)
- [ ] Active tab indicator
- [ ] Add "+" button for new tab

**C. Routing** (1 hour)

- [ ] Update URL structure: `/[tableId]?tab=tab1&tab=tab2&active=tab1`
- [ ] Handle navigation between tabs
- [ ] Preserve state when switching

**Files to Create/Modify**:

```
components/table/tab-bar.tsx              [NEW]
hooks/use-table-tabs.ts                   [NEW]
app/[tableId]/page.tsx                    [MODIFY - multi-tab support]
lib/constants.ts                          [ADD tab constants]
```

---

### 5. Advanced Grid Features (Priority: LOW)

**Time Estimate**: 2-3 hours

#### Enhancements:

- [ ] Column reordering (drag & drop)
- [ ] Column visibility toggle
- [ ] Column width persistence
- [ ] Cell copy/paste
- [ ] Keyboard navigation
- [ ] Fix JSON column rendering bug
- [ ] Virtual scrolling for large tables

**Files to Modify**:

```
components/table/data-grid.tsx
components/table/column-settings.tsx      [NEW]
```

---

## 🗓️ Implementation Timeline

### Day 4 Afternoon (Today) - 4 hours

✅ **COMPLETE**: Timestamp fixes and refocusing

- [x] Document plan
- [x] Update STATUS.md
- [ ] Start: Column Filtering (UI + State) - 2 hours
- [ ] Start: Server-Side Sorting (Full) - 2 hours

### Day 5 - 6 hours

- [ ] Complete: Column Filtering (Backend + Testing) - 2 hours
- [ ] Start: Foreign Key Navigation (Detection + Peek) - 3 hours
- [ ] Start: Multiple Table Tabs (State Management) - 1 hour

### Day 6 - 6 hours

- [ ] Complete: Foreign Key Navigation (Full feature) - 2 hours
- [ ] Complete: Multiple Table Tabs (UI + Routing) - 3 hours
- [ ] Start: Advanced Grid Features - 1 hour

### Day 7 - 6 hours

- [ ] Complete: Advanced Grid Features - 2 hours
- [ ] Polish & Bug Fixes - 2 hours
- [ ] Testing & Documentation - 2 hours

**Total Estimated Time**: 22 hours  
**Target Completion**: Day 7 evening

---

## 🎨 UI/UX Reference

### Filtering UI

```
┌─────────────────────────────────────────┐
│ 🔍 Filter | ↕️ Sort | 📊 [Active: 2]   │
│ ┌─────────────────────────────────────┐ │
│ │ Column: name ▾ Operator: = ▾       │ │
│ │ Value: [________] [Apply] [Clear]   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Active Filters:                         │
│ [ name = "John" ✕ ] [ age > 25 ✕ ]    │
└─────────────────────────────────────────┘
```

### Table Tabs

```
┌─────────────────────────────────────────┐
│ [📋 Users*] [📊 Orders] [🏬 Products] ➕ │
└─────────────────────────────────────────┘
```

### Foreign Key Cell

```
┌────────────────────┐
│ user_id: 123 →    │  ← Click to navigate
└────────────────────┘
     ↓ Hover
┌────────────────────┐
│ Preview:           │
│ id: 123            │
│ name: John Doe     │
│ email: john@...    │
│ [View Full →]      │
└────────────────────┘
```

---

## 📚 Key References from Studio

### Filter Implementation

- `/apps/studio/components/grid/components/header/filter/`
- `/apps/studio/components/ui/DataTable/DataTableFilters/`
- Filter operators in `Filter.constants.ts`

### Sort Implementation

- `SupabaseGrid.utils.ts` - URL param formatting
- `data-grid.tsx` - Column header click handlers

### Foreign Key Features

- `ForeignKeyFormatter.tsx` - Cell formatting
- `ReferenceRecordPeek.tsx` - Preview popover
- `table-editor-types.ts` - Relationship types

### Tab Management

- `state/table-editor.tsx` - State management patterns
- URL-based routing with Next.js App Router

---

## ✅ Success Criteria

- ✅ Users can filter by any column with all standard operators
- ✅ Users can sort by multiple columns
- ✅ Users can click foreign keys to preview/navigate
- ✅ Users can open multiple tables in tabs
- ✅ All state persists in URL (shareable links)
- ✅ Performance is good (no lag with 1000+ rows)
- ✅ UI matches Studio's look and feel

---

## 🚀 Quick Start

```bash
# Run development server
cd apps/editor-standalone
npm run dev

# Open browser
http://localhost:3000

# Test with a table that has:
# - Multiple columns (for filtering)
# - Foreign keys (for navigation)
# - Lots of data (for sorting/pagination)
```

---

Last Updated: October 1, 2025 - Afternoon
Next Update: End of Day 4
