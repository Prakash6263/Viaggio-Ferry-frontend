import { apiRequest } from "./apiClient"

export const markupDiscountApi = {
  // Create markup/discount rule
  createRule: async (ruleData) => {
    return apiRequest("/api/markup-discounts", {
      method: "POST",
      body: JSON.stringify(ruleData),
    })
  },

  // Get all markup/discount rules
  getRules: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters })
    return apiRequest(`/api/markup-discounts?${params}`)
  },

  // Get rule by ID
  getRuleById: async (ruleId) => {
    return apiRequest(`/api/markup-discounts/${ruleId}`)
  },

  // Update rule
  updateRule: async (ruleId, ruleData) => {
    return apiRequest(`/api/markup-discounts/${ruleId}`, {
      method: "PUT",
      body: JSON.stringify(ruleData),
    })
  },

  // Delete rule
  deleteRule: async (ruleId) => {
    return apiRequest(`/api/markup-discounts/${ruleId}`, {
      method: "DELETE",
    })
  },
}
