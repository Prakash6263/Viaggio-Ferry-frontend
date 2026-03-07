# Permission-Based UI Control Implementation Guide

## Overview

This guide explains how to implement **permission-based UI control** in your application using the `Can` component, following the pattern used in the Currency module.

## Why Implement canEdit/Permissions?

### 1. **User Experience (UX) Layer**
   - Hide UI elements (buttons, pages, forms) users don't have permission to access
   - Prevents users from seeing features they cannot use
   - Reduces confusion and improves usability

### 2. **Security (Backend Enforced)**
   - ⚠️ **Important**: This is a **UX-only layer**
   - Backend API still validates permissions and rejects unauthorized requests
   - Frontend hiding doesn't prevent determined users from accessing API endpoints directly
   - Always implement server-side authorization

### 3. **Permission Types**
   - **Read**: View/list data
   - **Create**: Add new records
   - **Update**: Edit existing records
   - **Delete**: Remove records

## How It Works

### Permission Flow
```
1. User logs in → Backend returns user role & permissions
2. Sidebar context stores permissions for each route/module
3. usePermissions hook retrieves permissions for current/specified route
4. Can component checks action against permissions
5. UI renders or hides based on permission check
```

### Backend Permission Format
The backend sends permissions in one of two formats:
```javascript
// Format A (Legacy)
{ canRead: true, canWrite: true, canEdit: true, canDelete: true }

// Format B (Current)
{ read: true, create: true, update: true, delete: true }
```

The `usePermissions` hook **normalizes both formats** to:
```javascript
{ read: true, create: true, update: true, delete: true }
```

## Implementation Steps

### Step 1: Use the `Can` Component

```jsx
import Can from "../components/Can";

export default function CompanyTripsList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* READ action - shows entire trips list if user has read permission */}
        <Can action="read" path="/company/ship-trips/trips">
          <TripsListTable />
        </Can>
      </PageWrapper>
    </div>
  );
}
```

### Step 2: Specify the Action & Path

**Action types:**
- `"read"` - Permission to view
- `"create"` - Permission to add new
- `"update"` - Permission to edit
- `"delete"` - Permission to remove

**Path format:**
- Use the **LIST route path** for permission checks
- Example: `/company/administration/currency` (not `/company/administration/currency/123`)
- For trips: `/company/ship-trips/trips`

### Step 3: Wrap Content

```jsx
<Can action="update" path="/company/ship-trips/trips">
  {/* This content only renders if user has UPDATE permission */}
  <EditForm />
</Can>

<Can action="delete" path="/company/ship-trips/trips">
  {/* This content only renders if user has DELETE permission */}
  <DeleteButton />
</Can>
```

## Applied to Trip Pages

### CompanyTripsList.jsx
```jsx
<Can action="read" path="/company/ship-trips/trips">
  <TripsListTable />
</Can>
```
- Entire trips list only shows if user can READ trips

### CompanyAddTrip.jsx
```jsx
<Can action="create" path="/company/ship-trips/trips">
  {/* Create trip form */}
</Can>
```
- Trip creation form only renders if user can CREATE trips

### CompanyEditTrip.jsx
```jsx
<Can action="update" path="/company/ship-trips/trips">
  {/* Edit trip form */}
</Can>
```
- Trip editing form only renders if user can UPDATE trips

## Usage with Individual Elements

You can also gate individual buttons/sections:

```jsx
{/* Individual button gating */}
<Can action="create" path="/company/ship-trips/trips">
  <Link to="/company/ship-trips/trips/new" className="btn btn-primary">
    Create New Trip
  </Link>
</Can>

{/* With fallback content */}
<Can 
  action="delete" 
  path="/company/ship-trips/trips"
  fallback={<div>You don't have permission to delete</div>}
>
  <button className="btn btn-danger">Delete Trip</button>
</Can>
```

## The `Can` Component Props

```typescript
interface CanProps {
  action: "read" | "create" | "update" | "delete"  // Required
  path?: string                                      // Optional (defaults to current route)
  children: React.ReactNode                          // Required (content if allowed)
  fallback?: React.ReactNode                         // Optional (content if denied, default: null)
}
```

## The `usePermissions` Hook

For more granular control, use the hook directly:

```jsx
import { usePermissions } from "../hooks/usePermissions";

export default function MyComponent() {
  const permissions = usePermissions("/company/administration/currency");
  
  return (
    <div>
      {permissions.read && <p>You can read</p>}
      {permissions.create && <p>You can create</p>}
      {permissions.update && <p>You can edit</p>}
      {permissions.delete && <p>You can delete</p>}
    </div>
  );
}
```

## Currency Module Pattern (Reference)

The Currency module demonstrates the complete pattern:

### CompanyCurrencyList.jsx
```jsx
<Can action="read" path="/company/administration/currency">
  {/* Currency list table */}
</Can>
```

### CompanyAddCurrency.jsx
```jsx
<Can action="create" path="/company/administration/currency">
  {/* Add currency form */}
</Can>
```

### CompanyEditCurrency.jsx
```jsx
<Can action="update" path="/company/administration/currency">
  {/* Edit currency form */}
</Can>
```

## Key Points to Remember

✅ **DO:**
- Use `Can` component at the page level to gate entire pages
- Use LIST route path for permission checks
- Implement backend validation alongside frontend gating
- Use semantic action names (read, create, update, delete)
- Test with different user roles to verify permissions

❌ **DON'T:**
- Rely on frontend permission check for security
- Use edit/detail route paths for permission checks
- Mix frontend and backend permission logic
- Hide UI without validating on the backend

## Backend Security Requirements

Always validate permissions on the backend:

```javascript
// Example: Route handler
app.post('/api/trips', authenticateUser, authorizeUser('create', 'trips'), (req, res) => {
  // Only users with CREATE permission reach here
  // Backend enforces what frontend hides
});
```

## Testing

Test permission states with different user roles:

1. **Company User**: Should see all features (has all permissions)
2. **User with Limited Permissions**: Should see only allowed features
3. **User with No Permissions**: Should see nothing or appropriate message

## Troubleshooting

**Content not showing even with correct permissions?**
- Check the sidebar context has loaded user permissions
- Verify the path exactly matches backend path structure
- Use browser DevTools to inspect `usePermissions` return value

**Backend rejecting requests but frontend allows them?**
- Confirm backend validates permissions
- Check permission paths match frontend and backend
- Review server logs for authorization errors

---

**Implementation completed for:**
- ✅ CompanyTripsList.jsx - READ permission gating
- ✅ CompanyAddTrip.jsx - CREATE permission gating  
- ✅ CompanyEditTrip.jsx - UPDATE permission gating
