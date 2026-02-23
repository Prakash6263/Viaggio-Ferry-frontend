import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

export const ticketingRulesApi = {
  // Fetch all ticketing rules with pagination, search, and filters
  getTicketingRules: async (params = {}) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Build query string from params
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append("page", params.page)
      if (params.limit) queryParams.append("limit", params.limit)
      if (params.search) queryParams.append("search", params.search)
      if (params.ruleType) queryParams.append("ruleType", params.ruleType)

      const queryString = queryParams.toString()
      const url = `/api/ticketing-rules${queryString ? `?${queryString}` : ""}`

      const response = await apiFetch(url, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch ticketing rules")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Ticketing Rules Error:", error.message)
      throw error
    }
  },

  // Get single ticketing rule by ID
  getTicketingRuleById: async (ruleId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!ruleId || ruleId === "undefined") {
        throw new Error("Invalid rule ID")
      }

      const response = await apiFetch(`/api/ticketing-rules/${ruleId}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch ticketing rule")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Ticketing Rule Error:", error.message)
      throw error
    }
  },

  // Create a new ticketing rule
  createTicketingRule: async (ruleData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch("/api/ticketing-rules", {
        method: "POST",
        body: JSON.stringify(ruleData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create ticketing rule")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Ticketing Rule Error:", error.message)
      throw error
    }
  },

  // Update existing ticketing rule
  updateTicketingRule: async (ruleId, ruleData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!ruleId || ruleId === "undefined") {
        throw new Error("Invalid rule ID")
      }

      const response = await apiFetch(`/api/ticketing-rules/${ruleId}`, {
        method: "PUT",
        body: JSON.stringify(ruleData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update ticketing rule")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Ticketing Rule Error:", error.message)
      throw error
    }
  },

  // Delete ticketing rule
  deleteTicketingRule: async (ruleId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!ruleId || ruleId === "undefined") {
        throw new Error("Invalid rule ID")
      }

      const response = await apiFetch(`/api/ticketing-rules/${ruleId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete ticketing rule")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Ticketing Rule Error:", error.message)
      throw error
    }
  },
}
