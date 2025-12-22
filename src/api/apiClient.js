/**
 * Centralized API Client with automatic token expiration handling
 * Wraps fetch to intercept 401/403 responses and trigger logout
 */

// const API_BASE_URL ="http://localhost:3001"
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

// Custom event for triggering logout across the app
export const AUTH_LOGOUT_EVENT = "auth:logout"

/**
 * Check if the error response indicates an invalid/expired token
 */
const isTokenError = (data) => {
  if (!data) return false

  const message = data.message?.toLowerCase() || ""
  const errorMessage = data.error?.message?.toLowerCase() || ""

  return (
    (message.includes("invalid") && message.includes("token")) ||
    (message.includes("expired") && message.includes("token")) ||
    (errorMessage.includes("invalid") && errorMessage.includes("token")) ||
    (errorMessage.includes("expired") && errorMessage.includes("token")) ||
    message === "invalid or expired token" ||
    errorMessage === "invalid or expired token"
  )
}

/**
 * Trigger logout - clears storage and dispatches event for navigation
 */
const triggerLogout = () => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("companyId")
  localStorage.removeItem("companyProfile")

  // Dispatch custom event so components can react to logout
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT))
}

/**
 * Authenticated fetch wrapper that handles token expiration
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {Object} options - Fetch options
 * @param {boolean} options.skipAuth - If true, don't add Authorization header
 * @returns {Promise<Response>} - Fetch response
 */
export const apiFetch = async (endpoint, options = {}) => {
  const { skipAuth = false, ...fetchOptions } = options

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  // Add default headers
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  // Add Authorization header if token exists and not skipped
  if (!skipAuth) {
    const token = localStorage.getItem("authToken")
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  // Clone response to read body without consuming it
  const responseClone = response.clone()

  // Check for 401/403 status or token error in response body
  if (response.status === 401 || response.status === 403) {
    try {
      const data = await responseClone.json()
      if (isTokenError(data)) {
        triggerLogout()
      }
    } catch {
      // If we can't parse JSON, still trigger logout on 401/403
      triggerLogout()
    }
  } else if (!response.ok) {
    // Check response body for token errors even on other status codes
    try {
      const data = await responseClone.json()
      if (isTokenError(data)) {
        triggerLogout()
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  return response
}

/**
 * Helper for JSON responses with automatic token handling
 */
export const apiRequest = async (endpoint, options = {}) => {
  const response = await apiFetch(endpoint, options)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export { API_BASE_URL }
