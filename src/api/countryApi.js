import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

export const countryApi = {
  /**
   * Fetch all countries
   */
  getCountries: async () => {
    try {
      const response = await apiFetch("/api/public/countries?limit=199", {
        method: "GET",
        skipAuth: true,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch countries")
      }

      const data = await response.json()

      // Extract countries array from the API response
      // API returns: { success: true, data: { countries: [...] } }
      return data.data?.countries || []
    } catch (error) {
      console.error("[v0] Get Countries Error:", error.message)
      throw error
    }
  },
}
