# RBAC Frontend/Backend Verification Checklist

## Backend Files You Provided

✅ **User.js**
- Model structure correct
- `moduleAccess` array: `[{ moduleCode, accessGroupId }]`
- Maps users to access groups per module

✅ **AccessGroup.js**
- Model structure correct
- `permissions` array with permission schema
- Permission format: `{ submoduleCode, canRead, canWrite, canEdit, canDelete }`

✅ **userAccessGroupController.js**
- `POST /api/users/:userId/assign-access-group` - assigns access group to user
- `GET /api/users/:userId/permissions/:moduleCode` - gets user permissions for module
- Returns permissions in format: `{ canRead, canWrite, canEdit, canDelete }`

✅ **userController.js**
- `POST /api/users` - creates user with validated moduleAccess
- Validates access groups before creating user

✅ **rbac.js (constants)**
- `MODULE_CODES`, `LAYER_CODES`, `MODULE_SUBMODULES`
- Defines all modules and their submodules

## Frontend Components That Need To Work

### Frontend Components Status:

**usePermissions.js Hook**
- ✅ Handles both permission formats:
  - Format A: `{ canRead, canWrite, canEdit, canDelete }`
  - Format B: `{ read, create, update, delete }`
- ✅ Maps backend keys to internal format
- ✅ Returns: `{ read, create, update, delete }`

**Can.jsx Component**
- ✅ Uses `usePermissions()` hook
- ✅ Action names: `"read" | "create" | "update" | "delete"`
- ✅ Hides UI when permission denied

**CanDisable.jsx Component**
- ✅ Uses `usePermissions()` hook
- ✅ Disables buttons when permission denied
- ✅ Shows tooltip on hover

**SidebarContext.jsx**
- ✅ Fetches sidebar from `/api/sidebar`
- ✅ Provides `getRoutePermissions(path)` function
- ✅ Returns permissions for path

**sidebarApi.js**
- ✅ `normalizePermissions()` - converts formats
- ✅ `getPermissionsForRoute(path, menu)` - finds permissions for a path

## What's Currently NOT Working

### Issue 1: Missing Backend Sidebar Endpoint
**Problem:** Frontend calls `/api/sidebar` but backend implementation not visible in your files.

**Expected response structure:**
```json
{
  "success": true,
  "data": {
    "menu": {
      "administration": {
        "type": "menu",
        "label": "Administration",
        "icon": "...",
        "submodules": {
          "currency": {
            "code": "currency",
            "label": "Currency",
            "route": "/company/administration/currency",
            "permissions": {
              "submoduleCode": "currency",
              "canRead": true,
              "canWrite": false,
              "canEdit": false,
              "canDelete": false
            }
          }
        }
      }
    },
    "user": { "role": "user", "layer": "company" },
    "company": { "_id": "...", "companyName": "..." },
    "version": "1.0"
  }
}
```

**What needs to happen:**
1. Backend builds sidebar menu structure for logged-in user
2. For each submodule, includes user's permissions from AccessGroup
3. Uses permission format: `{ canRead, canWrite, canEdit, canDelete }`
4. Returns to `/api/sidebar` endpoint

### Issue 2: Permission Updates Not Reflected
**Problem:** After assigning permission to user, buttons stay disabled until page refresh.

**Current flow:**
1. Admin assigns permission via backend API
2. Backend updates User.moduleAccess
3. Frontend doesn't know permissions changed
4. User must refresh page to see updated UI

**Needed fix:**
1. After permission assignment, frontend must reload sidebar
2. New sidebar has updated permissions
3. Components re-render with new permissions
4. Buttons auto-enable

## Currency Page Example (START HERE)

**Location:** `/company/administration/currency`

**Backend flow:**
1. User assigned to "Administrator" access group for "administration" module
2. Access group has: `{ canRead: true, canWrite: true, canEdit: true, canDelete: true }`
3. Backend returns this in sidebar

**Frontend flow:**
1. `usePermissions()` looks up path `/company/administration/currency`
2. `sidebarApi.js` finds "currency" submodule
3. Extracts permissions: `{ canRead, canWrite, canEdit, canDelete }`
4. Normalizes to: `{ read, create, update, delete }`
5. `CanDisable` buttons use normalized permissions
6. Buttons enable/disable based on `read`, `create`, `update`, `delete` values

## Action Items

### Backend Must Provide:

1. **POST /api/users/:userId/assign-access-group**
   - ✅ Already exists in userAccessGroupController.js
   - Takes: `{ moduleCode, accessGroupId }`
   - Returns: permission assignment success

2. **GET /api/sidebar**
   - ❌ **MISSING - You need to implement this**
   - Should build menu with user permissions
   - Return structure as shown above

3. **GET /api/users/:userId/permissions/:moduleCode**
   - ✅ Already exists in userAccessGroupController.js
   - Returns permissions for module

### Frontend Already Has:

1. ✅ `usePermissions()` hook - properly normalized
2. ✅ `Can` and `CanDisable` components
3. ✅ `sidebarApi.js` - permission extraction
4. ✅ `SidebarContext` - sidebar state management

### Frontend May Need:

1. Permission refresh after assignment (auto-reload sidebar)
2. Event system to notify components of permission changes

## Testing Checklist

### Test 1: Currency Page Buttons
- Go to `/company/administration/currency`
- Check if "Add", "Edit", "Delete" buttons are:
  - [ ] Disabled (if no permission)
  - [ ] Enabled (if have permission)

### Test 2: Assign Permission & Auto-Update
- User without "create" permission on Currency page
- Admin assigns "create" permission
- Check if button:
  - [ ] Auto-enables without page refresh
  - [ ] OR page must be refreshed to see change

### Test 3: Different Modules
- Test currency, users, taxes, etc.
- Each should respect their module permissions
- Permissions must come from backend sidebar

## Next Steps

1. **Build `/api/sidebar` backend endpoint**
   - Look at backend routes to find where to add it
   - Build menu structure with user permissions included

2. **Test currency page**
   - Verify buttons enable/disable correctly
   - Check console for permission values

3. **Handle permission refreshes**
   - After assignment, reload sidebar data
   - Components will auto-update with new permissions

---

**Key Point:** Your frontend is already set up correctly. The issue is that the backend `/api/sidebar` endpoint needs to include user permissions in the response.
