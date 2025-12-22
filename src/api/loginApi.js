import { apiFetch, AUTH_LOGOUT_EVENT } from "./apiClient"

export const loginApi = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await apiFetch("/api/companies/login", {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await response.json()

      // Store token and companyId in localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token)
      }
      if (data.data?.companyId) {
        localStorage.setItem("companyId", data.data.companyId)
      }

      return data
    } catch (error) {
      console.error("[v0] Login API Error:", error.message)
      throw error
    }
  },

  // Logout - clear stored credentials
  logout: () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("companyId")
    localStorage.removeItem("companyProfile")
    window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT))
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("authToken")
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken")
  },

  // Fetch company profile
  getCompanyProfile: async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch("/api/companies/me", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch company profile")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Company Profile Error:", error.message)
      throw error
    }
  },
}
