// import React from "react";
// import { Link } from "react-router-dom";
// import useSidebarToggle from "../../hooks/useSidebarToggle";
// import { useThemeToggle } from "../../hooks/useThemeToggle";
// import search from '../../assets/img/icons/search.svg';
// import logo from "../../logo.svg"
// import avatar from '../../assets/img/profiles/avatar-07.jpg';
// export default function Header() {
//   useSidebarToggle();   // wires #toggle_btn + #mobile_btn
//   useThemeToggle();     // wires #themeToggle

//   return (
//     <div className="header header-one">
//       {/* device logo (only shows on lg-none like HTML) */}
//       <Link
//         to="/dashboard"
//         className="d-inline-flex d-sm-inline-flex align-items-center d-md-inline-flex d-lg-none align-items-center device-logo"
//       >
//         <img
//           src={logo}
//           className="img-fluid logo2"
//           alt="Logo"
//           style={{ width: 60 }}
//         />
//       </Link>

//       {/* main text logo (Admin) */}
//       <div className="main-logo d-inline float-start d-lg-flex align-items-center d-none d-sm-none d-md-none">
//         <div className="logo-color">
//           <Link to="/dashboard">
//             <h4 className="img-fluid logo-blue text-white fw-bold">Admin</h4>
//           </Link>
//           <Link to="/dashboard">
//             <h4 className="img-fluid logo-small"></h4>
//           </Link>
//         </div>
//       </div>

//       {/* Sidebar Toggle */}
//       <a href="javascript:void(0);" id="toggle_btn">
//         <span className="toggle-bars">
//           <span className="bar-icons"></span>
//           <span className="bar-icons"></span>
//           <span className="bar-icons"></span>
//           <span className="bar-icons"></span>
//         </span>
//       </a>

//       {/* Search */}
//       <div className="top-nav-search">
//         <form onSubmit={(e) => e.preventDefault()}>
//           <input type="text" className="form-control" placeholder="Search here" />
//           <button className="btn" type="submit">
//             <img src={search} alt="img" />
//           </button>
//         </form>
//       </div>

//       {/* Mobile Menu Toggle */}
//       <a className="mobile_btn" id="mobile_btn">
//         <i className="fas fa-bars"></i>
//       </a>

//       {/* Header Menu (right) */}
//       <ul className="nav nav-tabs user-menu">
//         <li className="nav-item">
//           <a href="/" className="text-decoration-none">
//             <span className="btn btn-turquoise"><strong>Visit Site</strong></span>
//           </a>
//         </li>

//         {/* User Menu */}
//         <li className="nav-item dropdown">
//           <a href="javascript:void(0)" className="user-link nav-link" data-bs-toggle="dropdown">
//             <span className="user-img">
//               <img src={avatar} alt="img" className="profilesidebar" />
//               <span className="animate-circle"></span>
//             </span>
//             <span className="user-content">
//               <span className="user-details">Admin</span>
//               <span className="user-name">John Smith</span>
//             </span>
//           </a>
//           <div className="dropdown-menu menu-drop-user">
//             <div className="profilemenu">
//               <div className="subscription-logout">
//                 <ul>
//                   <li className="pb-0">
//                     <Link className="dropdown-item" to="/company/login">Log Out</Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </li>

//         {/* Theme toggle exactly like HTML */}
//         <li className="nav-item">
//           <button id="themeToggle" className="theme-toggle" title="Toggle Dark/Light" style={{ border: "none" }}>
//             <i className="bi bi-moon-stars-fill"></i>
//           </button>
//         </li>
//       </ul>
//     </div>
//   );
// }




"use client"

import { Link, useNavigate } from "react-router-dom"
import useSidebarToggle from "../../hooks/useSidebarToggle"
import { useThemeToggle } from "../../hooks/useThemeToggle"
import { loginApi } from "../../api/loginApi"
import search from "../../assets/img/icons/search.svg"
import logo from "../../logo.svg"
import avatar from "../../assets/img/profiles/avatar-07.jpg"

export default function Header() {
  const navigate = useNavigate()
  useSidebarToggle()
  useThemeToggle()

  const handleLogout = () => {
    loginApi.logout()
    navigate("/company-login", { replace: true })
  }

  const handleToggleBtnClick = (e) => {
    e.preventDefault()
  }

  return (
    <div className="header header-one">
      <Link
        to="/dashboard"
        className="d-inline-flex d-sm-inline-flex align-items-center d-md-inline-flex d-lg-none align-items-center device-logo"
      >
        <img src={logo || "/placeholder.svg"} className="img-fluid logo2" alt="Logo" style={{ width: 60 }} />
      </Link>

      <div className="main-logo d-inline float-start d-lg-flex align-items-center d-none d-sm-none d-md-none">
        <div className="logo-color">
          <Link to="/dashboard">
            <h4 className="img-fluid logo-blue text-white fw-bold">Admin</h4>
          </Link>
          <Link to="/dashboard">
            <h4 className="img-fluid logo-small"></h4>
          </Link>
        </div>
      </div>

      <a href="#" id="toggle_btn" onClick={handleToggleBtnClick}>
        <span className="toggle-bars">
          <span className="bar-icons"></span>
          <span className="bar-icons"></span>
          <span className="bar-icons"></span>
          <span className="bar-icons"></span>
        </span>
      </a>

      <div className="top-nav-search">
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" className="form-control" placeholder="Search here" />
          <button className="btn" type="submit">
            <img src={search || "/placeholder.svg"} alt="img" />
          </button>
        </form>
      </div>

      <a className="mobile_btn" id="mobile_btn">
        <i className="fas fa-bars"></i>
      </a>

      <ul className="nav nav-tabs user-menu">
        <li className="nav-item">
          <a href="https://voyagian.com" className="text-decoration-none">
            <span className="btn btn-turquoise">
              <strong>Visit Site</strong>
            </span>
          </a>
        </li>

        <li className="nav-item dropdown">
          <a href="#" className="user-link nav-link" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
            <span className="user-img">
              <img src={avatar || "/placeholder.svg"} alt="img" className="profilesidebar" />
              <span className="animate-circle"></span>
            </span>
            <span className="user-content">
              <span className="user-details">Admin</span>
              <span className="user-name">John Smith</span>
            </span>
          </a>
          <div className="dropdown-menu menu-drop-user">
            <div className="profilemenu">
              <div className="subscription-logout">
                <ul>
                  <li className="pb-0">
                    <a
                      href="#"
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >
                      Log Out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>

        <li className="nav-item">
          <button id="themeToggle" className="theme-toggle" title="Toggle Dark/Light" style={{ border: "none" }}>
            <i className="bi bi-moon-stars-fill"></i>
          </button>
        </li>
      </ul>
    </div>
  )
}
