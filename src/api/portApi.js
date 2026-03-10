import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const apiRequest = async (endpoint) => {
  try {
    const response = await apiFetch(endpoint, {
      method: "GET",
      waitForToken: true,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "API request failed")
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] API Error:", error.message)
    throw error
  }
}

export const portApi = {
  // Get all ports
  getPorts: async (page = 1, limit = 100) => {
    return apiRequest(`/api/ports?page=${page}&limit=${limit}`)
  },
}
