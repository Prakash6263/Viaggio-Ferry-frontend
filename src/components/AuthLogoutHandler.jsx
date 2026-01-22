// "use client"

// /**
//  * AuthLogoutHandler - Listens for auth logout events and navigates to login
//  * This component should be placed inside the Router context
//  */

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { AUTH_LOGOUT_EVENT } from "../api/apiClient"

// export default function AuthLogoutHandler() {
//   const navigate = useNavigate()

//   useEffect(() => {
//     const handleLogout = () => {
//       console.log("[v0] AuthLogoutHandler received logout event, navigating to login")
//       setTimeout(() => {
//         navigate("/company-login", { replace: true })
//       }, 100)
//     }

//     const listener = handleLogout
//     window.addEventListener(AUTH_LOGOUT_EVENT, listener)

//     console.log("[v0] AuthLogoutHandler mounted and listening for logout events")

//     return () => {
//       window.removeEventListener(AUTH_LOGOUT_EVENT, listener)
//       console.log("[v0] AuthLogoutHandler unmounted and listener removed")
//     }
//   }, [navigate])

//   return null // This component doesn't render anything
// }



"use client"

/**
 * AuthLogoutHandler - Listens for auth logout events and navigates to login
 * This component should be placed inside the Router context
 * Also clears sidebar state on logout
 */

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AUTH_LOGOUT_EVENT } from "../api/apiClient"
import { useSidebar } from "../context/SidebarContext"

export default function AuthLogoutHandler() {
  const navigate = useNavigate()
  const { clearSidebar } = useSidebar()

  useEffect(() => {
    const handleLogout = () => {
      // Clear sidebar state
      clearSidebar()

      setTimeout(() => {
        navigate("/company-login", { replace: true })
      }, 100)
    }

    const listener = handleLogout
    window.addEventListener(AUTH_LOGOUT_EVENT, listener)

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, listener)
    }
  }, [navigate, clearSidebar])

  return null // This component doesn't render anything
}
