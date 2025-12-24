"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { forgotPasswordApi } from "../api/forgotPasswordApi"
import "../styles/company-login.css"

export default function CompanyForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // Step 1: Email, Step 2: OTP & Password
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      if (!email) {
        setError("Please enter your email address")
        setLoading(false)
        return
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address")
        setLoading(false)
        return
      }

      const response = await forgotPasswordApi.sendOTP(email)

      if (response.success) {
        setSuccessMessage("OTP has been sent to your email. Please check your inbox.")
        setStep(2)
      } else {
        setError(response.message || "Failed to send OTP")
      }
    } catch (err) {
      setError(err.message || "An error occurred while sending OTP")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      if (!otp || !newPassword || !confirmPassword) {
        setError("Please fill in all fields")
        setLoading(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match")
        setLoading(false)
        return
      }

      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long")
        setLoading(false)
        return
      }

      const response = await forgotPasswordApi.resetPassword(email, otp, newPassword)

      if (response.success) {
        setSuccessMessage("Password reset successfully! Redirecting to login...")
        setTimeout(() => {
          navigate("/company-login")
        }, 2000)
      } else {
        setError(response.message || "Failed to reset password")
      }
    } catch (err) {
      setError(err.message || "An error occurred while resetting password")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/company-login")
  }

  return (
    <div className="company-login-wrapper">
      {/* Forgot Password Form Section */}
      <section className="features py-5">
        <div className="container-lg">
          <div className="row g-4 justify-content-center">
            {/* Forgot Password Card */}
            <div className="col-lg-5">
              <div className="contact-card destination">
                <h4 className="fw-bold mb-3">{step === 1 ? "Forgot Password" : "Reset Password"}</h4>

                {/* Error Banner */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
                  </div>
                )}

                {/* Step 1: Send OTP */}
                {step === 1 && (
                  <form onSubmit={handleSendOTP}>
                    <p className="text-muted mb-4">
                      Enter your email address and we'll send you an OTP to reset your password.
                    </p>

                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError("")
                        }}
                        disabled={loading}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary-navy w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>

                    <button type="button" className="btn btn-outline-secondary w-100 mt-3" onClick={handleBackToLogin}>
                      Back to Login
                    </button>
                  </form>
                )}

                {/* Step 2: Reset Password */}
                {step === 2 && (
                  <form onSubmit={handleResetPassword}>
                    <p className="text-muted mb-4">Enter the OTP sent to your email and create a new password.</p>

                    <div className="mb-3">
                      <label className="form-label">OTP</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value)
                          if (error) setError("")
                        }}
                        disabled={loading}
                        maxLength="6"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value)
                            if (error) setError("")
                          }}
                          disabled={loading}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          if (error) setError("")
                        }}
                        disabled={loading}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary-navy w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Resetting Password...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-3"
                      onClick={() => {
                        setStep(1)
                        setOtp("")
                        setNewPassword("")
                        setConfirmPassword("")
                        setError("")
                        setSuccessMessage("")
                      }}
                    >
                      Back to Email
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
