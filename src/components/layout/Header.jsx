"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useSidebarToggle from "../../hooks/useSidebarToggle"
import { useThemeToggle } from "../../hooks/useThemeToggle"
import { loginApi } from "../../api/loginApi"
import search from "../../assets/img/icons/search.svg"
import logo from "../../logo.svg"
import avatar from "../../assets/img/profiles/avatar-07.jpg"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"

export default function Header() {
  const navigate = useNavigate()
  useSidebarToggle()
  useThemeToggle()

  const [companyProfile, setCompanyProfile] = useState(null)

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await loginApi.getCompanyProfile()
        if (response.success && response.data) {
          if (response.data.isActive === false) {
            loginApi.logout()
            navigate("/company-login", { replace: true })
            return
          }
          setCompanyProfile(response.data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch company profile:", error)
      }
    }

    if (loginApi.isAuthenticated()) {
      fetchCompanyProfile()
    }
  }, [navigate])

  const handleLogout = () => {
    loginApi.logout()
    navigate("/company-login", { replace: true })
  }

  const handleToggleBtnClick = (e) => {
    e.preventDefault()
  }

  const companyLogoUrl = companyProfile?.logoUrl ? `${API_BASE_URL}${companyProfile.logoUrl}` : null

  return (
    <div className="header header-one">
      <Link
        to="/dashboard"
        className="d-inline-flex d-sm-inline-flex align-items-center d-md-inline-flex d-lg-none align-items-center device-logo"
      >
        <img
          src={companyLogoUrl || logo || "/placeholder.svg"}
          className="img-fluid logo2"
          alt={companyProfile?.companyName || "Logo"}
          style={{ width: 60 }}
        />
      </Link>

      <div className="main-logo d-inline float-start d-lg-flex align-items-center d-none d-sm-none d-md-none">
        <div className="logo-color">
          <Link to="/dashboard" className="d-flex align-items-center gap-2">
            {companyLogoUrl && (
              <img
                src={companyLogoUrl || "/placeholder.svg"}
                alt={companyProfile?.companyName || "Logo"}
                style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 4 }}
              />
            )}
            <h4 className="img-fluid logo-blue text-white fw-bold mb-0">{companyProfile?.companyName || "Admin"}</h4>
          </Link>
          <Link to="/dashboard">
            <h4 className="img-fluid logo-small"></h4>
          </Link>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <a href="#" id="toggle_btn" onClick={handleToggleBtnClick}>
        <span className="toggle-bars">
          <span className="bar-icons"></span>
          <span className="bar-icons"></span>
          <span className="bar-icons"></span>
          <span className="bar-icons"></span>
        </span>
      </a>

      {/* Search */}
      <div className="top-nav-search">
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" className="form-control" placeholder="Search here" />
          <button className="btn" type="submit">
            <img src={search || "/placeholder.svg"} alt="img" />
          </button>
        </form>
      </div>

      {/* Mobile Menu Toggle */}
      <a className="mobile_btn" id="mobile_btn">
        <i className="fas fa-bars"></i>
      </a>

      {/* Header Menu (right) */}
      <ul className="nav nav-tabs user-menu">
        <li className="nav-item">
          <a href="https://voyagian.com/company-site" className="text-decoration-none">
            <span className="btn btn-turquoise">
              <strong>Visit Site</strong>
            </span>
          </a>
        </li>

        {/* User Menu */}
        <li className="nav-item dropdown">
          <a href="#" className="user-link nav-link" data-bs-toggle="dropdown" onClick={(e) => e.preventDefault()}>
            <span className="user-img">
              <img
                src={companyLogoUrl || avatar || "/placeholder.svg"}
                alt={companyProfile?.companyName || "img"}
                className="profilesidebar"
              />
              <span className="animate-circle"></span>
            </span>
            <span className="user-content">
              <span className="user-details">Admin</span>
              <span className="user-name">{companyProfile?.companyName || "Company"}</span>
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

        {/* Theme toggle exactly like HTML */}
        <li className="nav-item">
          <button id="themeToggle" className="theme-toggle" title="Toggle Dark/Light" style={{ border: "none" }}>
            <i className="bi bi-moon-stars-fill"></i>
          </button>
        </li>
      </ul>
    </div>
  )
}
