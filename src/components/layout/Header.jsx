"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useSidebarToggle from "../../hooks/useSidebarToggle"
import { useThemeToggle } from "../../hooks/useThemeToggle"
import { loginApi } from "../../api/loginApi"
import { usersApi } from "../../api/usersApi"
import { companyApi } from "../../api/companyapi"
import { useSidebar } from "../../context/SidebarContext"
import { useCompanyProfile } from "../../context/CompanyProfileContext"
import UserProfileModal from "../UserProfileModal"
import search from "../../assets/img/icons/search.svg"
import logo from "../../logo.svg"
import avatar from "../../assets/img/profiles/avatar-07.jpg"

// const API_BASE_URL ="http://localhost:3001"
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"

// Helper function to decode JWT and get role
const getLoginRoleFromToken = () => {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return null

    const decoded = JSON.parse(atob(token.split(".")[1]))
    // Try multiple field names that backend might use
    return decoded.role || decoded.userType || decoded.layer || decoded.type || decoded.accountType
  } catch (error) {
    console.error("[v0] Error decoding token:", error)
    return null
  }
}

export default function Header() {
  const navigate = useNavigate()
  const { user: sidebarUser, clearSidebar } = useSidebar()
  const { companyProfile } = useCompanyProfile()
  useSidebarToggle()
  useThemeToggle()

  const [userProfile, setUserProfile] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [loginRole, setLoginRole] = useState(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(false)

  // Determine login role from JWT token
  useEffect(() => {
    const role = getLoginRoleFromToken()
    setLoginRole(role)
  }, [])

  // Load user or company profile based on login role
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingProfile(true)

        if (loginRole === "user") {
          const response = await usersApi.getCurrentProfile()
          if (response.success && response.data) {
            setUserProfile(response.data)
          }
        } else if (loginRole === "company") {
          const response = await companyApi.getCompanyProfile()
          if (response.data) {
            setCompanyData(response.data)
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching profile data:", error)
      } finally {
        setLoadingProfile(false)
      }
    }

    if (loginRole) {
      fetchProfileData()
    }
  }, [loginRole])

  useEffect(() => {
    // Check if company profile is inactive and logout
    if (companyProfile && companyProfile.isActive === false) {
      clearSidebar()
      loginApi.logout()
      navigate("/company-login", { replace: true })
    }
  }, [companyProfile, clearSidebar, navigate])

  const handleLogout = () => {
    clearSidebar()
    loginApi.logout()
    navigate("/company-login", { replace: true })
  }

  const handleToggleBtnClick = (e) => {
    e.preventDefault()
  }

  const handleVisitSite = (e) => {
    e.preventDefault()
    const token = loginApi.getToken()
    
    if (!token) {
      console.error("[v0] No token found")
      return
    }

    let websiteUrl = null

    // Determine website URL based on user role
    if (isUserLogin && userProfile?.company?.website) {
      // For user login: Get website from company object within userProfile
      websiteUrl = userProfile.company.website
    } else if (isCompanyLogin && companyData?.website) {
      // For company login: Get website directly from companyData
      websiteUrl = companyData.website
    }

    if (websiteUrl) {
      // Add token as query parameter
      const separator = websiteUrl.includes("?") ? "&" : "?"
      const urlWithToken = `${websiteUrl}${separator}token=${encodeURIComponent(token)}`
      window.open(urlWithToken, "_blank")
    } else {
      console.warn("[v0] No website URL found for this user/company")
    }
  }

  // Determine what to display based on login role
  const isUserLogin = loginRole === "user"
  const isCompanyLogin = loginRole === "company"

  // Get company data for header (either from userProfile.company or directly from companyData)
  let headerCompanyName = null
  let headerCompanyLogo = null
  
  if (isUserLogin && userProfile) {
    // For user login: Show company name from nested company object in userProfile
    headerCompanyName = userProfile.company?.companyName
    headerCompanyLogo = userProfile.company?.logoUrl
  } else if (isCompanyLogin && companyData) {
    // For company login: Show company name from company data
    headerCompanyName = companyData.companyName
    headerCompanyLogo = companyData.logoUrl
  }

  // Get user/admin data for right side of header
  let profileName = null
  let profileImage = null
  let displayLabel = null
  
  if (isUserLogin && userProfile) {
    profileName = userProfile.fullName
    profileImage = userProfile.profileImage
    displayLabel = "User"
  } else if (isCompanyLogin && companyData) {
    profileName = companyData.companyName
    profileImage = companyData.adminProfileImage
    displayLabel = "Admin"
  }

  const profileImageUrl = profileImage ? `${API_BASE_URL}${profileImage}` : null
  const companyLogoUrl = headerCompanyLogo ? `${API_BASE_URL}${headerCompanyLogo}` : null

  return (
    <div className="header header-one">
      <Link
        to="/dashboard"
        className="d-inline-flex d-sm-inline-flex align-items-center d-md-inline-flex d-lg-none align-items-center device-logo"
      >
        <img
          src={companyLogoUrl || logo || "/placeholder.svg"}
          className="img-fluid logo2"
          alt={headerCompanyName || "Logo"}
          style={{ width: 60, borderRadius: 4 }}
        />
      </Link>

      <div className="main-logo d-inline float-start d-lg-flex align-items-center d-none d-sm-none d-md-none">
        <div className="logo-color">
          <Link to="/dashboard" className="d-flex align-items-center gap-2">
            {companyLogoUrl && (
              <img
                src={companyLogoUrl || "/placeholder.svg"}
                alt={headerCompanyName || "Company Logo"}
                style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 4 }}
              />
            )}
            <h4 className="img-fluid logo-blue text-white fw-bold mb-0">{headerCompanyName || "Company"}</h4>
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
          <a
            href={companyProfile?.website || "https://voyagian.com/company-site"}
            className="text-decoration-none"
            onClick={handleVisitSite}
          >
            <span className="btn btn-turquoise">
              <strong>Visit Site</strong>
            </span>
          </a>
        </li>

        {/* User Menu */}
        <li className="nav-item dropdown">
          <a 
            href="#" 
            className="user-link nav-link" 
            onClick={(e) => {
              e.preventDefault()
              // For user login, open profile modal instead of dropdown
              if (isUserLogin && !isCompanyLogin) {
                setIsProfileModalOpen(true)
              }
            }}
            data-bs-toggle={isCompanyLogin ? "dropdown" : undefined}
            style={{ cursor: "pointer" }}
          >
            <span className="user-img">
              <img
                src={profileImageUrl || avatar}
                alt={profileName || "Profile"}
                className="profilesidebar"
                onError={(e) => {
                  e.currentTarget.src = avatar
                }}
              />

              <span className="animate-circle"></span>
            </span>
            <span className="user-content">
              <span className="user-details">{displayLabel}</span>
              <span className="user-name">{profileName || "User"}</span>
            </span>
          </a>
          {isCompanyLogin && (
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
          )}
        </li>

        {/* Theme toggle exactly like HTML */}
        <li className="nav-item">
          <button id="themeToggle" className="theme-toggle" title="Toggle Dark/Light" style={{ border: "none" }}>
            <i className="bi bi-moon-stars-fill"></i>
          </button>
        </li>
      </ul>

      {/* User Profile Modal - Show for user login */}
      {isUserLogin && !isCompanyLogin && (
        <UserProfileModal
          user={userProfile || companyProfile}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false)
          }}
          onSuccess={() => {
            // Refresh user profile after successful update
            const fetchUserProfile = async () => {
              try {
                const response = await usersApi.getCurrentProfile()
                if (response.success && response.data) {
                  setUserProfile(response.data)
                }
              } catch (error) {
                console.error("Error fetching user profile:", error)
              }
            }
            fetchUserProfile()
          }}
        />
      )}

      {/* Logout Modal for User - Show as modal with profile info */}
      {isUserLogin && !isCompanyLogin && isProfileModalOpen && (
        <>
          {/* Modal backdrop with logout button */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "transparent",
              zIndex: 1040,
            }}
            onClick={() => setIsProfileModalOpen(false)}
          ></div>
        </>
      )}
    </div>
  )
}
