import React from "react"
import { usePermissions } from "../hooks/usePermissions"

/**
 * CanDisable Component - Permission-based Button Disabling
 *
 * Renders the button but disables it if user lacks permission.
 * Perfect for showing UI while preventing interaction.
 *
 * SECURITY: This is a UX-only layer. Backend still enforces real security.
 *
 * Usage:
 *  <CanDisable action="update">
 *    <button>Edit</button>
 *  </CanDisable>
 *
 *  <CanDisable action="delete" path="/company/administration/currency">
 *    <button className="btn-danger">Delete</button>
 *  </CanDisable>
 *
 * Props:
 *  - action: "read" | "create" | "update" | "delete" (required)
 *  - path: Optional path to check (defaults to current route)
 *  - children: Button or element to conditionally disable (required)
 *  - tooltip: Custom tooltip text (optional, default: "You do not have permission")
 *
 * Behavior:
 *  - If permission granted: renders button normally (enabled)
 *  - If permission denied: renders button with disabled attribute + title tooltip
 *  - Clones children to inject disabled prop
 *
 * Notes:
 *  - Use when you want to show the UI but prevent interaction
 *  - Use <Can /> instead when you want to hide the UI completely
 *  - Works with both company and user roles
 */
export default function CanDisable({ action, path = null, children, tooltip = "You do not have permission" }) {
  const permissions = usePermissions(path)

  // If no permissions object (edge case), render enabled
  if (!permissions) return children

  // Validate action
  if (!["read", "create", "update", "delete"].includes(action)) {
    console.warn(`[v0] CanDisable: Unknown action "${action}". Use: read | create | update | delete`)
    return children
  }

  // Check if permission is granted using normalized format
  const allowed = permissions[action] === true

  // If allowed, render children as-is
  if (allowed) return children

  // If not allowed, clone children and add disabled attribute
  // This assumes children is a single React element
  if (!children || !children.props) {
    console.warn(`[v0] CanDisable: Expected single React element as children`)
    return children
  }

  return React.cloneElement(children, {
    disabled: true,
    title: tooltip,
    className: `${children.props.className || ""} cursor-not-allowed opacity-50`,
  })
}
