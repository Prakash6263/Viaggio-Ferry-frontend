// import { Navigate } from "react-router-dom"
// import { loginApi } from "../api/loginApi"

// /**
//  * ProtectedRoute component that prevents authenticated users from accessing public pages (like login)
//  * If user is authenticated, redirects to the specified route
//  */
// export function PublicRoute({ element, redirectTo = "/company/dashboard" }) {
//   const isAuthenticated = loginApi.isAuthenticated()

//   // If user is logged in, redirect to dashboard
//   if (isAuthenticated) {
//     return <Navigate to={redirectTo} replace />
//   }

//   // Otherwise, render the login page
//   return element
// }

// /**
//  * ProtectedRoute component for routes that require authentication
//  * If user is not authenticated, redirects to login page
//  */
// export function ProtectedRoute({ element, redirectTo = "/company-login" }) {
//   const isAuthenticated = loginApi.isAuthenticated()

//   // If user is not logged in, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to={redirectTo} replace />
//   }

//   // Otherwise, render the protected page
//   return element
// }


"use client"

import { Navigate, useLocation } from "react-router-dom"
import { loginApi } from "../api/loginApi"
import { useSidebar } from "../context/SidebarContext"

/**
 * PublicRoute - Prevents authenticated users from accessing public pages (like login)
 * If user is authenticated, redirects to the specified route
 */
export function PublicRoute({ element, redirectTo = "/company/dashboard" }) {
  const isAuthenticated = loginApi.isAuthenticated()

  // If user is logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Otherwise, render the public page (login, forgot password, etc.)
  return element
}

/**
 * ProtectedRoute - Routes that require authentication and optionally check route authorization
 * If user is not authenticated, redirects to login page
 * If route is not in menu, shows 403 or redirects (based on strictMode)
 */
export function ProtectedRoute({ element, redirectTo = "/company-login", strictMode = false }) {
  const isAuthenticated = loginApi.isAuthenticated()
  const location = useLocation()

  // If user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If strict mode is enabled, we would check route authorization here
  // For now, we render the element and let the sidebar context handle menu visibility
  // The actual security is enforced by the backend API

  return element
}

/**
 * RouteGuard - Enhanced route protection with menu-based authorization
 * Uses sidebar context to check if current route is authorized
 * 
 * Note: This is a UX layer only. Backend RBAC handles actual security.
 */
export function RouteGuard({ element, fallback = "/company/dashboard" }) {
  const isAuthenticated = loginApi.isAuthenticated()
  const location = useLocation()
  const { loading, checkPathAuthorization, menu } = useSidebar()

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/company-login" replace />
  }

  // Still loading menu - show loader
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  // Menu loaded - check authorization
  // Only enforce strict checking if menu is loaded and has items
  if (menu && Object.keys(menu).length > 0) {
    const isAuthorized = checkPathAuthorization(location.pathname)

    if (!isAuthorized) {
      // Route not in menu - redirect to fallback
      console.warn(`[v0] Unauthorized route access attempt: ${location.pathname}`)
      return <Navigate to={fallback} replace />
    }
  }

  // Authorized - render element
  return element
}

/**
 * ForbiddenPage - 403 error page for unauthorized access
 */
export function ForbiddenPage() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        <h1 className="display-1 text-danger">403</h1>
        <h2>Access Denied</h2>
        <p className="text-muted">You do not have permission to access this page.</p>
        <a href="/company/dashboard" className="btn btn-primary">
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}
