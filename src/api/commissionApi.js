import { apiRequest } from "./apiClient"

export const commissionApi = {
  // Create commission rule
  createRule: async (ruleData) => {
    return apiRequest("/api/commission-rules", {
      method: "POST",
      body: JSON.stringify(ruleData),
    })
  },

  // Get all commission rules
  getRules: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters })
    return apiRequest(`/api/commission-rules?${params}`)
  },

  // Get rule by ID
  getRuleById: async (ruleId) => {
    return apiRequest(`/api/commission-rules/${ruleId}`)
  },

  // Update rule
  updateRule: async (ruleId, ruleData) => {
    return apiRequest(`/api/commission-rules/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(ruleData),
    })
  },

  // Delete rule
  deleteRule: async (ruleId) => {
    return apiRequest(`/api/commission-rules/${ruleId}`, {
      method: "DELETE",
    })
  },

  // Get commission rules history
  getCommissionRulesHistory: async (dateRange = "last7days", actionType = "") => {
    const params = new URLSearchParams({ dateRange });
    if (actionType) params.append("actionType", actionType);
    return apiRequest(`/api/commission-rules/history?${params}`)
  },
}
