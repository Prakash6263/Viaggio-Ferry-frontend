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
 * 
 * SECURITY: This is a UX-only layer. Backend still enforces real security.
 * 
 * Usage (with <Can /> component - RECOMMENDED):
 *  <Can action="create">
 *    <button>Add New</button>
 *  </Can>
 * 
 * Legacy usage (direct access):
 *  const perms = usePermissions()
 *  {perms.canRead && <Component />}
 *  {perms.canCreate && <AddButton />}
 * 
 * Permission Mapping:
 *  - Backend keys: canRead, canWrite, canEdit, canDelete
 *  - Frontend actions: read, create, update, delete
 *  - Company role: Always has all permissions
 */

import { useLocation } from "react-router-dom"
import { useSidebar } from "../context/SidebarContext"

/**
 * Hook to get permissions for current route or specific path
 * @param {string} customPath - Optional custom path to check (defaults to current route)
 * @returns {Object} Permission object with backend keys (canRead, canWrite, canEdit, canDelete)
 */
export function usePermissions(customPath = null) {
  const location = useLocation()
  const { getRoutePermissions, user, menu } = useSidebar()

  const path = customPath || location.pathname

  // Company role has all permissions
  if (user?.role === "company") {
    return {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
      // Legacy compatibility
      canCreate: true,
      canUpdate: true,
      read: true,
      create: true,
      update: true,
      delete: true,
    }
  }

  // Get permissions for route from backend
  const rawPermissions = getRoutePermissions(path) || {}

  // Backend provides strict keys: canRead, canWrite, canEdit, canDelete
  // Trust backend contract strictly - no fallbacks
  const permissions = {
    canRead: rawPermissions.canRead === true,
    canWrite: rawPermissions.canWrite === true,
    canEdit: rawPermissions.canEdit === true,
    canDelete: rawPermissions.canDelete === true,
  }

  return permissions
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
      canRead: true, // Module is visible
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
