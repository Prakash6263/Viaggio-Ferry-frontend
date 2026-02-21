/**
 * USE PERMISSIONS HOOK
 * ====================
 * Provides permission-based UI control for components.
 * Normalizes backend permission formats into a single internal format.
 * 
 * SECURITY: This is a UX-only layer. Backend still enforces real security.
 * 
 * Backend sends TWO possible formats:
 *   A) userPermissions: { canRead, canWrite, canEdit, canDelete }
 *   B) permissions: { read, create, update, delete }
 * 
 * Frontend normalizes both to: { read, create, update, delete }
 * 
 * Usage (with <Can /> component - RECOMMENDED):
 *  <Can action="create">
 *    <button>Add New</button>
 *  </Can>
 *  
 *  <Can action="update" path="/company/currency">
 *    <button>Edit</button>
 *  </Can>
 */

import { useLocation } from "react-router-dom"
import { useSidebar } from "../context/SidebarContext"

/**
 * Hook to get normalized permissions for current route or specific path
 * @param {string} customPath - Optional custom path to check (defaults to current route)
 * @returns {Object} Normalized permission object { read, create, update, delete }
 */
export function usePermissions(customPath = null) {
  const location = useLocation()
  const { getRoutePermissions, user } = useSidebar()

  const path = customPath || location.pathname

  // Company role has all permissions
  if (user?.role === "company") {
    return {
      read: true,
      create: true,
      update: true,
      delete: true,
    }
  }

  // Get raw permissions from backend (via sidebar context)
  const rawPermissions = getRoutePermissions(path) || {}

  // Normalize: Backend sends either format, convert to internal standard
  // Format A: { canRead, canWrite, canEdit, canDelete }
  // Format B: { read, create, update, delete }
  // We normalize to: { read, create, update, delete }
  
  const normalized = {
    read: rawPermissions.canRead === true || rawPermissions.read === true,
    create: rawPermissions.canWrite === true || rawPermissions.create === true,
    update: rawPermissions.canEdit === true || rawPermissions.update === true,
    delete: rawPermissions.canDelete === true || rawPermissions.delete === true,
  }

  return normalized
}

/**
 * Hook to check specific permission for a module/submodule
 * @param {string} moduleCode - Module code
 * @param {string} submoduleCode - Submodule code
 * @returns {Object} Permission flags
 */
export function useModulePermissions(moduleCode, submoduleCode = null) {
  const { menu, user } = useSidebar()

  // Company role has all permissions
  if (user?.role === "company") {
    return {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
      hasAccess: true,
    }
  }

  // Find module in menu
  const module = menu?.[moduleCode]

  if (!module) {
    return {
      canRead: false,
      canWrite: false,
      canEdit: false,
      canDelete: false,
      hasAccess: false,
    }
  }

  // If no submodule specified, check module-level access
  if (!submoduleCode) {
    return {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
      hasAccess: true,
    }
  }

  // Find submodule
  const submodule = module.submodules?.[submoduleCode]

  if (!submodule) {
    return {
      canRead: false,
      canWrite: false,
      canEdit: false,
      canDelete: false,
      hasAccess: false,
    }
  }

  // CRITICAL FIX: Backend sends userPermissions, not permissions
  // Backend contract: { canRead, canWrite, canEdit, canDelete }
  const userPermissions = submodule.userPermissions || {}

  return {
    canRead: userPermissions.canRead === true,
    canWrite: userPermissions.canWrite === true,
    canEdit: userPermissions.canEdit === true,
    canDelete: userPermissions.canDelete === true,
    hasAccess: userPermissions.canRead === true,
  }
}

/**
 * Helper component to conditionally render based on permissions
 * @param {Object} props
 * @param {boolean} props.canRead - Require read permission
 * @param {boolean} props.canCreate - Require create permission
 * @param {boolean} props.canUpdate - Require update permission
 * @param {boolean} props.canDelete - Require delete permission
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Content to render if unauthorized
 */
export function PermissionGate({
  canRead = false,
  canCreate = false,
  canUpdate = false,
  canDelete = false,
  children,
  fallback = null,
}) {
  const permissions = usePermissions()

  // Check required permissions
  if (canRead && !permissions.canRead) return fallback
  if (canCreate && !permissions.canCreate) return fallback
  if (canUpdate && !permissions.canUpdate) return fallback
  if (canDelete && !permissions.canDelete) return fallback

  return children
}

