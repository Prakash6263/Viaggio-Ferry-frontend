const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"

export const loginApi = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("authToken")
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("authToken")
  },
}
