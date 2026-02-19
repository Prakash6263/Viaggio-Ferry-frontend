import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

export const priceListApi = {
  // Fetch all price lists by category
  getPriceLists: async (page = 1, limit = 10, category = "passenger") => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists?page=${page}&limit=${limit}&category=${category}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch price lists")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Price Lists Error:", error.message)
      throw error
    }
  },

  // Create a new price list
  createPriceList: async (priceListData) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priceListData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create price list")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Price List Error:", error.message)
      throw error
    }
  },

  // Get single price list by ID
  getPriceListById: async (id) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch price list")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Price List Error:", error.message)
      throw error
    }
  },

  // Update a price list
  updatePriceList: async (id, priceListData) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priceListData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update price list")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Price List Error:", error.message)
      throw error
    }
  },

  // Delete a price list
  deletePriceList: async (id) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete price list")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Price List Error:", error.message)
      throw error
    }
  },

  // Add detail to a price list
  addPriceListDetail: async (priceListId, detailData) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists/${priceListId}/details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(detailData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add price list detail")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Add Price List Detail Error:", error.message)
      throw error
    }
  },

  // Disable a price list detail
  disablePriceListDetail: async (detailId) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/price-lists/details/${detailId}/disable`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to disable price list detail")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Disable Price List Detail Error:", error.message)
      throw error
    }
  },
}
