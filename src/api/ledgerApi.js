import { apiRequest } from "./apiClient"

export const ledgerApi = {
  // Get all admin ledgers (base ledgers) - returns both types and ledgers based on filter
  getAdminLedgers: async (page = 1, limit = 50) => {
    return apiRequest(`/api/admin/ledgers?page=${page}&limit=${limit}`)
  },

  // Get allowed ledger types
  getAllowedLedgerTypes: async () => {
    return apiRequest("/api/admin/allowed-types")
  },

  getLedgersByType: async (ledgerType) => {
    return apiRequest(`/api/admin/ledgers?page=1&limit=50&ledgerType=${encodeURIComponent(ledgerType)}`)
  },

  // Create company ledger
  createCompanyLedger: async (ledgerData) => {
    return apiRequest("/api/ledgers/company", {
      method: "POST",
      body: JSON.stringify(ledgerData),
    })
  },

  // Get company ledgers
  getCompanyLedgers: async (page = 1, limit = 50) => {
    return apiRequest(`/api/companies/ledgers?page=${page}&limit=${limit}`)
  },

  // Delete ledger
  deleteLedger: async (ledgerId, companyId) => {
    const query = companyId ? `?companyId=${companyId}` : ""
    return apiRequest(`/api/admin/ledgers/${ledgerId}${query}`, {
      method: "DELETE",
    })
  },

  getLedgersList: async (limit = 50, page = 1) => {
    return apiRequest(`/api/companies/ledgers?limit=${limit}&page=${page}`)
  },
}
