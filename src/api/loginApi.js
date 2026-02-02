// import { apiFetch, AUTH_LOGOUT_EVENT } from "./apiClient"

// export const loginApi = {
//   // Login with email and password
//   login: async (email, password) => {
//     try {
//       const response = await apiFetch("/api/companies/login", {
//         method: "POST",
//         skipAuth: true,
//         body: JSON.stringify({ email, password }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Login failed")
//       }

//       const data = await response.json()

//       // Store token and companyId in localStorage
//       if (data.data?.token) {
//         localStorage.setItem("authToken", data.data.token)
//       }
//       if (data.data?.companyId) {
//         localStorage.setItem("companyId", data.data.companyId)
//       }

//       return data
//     } catch (error) {
//       console.error("[v0] Login API Error:", error.message)
//       throw error
//     }
//   },

//   // Logout - clear stored credentials
//   logout: () => {
//     localStorage.removeItem("authToken")
//     localStorage.removeItem("companyId")
//     localStorage.removeItem("companyProfile")
//     window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT))
//   },

//   // Get stored token
//   getToken: () => {
//     return localStorage.getItem("authToken")
//   },

//   // Check if user is authenticated
//   isAuthenticated: () => {
//     return !!localStorage.getItem("authToken")
//   },

//   // Fetch company profile
//   getCompanyProfile: async () => {
//     try {
//       const token = localStorage.getItem("authToken")
//       if (!token) {
//         throw new Error("No authentication token found")
//       }

//       const response = await apiFetch("/api/companies/me", {
//         method: "GET",
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to fetch company profile")
//       }

//       const data = await response.json()
//       return data
//     } catch (error) {
//       console.error("[v0] Get Company Profile Error:", error.message)
//       throw error
//     }
//   },
// }


import { apiFetch, AUTH_LOGOUT_EVENT } from "./apiClient"

// Custom event for triggering sidebar reload after login
export const AUTH_LOGIN_EVENT = "auth:login"

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
      // FIXED: Company ID is nested under user object
      if (data.data?.user?.companyId) {
        localStorage.setItem("companyId", data.data.user.companyId)
      }

      // Store user info if available
      if (data.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(data.data.user))
      }

      // Dispatch login event so sidebar can reload
      window.dispatchEvent(new CustomEvent(AUTH_LOGIN_EVENT))

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
    localStorage.removeItem("userInfo")
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
      const response = await apiFetch("/api/companies/me", {
        method: "GET",
        waitForToken: true, // Wait for token if not available yet
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

  // Fetch user profile (for non-company users)
  getUserProfile: async () => {
    try {
      const response = await apiFetch("/api/users/me", {
        method: "GET",
        waitForToken: true, // Wait for token if not available yet
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch user profile")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get User Profile Error:", error.message)
      throw error
    }
  },

  // Smart profile getter - automatically chooses the right API based on JWT token role
  getProfile: async () => {
    try {
      const token = localStorage.getItem("authToken")
      let userRole = null

      if (token) {
        try {
          const parts = token.split(".")
          if (parts.length === 3) {
            const decoded = JSON.parse(atob(parts[1]))
            // Check multiple possible field names for role
            userRole = decoded.role || decoded.userType || decoded.layer || decoded.type || decoded.accountType
            console.log("[v0] getProfile - JWT decoded, role found:", userRole)
          }
        } catch (decodeErr) {
          console.error("[v0] getProfile - Failed to decode JWT:", decodeErr.message)
        }
      }

      console.log("[v0] getProfile - Determined role:", userRole)

      // If role is "user", call /api/users/me
      if (userRole === "user") {
        console.log("[v0] getProfile - Calling /api/users/me (user role detected)")
        return await loginApi.getUserProfile()
      } else {
        // Default to company API for company logins or unknown roles
        console.log("[v0] getProfile - Calling /api/companies/me (company role or default)")
        return await loginApi.getCompanyProfile()
      }
    } catch (error) {
      console.error("[v0] Get Profile Error:", error.message)
      throw error
    }
  },
}
