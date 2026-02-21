// Add this to CompanyCurrencyList.jsx or any page to debug permissions

import { useSidebar } from "../context/SidebarContext"
import { usePermissions } from "../hooks/usePermissions"
import { useLocation } from "react-router-dom"

function RBACDebugger() {
  const location = useLocation()
  const { menu } = useSidebar()
  const permissions = usePermissions()

  console.log("[v0] === RBAC DEBUG ===")
  console.log("[v0] Current Path:", location.pathname)
  console.log("[v0] Permissions for this path:", permissions)
  console.log("[v0] Full Menu Structure:", menu)
  
  // Find currency submodule
  const currencyModule = menu?.administration?.submodules?.currency
  console.log("[v0] Currency Module Permissions:", currencyModule?.permissions)
  
  // Check if permissions are missing
  if (!currencyModule?.permissions) {
    console.warn("[v0] ⚠️ ISSUE: Backend sidebar is not returning permissions!")
    console.warn("[v0] This is why buttons are not updating.")
    console.warn("[v0] Solution: /api/sidebar endpoint must include permissions from AccessGroup")
  }

  return null // This component doesn't render anything
}

export default RBACDebugger

// Usage in page:
// import RBACDebugger from "../components/RBACDebugger"
// 
// export default function CompanyCurrencyList() {
//   return (
//     <>
//       <RBACDebugger />
//       {/* rest of page */}
//     </>
//   )
// }
