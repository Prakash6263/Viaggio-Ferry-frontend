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

const SidebarContext = createContext(null)

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

      setMenu(data.menu || {})
      setUser(data.user || null)
      setCompany(data.company || null)
      setVersion(data.version || "1.0")
      setRoutes(extractRoutesFromMenu(data.menu))
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
   */
  useEffect(() => {
    const handleLogin = () => {
      loadSidebar()
    }

    window.addEventListener(AUTH_LOGIN_EVENT, handleLogin)

    return () => {
      window.removeEventListener(AUTH_LOGIN_EVENT, handleLogin)
    }
  }, [loadSidebar])

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

/**
 * Hook to get permissions for current route
 * @param {string} path - Current path (optional, uses context if not provided)
 * @returns {Object} Permissions object with read, create, update, delete flags
 */
export function usePermissions(path) {
  const { getRoutePermissions, user } = useSidebar()

  // Company role has all permissions
  if (user?.role === "company") {
    return {
      read: true,
      create: true,
      update: true,
      delete: true,
    }
  }

  const permissions = getRoutePermissions(path)

  return (
    permissions || {
      read: false,
      create: false,
      update: false,
      delete: false,
    }
  )
}
