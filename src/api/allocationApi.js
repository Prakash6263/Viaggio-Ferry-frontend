import { apiFetch } from "./apiClient"

const BASE_URL = "/api/allocations"

export const allocationApi = {
  /**
   * Fetch my allocated trips with pagination
   */
  getMyTrips: async (page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams()
      params.append("page", page)
      params.append("limit", limit)

      const response = await apiFetch(`${BASE_URL}/my-trips?${params.toString()}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch allocations")
      }

      return await response.json()
    } catch (error) {
      console.error("[v0] Get My Trips Error:", error.message)
      throw error
    }
  },
}
