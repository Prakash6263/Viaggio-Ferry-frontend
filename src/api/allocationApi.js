import { apiFetch } from "./apiClient"

const BASE_URL = "/api/allocations"

export const allocationApi = {
  // Fetch my allocated trips with pagination
  getMyTrips: async (page = 1, limit = 10) => {
    try {
      const response = await apiFetch(`${BASE_URL}/my-trips?page=${page}&limit=${limit}`, { method: "GET" })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to fetch allocations")
      }
      return await response.json()
    } catch (error) {
      console.error("[v0] Get My Trips Error:", error.message)
      throw error
    }
  },

  // Create a child allocation
  // POST /api/allocations/child
  createChildAllocation: async (payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/child`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to create allocation")
      }
      return await response.json()
    } catch (error) {
      console.error("[v0] Create Child Allocation Error:", error.message)
      throw error
    }
  },

  // Update an existing child allocation
  // PUT /api/allocations/:allocationObjectId
  updateAllocation: async (allocationObjectId, payload) => {
    try {
      const response = await apiFetch(`${BASE_URL}/${allocationObjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to update allocation")
      }
      return await response.json()
    } catch (error) {
      console.error("[v0] Update Allocation Error:", error.message)
      throw error
    }
  },

  // Delete an existing child allocation
  // DELETE /api/allocations/:allocationObjectId
  deleteAllocation: async (allocationObjectId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/${allocationObjectId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to delete allocation")
      }
      return await response.json()
    } catch (error) {
      console.error("[v0] Delete Allocation Error:", error.message)
      throw error
    }
  },
}
