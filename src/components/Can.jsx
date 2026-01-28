import { usePermissions } from "../hooks/usePermissions"

/**
 * Can Component - Permission-based Conditional Rendering
 * 
 * Hides UI completely if user lacks permission.
 * Perfect for hiding buttons, sections, or features.
 * 
 * SECURITY: This is a UX-only layer. Backend still enforces real security.
 * 
 * Usage:
 *  <Can action="create">
 *    <button>Add New</button>
 *  </Can>
 *  
 *  <Can action="delete" path="/company/administration/currency">
 *    <button className="btn-danger">Delete</button>
 *  </Can>
 * 
 * Props:
 *  - action: "read" | "create" | "update" | "delete" (required)
 *  - path: Optional path to check (defaults to current route)
 *  - children: Content to render if allowed (required)
 *  - fallback: Content to render if denied (default: null)
 * 
 * Permission resolution:
 *  - If path provided: checks permissions for that path
 *  - Otherwise: checks permissions for current route
 *  - Company role: Always allowed
 *  - User role: Checks normalized permissions from backend
 */
export default function Can({ action, path = null, children, fallback = null }) {
  const permissions = usePermissions(path)

  if (!permissions) return fallback

  // All actions map to the normalized permission format
  const allowed = permissions[action] === true

  return allowed ? children : fallback
}
