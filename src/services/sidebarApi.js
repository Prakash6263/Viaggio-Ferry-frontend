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
 * Get permissions for a specific route
 * @param {string} path - Current path
 * @param {Object} menu - Menu object from sidebar API
 * @returns {Object|null} Permissions object or null if not found
 */
export const getPermissionsForRoute = (path, menu) => {
  if (!path || !menu) return null

  for (const module of Object.values(menu)) {
    // Check single page modules
    if (module.type === "single" && module.route) {
      if (path === module.route || path.startsWith(module.route + "/")) {
        return module.permissions || { read: true, create: true, update: true, delete: true }
      }
    }

    // Check submodules
    if (module.submodules) {
      for (const submodule of Object.values(module.submodules)) {
        if (submodule.route && (path === submodule.route || path.startsWith(submodule.route + "/"))) {
          return submodule.permissions || null
        }
      }
    }
  }

  return null
}
