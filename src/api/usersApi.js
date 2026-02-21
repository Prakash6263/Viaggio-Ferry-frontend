import { apiRequest } from "./apiClient"

/**
 * Helper: Trigger permission update event
 * This fires a custom event that the SidebarContext listens for
 * to reload permissions immediately when they change
 */
const triggerPermissionUpdate = () => {
  console.log("[v0] Firing PERMISSION_UPDATED event to refresh sidebar...")
  window.dispatchEvent(new CustomEvent("PERMISSION_UPDATED"))
}

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
   * CRITICAL: Assign access group to user
   * When this completes, triggers sidebar refresh so permissions update immediately
   */
  assignAccessGroupToUser: async (userId, moduleCode, accessGroupId) => {
    console.log("[v0] Assigning access group to user:", { userId, moduleCode, accessGroupId })
    
    try {
      const result = await apiRequest(`/api/users/${userId}/assign-access-group`, {
        method: "POST",
        body: JSON.stringify({ moduleCode, accessGroupId }),
      })

      if (result.success || result.data) {
        console.log("[v0] Permission assigned successfully, triggering sidebar refresh...")
        // Delay slightly to ensure backend has persisted
        setTimeout(() => {
          triggerPermissionUpdate()
        }, 300)
      }

      return result
    } catch (error) {
      console.error("[v0] Error assigning access group:", error)
      throw error
    }
  },

  /**
   * CRITICAL: Remove access group from user
   * When this completes, triggers sidebar refresh so permissions update immediately
   */
  removeAccessGroupFromUser: async (userId, moduleCode) => {
    console.log("[v0] Removing access group from user:", { userId, moduleCode })
    
    try {
      const result = await apiRequest(`/api/users/${userId}/access-group/${moduleCode}`, {
        method: "DELETE",
      })

      if (result.success || result.data) {
        console.log("[v0] Permission removed successfully, triggering sidebar refresh...")
        // Delay slightly to ensure backend has persisted
        setTimeout(() => {
          triggerPermissionUpdate()
        }, 300)
      }

      return result
    } catch (error) {
      console.error("[v0] Error removing access group:", error)
      throw error
    }
  },

  /**
   * Manual trigger for permission updates
   * Use this if you assign/update permissions through other means
   */
  refreshPermissions: () => {
    console.log("[v0] Manually triggering permission refresh...")
    triggerPermissionUpdate()
  },
}
