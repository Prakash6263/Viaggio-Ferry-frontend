# Ticketing Rules Module Implementation

## Overview
Successfully implemented a complete Ticketing Rules management module following the Currency module pattern with full RBAC integration.

## Files Created

### 1. API Service (`/src/api/ticketingRulesApi.js`)
- **getTicketingRules(params)** - Fetch rules with pagination, search, filters
- **getTicketingRuleById(ruleId)** - Get single rule
- **createTicketingRule(ruleData)** - Create new rule
- **updateTicketingRule(ruleId, ruleData)** - Update existing rule
- **deleteTicketingRule(ruleId)** - Delete rule

All functions include proper error handling, token management, and follow the existing apiFetch pattern.

### 2. List Component (`/src/components/ticketing/TicketingRulesList.jsx`)
Features:
- Dynamic table with DataTable integration (no hardcoded data)
- Search by rule name
- Filter by rule type (VOID, REFUND, REISSUE)
- Filter by payload type (PASSENGER, CARGO, VEHICLE, ALL)
- Pagination (10 items per page)
- Proper fee formatting:
  - NONE type → displays "-"
  - FIXED type → displays "₹ value"
  - PERCENTAGE type → displays "value%"
- Create/Edit/Delete actions with RBAC protection using `<Can />` and `<CanDisable />` components
- Loading spinners and error handling
- Success/error toast notifications using SweetAlert2

### 3. Form Modal Component (`/src/components/ticketing/TicketingRuleFormModal.jsx`)
Features:
- Modal-based create/edit form
- Dynamic field visibility based on rule type:
  - **VOID rules**: Shows sameDayOnly checkbox, hides startOffsetDays, restrictedPenalty, noShowPenalty
  - **REFUND/REISSUE rules**: Shows startOffsetDays, restricted penalty, no-show penalty
- Field-level RBAC using `usePermissions()` hook
- Three fee type configurations:
  - Normal Fee (optional for VOID, required for REFUND/REISSUE)
  - Restricted Penalty (REFUND/REISSUE only)
  - No Show Penalty (REFUND/REISSUE only)
- Form validation with error messages
- Auto-sets fee value to 0 when type is NONE
- Disabled state for read-only users

## RBAC Implementation

### Three-Level Protection

**1. Page Level** (TicketingRulesPage.jsx)
```jsx
<Can action="read" path="/sales-bookings/ticketing-rules">
  <TicketingRulesList />
</Can>
```

**2. Action Level** (Buttons in TicketingRulesList)
```jsx
<Can action="create">
  <button>Add Rule</button>
</Can>

<CanDisable action="update">
  <button>Edit</button>
</CanDisable>

<CanDisable action="delete">
  <button>Delete</button>
</CanDisable>
```

**3. Field Level** (Form Modal)
```jsx
const permissions = usePermissions()
const isDisabled = !(permissions.create || permissions.update)

// All form inputs use isDisabled prop
<input disabled={isDisabled} />
```

### Permission Mapping
- **read** → View list
- **write/create** → Create new rules
- **edit/update** → Edit existing rules
- **delete** → Delete rules

## Updated Files

### `/src/pages/TicketingRulesPage.jsx`
- Replaced hardcoded table with dynamic TicketingRulesList component
- Integrated `<Can />` component for page-level permission check
- Cleaned up unused AddTicketRulePage routing

## API Compliance

All endpoints follow the Postman collection specification:
- `GET /api/ticketing-rules` - List with pagination & filters
- `GET /api/ticketing-rules/:id` - Get single rule
- `POST /api/ticketing-rules` - Create rule
- `PUT /api/ticketing-rules/:id` - Update rule
- `DELETE /api/ticketing-rules/:id` - Delete rule

## Data Format Compliance

**Create/Update Payload:**
```json
{
  "ruleType": "REFUND|VOID|REISSUE",
  "ruleName": "string",
  "payloadType": "PASSENGER|CARGO|VEHICLE|ALL",
  "sameDayOnly": boolean,
  "startOffsetDays": number,
  "restrictedWindowHours": number,
  "normalFee": { "type": "NONE|FIXED|PERCENTAGE", "value": number },
  "restrictedPenalty": { "type": "NONE|FIXED|PERCENTAGE", "value": number },
  "noShowPenalty": { "type": "NONE|FIXED|PERCENTAGE", "value": number },
  "conditions": "string"
}
```

## Integration with Existing Systems

1. **Uses existing apiFetch** for authenticated requests
2. **Uses existing CanDisable & Can components** for RBAC
3. **Uses existing usePermissions hook** for permission checks
4. **Uses existing DataTable library** for table formatting
5. **Uses existing SweetAlert2** for notifications
6. **Uses existing CirclesWithBar** for loading spinners
7. **Follows existing currency module patterns** for consistency

## No Breaking Changes

- All existing flows remain intact
- Currency module continues to work as before
- Sidebar already has ticketing-rules route configured
- AddTicketRulePage remains available for legacy support if needed

## Testing Checklist

- [ ] List page shows rules from API
- [ ] Search filters by rule name
- [ ] Rule type filter works
- [ ] Payload type filter works
- [ ] Pagination works correctly
- [ ] Create rule modal opens and submits
- [ ] Edit rule modal opens with pre-filled data
- [ ] Delete shows confirmation and removes rule
- [ ] Fee formatting displays correctly (-, ₹, %)
- [ ] VOID rules hide REFUND/REISSUE fields
- [ ] Read-only users see disabled forms
- [ ] Add button hidden from users without write permission
- [ ] Edit/Delete buttons disabled for users without permissions
- [ ] Error messages display correctly
- [ ] Success notifications show after CRUD operations
