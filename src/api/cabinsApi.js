import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/cabins"

export const cabinsApi = {
  /**
   * Fetch all cabins with pagination and search
   */
  getCabins: async (page = 1, limit = 10, search = "", type = "") => {
    try {
      const params = new URLSearchParams()
      if (page) params.append("page", page)
      if (limit) params.append("limit", limit)
      if (search) params.append("search", search)
      if (type) params.append("type", type)

      const response = await apiFetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch cabins")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Cabins Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single cabin by ID
   */
  getCabinById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid cabin ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch cabin")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Cabin By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new cabin
   */
  createCabin: async (payload) => {
    try {
      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create cabin")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Cabin Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing cabin
   */
  updateCabin: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid cabin ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update cabin")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Cabin Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a cabin
   */
  deleteCabin: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid cabin ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete cabin")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Cabin Error:", error.message)
      throw error
    }
  },
}
