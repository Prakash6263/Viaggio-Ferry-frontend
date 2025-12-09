// "use client"

// import { useEffect } from "react"
// import { Link, useLocation } from "react-router-dom"
// import useSidebarSubmenu from "../../hooks/useSidebarSubmenu"

// export function Sidebar() {
//   const { pathname } = useLocation()
//   // pass pathname so submenu hook can auto-open the current parent
//   useSidebarSubmenu(pathname)

//   // active should match exact or nested routes
//   const isActive = (path) => pathname === path || pathname.startsWith(path + "/")

//   useEffect(() => {
//     if (window.jQuery && typeof window.jQuery.fn.slimScroll === "function") {
//       window.jQuery(".slimscroll").slimScroll({ height: "100%" })
//     }
//   }, [])

//   return (
//     <div className="sidebar" id="sidebar">
//       <div className="sidebar-inner slimscroll">
//         <div id="sidebar-menu" className="sidebar-menu">
//           <ul className="sidebar-vertical">
//             {/* Dashboard */}
//             <li>
//               <Link to="/company/dashboard" className={isActive("/company/dashboard") ? "active" : ""}>
//                 <i className="fe fe-home"></i> <span> Dashboard</span>
//               </Link>
//             </li>

//             {/* Administration */}
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

//                 {/* keep these as placeholders for now */}
//                 <li>
//                   <Link
//                     to="/company/administration/contact-messages"
//                     className={isActive("/company/administration/contact-messages") ? "active" : ""}
//                   >
//                     Contact Messages
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

//             {/* Ship & Trip (placeholders) */}
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

//             {/* Partner Management */}
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

//                 {/* Only list page linked here */}
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

//             {/* Sales & Booking (placeholders) */}
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

//             {/* Checking & Boardings */}
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

//    {/* Finance */}
//             <li>
//               <Link to="/company/finance" className={isActive("/company/finance") ? "active" : ""}>
//                 <i className="fa fa-credit-card"></i> <span>Finance</span>
//               </Link>
//             </li>


//             {/* Settings (placeholders) */}
//             <li className="submenu">
//               <a href="#">
//                 <i className="fa fa-cog"></i> <span> Settings </span> <span className="menu-arrow"></span>
//               </a>
//               <ul>
//                 <li>
//                  <Link
//   to="/company/settings/company-profile"
//   className={pathname.startsWith("/company/settings/company-profile") ? "active" : ""}>
//   Company Profile
// </Link>

//                 </li>
//                <li>
//   <Link
//     to="/company/settings/role-permission"
//     className={
//       pathname.startsWith("/company/settings/role-permission") ||
//       pathname.startsWith("/company/settings/add-group-permission")
//         ? "active"
//         : ""
//     }
//   >
//     Role & Permission
//   </Link>
// </li>

//                 <li>
//                   <a href="#">Load type</a>
//                 </li>
//                 <li>
//                   <a href="#">Partners Classifications</a>
//                 </li>
//                 <li>
//   <Link
//     to="/company/settings/port"
//     className={
//       pathname.startsWith("/company/settings/port") ||
//       pathname.startsWith("/company/settings/add-port")
//         ? "active"
//         : ""
//     }
//   >
//     Port
//   </Link>
// </li>

//                 <li>
//                  <Link
//   to="/company/settings/cabin"
//   className={
//     pathname.startsWith("/company/settings/cabin") ||
//     pathname.startsWith("/company/settings/add-cabin")
//       ? "active"
//       : ""
//   }
// >
//   Cabin
// </Link>

//                 </li>
//                 <li>
//                  <Link
//   to="/company/settings/payload-type"
//   className={
//     pathname.startsWith("/company/settings/payload-type")
//       ? "active"
//       : ""
//   }
// >
//   Payload Type
// </Link>

//                 </li>
//               </ul>
//             </li>

//             {/* System Alerts */}
//             <li>
//              <Link
//   to="/company/system-alerts"
//   className={pathname.startsWith("/company/system-alerts") ? "active" : ""}
// >
//   System Alerts
// </Link>

//             </li>

//             {/* Logout */}
//             <li>
//               <Link to="/company/login">
//                 <i className="fe fe-power"></i> <span>Logout</span>
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { loginApi } from "../../api/loginApi"
import useSidebarSubmenu from "../../hooks/useSidebarSubmenu"

export function Sidebar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useSidebarSubmenu(pathname)

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/")

  useEffect(() => {
    if (window.jQuery && typeof window.jQuery.fn.slimScroll === "function") {
      window.jQuery(".slimscroll").slimScroll({ height: "100%" })
    }
  }, [])

  const handleLogout = () => {
    loginApi.logout()
    navigate("/company-login", { replace: true })
  }

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div id="sidebar-menu" className="sidebar-menu">
          <ul className="sidebar-vertical">
            <li>
              <Link to="/company/dashboard" className={isActive("/company/dashboard") ? "active" : ""}>
                <i className="fe fe-home"></i> <span> Dashboard</span>
              </Link>
            </li>

            <li className="submenu">
              <a href="#">
                <i className="fa fa-user"></i> <span> Administration </span> <span className="menu-arrow"></span>
              </a>
              <ul>
                <li>
                  <Link
                    to="/company/administration/user-list"
                    className={isActive("/company/administration/user-list") ? "active" : ""}
                  >
                    User list
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/administration/currency"
                    className={isActive("/company/administration/currency") ? "active" : ""}
                  >
                    Currency
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/administration/taxes"
                    className={isActive("/company/administration/taxes") ? "active" : ""}
                  >
                    Taxes
                  </Link>
                </li>

                <li>
                  <Link
                    to="/company/administration/contact-messages"
                    className={isActive("/company/administration/contact-messages") ? "active" : ""}
                  >
                    Contact Messages
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/administration/terms"
                    className={isActive("/company/administration/terms") ? "active" : ""}
                  >
                    Term &amp; Conditions
                  </Link>
                </li>
              </ul>
            </li>

            <li className="submenu">
              <a href="#">
                <i className="fe fe-globe"></i> <span> Ship &amp; Trip </span> <span className="menu-arrow"></span>
              </a>
              <ul>
                <li>
                  <Link to="/company/ship-trip/ships" className={isActive("/company/ship-trip/ships") ? "active" : ""}>
                    Ships
                  </Link>
                </li>
                <li>
                  <Link to="/company/ship-trip/trips" className={isActive("/company/ship-trip/trips") ? "active" : ""}>
                    Trips
                  </Link>
                </li>
              </ul>
            </li>

            <li className="submenu">
              <a href="#">
                <i className="fe fe-users"></i> <span> Partner Management </span> <span className="menu-arrow"></span>
              </a>
              <ul>
                <li>
                  <Link to="/company/partners" className={isActive("/company/partners") ? "active" : ""}>
                    Business Partners
                  </Link>
                </li>
                <li>
                  <Link to="/company/b2c-customers" className={isActive("/company/b2c-customers") ? "active" : ""}>
                    B2C Customers
                  </Link>
                </li>
                <li>
                  <Link to="/company/salesmen" className={isActive("/company/salesmen") ? "active" : ""}>
                    Salesmen
                  </Link>
                </li>
                <li>
                  <Link to="/company/markup" className={isActive("/company/markup") ? "active" : ""}>
                    Markup &amp; Discount Board
                  </Link>
                </li>
                <li>
                  <Link to="/company/commission" className={isActive("/company/commission") ? "active" : ""}>
                    Commission Board
                  </Link>
                </li>

                <li>
                  <Link
                    to="/company/partner-management/promotions"
                    className={isActive("/company/partner-management/promotions") ? "active" : ""}
                  >
                    Promotions
                  </Link>
                </li>
              </ul>
            </li>

            <li className="submenu">
              <a href="#">
                <i className="fa fa-shopping-cart"></i> <span>Sales &amp; Booking</span>{" "}
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li>
                  <Link to="/company/pricelist" className={pathname.startsWith("/company/pricelist") ? "active" : ""}>
                    Price List
                  </Link>
                </li>

                <li>
                  <Link
                    to="/company/ticketing-rules"
                    className={pathname.startsWith("/company/ticketing-rules") ? "active" : ""}
                  >
                    Ticketing Rules
                  </Link>
                </li>

                <li>
                  <Link
                    to="/company/booking-and-tickets"
                    className={pathname.startsWith("/company/booking-and-tickets") ? "active" : ""}
                  >
                    Bookings &amp; Tickets
                  </Link>
                </li>

                <li>
                  <Link
                    to="/company/excess-baggage-tickets"
                    className={pathname.startsWith("/company/excess-baggage-tickets") ? "active" : ""}
                  >
                    Excess Baggage Tickets
                  </Link>
                </li>
              </ul>
            </li>

            <li className="submenu">
              <a href="#">
                <i className="fa fa-clipboard-list"></i> <span>Checking &amp; Boardings</span>{" "}
                <span className="menu-arrow"></span>
              </a>
              <ul>
                <li>
                  <Link
                    to="/company/passenger-checking"
                    className={pathname.startsWith("/company/passenger-checking") ? "active" : ""}
                  >
                    Passenger Check-in
                  </Link>
                </li>

                <li>
                  <Link
                    to="/company/cargo-checking"
                    className={pathname.startsWith("/company/cargo-checking") ? "active" : ""}
                  >
                    Cargo Boarding
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/vehicle-checking"
                    className={pathname.startsWith("/company/vehicle-checking") ? "active" : ""}
                  >
                    Vehicle Checking In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/passenger-boarding"
                    className={pathname.startsWith("/company/passenger-boarding") ? "active" : ""}
                  >
                    Passenger Boarding
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/cargo-boarding"
                    className={pathname.startsWith("/company/cargo-boarding") ? "active" : ""}
                  >
                    Cargo Boarding
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/vehicle-boarding"
                    className={pathname.startsWith("/company/vehicle-boarding") ? "active" : ""}
                  >
                    Vehicle Boarding
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/trip-completion"
                    className={pathname.startsWith("/company/trip-completion") ? "active" : ""}
                  >
                    Trip Completion &amp; Closure
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/company/finance" className={isActive("/company/finance") ? "active" : ""}>
                <i className="fa fa-credit-card"></i> <span>Finance</span>
              </Link>
            </li>

            <li className="submenu">
              <a href="#">
                <i className="fa fa-cog"></i> <span> Settings </span> <span className="menu-arrow"></span>
              </a>
              <ul>
                <li>
                  <Link
                    to="/company/settings/company-profile"
                    className={pathname.startsWith("/company/settings/company-profile") ? "active" : ""}
                  >
                    Company Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/settings/role-permission"
                    className={
                      pathname.startsWith("/company/settings/role-permission") ||
                      pathname.startsWith("/company/settings/add-group-permission")
                        ? "active"
                        : ""
                    }
                  >
                    Role &amp; Permission
                  </Link>
                </li>
                <li>
                  <a href="#">Load type</a>
                </li>
                <li>
                  <a href="#">Partners Classifications</a>
                </li>
                <li>
                  <Link
                    to="/company/settings/port"
                    className={
                      pathname.startsWith("/company/settings/port") || pathname.startsWith("/company/settings/add-port")
                        ? "active"
                        : ""
                    }
                  >
                    Port
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/settings/cabin"
                    className={
                      pathname.startsWith("/company/settings/cabin") ||
                      pathname.startsWith("/company/settings/add-cabin")
                        ? "active"
                        : ""
                    }
                  >
                    Cabin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company/settings/payload-type"
                    className={pathname.startsWith("/company/settings/payload-type") ? "active" : ""}
                  >
                    Payload Type
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link
                to="/company/system-alerts"
                className={pathname.startsWith("/company/system-alerts") ? "active" : ""}
              >
                System Alerts
              </Link>
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
