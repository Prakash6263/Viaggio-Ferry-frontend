import { apiFetch, API_BASE_URL } from "./apiClient"

export { API_BASE_URL }

export const currencyApi = {
  // Fetch all available currencies
  getAllCurrencies: async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch("/api/currencies", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch currencies")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get All Currencies Error:", error.message)
      throw error
    }
  },

  // Fetch company currencies with pagination
  getCompanyCurrencies: async (page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!companyId) {
        throw new Error("No company ID found")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies?page=${page}&limit=${limit}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch currencies")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Company Currencies Error:", error.message)
      throw error
    }
  },

  // Get single company currency by ID
  getCompanyCurrencyById: async (currencyId) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!companyId) {
        throw new Error("No company ID found")
      }

      if (!currencyId || currencyId === "undefined") {
        throw new Error("Invalid currency ID")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies/${currencyId}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch currency")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Company Currency Error:", error.message)
      throw error
    }
  },

  // Add a new currency to company
  addCompanyCurrency: async (companyId, currencyData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies`, {
        method: "POST",
        body: JSON.stringify(currencyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add currency to company")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Add Company Currency Error:", error.message)
      throw error
    }
  },

  // Update company currency
  updateCompanyCurrency: async (companyId, currencyId, currencyData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!currencyId || currencyId === "undefined") {
        throw new Error("Invalid currency ID")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies/${currencyId}`, {
        method: "PUT",
        body: JSON.stringify(currencyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update currency")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Company Currency Error:", error.message)
      throw error
    }
  },

  // Get currency exchange rate history
  getCurrencyHistory: async (companyCurrencyId, page = 1, limit = 10) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!companyId) {
        throw new Error("No company ID found")
      }

      if (!companyCurrencyId || companyCurrencyId === "undefined") {
        throw new Error("Invalid company currency ID")
      }

      const response = await apiFetch(
        `/api/companies/${companyId}/currencies/${companyCurrencyId}/history?page=${page}&limit=${limit}`,
        {
          method: "GET",
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch currency history")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Currency History Error:", error.message)
      throw error
    }
  },

  addExchangeRate: async (currencyId, rateData) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!companyId) {
        throw new Error("No company ID found")
      }

      if (!currencyId || currencyId === "undefined") {
        throw new Error("Invalid currency ID")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies/${currencyId}/rates`, {
        method: "POST",
        body: JSON.stringify(rateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add/update exchange rate")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Add Exchange Rate Error:", error.message)
      throw error
    }
  },

  // Delete company currency
  deleteCompanyCurrency: async (currencyId) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!companyId) {
        throw new Error("No company ID found")
      }

      if (!currencyId || currencyId === "undefined") {
        throw new Error("Invalid currency ID")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies/${currencyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete currency")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Company Currency Error:", error.message)
      throw error
    }
  },

  // Get exchange rate history
  getExchangeRateHistory: async (currencyId, limit = 50) => {
    try {
      const token = localStorage.getItem("authToken")
      const companyId = localStorage.getItem("companyId")

      if (!token) {
        throw new Error("No authentication token found")
      }

      if (!companyId) {
        throw new Error("No company ID found")
      }

      if (!currencyId || currencyId === "undefined") {
        throw new Error("Invalid currency ID")
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies/${currencyId}/rates?limit=${limit}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch exchange rate history")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Exchange Rate History Error:", error.message)
      throw error
    }
  },

  // Add a new currency to company with exchange rates
  addCompanyCurrencyWithRates: async (companyId, currencyData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Combined payload with exchangeRates array
      const payload = {
        currencyId: currencyData.currencyId,
        exchangeRates: currencyData.exchangeRates, // Array of rate objects
        isDefault: currencyData.isDefault || false,
      }

      const response = await apiFetch(`/api/companies/${companyId}/currencies`, {
        method: "POST",
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add currency with rates")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Add Company Currency With Rates Error:", error.message)
      throw error
    }
  },
}
