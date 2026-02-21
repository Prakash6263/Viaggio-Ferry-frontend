<!--
  RBAC ARCHITECTURE DIAGRAM
  Visual representation of how permissions flow through the system
-->

# RBAC Architecture Diagram

## Permission Update Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER PERMISSION UPDATE                        │
└─────────────────────────────────────────────────────────────────────┘

Step 1: Backend Update
┌──────────────────────────┐
│ Role & Permissions Page  │
│                          │
│ Admin assigns access     │ [calls API]
│ group to user            │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   Backend Updates DB     │
│                          │
│ user.moduleAccess = {    │
│   moduleCode: currency   │
│   accessGroupId: ...     │
│ }                        │
└──────────┬───────────────┘
           │
Step 2: Frontend Detects Update
           │
           ▼
┌──────────────────────────┐
│   usersApi.assign...()   │
│                          │
│ Calls backend API to     │
│ update permissions       │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ triggerPermissionUpdate()│
│                          │
│ Dispatches custom event: │
│ PERMISSION_UPDATED       │
└──────────┬───────────────┘
           │
Step 3: Event Propagation
           │
           ▼
┌──────────────────────────┐
│   SidebarContext         │
│   Listener Fired         │
│                          │
│ Detects PERMISSION_      │
│ UPDATED event            │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  loadSidebar() Called    │
│                          │
│ Fetches /api/sidebar     │
│ with updated perms       │
└──────────┬───────────────┘
           │
Step 4: UI Update
           │
           ▼
┌──────────────────────────┐
│   Menu State Updated     │
│                          │
│ All components watching  │
│ menu re-render           │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  usePermissions() Hook   │
│                          │
│ Re-evaluates for current │
│ path with new menu data  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  CanDisable Renders      │
│                          │
│ Checks permission from   │
│ hook, updates button     │
│ disabled state           │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   BUTTON ENABLED ✓       │
│                          │
│ User can now click Edit  │
│ and Delete buttons       │
└──────────────────────────┘
```

## Component Permission Check Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    PERMISSION CHECK FLOW                        │
└────────────────────────────────────────────────────────────────┘

<CanDisable action="update" path="/company/administration/currency">
  <button>Edit</button>
</CanDisable>
  │
  ▼
usePermissions("/company/administration/currency")
  │
  ├─→ Is user role "company"?
  │   ├─ YES → Return all permissions TRUE
  │   └─ NO → Continue to next check
  │
  ├─→ Get permissions for path from sidebar context
  │   │
  │   └─→ sidebarApi.getPermissionsForRoute()
  │       │
  │       ├─ Loop through all modules
  │       ├─ Find submodule with matching route
  │       └─ Extract permissions from submodule
  │
  ├─→ Normalize permissions
  │   │
  │   └─→ Map { canRead, canWrite, canEdit, canDelete }
  │       to { read, create, update, delete }
  │
  └─→ Return normalized object

CanDisable receives permissions object
  │
  ├─→ permissions.update === true ?
  │   ├─ YES → Render button ENABLED
  │   └─ NO → Render button DISABLED
  │
  └─→ Button renders with disabled={!allowed}
```

## Data Structure Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND RETURNS /api/sidebar                    │
└─────────────────────────────────────────────────────────────────┘

{
  menu: {
    administration: {          ◄── MODULE
      submodules: {
        currency: {            ◄── SUBMODULE
          route: "/company/administration/currency"
          permissions: {       ◄── PERMISSIONS!
            read: true         ◄── Can view table
            create: true       ◄── Can add button visible
            update: true       ◄── Can edit button enabled ✓
            delete: true       ◄── Can delete button enabled ✓
          }
        }
      }
    }
  },
  user: { role: "user" }       ◄── NOT company = check permissions
}

           │
           ▼

usePermissions() Normalizes
           │
           ▼

{ read: true, create: true, update: true, delete: true }
           │
           ├─→ CanDisable checks action="update"
           ├─→ permissions.update === true
           └─→ Button ENABLED ✓
```

## Event Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                      EVENT LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────┘

PERMISSION_UPDATED Event
         │
         ▼
    Dispatch Custom Event
         │
         ├─→ SidebarContext listens
         ├─→ Detects event
         └─→ Calls loadSidebar()

loadSidebar()
         │
         ├─→ Fetch /api/sidebar
         ├─→ Get new menu with updated permissions
         ├─→ Update React state
         └─→ Triggers re-render

Re-render Cascade
         │
         ├─→ All children of SidebarProvider re-render
         │
         ├─→ usePermissions() called again
         │   ├─→ Gets new menu from context
         │   └─→ Returns updated permissions
         │
         ├─→ CanDisable sees new permissions
         │   └─→ Renders button with new disabled state
         │
         └─→ UI updates immediately ✓

User sees instant button state change
```

## Permission Normalization

```
┌──────────────────────────────────────────────────────────────┐
│            PERMISSION NORMALIZATION PROCESS                  │
└──────────────────────────────────────────────────────────────┘

Input Options
(Either format accepted)

FORMAT A: New Standard        FORMAT B: Legacy
-----------                   --------
read                          canRead
create                        canWrite  ◄── Maps to create
update                        canEdit   ◄── Maps to update
delete                        canDelete

         │
         │ normalizePermissions()
         ▼

Output: Always Normalized
{
  read: boolean,
  create: boolean,
  update: boolean,
  delete: boolean
}

         │
         │ Used by frontend components
         ▼

<Can action="create">          ◄── Checks permissions.create
<CanDisable action="update">  ◄── Checks permissions.update
```

## Component Relationship Map

```
┌────────────────────────────────────────────────────────────────┐
│                  COMPONENT RELATIONSHIPS                        │
└────────────────────────────────────────────────────────────────┘

SidebarProvider (Context)
       │
       ├─→ Manages global menu + user state
       ├─→ Listens for PERMISSION_UPDATED events
       └─→ Provides getSidebar() hook
              │
              ▼
         useSidebar() Hook
              │
              ├─→ Used by usePermissions()
              └─→ Provides menu data for permission lookup

usePermissions() Hook
       │
       ├─→ Normalizes permissions from menu
       ├─→ Called by <Can> and <CanDisable>
       └─→ Returns { read, create, update, delete }
              │
              ▼
         Permission Components
         │
         ├─→ <Can action="..." />
         │   Conditionally renders content
         │
         └─→ <CanDisable action="..." />
             Disables button on permission denial

API Layer (usersApi.js)
       │
       ├─→ assignAccessGroupToUser()
       ├─→ removeAccessGroupFromUser()
       └─→ Both trigger PERMISSION_UPDATED event

RBAC Utils (rbacUtils.js)
       │
       └─→ triggerPermissionUpdate()
           Dispatches the event
```

## Files and Their Roles

```
┌────────────────────────────────────────────────────────────────┐
│                    FILES AND THEIR ROLES                        │
└────────────────────────────────────────────────────────────────┘

Frontend RBAC System:

┌─ STATE MANAGEMENT ─────────────┐
│ SidebarContext.jsx             │
│ ├─ Stores menu data            │
│ ├─ Listens for permission      │
│ │  update events               │
│ └─ Provides permission data    │
└────────────────────────────────┘

┌─ PERMISSION LOGIC ─────────────┐
│ usePermissions.js              │
│ ├─ Resolves permissions for    │
│ │  current path                │
│ ├─ Normalizes formats          │
│ └─ Returns { read, create,     │
│   update, delete }             │
└────────────────────────────────┘

┌─ UI COMPONENTS ────────────────┐
│ Can.jsx (show/hide)            │
│ ├─ Hides UI if denied          │
│ └─ Uses usePermissions()       │
│                                │
│ CanDisable.jsx (enable/disable)│
│ ├─ Disables button if denied   │
│ └─ Uses usePermissions()       │
└────────────────────────────────┘

┌─ API LAYER ────────────────────┐
│ usersApi.js                    │
│ ├─ Permission management       │
│ │  methods                     │
│ └─ Triggers refresh events     │
└────────────────────────────────┘

┌─ UTILITIES ────────────────────┐
│ rbacUtils.js                   │
│ ├─ triggerPermissionUpdate()   │
│ └─ Helper functions            │
└────────────────────────────────┘

┌─ API INTEGRATION ──────────────┐
│ sidebarApi.js                  │
│ ├─ Fetches menu from backend   │
│ ├─ Normalizes permissions      │
│ └─ Permission resolution logic │
└────────────────────────────────┘
```

## State Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    STATE PROGRESSION                        │
└────────────────────────────────────────────────────────────┘

User Has No Permission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- permissions = { update: false }
- Button disabled = true
- CSS: opacity-50, cursor-not-allowed
- User cannot interact


Assign Permission
   ▼

Permission Reload Event Fires
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- PERMISSION_UPDATED event
- loadSidebar() called
- API fetches new permissions


Menu Updated with New Data
   ▼

usePermissions Re-evaluates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Checks updated menu
- permissions = { update: true }
- CanDisable sees permission


Component Re-renders
   ▼

User Has Permission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- permissions = { update: true }
- Button disabled = false
- CSS: default, cursor-pointer
- User CAN interact ✓
```

---

**Use this diagram to understand the permission flow when debugging RBAC issues!**
