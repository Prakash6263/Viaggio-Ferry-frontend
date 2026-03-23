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

  // Fetch single allocation detail by allocationId
  getMyTripById: async (allocationId) => {
    try {
      const response = await apiFetch(`${BASE_URL}/my-trips/${allocationId}`, { method: "GET" })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to fetch allocation detail")
      }
      return await response.json()
    } catch (error) {
      console.error("[v0] Get My Trip By Id Error:", error.message)
      throw error
    }
  },
}
