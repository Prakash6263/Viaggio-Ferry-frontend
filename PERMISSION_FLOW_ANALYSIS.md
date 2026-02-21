# Permission Flow Analysis & Bug Fixes

## Overview

This document explains the permission system architecture, identifies critical bugs that were causing permission checks to fail, and documents all fixes applied.

---

## Permission System Architecture

### 1. Backend API Response Structure

The `/api/sidebar` endpoint returns user permissions in this format:

```json
{
  "menu": {
    "administration": {
      "moduleCode": "administration",
      "submodules": {
        "currency": {
          "submoduleCode": "currency",
          "route": "/company/administration/currency",
          "actions": ["read", "write", "edit", "delete"],
          "permissions": {
            "read": true,
            "create": false,
            "update": true,
            "delete": false
          }
        }
      }
    }
  },
  "user": {
    "id": "user123",
    "name": "John Doe",
    "role": "user"  // or "company"
  }
}
```

### 2. Permission Format Normalization

The backend sends permissions in **ONE** of two formats:

**Format A: `permissions` object** (CURRENT - as shown above)
```javascript
permissions: {
  read: boolean,      // Can view
  create: boolean,    // Can add new
  update: boolean,    // Can edit existing
  delete: boolean     // Can remove
}
```

**Format B: `userPermissions` object** (LEGACY - for backwards compatibility)
```javascript
userPermissions: {
  canRead: boolean,
  canWrite: boolean,    // Maps to "create"
  canEdit: boolean,     // Maps to "update"
  canDelete: boolean
}
```

### 3. Permission Flow in Frontend

```
API Response → SidebarContext (stores menu & user) 
            → usePermissions() hook (normalizes to internal format)
            → <Can /> component (hides UI if no permission)
            → <CanDisable /> component (disables button if no permission)
```

---

## Critical Bugs Found & Fixed

### ❌ BUG #1: useModulePermissions Returns Wrong Permission Format

**Location:** `src/hooks/usePermissions.js` (lines 248-285)

**Issue:**
The `useModulePermissions` hook was returning the OLD format:
```javascript
{
  canRead: true,
  canWrite: true,
  canEdit: true,      // ❌ Wrong! Should be "update"
  canDelete: true,
  hasAccess: true
}
```

But the `<CanDisable>` component expects the NEW normalized format:
```javascript
{
  read: true,
  create: true,
  update: true,       // ✅ Correct
  delete: true
}
```

**Impact:**
- Buttons wrapped with `<CanDisable action="update">` would never get disabled
- Permission checks would fail silently
- Users with limited update permissions could appear to have full access

**Fix Applied:**
Changed return format to normalize both backend formats to internal standard:
```javascript
return {
  read: perms.canRead === true || perms.read === true,
  create: perms.canWrite === true || perms.create === true,
  update: perms.canEdit === true || perms.update === true,
  delete: perms.canDelete === true || perms.delete === true,
  hasAccess: (perms.canRead === true || perms.read === true),
}
```

---

### ❌ BUG #2: CanDisable Component Missing Path Parameter

**Location:** Multiple files (EditCurrencyForm, EditTaxForm, AddCurrencyForm, AddTaxForm)

**Issue:**
When using `<CanDisable>` without a `path` parameter, it checks permissions for the **current route**, not the **resource route**:

```jsx
// ❌ WRONG - checks permissions for /company/administration/currency/:id (edit page)
<CanDisable action="update">
  <button>Update</button>
</CanDisable>

// ✅ CORRECT - checks permissions for /company/administration/currency (list page)
<CanDisable action="update" path="/company/administration/currency">
  <button>Update</button>
</CanDisable>
```

**Impact:**
- Edit buttons wouldn't respect permissions from the list page
- Users on an edit page would get permissions from that specific route (which might not exist in menu)
- Permission check would return `false` (deny by default), disabling buttons incorrectly

**Example Scenario:**
User has permissions for `/company/administration/currency` (read, update):
1. Opens edit page at `/company/administration/currency/123`
2. Route `/company/administration/currency/123` is NOT in menu
3. `getPermissionsForRoute()` returns `{ read: false, create: false, update: false, delete: false }`
4. Update button gets disabled even though user CAN update!

**Fixed Files:**
1. ✅ `src/components/admin/EditCurrencyForm.jsx` - Line 395
2. ✅ `src/components/admin/EditTaxForm.jsx` - Line 398
3. ✅ `src/components/admin/AddCurrencyForm.jsx` - Line 410
4. ✅ `src/components/admin/AddTaxForm.jsx` - Line 277

---

### ❌ BUG #3: Inconsistent Permission Gate Pattern

**Location:** `src/pages/CompanyEditTax.jsx`

**Issue:**
The currency edit page wrapped content with a permission gate:
```jsx
// CompanyEditCurrency.jsx ✅ CORRECT
<Can action="update" path="/company/administration/currency">
  {/* Page content */}
</Can>
```

But the tax edit page did NOT:
```jsx
// CompanyEditTax.jsx ❌ WRONG - No permission gate!
<PageWrapper>
  {/* Page content - directly accessible! */}
</PageWrapper>
```

**Impact:**
- Users without update permission could still navigate to and see the edit tax page
- Only the save button was protected, page UI was visible
- Inconsistent UX between similar features

**Fix Applied:**
Added the same permission gate pattern to CompanyEditTax:
```jsx
<Can action="update" path="/company/administration/taxes">
  {/* Page content now hidden if user lacks permission */}
</Can>
```

---

## How Permission Checks Work Now

### Case 1: Company Role
```javascript
// In usePermissions hook
if (user?.role === "company") {
  return {
    read: true,
    create: true,
    update: true,
    delete: true,
  }
}
// ✅ Company gets ALL permissions
```

### Case 2: Regular User Role
```javascript
const path = "/company/administration/currency"
const rawPermissions = getRoutePermissions(path)
// Returns: { read: true, create: false, update: true, delete: false }

// Normalized to internal format
const normalized = {
  read: true,
  create: false,
  update: true,
  delete: false,
}
// ✅ User gets only assigned permissions
```

---

## API Response Data Structure (Current Implementation)

### Sidebar Response Example
```json
{
  "success": true,
  "data": {
    "menu": {
      "administration": {
        "moduleCode": "administration",
        "label": "Administration",
        "type": "menu",
        "submodules": {
          "currency": {
            "submoduleCode": "currency",
            "label": "Currency",
            "route": "/company/administration/currency",
            "permissions": {
              "read": true,
              "create": false,
              "update": true,
              "delete": false
            }
          }
        }
      }
    },
    "user": {
      "id": "6972fea536c0ff3b12a0a643",
      "name": "veeru",
      "role": "user"
    },
    "company": {
      "id": "6972facc057e26066d32bfe2",
      "name": "Company",
      "logo": null
    }
  }
}
```

---

## Testing the Permission Flow

### Test Case 1: User with Limited Permissions
```
Given: User has { read: true, create: false, update: true, delete: false }
When: User navigates to /company/administration/currency
Then: 
  - Page loads ✅
  - "Add New Currency" button is HIDDEN ❌ Can't create
  - Edit buttons are ENABLED ✅ Can update
  - Delete buttons are HIDDEN ❌ Can't delete
```

### Test Case 2: Company Role
```
Given: User has role "company"
When: User navigates to any administration page
Then:
  - ALL buttons are ENABLED ✅
  - No permissions are hidden ✅
```

### Test Case 3: User with No Read Permission
```
Given: User has { read: false }
When: User navigates to /company/administration/currency
Then:
  - Entire page is HIDDEN ❌ No access
  - User is shown nothing/redirected 🚫
```

---

## Code Examples

### Using the Permission Components

**Option 1: Hide UI Completely**
```jsx
import Can from "../components/Can"

function MyComponent() {
  return (
    <Can action="delete">
      <button>Delete Item</button>
    </Can>
  )
}
// If no delete permission: button is not rendered at all
```

**Option 2: Disable Button (Show but Can't Click)**
```jsx
import CanDisable from "../components/CanDisable"

function MyComponent() {
  return (
    <CanDisable action="update" path="/company/administration/currency">
      <button>Update Currency</button>
    </CanDisable>
  )
}
// If no update permission: button rendered but disabled with tooltip
```

**Option 3: Check Permission in Code**
```jsx
import { usePermissions } from "../hooks/usePermissions"

function MyComponent() {
  const permissions = usePermissions("/company/administration/currency")
  
  return (
    <button disabled={!permissions.update}>
      Update {!permissions.update && "(No Permission)"}
    </button>
  )
}
```

---

## Security Notes

⚠️ **IMPORTANT:**
All permission checks in the UI are **UX-only**. The backend still enforces actual security:
- Buttons can be disabled/hidden, but API calls are still verified server-side
- Never rely on client-side permission checks for actual security
- Always validate permissions on the backend before processing data

---

## Files Modified

| File | Change | Bug Fixed |
|------|--------|-----------|
| `src/hooks/usePermissions.js` | Fixed `useModulePermissions` return format | Bug #1 |
| `src/components/admin/EditCurrencyForm.jsx` | Added `path` to CanDisable | Bug #2 |
| `src/components/admin/EditTaxForm.jsx` | Added `path` to CanDisable | Bug #2 |
| `src/components/admin/AddCurrencyForm.jsx` | Added `path` to CanDisable | Bug #2 |
| `src/components/admin/AddTaxForm.jsx` | Added `path` to CanDisable | Bug #2 |
| `src/pages/CompanyEditTax.jsx` | Added permission gate wrapper | Bug #3 |

---

## Next Steps

1. ✅ Verify all fixes work as expected by testing:
   - User with different permission levels
   - Company role with full permissions
   - Navigation to edit/add pages

2. ✅ Check other similar pages for same patterns:
   - Other edit pages should have permission gates
   - All CanDisable components should have path parameters

3. ✅ Monitor server logs to ensure:
   - Backend permission checks are working
   - No unauthorized API calls are being made

---

## Related Files & Concepts

- **Permission Components:** `src/components/Can.jsx`, `src/components/CanDisable.jsx`
- **Permission Hook:** `src/hooks/usePermissions.js`
- **Sidebar Context:** `src/context/SidebarContext.jsx`
- **Sidebar API Service:** `src/services/sidebarApi.js`
- **Login API:** `src/api/loginApi.js`
