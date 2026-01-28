'use client';

import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { usersApi } from "../api/usersApi"
import { loginApi } from "../api/loginApi"
import { useSidebar } from "../context/SidebarContext"
import Swal from "sweetalert2"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"

export default function UserProfileModal({ user, isOpen, onClose, onSuccess }) {
  const navigate = useNavigate()
  const { clearSidebar } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    email: "",
    profileImage: null,
    profileImagePreview: null,
  })
  const fileInputRef = useRef(null)

  // Fetch user profile data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen])

  const fetchUserProfile = async () => {
    try {
      setFetching(true)
      const response = await usersApi.getCurrentProfile()
      
      if (response.success && response.data) {
        const userProfile = response.data
        setUserData(userProfile)
        setFormData({
          fullName: userProfile.fullName || "",
          position: userProfile.position || "",
          email: userProfile.email || "",
          profileImage: null,
          profileImagePreview: userProfile.profileImage ? `${API_BASE_URL}${userProfile.profileImage}` : null,
        })
      } else {
        console.error("[v0] Failed to fetch user profile:", response.message)
      }
    } catch (error) {
      console.error("[v0] Error fetching user profile:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load profile data",
      })
    } finally {
      setFetching(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null,
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Confirm Logout",
      text: "Are you sure you want to log out?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      clearSidebar()
      loginApi.logout()
      navigate("/company-login", { replace: true })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const submitFormData = new FormData()
      submitFormData.append("fullName", formData.fullName)
      submitFormData.append("position", formData.position)
      if (formData.profileImage) {
        submitFormData.append("profileImage", formData.profileImage)
      }

      const response = await usersApi.updateProfile(submitFormData)

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: response.message,
          timer: 2000,
        })
        onSuccess?.()
        onClose()
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message || "Failed to update profile",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update profile",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {fetching ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Profile Image */}
                  <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <div className="text-center mb-3">
                      <img
                        src={formData.profileImagePreview || "https://via.placeholder.com/150"}
                        alt="Profile Preview"
                        style={{
                          width: "120px",
                          height: "120px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #ddd",
                        }}
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                    {formData.profileImage && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger mt-2"
                        onClick={handleRemoveImage}
                        disabled={loading}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Position - Read Only */}
                  <div className="mb-3">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      name="position"
                      className="form-control"
                      value={formData.position}
                      disabled
                      title="Position is read-only"
                    />
                    <small className="text-muted">This field is read-only</small>
                  </div>

                  {/* Email - Read Only */}
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      disabled
                      title="Email is read-only"
                    />
                    <small className="text-muted">This field is read-only</small>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
                disabled={loading || fetching}
              >
                Logout
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading || fetching}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || fetching}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
