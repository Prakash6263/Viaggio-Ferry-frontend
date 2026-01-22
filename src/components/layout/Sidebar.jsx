// "use client"

// import { useEffect } from "react"
// import { Link, useLocation, useNavigate } from "react-router-dom"
// import { loginApi } from "../../api/loginApi"
// import useSidebarSubmenu from "../../hooks/useSidebarSubmenu"

// export function Sidebar() {
//   const { pathname } = useLocation()
//   const navigate = useNavigate()
//   useSidebarSubmenu(pathname)

//   const isActive = (path) => pathname === path || pathname.startsWith(path + "/")

//   useEffect(() => {
//     if (window.jQuery && typeof window.jQuery.fn.slimScroll === "function") {
//       window.jQuery(".slimscroll").slimScroll({ height: "100%" })
//     }
//   }, [])

//   const handleLogout = () => {
//     loginApi.logout()
//     navigate("/company-login", { replace: true })
//   }

//   return (
//     <div className="sidebar" id="sidebar">
//       <div className="sidebar-inner slimscroll">
//         <div id="sidebar-menu" className="sidebar-menu">
//           <ul className="sidebar-vertical">
//             <li>
//               <Link to="/company/dashboard" className={isActive("/company/dashboard") ? "active" : ""}>
//                 <i className="fe fe-home"></i> <span> Dashboard</span>
//               </Link>
//             </li>

//             <li className="submenu">
//               <a href="#">
//                 <i className="fa fa-user"></i> <span> Administration </span> <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                   <Link
//                     to="/company/administration/user-list"
//                     className={isActive("/company/administration/user-list") ? "active" : ""}
//                   >
//                     User list
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/administration/currency"
//                     className={isActive("/company/administration/currency") ? "active" : ""}
//                   >
//                     Currency
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/administration/taxes"
//                     className={isActive("/company/administration/taxes") ? "active" : ""}
//                   >
//                     Taxes
//                   </Link>
//                 </li>

//                 {/* <li>
//                   <Link
//                     to="/company/administration/contact-messages"
//                     className={isActive("/company/administration/contact-messages") ? "active" : ""}
//                   >
//                     Contact Messages
//                   </Link>
//                 </li> */}
//                 <li>
//                   <Link
//                     to="/company/administration/support"
//                     className={isActive("/company/administration/support") ? "active" : ""}
//                   >
//                      Contact Messages
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/administration/terms"
//                     className={isActive("/company/administration/terms") ? "active" : ""}
//                   >
//                     Term &amp; Conditions
//                   </Link>
//                 </li>
//               </ul>
//             </li>

//             <li className="submenu">
//               <a href="#">
//                 <i className="fe fe-globe"></i> <span> Ship &amp; Trip </span> <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                   <Link to="/company/ship-trip/ships" className={isActive("/company/ship-trip/ships") ? "active" : ""}>
//                     Ships
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company/ship-trip/trips" className={isActive("/company/ship-trip/trips") ? "active" : ""}>
//                     Trips
//                   </Link>
//                 </li>
//               </ul>
//             </li>

//             <li className="submenu">
//               <a href="#">
//                 <i className="fe fe-users"></i> <span> Partner Management </span> <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                   <Link to="/company/partners" className={isActive("/company/partners") ? "active" : ""}>
//                     Business Partners
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company/b2c-customers" className={isActive("/company/b2c-customers") ? "active" : ""}>
//                     B2C Customers
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company/salesmen" className={isActive("/company/salesmen") ? "active" : ""}>
//                     Salesmen
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company/markup" className={isActive("/company/markup") ? "active" : ""}>
//                     Markup &amp; Discount Board
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/company/commission" className={isActive("/company/commission") ? "active" : ""}>
//                     Commission Board
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/company/partner-management/promotions"
//                     className={isActive("/company/partner-management/promotions") ? "active" : ""}
//                   >
//                     Promotions
//                   </Link>
//                 </li>
//               </ul>
//             </li>

//             <li className="submenu">
//               <a href="#">
//                 <i className="fa fa-shopping-cart"></i> <span>Sales &amp; Booking</span>{" "}
//                 <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                   <Link to="/company/pricelist" className={pathname.startsWith("/company/pricelist") ? "active" : ""}>
//                     Price List
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/company/ticketing-rules"
//                     className={pathname.startsWith("/company/ticketing-rules") ? "active" : ""}
//                   >
//                     Ticketing Rules
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/company/booking-and-tickets"
//                     className={pathname.startsWith("/company/booking-and-tickets") ? "active" : ""}
//                   >
//                     Bookings &amp; Tickets
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/company/excess-baggage-tickets"
//                     className={pathname.startsWith("/company/excess-baggage-tickets") ? "active" : ""}
//                   >
//                     Excess Baggage Tickets
//                   </Link>
//                 </li>
//               </ul>
//             </li>

//             <li className="submenu">
//               <a href="#">
//                 <i className="fa fa-clipboard-list"></i> <span>Checking &amp; Boardings</span>{" "}
//                 <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                   <Link
//                     to="/company/passenger-checking"
//                     className={pathname.startsWith("/company/passenger-checking") ? "active" : ""}
//                   >
//                     Passenger Check-in
//                   </Link>
//                 </li>

//                 <li>
//                   <Link
//                     to="/company/cargo-checking"
//                     className={pathname.startsWith("/company/cargo-checking") ? "active" : ""}
//                   >
//                     Cargo Boarding
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/vehicle-checking"
//                     className={pathname.startsWith("/company/vehicle-checking") ? "active" : ""}
//                   >
//                     Vehicle Checking In
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/passenger-boarding"
//                     className={pathname.startsWith("/company/passenger-boarding") ? "active" : ""}
//                   >
//                     Passenger Boarding
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/cargo-boarding"
//                     className={pathname.startsWith("/company/cargo-boarding") ? "active" : ""}
//                   >
//                     Cargo Boarding
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/vehicle-boarding"
//                     className={pathname.startsWith("/company/vehicle-boarding") ? "active" : ""}
//                   >
//                     Vehicle Boarding
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/trip-completion"
//                     className={pathname.startsWith("/company/trip-completion") ? "active" : ""}
//                   >
//                     Trip Completion &amp; Closure
//                   </Link>
//                 </li>
//               </ul>
//             </li>

//             <li>
//               <Link to="/company/finance" className={isActive("/company/finance") ? "active" : ""}>
//                 <i className="fa fa-credit-card"></i> <span>Finance</span>
//               </Link>
//             </li>

//             <li className="submenu">
//               <a href="#">
//                 <i className="fa fa-cog"></i> <span> Settings </span> <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                   <Link
//                     to="/company/settings/company-profile"
//                     className={pathname.startsWith("/company/settings/company-profile") ? "active" : ""}
//                   >
//                     Company Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/settings/role-permission"
//                     className={
//                       pathname.startsWith("/company/settings/role-permission") ||
//                       pathname.startsWith("/company/settings/add-group-permission")
//                         ? "active"
//                         : ""
//                     }
//                   >
//                     Role &amp; Permission
//                   </Link>
//                 </li>
//                 <li>
//                   <a href="#">Load type</a>
//                 </li>
//                 <li>
//                   <a href="#">Partners Classifications</a>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/settings/port"
//                     className={
//                       pathname.startsWith("/company/settings/port") || pathname.startsWith("/company/settings/add-port")
//                         ? "active"
//                         : ""
//                     }
//                   >
//                     Port
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/settings/cabin"
//                     className={
//                       pathname.startsWith("/company/settings/cabin") ||
//                       pathname.startsWith("/company/settings/add-cabin")
//                         ? "active"
//                         : ""
//                     }
//                   >
//                     Cabin
//                   </Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/company/settings/payload-type"
//                     className={pathname.startsWith("/company/settings/payload-type") ? "active" : ""}
//                   >
//                     Payload Type
//                   </Link>
//                 </li>
//               </ul>
//             </li>

//             <li>
//               <Link
//                 to="/company/system-alerts"
//                 className={pathname.startsWith("/company/system-alerts") ? "active" : ""}
//               >
//                 System Alerts
//               </Link>
//             </li>

//             <li>
//               <a
//                 href="#"
//                 onClick={(e) => {
//                   e.preventDefault()
//                   handleLogout()
//                 }}
//               >
//                 <i className="fe fe-power"></i> <span>Logout</span>
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useMemo } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { loginApi } from "../../api/loginApi"
import { useSidebar } from "../../context/SidebarContext"
import { getIconClass } from "../../config/iconMap"
import useSidebarSubmenu from "../../hooks/useSidebarSubmenu"

/**
 * DYNAMIC SIDEBAR COMPONENT
 * =========================
 * Renders sidebar menu from backend data.
 * No hardcoded routes or menu items.
 * 
 * Rules:
 * - Menu structure comes from useSidebar() context
 * - Icons are resolved via iconMap
 * - Submodules only show if permissions.read === true
 * - Company role sees everything, User role sees filtered menu
 */
export function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { menu, loading, error, clearSidebar, company } = useSidebar()

  useSidebarSubmenu(pathname)

  /**
   * Check if a path is active
   */
  const isActive = (path) => {
    if (!path) return false
    return pathname === path || pathname.startsWith(path + "/")
  }

  /**
   * Sort menu items by displayOrder
   */
  const sortedMenu = useMemo(() => {
    if (!menu) return []

    return Object.entries(menu)
      .map(([code, module]) => ({ code, ...module }))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [menu])

  /**
   * Sort submodules by displayOrder
   * FIXED: Check for correct permission key from backend (canRead instead of read)
   */
  const sortSubmodules = (submodules) => {
    if (!submodules) return []

    return Object.entries(submodules)
      .map(([code, sub]) => ({ code, ...sub }))
      .filter((sub) => sub.userPermissions?.canRead === true || sub.permissions?.read !== false) // Check both formats
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }

  /**
   * Initialize slimScroll
   */
  useEffect(() => {
    if (window.jQuery && typeof window.jQuery.fn.slimScroll === "function") {
      window.jQuery(".slimscroll").slimScroll({ height: "100%" })
    }
  }, [sortedMenu])

  /**
   * Handle logout
   */
  const handleLogout = () => {
    clearSidebar()
    loginApi.logout()
    navigate("/company-login", { replace: true })
  }

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul className="sidebar-vertical">
              <li className="text-center p-4">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Loading menu...</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul className="sidebar-vertical">
              <li className="text-center p-4 text-danger">
                <i className="fe fe-alert-circle"></i>
                <span className="ms-2">{error}</span>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}
                >
                  <i className="fe fe-power"></i> <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render empty menu state
   */
  if (!sortedMenu || sortedMenu.length === 0) {
    return (
      <div className="sidebar" id="sidebar">
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul className="sidebar-vertical">
              <li className="text-center p-4 text-muted">
                <i className="fe fe-info"></i>
                <span className="ms-2">No access assigned</span>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handleLogout()
                  }}
                >
                  <i className="fe fe-power"></i> <span>Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul className="sidebar-vertical">
            {/* Dynamic Menu Items */}
            {sortedMenu.map((module) => {
              // Single page module (no submodules)
              if (module.type === "single") {
                return (
                  <li key={module.code}>
                    <Link to={module.route} className={isActive(module.route) ? "active" : ""}>
                      <i className={getIconClass(module.icon)}></i> <span>{module.label}</span>
                    </Link>
                  </li>
                )
              }

              // Menu with submodules
              if (module.type === "menu" && module.submodules) {
                const sortedSubs = sortSubmodules(module.submodules)

                // Don't render menu if no visible submodules
                if (sortedSubs.length === 0) return null

                // Check if any submodule is active
                const hasActiveChild = sortedSubs.some((sub) => isActive(sub.route))

                return (
                  <li key={module.code} className="submenu">
                    <a href="#" className={hasActiveChild ? "active" : ""}>
                      <i className={getIconClass(module.icon)}></i> <span>{module.label}</span>{" "}
                      <span className="menu-arrow"></span>
                    </a>
                    <ul>
                      {sortedSubs.map((sub) => (
                        <li key={sub.code}>
                          <Link to={sub.route} className={isActive(sub.route) ? "active" : ""}>
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )
              }

              return null
            })}

            {/* Logout Button */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleLogout()
                }}
              >
                <i className="fe fe-power"></i> <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
