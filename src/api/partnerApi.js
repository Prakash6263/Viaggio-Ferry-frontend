import { apiRequest } from "./apiClient"

export const partnerApi = {
  // 1. Add new partner
  addPartner: async (partnerData) => {
    return apiRequest("/api/partners", {
      method: "POST",
      body: JSON.stringify(partnerData),
    })
  },

  // 2. Get all partners list
  getPartnersList: async (params = {}) => {
    return apiRequest("/api/partners")
  },

  // 3. Get partner by ID
  getPartnerById: async (partnerId) => {
    return apiRequest(`/api/partners/${partnerId}`)
  },

  // 4. Update partner
  updatePartner: async (partnerId, partnerData) => {
    return apiRequest(`/api/partners/${partnerId}`, {
      method: "PUT",
      body: JSON.stringify(partnerData),
    })
  },

  // 5. Disable partner
  disablePartner: async (partnerId) => {
    return apiRequest(`/api/partners/${partnerId}/disable`, {
      method: "PATCH",
    })
  },

  // 6. Enable partner
  enablePartner: async (partnerId) => {
    return apiRequest(`/api/partners/${partnerId}/enable`, {
      method: "PATCH",
    })
  },
}
