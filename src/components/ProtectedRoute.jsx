import { Navigate } from "react-router-dom"
import { loginApi } from "../api/loginApi"

/**
 * ProtectedRoute component that prevents authenticated users from accessing public pages (like login)
 * If user is authenticated, redirects to the specified route
 */
export function PublicRoute({ element, redirectTo = "/company/dashboard" }) {
  const isAuthenticated = loginApi.isAuthenticated()

  // If user is logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Otherwise, render the login page
  return element
}

/**
 * ProtectedRoute component for routes that require authentication
 * If user is not authenticated, redirects to login page
 */
export function ProtectedRoute({ element, redirectTo = "/company-login" }) {
  const isAuthenticated = loginApi.isAuthenticated()

  // If user is not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Otherwise, render the protected page
  return element
}
