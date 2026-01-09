import { apiFetch } from "./apiClient"

export const bankCashAccountsApi = {
  // Create new bank/cash account
  createAccount: async (accountData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch("/api/bank-cash-accounts", {
        method: "POST",
        body: JSON.stringify(accountData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create account")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Create Bank/Cash Account Error:", error.message)
      throw error
    }
  },

  // Get all accounts with pagination
  getAccounts: async (page = 1, limit = 50) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/bank-cash-accounts?limit=${limit}&page=${page}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch accounts")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Bank/Cash Accounts Error:", error.message)
      throw error
    }
  },

  // Get account by ID
  getAccountById: async (accountId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/bank-cash-accounts/${accountId}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch account")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Get Bank/Cash Account Error:", error.message)
      throw error
    }
  },

  // Update account
  updateAccount: async (accountId, accountData) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/bank-cash-accounts/${accountId}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update account")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Update Bank/Cash Account Error:", error.message)
      throw error
    }
  },

  // Delete account
  deleteAccount: async (accountId) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await apiFetch(`/api/bank-cash-accounts/${accountId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete account")
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[v0] Delete Bank/Cash Account Error:", error.message)
      throw error
    }
  },
}
