import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

export const companyApi = {
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

  updateCompanyProfile: async (companyId, formData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Use fetch directly for FormData (multipart/form-data)
      const response = await fetch(`${API_BASE_URL}/api/companies/${companyId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update company profile")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Update Company Profile Error:", error.message)
      throw error
    }
  },

  // Update Who We Are data (supports image upload via FormData)
  updateWhoWeAre: async (formData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Use fetch directly for FormData (multipart/form-data)
      const response = await fetch(`${API_BASE_URL}/api/who-we-are`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update Who We Are data")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Update Who We Are Error:", error.message)
      throw error
    }
  },
}
