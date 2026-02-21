/**
 * RBAC Utility Functions
 * Helper functions for permission management and refresh
 */

/**
 * Trigger a permission update event
 * This will cause the sidebar to reload and all permission-based UI to update
 */
export const triggerPermissionUpdate = () => {
  console.log("[v0] [RBAC] Triggering permission update event...")
  const event = new CustomEvent("PERMISSION_UPDATED", {
    detail: { timestamp: Date.now() },
  })
  window.dispatchEvent(event)
}

/**
 * Get readable action name for logging
 */
export const getActionName = (action) => {
  const actionMap = {
    read: "Read",
    create: "Create",
    update: "Update/Edit",
    delete: "Delete",
  }
  return actionMap[action] || action
}

/**
 * Format permissions for display
 */
export const formatPermissions = (permissions) => {
  if (!permissions) return "No permissions"
  
  const granted = []
  if (permissions.read) granted.push("Read")
  if (permissions.create) granted.push("Create")
  if (permissions.update) granted.push("Update")
  if (permissions.delete) granted.push("Delete")
  
  return granted.length > 0 ? granted.join(", ") : "No permissions"
}

export default {
  triggerPermissionUpdate,
  getActionName,
  formatPermissions,
}
