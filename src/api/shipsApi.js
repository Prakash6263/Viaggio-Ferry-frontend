import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/ships"

export const shipsApi = {
  /**
   * Fetch all ships with pagination and search
   */
  getShips: async (page = 1, limit = 10, search = "") => {
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
        throw new Error(errorData.message || "Failed to fetch ships")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Ships Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single ship by ID
   */
  getShipById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ship ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch ship")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Ship By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new ship
   */
  createShip: async (payload) => {
    try {
      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create ship")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Ship Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing ship
   */
  updateShip: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ship ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update ship")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Ship Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new ship with file uploads (FormData)
   */
  createShipWithFiles: async (formData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Use fetch directly for FormData (multipart/form-data)
      const response = await fetch(`${API_BASE_URL || ""}${BASE_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create ship")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Ship With Files Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing ship with file uploads (FormData)
   */
  updateShipWithFiles: async (id, formData) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ship ID")
      }

      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Use fetch directly for FormData (multipart/form-data)
      const response = await fetch(`${API_BASE_URL || ""}${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update ship")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Ship With Files Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a ship
   */
  deleteShip: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid ship ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete ship")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Ship Error:", error.message)
      throw error
    }
  },
}

