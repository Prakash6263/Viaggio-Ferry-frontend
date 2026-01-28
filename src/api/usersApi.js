import { apiRequest } from "./apiClient"

export const usersApi = {
  // 1. Create new user
  createUser: async (userData) => {
    return apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // 2. Get all users list with pagination and filters
  getUsersList: async (page = 1, limit = 10, status = "Active", sortBy = "createdAt", sortOrder = "desc") => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      sortBy,
      sortOrder,
    })
    return apiRequest(`/api/users?${params.toString()}`)
  },

  getUsersByStatus: async (status) => {
    return apiRequest(`/api/users/by-status/${status}`)
  },

  // 3. Get user by ID
  getUserById: async (userId) => {
    return apiRequest(`/api/users/${userId}`)
  },

  // 4. Update user
  updateUser: async (userId, userData) => {
    return apiRequest(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },

  // 5. Delete user
  deleteUser: async (userId) => {
    return apiRequest(`/api/users/${userId}`, {
      method: "DELETE",
    })
  },

  // 6. Get access groups by module and layer
  getAccessGroupsByModuleLayer: async (moduleCode, layer) => {
    return apiRequest(`/api/users/access-groups/by-module-layer?moduleCode=${moduleCode}&layer=${layer}`)
  },

  getSalesmenList: async (page = 1, limit = 10, status = "Active", sortBy = "createdAt", sortOrder = "desc") => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      sortBy,
      sortOrder,
    })
    return apiRequest(`/api/users/salesman/list?${params.toString()}`)
  },

  // Get current user profile
  getCurrentProfile: async () => {
    return apiRequest("/api/users/me")
  },

  // Update current user profile
  updateProfile: async (formData) => {
    return apiRequest("/api/users/me/update", {
      method: "PUT",
      body: formData, // FormData object with fullName, position, profileImage
    })
  },
}
