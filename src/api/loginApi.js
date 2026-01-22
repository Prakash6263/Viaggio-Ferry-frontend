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

  // Fetch user profile (for non-company users)
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch("/api/users/me", {
        method: "GET",
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
}
