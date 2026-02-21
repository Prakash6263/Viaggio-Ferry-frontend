# RBAC Fix Summary - Viaggio Ferry Frontend

## Problem Analysis

The RBAC (Role-Based Access Control) buttons on the Currency page (and other pages) were not updating when user permissions were changed because:

1. **No Permission Refresh Mechanism**: The frontend didn't have a way to reload permissions after backend changes
2. **Missing Permission Update APIs**: User permission management endpoints were not exposed in the frontend API layer
3. **Debug Logging Missing**: No way to trace permission evaluation flow
4. **Context Listener Missing**: SidebarContext didn't listen for permission update events

## Files Modified

### 1. `/src/services/sidebarApi.js`
**Changes:**
- Added detailed logging to `normalizePermissions()` function to debug permission mapping
- Enhanced `getPermissionsForRoute()` with extensive logging to trace permission lookups
- Added debug output showing raw permissions before normalization

**Why:** The permission normalization wasn't showing errors. Now we can see exactly what the backend sends and how it's being converted.

### 2. `/src/context/SidebarContext.jsx`
**Changes:**
- Added event listener for `PERMISSION_UPDATED` custom event
- When event fires, automatically reloads sidebar via `loadSidebar()`
- Properly cleans up event listeners on component unmount

**Why:** This allows any component to trigger a permission reload by dispatching a custom event.

### 3. `/src/hooks/usePermissions.js`
**Changes:**
- Added extensive logging to trace permission evaluation for each route
- Shows user role, raw permissions from backend, and normalized final permissions
- Logs whether permission was granted or denied for each action

**Why:** Now we can see the full permission resolution chain in the browser console.

### 4. `/src/components/CanDisable.jsx`
**Changes:**
- Added logging to show when component renders and what permissions it checks
- Shows whether permission was GRANTED or DENIED for each action
- Logs the exact permissions object being evaluated

**Why:** Can now debug why buttons don't disable/enable as expected.

### 5. `/src/components/Can.jsx`
**Changes:**
- Added logging to track conditional rendering decisions
- Shows which actions are ALLOWED or DENIED
- Logs when fallback content is shown

**Why:** Debug why content is hidden when it shouldn't be.

### 6. `/src/api/usersApi.js`
**Changes:**
- Added `getUserAccessGroups()` - Get all access groups assigned to a user
- Added `getUserPermissionsForModule()` - Get permissions for specific module
- Added `assignAccessGroupToUser()` - Assign permission, triggers refresh
- Added `removeAccessGroupFromUser()` - Remove permission, triggers refresh
- All permission-changing endpoints trigger `triggerPermissionUpdate()`

**Why:** Frontend can now manage user permissions and automatically refresh UI.

### 7. `/src/utils/rbacUtils.js` (NEW FILE)
**Changes:**
- `triggerPermissionUpdate()` - Dispatches PERMISSION_UPDATED event
- `getActionName()` - Converts action codes to readable names
- `formatPermissions()` - Formats permission objects for display

**Why:** Centralized permission management utilities used across the app.

## How It Works Now

### When User Permission is Changed:

1. Backend updates user's access groups
2. Frontend calls `usersApi.assignAccessGroupToUser()` or `removeAccessGroupFromUser()`
3. API functions call `triggerPermissionUpdate()`
4. Custom event `PERMISSION_UPDATED` is dispatched
5. `SidebarContext` listens for this event and calls `loadSidebar()`
6. New menu data with updated permissions is fetched from backend
7. All components using `usePermissions()` automatically re-render
8. `CanDisable` buttons immediately update their disabled state
9. `Can` components re-evaluate and show/hide content

### Debug Flow (Check Browser Console):

1. Look for `[v0] [RBAC]` prefix logs
2. See what permissions the backend returned
3. See how they're normalized
4. See whether each button action is allowed or denied
5. Trace through `usePermissions()` → `Can`/`CanDisable` chain

## Currency Page Example

The `CurrencyListTable.jsx` now uses:

```jsx
<CanDisable action="update" path="/company/administration/currency">
  <button className="btn btn-sm btn-primary me-2">
    <i className="bi bi-pencil"></i> Update
  </button>
</CanDisable>

<CanDisable action="delete" path="/company/administration/currency">
  <button className="btn btn-sm btn-danger">
    <i className="bi bi-trash"></i> Delete
  </button>
</CanDisable>
```

When a user gets the "update" permission:
1. Admin assigns access group with write permission
2. Backend updates user's moduleAccess array
3. Frontend calls `usersApi.assignAccessGroupToUser()`
4. Permission refresh event is triggered
5. Menu is reloaded with updated permissions
6. `CanDisable` re-renders and button becomes enabled

## Testing the Fix

1. **Assign Permission:**
   - Go to Role & Permissions page
   - Assign a user access to "Currency" module with "write" and "delete" permissions
   - Check browser console for `[v0] [RBAC]` logs

2. **Verify Update:**
   - Go to Currency page
   - Update and Delete buttons should now be enabled
   - If not, check console logs to see where permission chain breaks

3. **Verify Removal:**
   - Remove the access group
   - Currency page should hide (read permission revoked)
   - Or buttons should disable if keeping read but removing write/delete

## Backend Verification Needed

Ensure backend `/api/sidebar` endpoint returns:

```json
{
  "success": true,
  "data": {
    "menu": {
      "administration": {
        "submodules": {
          "currency": {
            "route": "/company/administration/currency",
            "permissions": {
              "read": true,
              "create": true,
              "update": true,
              "delete": true
            }
          }
        }
      }
    },
    "user": { "role": "user" },
    "company": { "name": "..." }
  }
}
```

The `permissions` object must have `read`, `create`, `update`, `delete` keys (or the old format: `canRead`, `canWrite`, `canEdit`, `canDelete`).

## Known Issues & Next Steps

1. **Backend Sidebar API**: Verify it returns correct permission structure from user's access groups
2. **Permission Normalization**: May need to adjust if backend uses different format
3. **Other Pages**: Apply same `CanDisable` wrapper to action buttons on other pages
4. **Polling Alternative**: If custom events don't work, add periodic sidebar reload

## Commands to Remove Debug Logs (After Testing)

Once working, remove `[v0]` logs by replacing with `//` comments or completely removing.

All modified files are production-ready with these logs. Remove them after testing in staging.
