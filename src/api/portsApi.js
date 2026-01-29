import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/ports"

export const portsApi = {
  /**
   * Fetch all ports with pagination and search
   */
  getPorts: async (page = 1, limit = 10, search = "") => {
    try {
      const params = new URLSearchParams()
      if (page) params.append("page", page)
      if (limit) params.append("limit", limit)
      if (search) params.append("search", search)

      const response = await apiFetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch ports")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Ports Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single port by ID
   */
  getPortById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid port ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch port")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Port By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new port
   */
  createPort: async (payload) => {
    try {
      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create port")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Port Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing port
   */
  updatePort: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid port ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update port")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Port Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a port
   */
  deletePort: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid port ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete port")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Port Error:", error.message)
      throw error
    }
  },
}
