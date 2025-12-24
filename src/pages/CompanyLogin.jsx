"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginApi } from "../api/loginApi"
import "../styles/company-login.css"

export default function CompanyLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      const response = await loginApi.login(formData.email, formData.password)

      if (response.success) {
        // Navigate to dashboard after successful login
        navigate("/company/dashboard")
      } else {
        setError(response.message || "Login failed")
      }
    } catch (err) {
      setError(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    // Implement theme toggle logic here
  }

  return (
    <div className="company-login-wrapper">
      {/* Navbar */}
      {/* <nav className="navbar navbar-expand-lg navbar-light headback shadow-sm fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">
            <img src="/images/logo.png" alt="Logo" />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how">
                  How It Works
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
            <div className="d-flex flex-wrap">
              <a className="btn btn-turquoise px-2" href="/super-admin-login">
                Super Admin
              </a>
              <button className="btn btn-primary-navy ms-2">Request Demo</button>
              <button id="themeToggle" className="theme-toggle ms-2" title="Toggle Dark/Light" onClick={toggleTheme}>
                <i className="bi bi-moon-stars-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Login Form Section */}
      <section className="features py-5">
        <div className="container-lg">
          <div className="row g-4 justify-content-center">
            {/* Login Form Card */}
            <div className="col-lg-5">
              <div className="contact-card destination">
                <h4 className="fw-bold mb-3">Login to Company</h4>

                {/* Error Banner */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="text-end mb-3">
                    <a
                      href="/company-forgot-password"
                      className="text-decoration-none fw-500"
                      style={{ color: "#004aad" }}
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button type="submit" className="btn btn-primary-navy w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
