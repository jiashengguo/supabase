# Table Editor Feature Analysis

This document provides a comprehensive breakdown of the Table Editor feature to help you understand what's required for extraction.

## 🎯 Core Functionality

The Table Editor provides these key features:

1. **View/Browse Tables**: List and navigate database tables
2. **Edit Table Data**: CRUD operations on table rows
3. **Manage Schema**: Create/edit/delete tables and columns
4. **Filter & Sort**: Query table data with filters and sorting
5. **Import/Export**: CSV import and data export
6. **View Definitions**: Display SQL definitions of tables/views

## 📁 File Structure Overview

### 1. **Page Routes** (3 files)

```
pages/project/[ref]/editor/
├── index.tsx          # Landing page - shows last visited table
├── [id].tsx           # Main table view page
└── new.tsx            # New table creation page
```

**Dependencies**: Router, authentication, project context

---

### 2. **Core Components** (Major Layers)

#### Layer 1: Main Container

```
components/interfaces/TableGridEditor/
└── TableGridEditor.tsx          # Main component that orchestrates everything
```

**What it does**:

- Loads selected table data
- Manages permissions (read-only vs editable)
- Handles table creation/deletion
- Switches between data view and definition view

#### Layer 2: Grid System

```
components/grid/
├── SupabaseGrid.tsx             # Grid wrapper component
├── components/
│   ├── grid/Grid.tsx            # Main data grid (uses react-data-grid)
│   ├── header/Header.tsx        # Grid toolbar & actions
│   └── footer/Footer.tsx        # Pagination controls
└── hooks/
    ├── useTableFilter.tsx       # Filter management
    └── useTableSort.tsx         # Sort management
```

**What it does**:

- Renders the actual table with rows/columns
- Handles inline editing
- Manages filters, sorting, pagination
- Row selection and context menus

#### Layer 3: Side Panels (Editors)

```
components/interfaces/TableGridEditor/SidePanelEditor/
├── SidePanelEditor.tsx          # Orchestrates all side panels
├── RowEditor/
│   ├── RowEditor.tsx            # Edit/create individual rows
│   ├── JsonEditor/              # JSON field editor
│   └── TextEditor.tsx           # Text field editor
├── ColumnEditor/
│   └── ColumnEditor.tsx         # Edit column properties
├── TableEditor/
│   └── TableEditor.tsx          # Create/edit table schema
└── SchemaEditor.tsx             # Create/edit schemas
```

**What it does**:

- Create/edit rows with form validation
- Special editors for JSON, text, foreign keys
- Table schema management (columns, types, constraints)
- Import data from CSV/spreadsheet

#### Layer 4: Layout Components

```
components/layouts/
├── TableEditorLayout/
│   ├── TableEditorLayout.tsx    # Permission wrapper
│   ├── TableEditorMenu.tsx      # Left sidebar with table list
│   └── EntityListItem.tsx       # Individual table item in sidebar
├── editors/
│   └── EditorBaseLayout.tsx     # Base layout with tabs
└── Tabs/
    └── Tabs.tsx                 # Tab management for open tables
```

**What it does**:

- Left sidebar with searchable table list
- Tab system for multiple open tables
- Permission checks

---

### 3. **State Management** (3 files)

```
state/
├── table-editor.tsx             # Global editor state (side panels, modals)
├── table-editor-table.tsx       # Per-table state (columns, rows, selection)
└── tabs.tsx                     # Tab management state
```

**What they manage**:

- Which side panels are open
- Grid columns configuration
- Selected rows
- Pagination state
- Open tabs tracking

---

### 4. **Data Layer** (API Queries)

```
data/
├── table-editor/
│   ├── table-editor-query.ts           # Fetch table metadata
│   └── table-editor-types.ts           # Type definitions
├── table-rows/
│   ├── table-rows-query.ts             # Fetch table data
│   ├── table-rows-create-mutation.ts   # Insert rows
│   ├── table-rows-update-mutation.ts   # Update rows
│   └── table-rows-delete-mutation.ts   # Delete rows
├── database-columns/
│   ├── database-columns-query.ts       # Column metadata
│   └── ...mutations                    # CRUD for columns
└── tables/
    ├── tables-query.ts                 # List tables
    └── ...mutations                    # CRUD for tables
```

**What they do**:

- React Query hooks for data fetching
- Mutations for CRUD operations
- Optimistic updates and cache management

---

## 🔗 Key Dependencies Breakdown

### A. **Critical Infrastructure** (Cannot easily remove)

1. **Authentication & Authorization**

   - `@supabase/supabase-js` - Database client
   - `@supabase/auth-js` - User authentication
   - Permission checking system (`hooks/misc/useCheckPermissions`)
   - Project/organization context

2. **Database Connection**

   - `@gregnr/postgres-meta` - PostgreSQL metadata queries
   - `@supabase/pg-meta` - Extended metadata operations
   - Connection string management
   - Transaction handling

3. **State Management**

   - `valtio` - Global state management
   - `@tanstack/react-query` - Server state & caching
   - Local storage persistence

4. **UI Framework**
   - `react-data-grid` - Main grid component
   - `@radix-ui/*` - Headless UI primitives
   - `ui` package - Design system components
   - `ui-patterns` package - Reusable patterns

### B. **Supporting Features** (Could potentially simplify)

1. **Advanced Editing**

   - `@monaco-editor/react` - Code editor for JSON/SQL
   - `react-dnd` - Drag and drop for columns
   - Foreign key relationship selector
   - Spreadsheet import (`@zip.js/zip.js`)

2. **Grid Features**

   - Filtering system with complex operators
   - Multi-column sorting
   - Row selection & bulk operations
   - Inline editing with validation

3. **Import/Export**

   - CSV export (`papaparse`)
   - Spreadsheet import
   - Data validation

4. **Schema Management**
   - Column type selection
   - Foreign key configuration
   - Primary key management
   - RLS (Row Level Security) toggles

---

## 📦 Package Dependencies Needed

### Absolutely Required:

```json
{
  "@supabase/supabase-js": "For database operations",
  "@supabase/pg-meta": "For PostgreSQL metadata",
  "@tanstack/react-query": "For data fetching/caching",
  "react-data-grid": "Core grid component",
  "valtio": "State management",
  "next": "Framework (or alternative)",
  "react": "UI library",
  "ui": "Design system (workspace package)"
}
```

### Highly Recommended:

```json
{
  "@monaco-editor/react": "For JSON/SQL editors",
  "@radix-ui/*": "For modals, dropdowns, etc.",
  "react-hook-form": "Form management",
  "yup" or "zod": "Validation",
  "papaparse": "CSV handling",
  "lodash": "Utility functions"
}
```

### Can Be Simplified/Removed:

```json
{
  "@dnd-kit/*": "If you don't need drag-drop columns",
  "@stripe/*": "Billing (not needed)",
  "@sentry/*": "Error tracking (optional)",
  "framer-motion": "Animations (optional)",
  "recharts": "Charts (not used in editor)"
}
```

---

## 🎨 Minimum Viable Editor

If you want to create a **minimal standalone table editor**, here's what you actually need:

### Core Files (~50 files):

1. ✅ **Pages**: 3 route files
2. ✅ **TableGridEditor**: Main component + Grid components (~10 files)
3. ✅ **SidePanelEditor**: Row editor + basic editors (~15 files)
4. ✅ **State**: table-editor + table-editor-table (~2 files)
5. ✅ **Data hooks**: Basic CRUD queries (~10 files)
6. ✅ **UI Components**: From workspace packages (~10 files)

### Can Skip:

- ❌ Advanced features: Foreign key selector, import/export
- ❌ Complex layouts: Full sidebar, tabs system
- ❌ Definition view: SQL formatter, Monaco editor
- ❌ Advanced filters: Complex filter UI
- ❌ Permissions: Full RBAC system (use simple check)

---

## 💡 Recommended Approaches

### Option 1: **Minimal Rebuild** (Best for learning)

Start fresh with:

- Simple table list (no fancy sidebar)
- Basic data grid (react-data-grid)
- Simple row editor (forms)
- Direct Supabase client calls

**Effort**: 2-3 weeks
**Result**: Clean, maintainable codebase

### Option 2: **Selective Extract** (Best for reuse)

Extract only:

- Grid component (SupabaseGrid.tsx + dependencies)
- Row editor (basic version)
- Required utilities
- Simplified state management

**Effort**: 1-2 weeks
**Result**: Working editor, some technical debt

### Option 3: **Keep Full Studio** (Best for production)

Use the full Studio app but:

- Hide unused menu items
- Disable unused routes
- Customize branding
- Deploy as-is

**Effort**: 1-3 days
**Result**: Full-featured, production-ready

---

## 🔍 What Do You Actually Need?

### Questions to Determine Your Requirements:

1. **What operations do users need?**

   - [ ] View data only
   - [ ] Add/edit/delete rows
   - [ ] Create/modify tables
   - [ ] Import/export data

2. **What level of complexity?**

   - [ ] Simple forms for editing
   - [ ] Inline grid editing
   - [ ] Bulk operations
   - [ ] Foreign key relationships

3. **What authentication?**

   - [ ] Public access (read-only)
   - [ ] User authentication
   - [ ] Row-level security
   - [ ] Role-based permissions

4. **What deployment?**
   - [ ] Standalone Next.js app
   - [ ] Embed in existing app
   - [ ] Internal tool only

---

## 📊 Complexity Estimate

| Feature                 | Files | Lines of Code | Complexity |
| ----------------------- | ----- | ------------- | ---------- |
| Basic Grid View         | ~20   | ~2,000        | Medium     |
| Row Editing             | ~15   | ~1,500        | Medium     |
| Table Schema Management | ~20   | ~2,500        | High       |
| Filters & Sorting       | ~10   | ~800          | Medium     |
| Import/Export           | ~8    | ~1,000        | Medium     |
| Full Integration        | ~100+ | ~10,000+      | Very High  |

---

## 🚀 Next Steps

Based on your answers, I can help you:

1. **Create a minimal editor** - Clean slate, only what you need
2. **Extract specific components** - Reuse grid + essential parts
3. **Configure Studio** - Hide/disable unused features
4. **Plan the architecture** - Design document for your approach

**What would you like to focus on?**
