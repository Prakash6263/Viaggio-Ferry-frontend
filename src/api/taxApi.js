import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

export const taxApi = {
  // Create a new tax
  createTax: async (taxData) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/company/taxes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taxData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create tax")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Tax Error:", error.message)
      throw error
    }
  },

  // Fetch all company taxes
  getCompanyTaxes: async () => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/company/taxes`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch taxes")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Company Taxes Error:", error.message)
      throw error
    }
  },

  // Update a tax
  updateTax: async (taxId, taxData) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/company/taxes/${taxId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taxData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update tax")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Tax Error:", error.message)
      throw error
    }
  },

  // Delete a tax
  deleteTax: async (taxId) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/company/taxes/${taxId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete tax")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Tax Error:", error.message)
      throw error
    }
  },
}
