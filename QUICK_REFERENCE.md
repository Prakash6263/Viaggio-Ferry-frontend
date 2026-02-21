<!-- 
  QUICK REFERENCE - RBAC FIX
  Print this or bookmark it for quick access
-->

# RBAC Fix - Quick Reference Card

## The Problem
✗ Buttons don't enable/disable when permissions are assigned/removed

## The Solution
✓ Added permission refresh mechanism with event listeners
✓ Added comprehensive logging for debugging
✓ Added permission management APIs
✓ Updated components to use CanDisable wrapper

## Check It's Working

### Step 1: Open DevTools
Press F12 → Console tab

### Step 2: Go to Currency Page
Navigate to /company/administration/currency

### Step 3: Look for Logs
Search for: `[v0] [RBAC]`

You should see:
- User role detection
- Permission normalization
- Button state decisions

### Step 4: Assign Permission
1. Go to Role & Permissions
2. Create/assign access group with currency permissions
3. Assign to test user

### Step 5: Go Back to Currency
Watch the logs reload and buttons change state

## If It's Not Working

| Problem | Check |
|---------|-------|
| No logs at all | Browser DevTools open? Filter for `[v0]`? |
| Permission denied logs | Backend returning correct structure? |
| Buttons not updating | Event fired? Sidebar reloaded? |
| Wrong path | CanDisable has correct path prop? |

## Key Files Modified

```
src/services/sidebarApi.js      ← Permission normalization + logging
src/context/SidebarContext.jsx  ← Event listener for permission updates
src/hooks/usePermissions.js     ← Permission resolution + logging
src/components/CanDisable.jsx   ← Wraps buttons to auto-disable
src/api/usersApi.js             ← Permission API methods
src/utils/rbacUtils.js          ← Permission utilities
```

## How to Use CanDisable

```jsx
// Before - buttons always clickable
<button className="btn btn-primary">Edit</button>

// After - automatically disabled if no permission
<CanDisable action="update" path="/company/administration/currency">
  <button className="btn btn-primary">Edit</button>
</CanDisable>
```

## Actions Available

| Action | Purpose |
|--------|---------|
| `read` | View/read access |
| `create` | Create/add access |
| `update` | Edit/modify access |
| `delete` | Delete access |

## Event to Trigger Reload

```jsx
// Manually trigger permission reload if needed
const event = new CustomEvent("PERMISSION_UPDATED", {
  detail: { timestamp: Date.now() }
})
window.dispatchEvent(event)
```

## Backend Contract

Must return this structure from `/api/sidebar`:

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
    "user": { "role": "user" }
  }
}
```

**Critical:** Must have `permissions` object with boolean values.

## Console Log Meanings

| Log | Meaning |
|-----|---------|
| `Permission update event received` | Permissions reloading ✓ |
| `Route not found in menu` | Path doesn't match any submodule |
| `Permission GRANTED` | Button will be enabled ✓ |
| `Permission DENIED` | Button will be disabled ✓ |
| `No permissions provided` | Backend not returning data |

## Quick Troubleshooting

### Buttons Always Disabled
→ Check: Is backend returning permissions with value `true`?
```
[v0] [RBAC] Raw permissions from backend: {canRead: true, canWrite: false...}
```

### Buttons Never Update
→ Check: Is permission reload event firing?
```
[v0] [RBAC] Permission update event received
```

### Wrong Buttons Affected
→ Check: Is path correct in CanDisable component?
```jsx
<CanDisable action="update" path="/company/administration/currency">
```

## Testing Scenarios

### Test 1: Assign Permission
1. User has no currency permission
2. Assign access group with "write" permission
3. Go to currency page
4. Buttons should be ENABLED ✓

### Test 2: Remove Permission
1. User has currency permission
2. Remove access group
3. Go to currency page
4. Buttons should be DISABLED ✓

### Test 3: Read-Only
1. Assign only "read" permission
2. Table visible but buttons disabled ✓

## Documentation Files

| File | Purpose |
|------|---------|
| `RBAC_FRONTEND_FIX_SUMMARY.md` | Overview and implementation summary |
| `RBAC_FIX_DOCUMENTATION.md` | Technical deep-dive |
| `RBAC_TESTING_GUIDE.md` | Step-by-step testing scenarios |
| `BACKEND_SIDEBAR_CONTRACT.md` | Backend API specification |

## One-Liner Debugging

Paste in console to see all permission logs:
```js
setInterval(() => {
  const logs = console.getLogs?.() || []
  const rbacLogs = logs.filter(l => l.includes('[v0] [RBAC]'))
  console.table(rbacLogs)
}, 1000)
```

Or search filter in console: `[v0] [RBAC]`

## Apply to Other Pages

Copy CanDisable pattern to other pages:

```jsx
// Old
<button onClick={handleDelete}>Delete</button>

// New  
<CanDisable action="delete" path="/your/page/path">
  <button onClick={handleDelete}>Delete</button>
</CanDisable>
```

## Remember

- **Frontend only**: This is UI layer, backend enforces real security
- **Event-driven**: Permissions auto-update when event fires
- **Debug logs**: Search for `[v0] [RBAC]` to trace the flow
- **Backend critical**: Must return correct permission structure

---

**Last Updated:** 2025-02-21  
**Version:** 1.0  
**Status:** Ready for testing
