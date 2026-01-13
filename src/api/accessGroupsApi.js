import { apiRequest } from "./apiClient"

export const accessGroupsApi = {
  // 1. Create new access group
  createAccessGroup: async (groupData) => {
    return apiRequest("/api/access-groups", {
      method: "POST",
      body: JSON.stringify(groupData),
    })
  },

  // 2. Get all access groups list with pagination
  getAccessGroupsList: async (page = 1, limit = 10) => {
    return apiRequest(`/api/access-groups?page=${page}&limit=${limit}`)
  },

  // 3. Get access group by ID
  getAccessGroupById: async (groupId) => {
    return apiRequest(`/api/access-groups/${groupId}`)
  },

  // 4. Update access group
  updateAccessGroup: async (groupId, groupData) => {
    return apiRequest(`/api/access-groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(groupData),
    })
  },

  // 5. Delete access group
  deleteAccessGroup: async (groupId) => {
    return apiRequest(`/api/access-groups/${groupId}`, {
      method: "DELETE",
    })
  },

  // 6. Toggle access group status
  toggleAccessGroupStatus: async (groupId, isActive) => {
    return apiRequest(`/api/access-groups/${groupId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    })
  },
}
