// /**
//  * USE PERMISSIONS HOOK
//  * ====================
//  * Provides permission-based UI control for components.
//  * 
//  * Usage:
//  * const { canCreate, canUpdate, canDelete, canRead } = usePermissions()
//  * 
//  * // In JSX:
//  * {canCreate && <Button>Add New</Button>}
//  * {canUpdate && <Button>Edit</Button>}
//  * {canDelete && <Button>Delete</Button>}
//  * 
//  * Note: This is UX-only. Backend still enforces actual security.
//  */

// import { useLocation } from "react-router-dom"
// import { useSidebar } from "../context/SidebarContext"

// /**
//  * Hook to get permissions for current route or specific path
//  * @param {string} customPath - Optional custom path to check (defaults to current route)
//  * @returns {Object} Permission flags and helper functions
//  */
// export function usePermissions(customPath = null) {
//   const location = useLocation()
//   const { getRoutePermissions, user, menu } = useSidebar()

//   const path = customPath || location.pathname

//   // Company role has all permissions
//   if (user?.role === "company") {
//     return {
//       canRead: true,
//       canCreate: true,
//       canUpdate: true,
//       canDelete: true,
//       permissions: {
//         read: true,
//         create: true,
//         update: true,
//         delete: true,
//       },
//       isCompany: true,
//       isUser: false,
//       role: "company",
//     }
//   }

//   // Get permissions for route
//   const rawPermissions = getRoutePermissions(path) || {}

//   // FIXED: Map backend permission keys (canRead, canWrite, canEdit, canDelete) to frontend keys
//   const permissions = {
//     read: rawPermissions.canRead === true || rawPermissions.read === true,
//     create: rawPermissions.canWrite === true || rawPermissions.create === true,
//     update: rawPermissions.canEdit === true || rawPermissions.update === true,
//     delete: rawPermissions.canDelete === true || rawPermissions.delete === true,
//   }

//   return {
//     canRead: permissions.read === true,
//     canCreate: permissions.create === true,
//     canUpdate: permissions.update === true,
//     canDelete: permissions.delete === true,
//     permissions,
//     isCompany: false,
//     isUser: true,
//     role: "user",
//   }
// }

// /**
//  * Hook to check specific permission for a module/submodule
//  * @param {string} moduleCode - Module code
//  * @param {string} submoduleCode - Submodule code
//  * @returns {Object} Permission flags
//  */
// export function useModulePermissions(moduleCode, submoduleCode = null) {
//   const { menu, user } = useSidebar()

//   // Company role has all permissions
//   if (user?.role === "company") {
//     return {
//       canRead: true,
//       canCreate: true,
//       canUpdate: true,
//       canDelete: true,
//       hasAccess: true,
//     }
//   }

//   // Find module in menu
//   const module = menu?.[moduleCode]

//   if (!module) {
//     return {
//       canRead: false,
//       canCreate: false,
//       canUpdate: false,
//       canDelete: false,
//       hasAccess: false,
//     }
//   }

//   // If no submodule specified, check module-level access
//   if (!submoduleCode) {
//     return {
//       canRead: true, // Module is visible
//       canCreate: true,
//       canUpdate: true,
//       canDelete: true,
//       hasAccess: true,
//     }
//   }

//   // Find submodule
//   const submodule = module.submodules?.[submoduleCode]

//   if (!submodule) {
//     return {
//       canRead: false,
//       canCreate: false,
//       canUpdate: false,
//       canDelete: false,
//       hasAccess: false,
//     }
//   }

//   const permissions = submodule.permissions || {}

//   return {
//     canRead: permissions.read === true,
//     canCreate: permissions.create === true,
//     canUpdate: permissions.update === true,
//     canDelete: permissions.delete === true,
//     hasAccess: permissions.read === true,
//   }
// }

// /**
//  * Helper component to conditionally render based on permissions
//  * @param {Object} props
//  * @param {boolean} props.canRead - Require read permission
//  * @param {boolean} props.canCreate - Require create permission
//  * @param {boolean} props.canUpdate - Require update permission
//  * @param {boolean} props.canDelete - Require delete permission
//  * @param {React.ReactNode} props.children - Content to render if authorized
//  * @param {React.ReactNode} props.fallback - Content to render if unauthorized
//  */
// export function PermissionGate({
//   canRead = false,
//   canCreate = false,
//   canUpdate = false,
//   canDelete = false,
//   children,
//   fallback = null,
// }) {
//   const permissions = usePermissions()

//   // Check required permissions
//   if (canRead && !permissions.canRead) return fallback
//   if (canCreate && !permissions.canCreate) return fallback
//   if (canUpdate && !permissions.canUpdate) return fallback
//   if (canDelete && !permissions.canDelete) return fallback

//   return children
// }

// export default usePermissions


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
 * 
 * @param {string} customPath - Optional custom path to check (defaults to current route)
 * @returns {Object} Normalized permissions: { read, create, update, delete }
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
      read: true,
      create: true,
      update: true,
      delete: true,
      hasAccess: true,
    }
  }

  // Find module in menu
  const module = menu?.[moduleCode]

  if (!module) {
    return {
      read: false,
      create: false,
      update: false,
      delete: false,
      hasAccess: false,
    }
  }

  // If no submodule specified, check module-level access
  if (!submoduleCode) {
    return {
      read: true, // Module is visible
      create: true,
      update: true,
      delete: true,
      hasAccess: true,
    }
  }

  // Find submodule
  const submodule = module.submodules?.[submoduleCode]

  if (!submodule) {
    return {
      read: false,
      create: false,
      update: false,
      delete: false,
      hasAccess: false,
    }
  }

  // CRITICAL FIX: Normalize permissions to match internal format
  // Backend sends either: { canRead, canWrite, canEdit, canDelete } or { read, create, update, delete }
  // Return normalized: { read, create, update, delete }
  const perms = submodule.permissions || submodule.userPermissions || {}

  return {
    read: perms.canRead === true || perms.read === true,
    create: perms.canWrite === true || perms.create === true,
    update: perms.canEdit === true || perms.update === true,
    delete: perms.canDelete === true || perms.delete === true,
    hasAccess: (perms.canRead === true || perms.read === true),
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
