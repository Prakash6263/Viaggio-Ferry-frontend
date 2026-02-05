# TESTING GUIDE - SHIP MANAGEMENT SYSTEM

## Pre-Testing Requirements
- Backend API running on configured URL
- Authentication token available in localStorage
- REACT_APP_API_BASE_URL environment variable set
- User has proper RBAC permissions

---

## MANUAL TESTING SCENARIOS

### 1. SHIPS LIST PAGE
**URL:** `/company/ship-trip/ships`

#### Test Cases:
```
✓ Page loads with spinner
✓ Ships data displays in table after API returns
✓ Table shows: Name, IMO, Type, Year Built, Flag, Status, Capacity, Actions
✓ Pagination works (10/25/50/100 per page)
✓ Search filters ships by name/IMO/type
✓ Grid view button switches to card layout
✓ Table view button switches back to table
✓ Add Ship button visible if CREATE permission
✓ Add Ship button hidden if NO CREATE permission
✓ Edit/Delete buttons visible if UPDATE/DELETE permission
✓ Capacity columns show correct totals
✓ Status badge shows Active/Inactive
✓ No ships found message displays when empty
```

#### Edge Cases:
```
✓ API returns empty array
✓ API returns error 500
✓ User session expired (401) → redirect to login
✓ User has no read permission → page hidden
✓ Large list (1000+ ships) loads without lag
```

---

### 2. ADD SHIP PAGE
**URL:** `/company/ship-trip/add-ship`

#### Test Sequence:
```
Step 1: Load Page
  ✓ Form displays with all sections visible
  ✓ Cabins load from API (check network tab)
  ✓ No data pre-filled (blank form)
  ✓ "Save Ship" button visible if CREATE permission

Step 2: Fill General Information
  ✓ Ship Name field accepts text
  ✓ IMO Number field accepts text
  ✓ MMSI Number field accepts text
  ✓ Flag State field accepts text
  ✓ Ship Type field accepts text
  ✓ Year Built field accepts text
  ✓ Classification Society field accepts text
  ✓ Status dropdown shows Active/Inactive
  ✓ Remarks textarea accepts multi-line text

Step 3: Fill Technical Specs
  ✓ All number fields accept decimal input
  ✓ GT, NT, LOA, Beam, Draft populate correctly

Step 4: Add Passenger Capacity
  ✓ Click "+ Add Line" creates new row
  ✓ Cabin dropdown shows all passenger cabins from API
  ✓ Selecting cabin auto-fills cabin name
  ✓ Weight field accepts numbers
  ✓ Seats field accepts numbers
  ✓ Remove button removes row
  ✓ At least 1 row required (warning if try to remove)
  ✓ Multiple rows can be added

Step 5: Add Cargo Capacity
  ✓ Repeat Step 4 with cargo fields
  ✓ Cabin dropdown shows cargo cabins (different from passenger)
  ✓ Weight (tons) field distinct from passenger weight

Step 6: Add Vehicle Capacity
  ✓ Repeat Step 4 with vehicle fields
  ✓ Cabin dropdown shows vehicle cabins

Step 7: Submit Form
  ✓ Click "Save Ship" button
  ✓ Spinner appears during submission
  ✓ API called with correct payload
  ✓ Success alert appears
  ✓ Redirects to /company/ship-trip/ships
  ✓ New ship appears in list
```

#### Validation Testing:
```
Submit without Ship Name:
  ✓ Error message appears: "Ship name is required"
  ✓ Field highlighted in red
  ✓ Form not submitted

Submit without IMO Number:
  ✓ Error message appears: "IMO number is required"
  ✓ Field highlighted in red

Submit without Ship Type:
  ✓ Error message appears: "Ship type is required"

Submit without Flag State:
  ✓ Error message appears: "Flag state is required"

Optional fields left blank:
  ✓ Form submits successfully
  ✓ Backend receives empty strings/nulls
```

#### Error Scenarios:
```
Backend returns 401:
  ✓ SweetAlert: "Session Expired"
  ✓ Redirect to /company-login

Backend returns 403:
  ✓ SweetAlert: "You don't have permission"
  ✓ Remain on page

Backend returns 500:
  ✓ SweetAlert: "Something went wrong"
  ✓ Stay on form (user can retry)

Network timeout:
  ✓ Loading spinner shows
  ✓ After timeout: error alert
```

---

### 3. EDIT SHIP PAGE
**URL:** `/company/ship-trip/edit-ship/[SHIP_ID]`

#### Test Sequence:
```
Step 1: Load Page
  ✓ Loading spinner appears
  ✓ API called to fetch ship data
  ✓ All form fields pre-populate with ship data
  ✓ Page title shows "Edit Ship"
  ✓ Button text shows "Update Ship"
  ✓ Passenger/Cargo/Vehicle rows show existing capacity data

Step 2: Verify Data Loaded
  ✓ Name field shows ship name
  ✓ IMO field shows correct IMO
  ✓ Technical specs show correct values
  ✓ Passenger capacity rows show correct data
  ✓ Cargo capacity rows show correct data
  ✓ Vehicle capacity rows show correct data
  ✓ Cabin dropdowns have correct selection

Step 3: Modify and Save
  ✓ Change ship name
  ✓ Change technical spec (e.g., GT)
  ✓ Add new cargo row
  ✓ Remove vehicle row
  ✓ Click "Update Ship"
  ✓ Spinner shows
  ✓ API called with PUT method
  ✓ Success alert shows
  ✓ Redirect to list page
  ✓ Changes visible in list

Step 4: Refresh Page
  ✓ GET new ship data
  ✓ All changes persist
  ✓ Modified fields show new values
```

#### Edge Cases:
```
Invalid ship ID:
  ✓ API returns 404
  ✓ Error alert: "Failed to load ship data"

Ship deleted by another user:
  ✓ API returns 404
  ✓ Error alert appropriate

No UPDATE permission:
  ✓ Page gate: <Can action="update"> blocks page
  ✓ OR button disabled
```

---

### 4. DELETE SHIP
**From:** Ships list page (Delete button)

#### Test Sequence:
```
Step 1: Click Delete Button
  ✓ SweetAlert confirmation modal appears
  ✓ Title: "Are you sure?"
  ✓ Message: "This ship will be removed."
  ✓ Two buttons: "Yes, delete it!" and "Cancel"

Step 2: Click Cancel
  ✓ Modal closes
  ✓ No API call made
  ✓ Ship stays in list

Step 3: Click Confirm
  ✓ Modal closes
  ✓ Spinner shows on page
  ✓ DELETE /api/ships/:id called
  ✓ List refreshes from API
  ✓ Ship removed from display
  ✓ Success alert: "Ship has been deleted successfully."

Step 4: Verify Deletion
  ✓ Navigate to list again
  ✓ Ship is gone (not cached)
```

---

### 5. RBAC PERMISSION TESTING

#### Scenario: User with NO CREATE permission
```
✓ Add Ship button NOT visible
✓ Cannot navigate to /company/ship-trip/add-ship directly
  (page either blocked or read-only)
```

#### Scenario: User with NO UPDATE permission
```
✓ Edit button DISABLED (CanDisable)
✓ Cannot navigate to /company/ship-trip/edit-ship/:id
  (page blocked by <Can action="update">)
```

#### Scenario: User with NO DELETE permission
```
✓ Delete button DISABLED (CanDisable)
✓ Cannot manually call DELETE API
```

#### Scenario: User with NO READ permission
```
✓ Ships list page entirely hidden
✓ Cannot access /company/ship-trip/ships
```

---

### 6. API PAYLOAD VERIFICATION

**Create Request Example:**
```bash
POST /api/ships
Authorization: Bearer [TOKEN]
Content-Type: application/json

{
  "name": "Marine Star",
  "imoNumber": "IMO1234567",
  "mmsiNumber": "123456789",
  "shipType": "Cargo",
  "yearBuilt": "2015",
  "flagState": "Oman",
  "classificationSociety": "ABS",
  "status": "Active",
  "remarks": "New cargo vessel",
  "technical": {
    "grossTonnage": 5000,
    "netTonnage": 3000,
    "loa": 150.5,
    "beam": 25.0,
    "draft": 8.5
  },
  "passengerCapacity": [
    {
      "cabinId": "CABIN_001",
      "cabinName": "First Class",
      "totalWeightKg": 80000,
      "seats": 100
    }
  ],
  "cargoCapacity": [
    {
      "cabinId": "CABIN_002",
      "cabinName": "Cargo Hold A",
      "totalWeightTons": 5000,
      "spots": 50
    }
  ],
  "vehicleCapacity": [
    {
      "cabinId": "CABIN_003",
      "cabinName": "Vehicle Deck",
      "totalWeightTons": 2000,
      "spots": 100
    }
  ]
}
```

**Verify in Network Tab:**
```
✓ All fields present
✓ Data types correct (strings, numbers)
✓ Arrays formatted correctly
✓ Authorization header present
✓ Content-Type: application/json
```

---

### 7. STRESS TESTING

#### Large Dataset:
```
✓ Load list with 1000+ ships
✓ Pagination works smoothly
✓ Search performs without lag
✓ Grid view renders efficiently
```

#### Many Capacity Rows:
```
✓ Add 50+ rows to each capacity section
✓ Add/Remove still responsive
✓ Form still submits with all data
```

#### Concurrent Requests:
```
✓ Edit one ship while list is loading
✓ Delete while add form loading
✓ No race condition errors
```

---

## BROWSER DEVELOPER TOOLS CHECKLIST

### Network Tab:
```
✓ All requests have Authorization header
✓ Base URL correct
✓ Request/response bodies match schema
✓ Status codes appropriate
✓ No failed requests (404/500) unless testing errors
```

### Console:
```
✓ No errors (except intentional error testing)
✓ Console logs show [v0] debug messages
✓ No memory leaks (check during long sessions)
✓ React warnings are expected (dev mode)
```

### Application Tab:
```
✓ localStorage has authToken
✓ No sensitive data in localStorage
✓ Session storage clean
```

---

## PERFORMANCE TESTING

### Load Times:
```
✓ List page < 2 seconds
✓ Add page < 1 second (cabins fetch < 500ms)
✓ Edit page < 2 seconds (ship data + cabins)
```

### Memory:
```
✓ No memory growth over 10+ navigation cycles
✓ DataTables cleanup prevents leaks
```

---

## FINAL VERIFICATION

- [ ] All CRUD operations work
- [ ] RBAC enforced correctly
- [ ] Cabins dynamic fetching works
- [ ] Form validation prevents invalid data
- [ ] Error handling shows helpful messages
- [ ] Loading states appear and disappear
- [ ] Pagination/search functional
- [ ] Edit mode correctly detects ship ID
- [ ] Delete confirmation works
- [ ] No console errors (except intentional)
- [ ] Token injection automatic
- [ ] API payload matches backend schema
- [ ] Redirects happen correctly
- [ ] No hardcoded test data remains

---

## BUG REPORT TEMPLATE

If you find an issue:

```
Title: [Component] Brief description

Steps to Reproduce:
1.
2.
3.

Expected Result:
[What should happen]

Actual Result:
[What happened]

Environment:
- Browser: 
- URL: 
- User Role:
- API Status:

Screenshots/Videos:
[If applicable]

Console Errors:
[Any errors from browser console]
```

---

**Testing Status:** Ready for QA
**Last Updated:** 2026-02-05
**Version:** 1.0
