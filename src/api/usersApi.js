import { apiRequest } from "./apiClient"
import { triggerPermissionUpdate } from "../utils/rbacUtils"

export const usersApi = {
  // 1. Create new user
  createUser: async (userData) => {
    return apiRequest("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // 2. Get all users list with pagination and filters
  getUsersList: async (page = 1, limit = 10, status = "Active", sortBy = "createdAt", sortOrder = "desc", search = "") => {
    const params = new URLSearchParams({
      page,
      limit,
      status,
      sortBy,
      sortOrder,
    })
    if (search) {
      params.append("search", search)
    }
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

  /**
   * PERMISSION MANAGEMENT ENDPOINTS
   * ================================
   */

  // Get user's access groups across all modules
  getUserAccessGroups: async (userId) => {
    const result = await apiRequest(`/api/users/${userId}/access-groups`)
    console.log("[v0] getUserAccessGroups result:", result)
    return result
  },

  // Get user permissions for a specific module
  getUserPermissionsForModule: async (userId, moduleCode) => {
    const result = await apiRequest(`/api/users/${userId}/permissions/${moduleCode}`)
    console.log("[v0] getUserPermissionsForModule result:", result)
    return result
  },

  // Assign access group to user for a module
  assignAccessGroupToUser: async (userId, moduleCode, accessGroupId) => {
    console.log("[v0] Assigning access group to user:", { userId, moduleCode, accessGroupId })
    const result = await apiRequest(`/api/users/${userId}/assign-access-group`, {
      method: "POST",
      body: JSON.stringify({ moduleCode, accessGroupId }),
    })
    if (result.success) {
      console.log("[v0] Permission assigned successfully, triggering UI refresh...")
      triggerPermissionUpdate()
    }
    return result
  },

  // Remove access group from user for a module
  removeAccessGroupFromUser: async (userId, moduleCode) => {
    console.log("[v0] Removing access group from user:", { userId, moduleCode })
    const result = await apiRequest(`/api/users/${userId}/access-group/${moduleCode}`, {
      method: "DELETE",
    })
    if (result.success) {
      console.log("[v0] Permission removed successfully, triggering UI refresh...")
      triggerPermissionUpdate()
    }
    return result
  },
}
