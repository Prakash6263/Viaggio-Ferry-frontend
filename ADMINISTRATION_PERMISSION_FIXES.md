# Administration Module Permission Flow - Complete Implementation

## Overview
This document summarizes all permission flow fixes applied across the administration modules in Viaggio Ferry frontend.

## Issues Found and Fixed

### Issue 1: Permission Format Mismatch
**File:** `src/hooks/usePermissions.js`
**Problem:** The `useModulePermissions` hook was returning permission keys that didn't match the API response format.
- Was returning: `{ canRead, canWrite, canEdit, canDelete }`
- Backend sends: `{ read, create, update, delete }` or `{ canRead, canWrite, canEdit, canDelete }`
- Components expected: `{ read, create, update, delete }`

**Fix:** Updated hook to normalize both formats and return consistent keys.

---

### Issue 2: Missing Path Parameters in CanDisable Components
**Problem:** `CanDisable` components without path parameters check permissions on the current route instead of the target resource route.

**Example:**
```jsx
// WRONG - checks permissions for /company/administration/edit-currency/:id
<CanDisable action="update">
  <button>Update</button>
</CanDisable>

// CORRECT - checks permissions for /company/administration/currency
<CanDisable action="update" path="/company/administration/currency">
  <button>Update</button>
</CanDisable>
```

**Fixed Files:**

#### Currency Management
- ✅ `src/components/admin/EditCurrencyForm.jsx` - added `path="/company/administration/currency"`
- ✅ `src/components/admin/AddCurrencyForm.jsx` - added `path="/company/administration/currency"`
- ✅ `src/components/admin/CurrencyListTable.jsx` - added paths to update and delete buttons

#### Tax Management
- ✅ `src/components/admin/EditTaxForm.jsx` - added `path="/company/administration/taxes"`
- ✅ `src/components/admin/AddTaxForm.jsx` - added `path="/company/administration/taxes"`
- ✅ `src/components/admin/TaxesListTable.jsx` - added paths to update and delete buttons

#### User Management
- ✅ `src/components/admin/EditUserForm.jsx` - added `path="/company/administration/users"` and CanDisable wrapper
- ✅ `src/components/admin/AddUserForm.jsx` - added `path="/company/administration/users"` and CanDisable wrapper
- ✅ `src/components/admin/UserListTable.jsx` - added paths to update and delete buttons

#### Ship Management
- ✅ `src/components/ships/ShipsListTable.jsx` - added `path="/company/administration/ships"` to action buttons

---

### Issue 3: Missing Permission Gates on Pages
**Problem:** Edit/Add pages didn't have `<Can>` wrapper components to gate entire pages based on permissions.

**Fixed Pages:**

#### Currency
- ✅ `src/pages/CompanyEditCurrency.jsx` - already had permission gate
- ✅ `src/pages/CompanyAddCurrency.jsx` - already had permission gate
- ✅ `src/pages/CompanyCurrencyList.jsx` - already had permission gate
- ✅ `src/pages/CompanyCurrencyHistory.jsx` - added READ permission gate

#### Tax
- ✅ `src/pages/CompanyAddTax.jsx` - added CREATE permission gate with path `/company/administration/taxes`
- ✅ `src/pages/CompanyEditTax.jsx` - added UPDATE permission gate with path `/company/administration/taxes`
- ✅ `src/pages/CompanyTaxesList.jsx` - already had permission gate

#### User
- ✅ `src/pages/AdminAddUser.jsx` - added CREATE permission gate with path `/company/administration/users`
- ✅ `src/pages/AdminEditUser.jsx` - added UPDATE permission gate with path `/company/administration/users`
- ✅ `src/pages/AdminUserList.jsx` - added permission gate for ADD button

#### Ship
- ✅ `src/pages/CompanyAddShip.jsx` - added CREATE permission gate with path `/company/administration/ships`
- ✅ `src/pages/CompanyEditShip.jsx` - added UPDATE permission gate with path `/company/administration/ships`
- ✅ `src/pages/CompanyShipsList.jsx` - already had permission gate

#### Other
- ✅ `src/pages/CompanyTripsList.jsx` - added READ permission gate
- ✅ `src/pages/CompanyPromotionsList.jsx` - already had permission gates

---

## Permission Flow Architecture

### Backend API Response Structure
```javascript
{
  user: { role, id, ... },
  menu: {
    "administration": {
      submodules: {
        "currency": {
          userPermissions: {
            canRead: true,
            canWrite: true,
            canEdit: true,
            canDelete: false
          }
        },
        "taxes": { ... },
        "users": { ... }
      }
    }
  }
}
```

### How Company Role Works
When user role is "company" (company admin):
- ALL permissions return `true`
- This happens in `useModulePermissions` hook
- Ensures company admins have full access

### Permission Check Flow
1. **Page Load** → `Can` component wraps entire page
2. **Action Button** → `CanDisable` component wraps individual buttons
3. **Button inside Form** → `CanDisable` wrapper prevents form submission

---

## Test Cases

### Test 1: Regular User with Limited Permissions
1. Login as user with only "read" permission on Currency
2. Navigate to Currency List
   - ✅ Page loads (READ permission granted)
   - ✅ "Add Currency" button is hidden
   - ✅ "Edit" and "Delete" buttons are disabled
3. Manually navigate to Add Currency
   - ✅ Page is hidden (CREATE permission denied)

### Test 2: Company Admin (Full Permissions)
1. Login as company admin
2. Navigate to any admin module
   - ✅ All pages load
   - ✅ All buttons are enabled
   - ✅ All actions work

### Test 3: User with Update Only
1. Login as user with only "update" permission
2. Navigate to Currency List
   - ✅ List page loads (READ not explicitly set, but READ check might fail)
   - ✅ "Edit" button is enabled
   - ✅ "Add" and "Delete" buttons are disabled/hidden

---

## Standard Permission Paths

Use these paths when implementing CanDisable on new modules:

```
Currency:        /company/administration/currency
Tax:             /company/administration/taxes
User:            /company/administration/users
Ship:            /company/administration/ships
Trip:            /company/administration/trips
Promotion:       /company/partner-management/promotions
```

---

## Code Pattern Template

### For List Pages
```jsx
<Can action="read">
  {/* Page content */}
  
  <Can action="create" path="/path/to/resource">
    <Link to="/add" className="btn btn-turquoise">
      Add New
    </Link>
  </Can>
  
  {/* Table/List */}
</Can>
```

### For Add/Edit Pages
```jsx
<Can action="create" path="/path/to/resource"> {/* or "update" */}
  {/* Form content */}
  
  <CanDisable action="create" path="/path/to/resource">
    <button type="submit">Save</button>
  </CanDisable>
</Can>
```

### For Table Actions
```jsx
<CanDisable action="update" path="/path/to/resource">
  <button onClick={handleEdit}>Edit</button>
</CanDisable>

<CanDisable action="delete" path="/path/to/resource">
  <button onClick={handleDelete}>Delete</button>
</CanDisable>
```

---

## Summary of Changes

| File | Change Type | Details |
|------|------------|---------|
| usePermissions.js | Fix | Normalize permission format |
| EditCurrencyForm.jsx | Fix | Added path to CanDisable |
| AddCurrencyForm.jsx | Fix | Added path to CanDisable |
| CurrencyListTable.jsx | Fix | Added paths to action buttons |
| EditTaxForm.jsx | Fix | Added path to CanDisable |
| AddTaxForm.jsx | Fix | Added path to CanDisable |
| TaxesListTable.jsx | Fix | Added paths to action buttons |
| EditUserForm.jsx | Fix | Added CanDisable wrapper + path |
| AddUserForm.jsx | Fix | Added CanDisable wrapper + path |
| UserListTable.jsx | Fix | Added paths to action buttons |
| ShipsListTable.jsx | Fix | Added paths to action buttons |
| CompanyAddTax.jsx | Fix | Added permission gate |
| CompanyEditTax.jsx | Fix | Added permission gate |
| AdminAddUser.jsx | Fix | Added permission gate |
| AdminEditUser.jsx | Fix | Added permission gate |
| AdminUserList.jsx | Fix | Added permission check for ADD button |
| CompanyAddShip.jsx | Fix | Added permission gate |
| CompanyEditShip.jsx | Fix | Added permission gate with path |
| CompanyCurrencyHistory.jsx | Fix | Added permission gate |
| CompanyTripsList.jsx | Fix | Added permission gate |

**Total: 19 files fixed**

---

## Testing Checklist

- [ ] Test as company user (full permissions)
- [ ] Test as regular user with mixed permissions
- [ ] Test hiding of Add buttons
- [ ] Test disabling of Edit buttons
- [ ] Test disabling of Delete buttons
- [ ] Test full page gates (cannot access edit/add pages)
- [ ] Test button gates in forms
- [ ] Verify no broken existing flows
- [ ] Test on mobile responsive view
- [ ] Verify console logs show correct permission values

