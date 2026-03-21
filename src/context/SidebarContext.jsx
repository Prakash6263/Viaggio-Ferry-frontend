'use client';

/**
 * SIDEBAR CONTEXT
 * ================
 * Global state for sidebar menu data.
 * Provides menu, user, company info, and loading state.
 * 
 * Usage:
 * - Wrap app in <SidebarProvider>
 * - Use useSidebar() hook to access state
 */

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { fetchSidebar, extractRoutesFromMenu, isPathAuthorized, getPermissionsForRoute } from "../services/sidebarApi"
import { loginApi, AUTH_LOGIN_EVENT } from "../api/loginApi"
import { AUTH_LOGOUT_EVENT } from "../api/apiClient"

/**
 * Inject any frontend-only submodules that the backend hasn't added yet.
 * This is a temporary bridge — remove each entry once the backend adds it.
 *
 * Structure mirrors what the backend returns for a submodule:
 *   { label, route, displayOrder, permissions: { read, create, update, delete } }
 */
const FRONTEND_SUBMODULE_INJECTIONS = {
  "partners-management": {
    allocation: {
      label: "My Allocations",
      route: "/company/partner-management/allocation",
      displayOrder: 60,
      permissions: { read: true, create: true, update: true, delete: true },
    },
  },
}

/**
 * Merge frontend-injected submodules into the backend menu.
 * Only injects if the parent module exists AND the submodule is not already present.
 */
const injectFrontendSubmodules = (menu) => {
  if (!menu) return menu
  const patched = { ...menu }

  for (const [moduleCode, submodulesToInject] of Object.entries(FRONTEND_SUBMODULE_INJECTIONS)) {
    if (!patched[moduleCode]) continue // parent module not in menu, skip
    patched[moduleCode] = {
      ...patched[moduleCode],
      submodules: {
        ...patched[moduleCode].submodules,
        // Only inject if backend hasn't already sent this submodule
        ...Object.fromEntries(
          Object.entries(submodulesToInject).filter(
            ([code]) => !patched[moduleCode]?.submodules?.[code]
          )
        ),
      },
    }
  }

  return patched
}



/**
 * Sidebar Provider Component
 * Manages global sidebar state and provides it to children
 */
export function SidebarProvider({ children }) {
  const [menu, setMenu] = useState(null)
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [version, setVersion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [routes, setRoutes] = useState(new Set())

  /**
   * Load sidebar data from API
   */
  const loadSidebar = useCallback(async () => {
    // Only load if authenticated
    if (!loginApi.isAuthenticated()) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchSidebar()

      const patchedMenu = injectFrontendSubmodules(data.menu || {})

      setMenu(patchedMenu)
      setUser(data.user || null)
      setCompany(data.company || null)
      setVersion(data.version || "1.0")
      setRoutes(extractRoutesFromMenu(patchedMenu))
    } catch (err) {
      console.error("[v0] Failed to load sidebar:", err.message)
      setError(err.message || "Unable to load system menu")
      setMenu({})
      setRoutes(new Set())
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Clear sidebar data (on logout)
   */
  const clearSidebar = useCallback(() => {
    setMenu(null)
    setUser(null)
    setCompany(null)
    setVersion(null)
    setRoutes(new Set())
    setError(null)
  }, [])

  /**
   * Check if a path is authorized
   */
  const checkPathAuthorization = useCallback(
    (path) => {
      // If no menu loaded yet, don't block navigation
      if (!menu || Object.keys(menu).length === 0) return true
      return isPathAuthorized(path, routes)
    },
    [menu, routes],
  )

  /**
   * Get permissions for a specific route
   */
  const getRoutePermissions = useCallback(
    (path) => {
      return getPermissionsForRoute(path, menu)
    },
    [menu],
  )

  /**
   * Load sidebar on mount if authenticated
   */
  useEffect(() => {
    if (loginApi.isAuthenticated()) {
      loadSidebar()
    } else {
      setLoading(false)
    }
  }, [loadSidebar])

  /**
   * Listen for login event to reload sidebar
   * Also listen for logout event to clear sidebar
   */
  useEffect(() => {
    const handleLogin = () => {
      console.log("[v0] Auth login event received, reloading sidebar...")
      loadSidebar()
    }

    const handleLogout = () => {
      console.log("[v0] Auth logout event received, clearing sidebar...")
      clearSidebar()
    }

    window.addEventListener(AUTH_LOGIN_EVENT, handleLogin)
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout)

    return () => {
      window.removeEventListener(AUTH_LOGIN_EVENT, handleLogin)
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout)
    }
  }, [loadSidebar, clearSidebar])

  const value = {
    // State
    menu,
    user,
    company,
    version,
    loading,
    error,
    routes,

    // Actions
    loadSidebar,
    clearSidebar,
    checkPathAuthorization,
    getRoutePermissions,

    // Computed
    isMenuEmpty: !menu || Object.keys(menu).length === 0,
    isCompanyRole: user?.role === "company",
    isUserRole: user?.role === "user",
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

/**
 * Hook to access sidebar context
 * @returns {Object} Sidebar context value
 */
export function useSidebar() {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}
