import { apiRequest } from "./apiClient"

export const b2cApi = {
  // 1. Get B2C users list for partner management
  getUsers: async (params = {}) => {
    const { status = "Active", page = 1, limit = 10, search = "" } = params
    const query = new URLSearchParams({ status, page, limit, search }).toString()
    return apiRequest(`/api/b2c/company/users?${query}`)
  },

  // 2. Toggle B2C account status (Active/Inactive)
  toggleStatus: async (userId, status) => {
    return apiRequest(`/api/b2c/${userId}/toggle-status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },

  // 3. Delete B2C account
  deleteUser: async (userId) => {
    return apiRequest(`/api/b2c/${userId}`, {
      method: "DELETE",
    })
  },
}
