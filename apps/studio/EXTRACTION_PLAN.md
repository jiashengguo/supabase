# Table Editor Extraction Plan - 1 Week Timeline

**Target**: Standalone Next.js app with view & edit capabilities for developers

## 🎯 Scope Definition

### ✅ INCLUDE (MVP Features)

- View tables list and data
- Edit existing rows (inline & modal)
- Basic filtering and sorting
- Pagination
- Row selection and deletion
- Simple authentication (Supabase Auth)

### ❌ EXCLUDE (Out of Scope)

- Create/edit table schemas
- Column management
- Import/Export CSV
- Foreign key relationships
- SQL definition view
- Advanced permissions/RLS
- Complex tab system
- Schema switcher

## 📅 Week Timeline

### Day 1-2: Setup & Core Infrastructure

**Goal**: Working Next.js app with authentication

**Tasks**:

1. Create new Next.js app structure
2. Copy essential workspace packages (ui, common, icons)
3. Setup Supabase client & authentication
4. Create basic layout (header + main area)
5. Add table list sidebar (simplified)

**Files to extract**: ~20 files

- Basic layout components
- Auth hooks
- Supabase client setup

### Day 3-4: Grid & Data Display

**Goal**: Display table data with sorting/filtering

**Tasks**:

1. Extract SupabaseGrid component
2. Extract Grid, Header, Footer components
3. Setup React Query for data fetching
4. Add sorting & basic filtering
5. Add pagination

**Files to extract**: ~25 files

- `components/grid/*`
- `data/table-rows/*`
- Grid utilities

### Day 5-6: Row Editing

**Goal**: Edit and delete rows

**Tasks**:

1. Extract RowEditor component (simplified)
2. Add inline editing capability
3. Add delete confirmation
4. Setup mutations (update, delete)
5. Handle validation

**Files to extract**: ~15 files

- `SidePanelEditor/RowEditor/*`
- Row mutation hooks
- Form components

### Day 7: Polish & Testing

**Goal**: Production-ready MVP

**Tasks**:

1. Error handling
2. Loading states
3. Toast notifications
4. Basic styling cleanup
5. Testing with real database
6. Documentation

---

## 📁 File Structure (Simplified)

```
standalone-editor/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home/redirect
│   └── [tableId]/
│       └── page.tsx                  # Table view page
├── components/
│   ├── grid/
│   │   ├── Grid.tsx                  # Main grid component
│   │   ├── Header.tsx                # Grid toolbar
│   │   ├── Footer.tsx                # Pagination
│   │   └── components/               # Grid sub-components
│   ├── editor/
│   │   ├── RowEditor.tsx             # Edit row modal
│   │   └── FieldEditor.tsx           # Individual field editors
│   ├── layout/
│   │   ├── Sidebar.tsx               # Table list
│   │   └── Header.tsx                # App header
│   └── ui/                           # UI components from workspace
├── lib/
│   ├── supabase.ts                   # Supabase client
│   ├── hooks/                        # React hooks
│   └── utils/                        # Utilities
├── state/
│   ├── grid-state.ts                 # Grid state (simplified)
│   └── editor-state.ts               # Editor state
└── package.json
```

---

## 🔧 Technical Stack

### Core Dependencies

```json
{
  "next": "15.x",
  "react": "18.x",
  "@supabase/supabase-js": "^2.x",
  "@tanstack/react-query": "^4.x",
  "react-data-grid": "^7.x",
  "valtio": "^2.x"
}
```

### UI Dependencies

```json
{
  "@radix-ui/react-dialog": "Dialog modals",
  "@radix-ui/react-dropdown-menu": "Dropdowns",
  "@radix-ui/react-select": "Selects",
  "lucide-react": "Icons",
  "tailwindcss": "Styling"
}
```

### Development

```json
{
  "typescript": "^5.x",
  "eslint": "^8.x",
  "prettier": "^3.x"
}
```

---

## 📦 Files to Extract (Priority Order)

### Priority 1: Essential Core (~30 files)

**Must have for basic functionality**

#### Grid System

- [ ] `components/grid/SupabaseGrid.tsx`
- [ ] `components/grid/components/grid/Grid.tsx`
- [ ] `components/grid/components/header/Header.tsx`
- [ ] `components/grid/components/footer/Footer.tsx`
- [ ] `components/grid/components/grid/SelectColumn.tsx`
- [ ] `components/grid/utils/column.ts`
- [ ] `components/grid/utils/gridColumns.ts`
- [ ] `components/grid/hooks/useTableFilter.tsx`
- [ ] `components/grid/hooks/useTableSort.tsx`
- [ ] `components/grid/types.ts`

#### Data Layer

- [ ] `data/table-rows/table-rows-query.ts`
- [ ] `data/table-rows/table-rows-update-mutation.ts`
- [ ] `data/table-rows/table-rows-delete-mutation.ts`
- [ ] `data/table-editor/table-editor-query.ts`
- [ ] `data/table-editor/table-editor-types.ts`
- [ ] `data/tables/tables-query.ts`

#### State Management

- [ ] `state/table-editor.tsx` (simplified)
- [ ] `state/table-editor-table.tsx` (simplified)

#### Utilities

- [ ] `lib/helpers.ts`
- [ ] `lib/constants.ts`
- [ ] `components/grid/SupabaseGrid.utils.ts`

### Priority 2: Row Editing (~20 files)

**For edit functionality**

#### Row Editor

- [ ] `components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/RowEditor.tsx`
- [ ] `components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/RowEditor.utils.ts`
- [ ] `components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/RowField.tsx`
- [ ] `components/interfaces/TableGridEditor/SidePanelEditor/ActionBar.tsx`

#### Field Editors (Simplified)

- [ ] Basic text/number inputs (built-in)
- [ ] Boolean toggle
- [ ] Date picker (simple)
- [ ] JSON viewer (read-only or basic textarea)

### Priority 3: UI Components (~15 files)

**From workspace packages**

#### From `packages/ui`

- [ ] `Button.tsx`
- [ ] `Input.tsx`
- [ ] `Modal.tsx` (or use SidePanel)
- [ ] `Badge.tsx`
- [ ] `Alert.tsx`
- [ ] `Checkbox.tsx`
- [ ] `Select.tsx`

#### From `packages/common`

- [ ] `useParams.tsx`
- [ ] Other utility hooks

---

## 🚀 Implementation Strategy

### Step 1: Create New App (Day 1)

```bash
npx create-next-app@latest standalone-editor --typescript --tailwind --app
cd standalone-editor
```

### Step 2: Copy Workspace Packages (Day 1)

```bash
# Copy essential UI components
cp -r ../studio/packages/ui ./packages/ui
cp -r ../studio/packages/common ./packages/common
cp -r ../studio/packages/icons ./packages/icons

# Simplify: Remove unused components
# Keep only: Button, Input, Modal, Badge, Alert, etc.
```

### Step 3: Extract Grid System (Day 3)

```bash
# Copy grid components
cp -r ../studio/components/grid ./components/grid

# Simplify:
# - Remove advanced features
# - Remove unused utilities
# - Simplify state management
```

### Step 4: Extract Row Editor (Day 5)

```bash
# Copy row editor (simplified version)
cp ../studio/components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/* \
   ./components/editor/

# Simplify:
# - Remove foreign key selector
# - Remove complex JSON editor (use textarea)
# - Remove text editor (use textarea)
```

---

## 🎨 Simplifications to Make

### 1. **Authentication**

- Use simple Supabase Auth (email/password)
- No complex permissions/RBAC
- Just check if user is authenticated

### 2. **Table List**

- Simple list (no fancy search/filters)
- Query all tables in public schema only
- No schema switcher

### 3. **Grid**

- Keep sorting & basic filtering
- Remove complex filter UI (just simple text search)
- Remove advanced features (bulk edit, etc.)

### 4. **Row Editing**

- Modal form for editing (not inline first)
- Basic field types only
- Simple validation (required/type checking)

### 5. **State Management**

- Simplify to just current table state
- Remove tabs system
- Remove complex history tracking

---

## 🔍 Key Challenges & Solutions

### Challenge 1: Workspace Package Dependencies

**Problem**: UI package depends on many other packages
**Solution**:

- Copy only used components
- Inline small utilities
- Replace complex components with simpler alternatives

### Challenge 2: Complex State Management

**Problem**: Current state is over-engineered for your needs
**Solution**:

- Create new simplified state (just grid + editor)
- Use React Query for server state
- Use simple useState/useReducer for UI state

### Challenge 3: Grid Component Complexity

**Problem**: SupabaseGrid has many features you don't need
**Solution**:

- Keep core rendering logic
- Remove: tabs, history, complex filters
- Simplify: just table data + basic operations

### Challenge 4: Type Dependencies

**Problem**: TypeScript types spread across many files
**Solution**:

- Copy essential types to single types.ts file
- Simplify complex unions
- Use `any` temporarily where needed (fix later)

---

## 📋 Checklist for Each Day

### ✅ Day 1 Checklist

- [ ] New Next.js app created
- [ ] Supabase client configured
- [ ] Basic authentication working
- [ ] Can connect to database
- [ ] Basic layout rendered

### ✅ Day 2 Checklist

- [ ] Table list sidebar working
- [ ] Can list all tables
- [ ] Can navigate to table view
- [ ] Basic routing working
- [ ] UI components functional

### ✅ Day 3 Checklist

- [ ] Grid renders table data
- [ ] Pagination working
- [ ] Can navigate pages
- [ ] Loading states display
- [ ] Error handling basic

### ✅ Day 4 Checklist

- [ ] Sorting works
- [ ] Basic filtering works
- [ ] Row selection works
- [ ] Performance acceptable
- [ ] Grid is responsive

### ✅ Day 5 Checklist

- [ ] Can open row editor
- [ ] Can edit fields
- [ ] Can save changes
- [ ] Validation works
- [ ] Error handling

### ✅ Day 6 Checklist

- [ ] Can delete rows
- [ ] Confirmation dialogs work
- [ ] All CRUD operations tested
- [ ] Data refreshes correctly
- [ ] No critical bugs

### ✅ Day 7 Checklist

- [ ] Error messages helpful
- [ ] Loading states polished
- [ ] Toast notifications work
- [ ] Basic docs written
- [ ] Deployed/tested

---

## 🎯 Success Criteria

After 1 week, you should have:

1. ✅ Working standalone Next.js app
2. ✅ List of tables from database
3. ✅ View table data in grid
4. ✅ Sort and filter rows
5. ✅ Edit existing rows
6. ✅ Delete rows
7. ✅ Basic authentication
8. ✅ Responsive UI
9. ✅ No critical bugs

---

## 🚦 Go/No-Go Decision Points

### After Day 2

**Question**: Is authentication and basic layout working?

- ✅ **Yes**: Continue to grid implementation
- ❌ **No**: Spend extra day on foundation

### After Day 4

**Question**: Is grid displaying data correctly?

- ✅ **Yes**: Move to editing features
- ❌ **No**: Simplify grid further, skip fancy features

### After Day 6

**Question**: Is editing working end-to-end?

- ✅ **Yes**: Polish and test
- ❌ **No**: Cut scope (maybe delete only, no edit)

---

## 📝 Next Steps - START HERE

### Immediate Action Items:

1. **Review this plan** - Any concerns? Adjustments needed?

2. **Create new app structure**:

   ```bash
   cd /Users/jiasheng/Work/repo/supabase/apps
   npx create-next-app@latest editor-standalone --typescript --tailwind --app
   ```

3. **Start extraction** - I can help you:

   - Copy files in the right order
   - Simplify complex components
   - Remove unnecessary dependencies
   - Fix import paths
   - Test as we go

4. **Daily check-ins** - Let me know:
   - What's working
   - What's blocking you
   - What to prioritize/cut

---

## 🆘 Fallback Plan

If we hit major blockers:

**Plan B (3 days)**: Super Minimal Version

- Just grid view (read-only)
- External form for editing (separate page)
- No fancy features at all
- Gets you 70% value in 40% time

**Plan C (1 day)**: Configure Full Studio

- Hide all unused features via CSS/config
- Deploy full app
- Customize later
- Gets you 100% value immediately

---

## ❓ Questions Before We Start

1. Do you already have a Supabase project set up?
2. Do you want to start from scratch or copy existing files?
3. Should I help you create the new app now?
4. Any specific table structures I should know about?

**Let me know and we'll start the extraction!** 🚀
