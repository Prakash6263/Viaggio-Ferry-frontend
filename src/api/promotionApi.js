import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/promotions"

export const promotionApi = {
  /**
   * Create a new promotion
   * @param {Object} payload - Promotion data
   */
  createPromotion: async (payload) => {
    try {
      console.log("[v0] Creating promotion with payload:", payload)

      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create promotion")
      }

      const data = await response.json()
      console.log("[v0] Promotion created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Create Promotion Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch all promotions with pagination
   */
  getPromotions: async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams()
      if (page) params.append("page", page)
      if (limit) params.append("limit", limit)

      const response = await apiFetch(`${BASE_URL}?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch promotions")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Promotions Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single promotion by ID
   */
  getPromotionById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid promotion ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch promotion")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Promotion By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Update a promotion
   */
  updatePromotion: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid promotion ID")
      }

      console.log("[v0] Updating promotion with ID:", id, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update promotion")
      }

      const data = await response.json()
      console.log("[v0] Promotion updated successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Update Promotion Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a promotion
   */
  deletePromotion: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid promotion ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete promotion")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Promotion Error:", error.message)
      throw error
    }
  },
}
