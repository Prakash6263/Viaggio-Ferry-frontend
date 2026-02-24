## Ticketing Rules - Payload Field Mapping & Implementation Summary

### Files Updated
1. **`/src/components/ticketing/RuleCard.jsx`** - Updated with all Postman collection fields
2. **`/src/pages/AddTicketRulePage.jsx`** - Updated with API integration and full payload support

---

### Postman Collection Fields vs Form Implementation

#### CORE FIELDS (All Rule Types)
| Field | Type | Form Control | Notes |
|-------|------|--------------|-------|
| `ruleType` | String | Dropdown (VOID, REFUND, REISSUE) | Selected before adding rule |
| `ruleName` | String | Text Input | Required field |
| `conditions` | String | TextArea | Optional field |

#### CONDITIONAL FIELDS - VOID Rule Only
| Field | Type | Form Control | Notes |
|-------|------|--------------|-------|
| `sameDayOnly` | Boolean | Checkbox | TRUE for VOID rules |
| `startOffsetDays` | Number | (Not shown) | Always 0 for VOID |
| `restrictedWindowHours` | Number | Number Input | Hours before departure |

#### CONDITIONAL FIELDS - REFUND/REISSUE Rules
| Field | Type | Form Control | Notes |
|-------|------|--------------|-------|
| `sameDayOnly` | Boolean | (Not shown) | Always FALSE |
| `startOffsetDays` | Number | Number Input | Days from ticket issue |
| `restrictedWindowHours` | Number | Number Input | Hours before departure |

#### FEE STRUCTURES (All Rule Types)
All three fee types follow same pattern:

**1. Normal Fee**
- `normalFee.type` - Dropdown: NONE, FIXED, PERCENTAGE
- `normalFee.value` - Number Input (disabled if NONE)

**2. Restricted Penalty**
- `restrictedPenalty.type` - Dropdown: NONE, FIXED, PERCENTAGE
- `restrictedPenalty.value` - Number Input (disabled if NONE)

**3. No Show Penalty** 
- `noShowPenalty.type` - Dropdown: NONE, FIXED, PERCENTAGE
- `noShowPenalty.value` - Number Input (disabled if NONE)

---

### Example Payloads

#### VOID Rule Payload
```json
{
  "ruleType": "VOID",
  "ruleName": "Void - Same Day 3 Hours Before ETD",
  "sameDayOnly": true,
  "startOffsetDays": 0,
  "restrictedWindowHours": 3,
  "normalFee": { "type": "NONE", "value": 0 },
  "restrictedPenalty": { "type": "NONE", "value": 0 },
  "noShowPenalty": { "type": "NONE", "value": 0 },
  "conditions": "Valid only for same-day void requests"
}
```

#### REFUND Rule Payload
```json
{
  "ruleType": "REFUND",
  "ruleName": "Refund - Next Day 3 Hours Rule",
  "sameDayOnly": false,
  "startOffsetDays": 1,
  "restrictedWindowHours": 3,
  "normalFee": { "type": "NONE", "value": 0 },
  "restrictedPenalty": { "type": "FIXED", "value": 50 },
  "noShowPenalty": { "type": "PERCENTAGE", "value": 25 },
  "conditions": "Refund allowed until 3 hours before departure"
}
```

#### REISSUE Rule Payload
```json
{
  "ruleType": "REISSUE",
  "ruleName": "Reissue - Next Day 4 Hours Rule",
  "sameDayOnly": false,
  "startOffsetDays": 1,
  "restrictedWindowHours": 4,
  "normalFee": { "type": "FIXED", "value": 25 },
  "restrictedPenalty": { "type": "PERCENTAGE", "value": 15 },
  "noShowPenalty": { "type": "PERCENTAGE", "value": 30 },
  "conditions": "Reissue available after minimum 1 day from issue"
}
```

---

### Form Features Implemented

✅ **Dropdown for Fee Types** - All three fees (normal, restricted penalty, no show penalty) have dropdown selectors
✅ **Conditional Field Visibility** - VOID rules show `sameDayOnly` checkbox; REFUND/REISSUE show `startOffsetDays`
✅ **Smart Value Inputs** - Fee value inputs disabled when fee type is NONE
✅ **API Integration** - `saveRules()` sends all data to `ticketingRuleApi.createTicketingRule()`
✅ **Validation** - Checks that rule names are filled before saving
✅ **Error Handling** - Displays errors from API in error alert
✅ **Loading States** - Buttons disabled during API call with spinner indicator

---

### All Payload Fields Covered ✅
- ✅ ruleType
- ✅ ruleName
- ✅ sameDayOnly
- ✅ startOffsetDays
- ✅ restrictedWindowHours
- ✅ normalFee (type + value)
- ✅ restrictedPenalty (type + value)
- ✅ noShowPenalty (type + value)
- ✅ conditions

**No fields are missing from the form.**
