import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

const BASE_URL = "/api/trips"

export const tripsApi = {
  /**
   * Fetch all trips with pagination and search
   */
  getTrips: async (page = 1, limit = 10, search = "") => {
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
        throw new Error(errorData.message || "Failed to fetch trips")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Trips Error:", error.message)
      throw error
    }
  },

  /**
   * Fetch a single trip by ID
   */
  getTripById: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid trip ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch trip")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Trip By ID Error:", error.message)
      throw error
    }
  },

  /**
   * Create a new trip
   * @param {Object} payload - Trip data
   * @param {string} payload.tripName - Name of the trip
   * @param {string} payload.tripCode - Trip code
   * @param {string} payload.ship - Ship ID
   * @param {string} payload.departurePort - Departure port ID
   * @param {string} payload.arrivalPort - Arrival port ID
   * @param {string} payload.departureDateTime - Departure date and time (ISO format)
   * @param {string} payload.arrivalDateTime - Arrival date and time (ISO format)
   * @param {string} payload.status - Trip status (e.g., "SCHEDULED")
   * @param {string} payload.bookingOpeningDate - Booking opening date (ISO format)
   * @param {string} payload.bookingClosingDate - Booking closing date (ISO format)
   * @param {string} payload.checkInOpeningDate - Check-in opening date (ISO format)
   * @param {string} payload.checkInClosingDate - Check-in closing date (ISO format)
   * @param {string} payload.boardingClosingDate - Boarding closing date (ISO format)
   */
  createTrip: async (payload) => {
    try {
      console.log("[v0] Creating trip with payload:", payload)

      const response = await apiFetch(BASE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create trip")
      }

      const data = await response.json()
      console.log("[v0] Trip created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Create Trip Error:", error.message)
      throw error
    }
  },

  /**
   * Update an existing trip
   */
  updateTrip: async (id, payload) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid trip ID")
      }

      console.log("[v0] Updating trip with ID:", id, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update trip")
      }

      const data = await response.json()
      console.log("[v0] Trip updated successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Update Trip Error:", error.message)
      throw error
    }
  },

  /**
   * Delete a trip
   */
  deleteTrip: async (id) => {
    try {
      if (!id || id === "undefined") {
        throw new Error("Invalid trip ID")
      }

      const response = await apiFetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete trip")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Trip Error:", error.message)
      throw error
    }
  },

  /**
   * Create availability for a trip
   * @param {string} tripId - Trip ID
   * @param {Object} payload - Availability data with availabilityTypes
   */
  createAvailability: async (tripId, payload) => {
    try {
      if (!tripId || tripId === "undefined") {
        throw new Error("Invalid trip ID")
      }

      console.log("[v0] Creating availability for trip ID:", tripId, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${tripId}/availabilities`, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create availability")
      }

      const data = await response.json()
      console.log("[v0] Availability created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Create Availability Error:", error.message)
      throw error
    }
  },

  /**
   * Get availabilities for a trip
   * @param {string} tripId - Trip ID
   */
  getAvailabilities: async (tripId) => {
    try {
      if (!tripId || tripId === "undefined") {
        throw new Error("Invalid trip ID")
      }

      console.log("[v0] Fetching availabilities for trip ID:", tripId)

      const response = await apiFetch(`${BASE_URL}/${tripId}/availabilities`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch availabilities")
      }

      const data = await response.json()
      console.log("[v0] Availabilities fetched successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Get Availabilities Error:", error.message)
      throw error
    }
  },

  /**
   * Update availability for a trip
   * @param {string} tripId - Trip ID
   * @param {string} availabilityId - Availability ID
   * @param {Object} payload - Availability data with availabilityTypes
   */
  updateAvailability: async (tripId, availabilityId, payload) => {
    try {
      if (!tripId || tripId === "undefined") {
        throw new Error("Invalid trip ID")
      }
      if (!availabilityId || availabilityId === "undefined") {
        throw new Error("Invalid availability ID")
      }

      console.log("[v0] Updating availability for trip ID:", tripId, "availability ID:", availabilityId, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${tripId}/availabilities/${availabilityId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update availability")
      }

      const data = await response.json()
      console.log("[v0] Availability updated successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Update Availability Error:", error.message)
      throw error
    }
  },

  /**
   * Get agent allocations for trip availability
   * @param {string} tripId - Trip ID
   * @param {string} availabilityId - Availability ID
   */
  getAgentAllocations: async (tripId, availabilityId) => {
    try {
      if (!tripId || tripId === "undefined") {
        throw new Error("Invalid trip ID")
      }
      if (!availabilityId || availabilityId === "undefined") {
        throw new Error("Invalid availability ID")
      }

      console.log("[v0] Fetching agent allocations for trip:", tripId, "availability:", availabilityId)

      const response = await apiFetch(`${BASE_URL}/${tripId}/availabilities/${availabilityId}/agent-allocations`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch agent allocations")
      }

      const data = await response.json()
      console.log("[v0] Agent allocations fetched successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Get Agent Allocations Error:", error.message)
      throw error
    }
  },

  /**
   * Create agent allocations for trip availability
   * @param {string} tripId - Trip ID
   * @param {string} availabilityId - Availability ID
   * @param {Array} payload - Array of agent allocations
   */
  createAgentAllocations: async (tripId, availabilityId, payload) => {
    try {
      if (!tripId || tripId === "undefined") {
        throw new Error("Invalid trip ID")
      }
      if (!availabilityId || availabilityId === "undefined") {
        throw new Error("Invalid availability ID")
      }

      console.log("[v0] Creating agent allocations for trip:", tripId, "availability:", availabilityId, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${tripId}/availabilities/${availabilityId}/agent-allocations`, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create agent allocations")
      }

      const data = await response.json()
      console.log("[v0] Agent allocations created successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Create Agent Allocations Error:", error.message)
      throw error
    }
  },

  /**
   * Update ticketing rules for a trip
   * @param {string} tripId - Trip ID
   * @param {Array} payload - Array of ticketing rules with ruleType and rule ID
   */
  updateTicketingRules: async (tripId, payload) => {
    try {
      if (!tripId || tripId === "undefined") {
        throw new Error("Invalid trip ID")
      }

      console.log("[v0] Updating ticketing rules for trip:", tripId, "Payload:", payload)

      const response = await apiFetch(`${BASE_URL}/${tripId}/ticketing-rules`, {
        method: "PUT",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update ticketing rules")
      }

      const data = await response.json()
      console.log("[v0] Ticketing rules updated successfully:", data)
      return data
    } catch (error) {
      console.error("[v0] Update Ticketing Rules Error:", error.message)
      throw error
    }
  },
}
