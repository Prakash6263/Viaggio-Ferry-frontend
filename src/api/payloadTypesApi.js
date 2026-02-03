import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/payload-types"

export const payloadTypesApi = {
  /**
   * Fetch all payload types with pagination and category filter
   */
  getPayloadTypes: async (page = 1, limit = 10, category = "") => {
    try {
      const params = new URLSearchParams()
      if (page) params.append("page", page)
      if (limit) params.append("limit", limit)
      if (category) params.append("category", category)

      const response = await apiFetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch payload types")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Payload Types Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single payload type by ID
   */
  getPayloadTypeById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid payload type ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch payload type")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Payload Type By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new payload type
   */
  createPayloadType: async (payload) => {
    try {
      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create payload type")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Payload Type Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing payload type
   */
  updatePayloadType: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid payload type ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update payload type")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Payload Type Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a payload type
   */
  deletePayloadType: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid payload type ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete payload type")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Payload Type Error:", error.message)
      throw error
    }
  },
}
