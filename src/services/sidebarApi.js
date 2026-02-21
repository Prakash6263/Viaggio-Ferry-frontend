/**
 * SIDEBAR API SERVICE
 * ====================
 * Responsible for fetching sidebar menu from backend.
 * This is the ONLY place that calls the sidebar API.
 */

import { apiFetch } from "../api/apiClient"

/**
 * Fetch sidebar menu from backend
 * @returns {Promise<Object>} Sidebar data including menu, user, company, version
 */
export const fetchSidebar = async () => {
  const token = localStorage.getItem("authToken")

  if (!token) {
    throw new Error("No authentication token found")
  }

  const response = await apiFetch("/api/sidebar", {
    method: "GET",
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Failed to fetch sidebar menu")
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch sidebar menu")
  }

  return data.data
}

/**
 * Extract all routes from menu structure
 * Used for route validation
 * @param {Object} menu - Menu object from sidebar API
 * @returns {Set<string>} Set of all valid routes
 */
export const extractRoutesFromMenu = (menu) => {
  const routes = new Set()

  if (!menu) return routes

  Object.values(menu).forEach((module) => {
    // Single page modules have a direct route
    if (module.type === "single" && module.route) {
      routes.add(module.route)
    }

    // Menu modules have submodules with routes
    if (module.submodules) {
      Object.values(module.submodules).forEach((submodule) => {
        if (submodule.route) {
          routes.add(submodule.route)
        }
      })
    }
  })

  return routes
}

/**
 * Check if a path is authorized based on menu routes
 * @param {string} path - Current path to check
 * @param {Set<string>} routes - Set of valid routes
 * @returns {boolean} True if path is authorized
 */
export const isPathAuthorized = (path, routes) => {
  if (!path || !routes || routes.size === 0) return false

  // Direct match
  if (routes.has(path)) return true

  // Check if path starts with any authorized route
  for (const route of routes) {
    if (path.startsWith(route + "/")) return true
  }

  return false
}

/**
 * Normalize permission from any backend format to internal standard
 * Backend sends either:
 *   A) userPermissions: { canRead, canWrite, canEdit, canDelete }
 *   B) permissions: { read, create, update, delete }
 * 
 * Frontend normalizes to: { read, create, update, delete }
 * 
 * STRICT MODE: No fallbacks. Backend must explicitly grant permission.
 * 
 * @param {Object} rawPerms - Raw permission object from backend
 * @returns {Object} Normalized permission object
 */
const normalizePermissions = (rawPerms) => {
  if (!rawPerms) {
    console.log("[v0] [RBAC] normalizePermissions: No permissions provided, defaulting to false")
    return {
      read: false,
      create: false,
      update: false,
      delete: false,
    }
  }

  // Normalize: Try both formats, default to false (strict mode)
  const normalized = {
    read: rawPerms.canRead === true || rawPerms.read === true || false,
    create: rawPerms.canWrite === true || rawPerms.create === true || false,
    update: rawPerms.canEdit === true || rawPerms.update === true || false,
    delete: rawPerms.canDelete === true || rawPerms.delete === true || false,
  }

  console.log("[v0] [RBAC] normalizePermissions: Input =", rawPerms, "Output =", normalized)
  return normalized
}

/**
 * Get permissions for a specific route
 * Searches menu structure and normalizes permissions to internal format
 * 
 * @param {string} path - Current path
 * @param {Object} menu - Menu object from sidebar API
 * @returns {Object} Normalized permissions { read, create, update, delete }
 */
export const getPermissionsForRoute = (path, menu) => {
  if (!path || !menu) {
    console.log("[v0] [RBAC] getPermissionsForRoute: No path or menu, denying all")
    return {
      read: false,
      create: false,
      update: false,
      delete: false,
    }
  }

  console.log("[v0] [RBAC] getPermissionsForRoute: Checking path =", path)

  for (const moduleCode of Object.keys(menu)) {
    const module = menu[moduleCode]
    
    // Check single page modules
    if (module.type === "single" && module.route) {
      if (path === module.route || path.startsWith(module.route + "/")) {
        console.log("[v0] [RBAC] Single module match:", moduleCode)
        // Single modules get normalized permissions or default deny
        return normalizePermissions(module.permissions || module.userPermissions)
      }
    }

    // Check submodules - main permission source
    if (module.submodules) {
      for (const submoduleCode of Object.keys(module.submodules)) {
        const submodule = module.submodules[submoduleCode]
        if (submodule.route && (path === submodule.route || path.startsWith(submodule.route + "/"))) {
          console.log("[v0] [RBAC] Submodule match:", moduleCode, "->", submoduleCode)
          // Submodules can have either format: permissions or userPermissions
          const perms = submodule.permissions || submodule.userPermissions
          console.log("[v0] [RBAC] Raw permissions found:", perms)
          return normalizePermissions(perms)
        }
      }
    }
  }

  // Route not found - deny all
  console.log("[v0] [RBAC] Route not found in menu, denying all")
  return {
    read: false,
    create: false,
    update: false,
    delete: false,
  }
}
