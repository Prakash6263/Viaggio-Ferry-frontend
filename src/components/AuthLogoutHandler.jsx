"use client"

/**
 * AuthLogoutHandler - Listens for auth logout events and navigates to login
 * This component should be placed inside the Router context
 */

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AUTH_LOGOUT_EVENT } from "../api/apiClient"

export default function AuthLogoutHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogout = () => {
      // Navigate to login page
      navigate("/company-login", { replace: true })
    }

    // Listen for logout events
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout)

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout)
    }
  }, [navigate])

  return null // This component doesn't render anything
}
