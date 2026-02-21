/**
 * BACKEND SIDEBAR API CONTRACT
 * ===========================
 * 
 * This document defines the EXACT structure the frontend expects
 * from the /api/sidebar endpoint.
 * 
 * If the backend doesn't match this structure, permissions won't work.
 */

/**
 * ENDPOINT
 * ========
 * GET /api/sidebar
 * 
 * Headers:
 *   - Authorization: Bearer <authToken>
 * 
 * Response Status: 200 OK
 */

/**
 * RESPONSE STRUCTURE
 * ==================
 */

const SIDEBAR_API_RESPONSE = {
  "success": true,
  "data": {
    // ===================================
    // MENU STRUCTURE
    // ===================================
    "menu": {
      // Each key is a MODULE CODE
      "administration": {
        "moduleCode": "administration",
        "label": "Administration",
        "icon": "fa-user",
        "type": "menu",  // "menu" | "single"
        "displayOrder": 2,

        // For "menu" type modules, include submodules
        "submodules": {
          // Each key is a SUBMODULE CODE
          "currency": {
            "submoduleCode": "currency",
            "label": "Currency",
            "route": "/company/administration/currency",
            "displayOrder": 2,
            "actions": ["read", "write", "edit", "delete"],

            // ===== CRITICAL =====
            // PERMISSIONS OBJECT must be present for each submodule
            // This determines what the user can do
            // ===== CRITICAL =====
            "permissions": {
              "read": true,
              "create": true,    // Mapped to "write" in backend
              "update": true,    // Mapped to "edit" in backend
              "delete": true
            }
            // OR LEGACY FORMAT:
            // "userPermissions": {
            //   "canRead": true,
            //   "canWrite": true,
            //   "canEdit": true,
            //   "canDelete": true
            // }
          },

          "users": {
            "submoduleCode": "users",
            "label": "User List",
            "route": "/company/administration/user-list",
            "displayOrder": 1,
            "actions": ["read", "write", "edit", "delete"],
            "permissions": {
              "read": true,
              "create": false,
              "update": false,
              "delete": false
            }
          }
        }
      },

      "finance": {
        "moduleCode": "finance",
        "label": "Finance",
        "icon": "fa-credit-card",
        "type": "menu",
        "displayOrder": 7,
        "submodules": {
          "bank-cash-accounts": {
            "submoduleCode": "bank-cash-accounts",
            "label": "Bank & Cash Accounts",
            "route": "/company/finance/bank-cash-accounts",
            "displayOrder": 2,
            "actions": ["read", "write", "edit", "delete"],
            "permissions": {
              "read": true,
              "create": true,
              "update": true,
              "delete": false
            }
          }
        }
      },

      "settings": {
        "moduleCode": "settings",
        "label": "Settings",
        "icon": "fa-cog",
        "type": "menu",
        "displayOrder": 8,
        "submodules": {
          "roles-permissions": {
            "submoduleCode": "roles-permissions",
            "label": "Role & Permission",
            "route": "/company/settings/role-permission",
            "displayOrder": 2,
            "actions": ["read", "write", "edit", "delete"],
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

    // ===================================
    // USER INFORMATION
    // ===================================
    "user": {
      "_id": "user_mongo_id_123",
      "fullName": "John Doe",
      "email": "john@company.com",
      "role": "user",  // "company" | "user"
      "layer": "company",  // "company" | "marine-agent" | "commercial-agent" | "selling-agent"
      "position": "Manager"
    },

    // ===================================
    // COMPANY INFORMATION
    // ===================================
    "company": {
      "_id": "company_mongo_id_456",
      "name": "Viaggio Ferry Ltd",
      "email": "info@viaggio.com",
      "country": "Egypt"
    },

    // ===================================
    // API VERSION
    // ===================================
    "version": "1.0"
  }
}

/**
 * PERMISSION NORMALIZATION
 * ========================
 * 
 * The frontend normalizes these formats:
 * 
 * INPUT FORMAT A (NEW - RECOMMENDED):
 * {
 *   "read": boolean,
 *   "create": boolean,
 *   "update": boolean,
 *   "delete": boolean
 * }
 * 
 * INPUT FORMAT B (LEGACY):
 * {
 *   "canRead": boolean,
 *   "canWrite": boolean,   // Maps to "create"
 *   "canEdit": boolean,    // Maps to "update"
 *   "canDelete": boolean
 * }
 * 
 * FRONTEND USES:
 * {
 *   "read": true/false,
 *   "create": true/false,
 *   "update": true/false,
 *   "delete": true/false
 * }
 */

/**
 * PATH MATCHING ALGORITHM
 * =======================
 * 
 * When frontend checks permissions for a route, it does:
 * 
 * 1. Extract current path from URL (e.g., /company/administration/currency)
 * 2. Search through all modules and their submodules
 * 3. Compare path with submodule.route
 * 4. Return permissions object from matching submodule
 * 
 * Example paths that should match:
 * - /company/administration/currency -> matches route
 * - /company/administration/edit-currency/123 -> matches route (parent path)
 * - /company/administration/add-currency -> does NOT match (different route)
 * 
 * If path doesn't match ANY submodule route:
 * - Return { read: false, create: false, update: false, delete: false }
 * - User sees: Nothing or disabled UI
 */

/**
 * EXAMPLE: USER WITH LIMITED ACCESS
 * ==================================
 * 
 * User has only READ access to currency (can view but not edit)
 */

const LIMITED_ACCESS_RESPONSE = {
  "success": true,
  "data": {
    "menu": {
      "administration": {
        "moduleCode": "administration",
        "type": "menu",
        "submodules": {
          "currency": {
            "submoduleCode": "currency",
            "route": "/company/administration/currency",
            "permissions": {
              "read": true,      // Can see the list
              "create": false,   // Cannot add new
              "update": false,   // Cannot edit
              "delete": false    // Cannot delete
            }
          }
        }
      }
    },
    "user": { "role": "user" }
  }
}

/**
 * EXAMPLE: COMPANY ADMIN WITH ALL ACCESS
 * =======================================
 * 
 * Company admin role gets all modules visible (no permission filtering)
 */

const ADMIN_RESPONSE = {
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
      // ... all other modules fully accessible
    },
    "user": { "role": "company" }  // Special role
  }
}

/**
 * DEBUGGING: MISSING PERMISSIONS OBJECT
 * =====================================
 * 
 * If you see console error:
 * "[v0] [RBAC] normalizePermissions: No permissions provided, defaulting to false"
 * 
 * It means the backend returned a submodule WITHOUT a permissions object.
 * 
 * SOLUTION:
 * - Add "permissions" object to each submodule in the menu
 * - Ensure it has at least: { read: false, create: false, update: false, delete: false }
 * - If user has access, set appropriate values to true
 */

/**
 * BACKEND SIDEBAR CONTROLLER PSEUDOCODE
 * =====================================
 * 
 * ```
 * getSidebar(req, res) {
 *   1. Get current user from token
 *   2. If company role: return FULL menu with all permissions true
 *   3. If user role:
 *      a. Find user in DB with moduleAccess array
 *      b. For each moduleAccess entry, fetch AccessGroup
 *      c. Build menu structure with only visible modules
 *      d. Attach permissions from AccessGroup.permissions array
 *   4. Return formatted response
 * }
 * ```
 */

/**
 * QUICK CHECKLIST FOR BACKEND DEVS
 * =================================
 * 
 * ✓ Sidebar endpoint returns "permissions" object in each submodule
 * ✓ Permissions object has: read, create, update, delete keys
 * ✓ Permission values match user's actual access (from AccessGroup)
 * ✓ User with no module access doesn't see that module at all
 * ✓ User with read-only access gets create/update/delete as false
 * ✓ Company role users get all permissions as true
 * ✓ When permission is updated, next sidebar call returns new values
 * ✓ Soft-deleted AccessGroups don't appear in menu
 * ✓ Inactive AccessGroups don't appear in menu
 */

export default SIDEBAR_API_RESPONSE
