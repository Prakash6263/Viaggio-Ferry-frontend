'use client'

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { companyApi } from "../api/companyapi"
import { loginApi, AUTH_LOGIN_EVENT } from "../api/loginApi"
import { AUTH_LOGOUT_EVENT } from "../api/apiClient"

const CompanyProfileContext = createContext(null)

// Helper function to decode JWT and extract user role
function getUserRoleFromToken() {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return null

    const parts = token.split(".")
    if (parts.length !== 3) return null

    const decoded = JSON.parse(atob(parts[1]))
    return decoded.role // Returns "company" or "user" based on JWT
  } catch (err) {
    console.error("[v0] Failed to decode token:", err)
    return null
  }
}

export function CompanyProfileProvider({ children }) {
  const [companyProfile, setCompanyProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCompanyProfile = useCallback(async () => {
    if (!loginApi.isAuthenticated()) {
      setCompanyProfile(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const userRole = getUserRoleFromToken()
      console.log("[v0] User role:", userRole)

      let profile
      if (userRole === "company") {
        // Company user - fetch from companies/me
        profile = await companyApi.getCompanyProfile()
      } else if (userRole === "user") {
        // Regular user - fetch from users/me
        profile = await loginApi.getUserProfile()
      } else {
        throw new Error("Unknown user role")
      }

      setCompanyProfile(profile)
    } catch (err) {
      console.error("[v0] Failed to fetch profile:", err.message)
      setError(err.message || "Unable to load profile")
      setCompanyProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCompanyProfile = useCallback(() => {
    setCompanyProfile(null)
    setError(null)
  }, [])

  useEffect(() => {
    if (loginApi.isAuthenticated()) {
      fetchCompanyProfile()
    }
  }, [fetchCompanyProfile])

  useEffect(() => {
    const handleLogin = () => {
      console.log("[v0] Auth login event, loading company profile...")
      fetchCompanyProfile()
    }

    const handleLogout = () => {
      console.log("[v0] Auth logout event, clearing company profile...")
      clearCompanyProfile()
    }

    window.addEventListener(AUTH_LOGIN_EVENT, handleLogin)
    window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout)

    return () => {
      window.removeEventListener(AUTH_LOGIN_EVENT, handleLogin)
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout)
    }
  }, [fetchCompanyProfile, clearCompanyProfile])

  const value = {
    companyProfile,
    loading,
    error,
    fetchCompanyProfile,
    clearCompanyProfile,
  }

  return (
    <CompanyProfileContext.Provider value={value}>
      {children}
    </CompanyProfileContext.Provider>
  )
}

export function useCompanyProfile() {
  const context = useContext(CompanyProfileContext)
  if (!context) {
    // Return a safe default context when provider is not available
    return {
      companyProfile: null,
      loading: false,
      error: null,
      fetchCompanyProfile: async () => {},
      clearCompanyProfile: () => {},
    }
  }
  return context
}
