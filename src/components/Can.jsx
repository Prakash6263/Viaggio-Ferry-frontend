import { usePermissions } from "../hooks/usePermissions"

/**
 * Can Component - Enterprise-grade Permission Guard
 *
 * Provides clean, declarative permission-based UI rendering.
 * Replaces boilerplate permission checks throughout your pages.
 *
 * SECURITY: This is a UX-only layer. Backend still enforces real security.
 *
 * Usage:
 *  <Can action="create">
 *    <button>Add New</button>
 *  </Can>
 *
 *  <Can action="update">
 *    <button>Edit</button>
 *  </Can>
 *
 *  <Can action="delete">
 *    <button>Delete</button>
 *  </Can>
 *
 *  <Can action="read" fallback={<p>No access</p>}>
 *    <PageContent />
 *  </Can>
 *
 * Props:
 *  - action: "read" | "create" | "update" | "delete" (required)
 *  - children: JSX to render if permitted (required)
 *  - fallback: JSX to render if NOT permitted (optional, default: null)
 *
 * Notes:
 *  - Frontend permission mapping:
 *    - read   → backend canRead
 *    - create → backend canWrite
 *    - update → backend canEdit
 *    - delete → backend canDelete
 *  - Handles missing permissions gracefully
 *  - Works with both company and user roles
 */
export default function Can({ action, children, fallback = null }) {
  const permissions = usePermissions()

  // If no permissions object (edge case), show fallback
  if (!permissions) return fallback

  // Map frontend action names to permission keys
  // Backend returns: canRead, canWrite, canEdit, canDelete
  // Frontend actions: read, create, update, delete
  const permissionMap = {
    read: "canRead",
    create: "canWrite",
    update: "canEdit",
    delete: "canDelete",
  }

  const permissionKey = permissionMap[action]

  if (!permissionKey) {
    console.warn(`[v0] Can: Unknown action "${action}". Use: read | create | update | delete`)
    return fallback
  }

  // Check if permission is granted
  const allowed = permissions[permissionKey] === true

  // Render children if allowed, otherwise render fallback
  return allowed ? children : fallback
}
