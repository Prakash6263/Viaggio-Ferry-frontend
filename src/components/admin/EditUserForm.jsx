'use client';

import { useState, useEffect } from "react"
import { usersApi } from "../../api/usersApi"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"

export default function EditUserForm() {
  const { userId } = useParams()
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    position: "",
    layer: "",
    status: "",
    createdAt: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    try {
      setInitialLoading(true)
      const response = await usersApi.getUserById(userId)
      if (response.data) {
        const user = response.data
        setForm({
          fullName: user.fullName || "",
          email: user.email || "",
          position: user.position || "",
          layer: user.layer || "",
          status: user.status || "",
          createdAt: user.createdAt || "",
        })
        setError(null)
      }
    } catch (err) {
      console.error("Error fetching user:", err)
      setError(err.message || "Failed to load user data")
    } finally {
      setInitialLoading(false)
    }
  }

  const onChange = (e) => {
    const { name, value } = e.target
    // Only allow changes to fullName and position
    if (name === "fullName" || name === "position") {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      // Only send fullName and position in the payload
      const payload = {
        fullName: form.fullName,
        position: form.position,
      }

      // Confirmation dialog
      const result = await Swal.fire({
        title: "Confirm Update",
        text: `Are you sure you want to update user ${form.fullName}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2575fc",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "Cancel",
      })

      if (!result.isConfirmed) {
        setLoading(false)
        return
      }

      // Update user
      await usersApi.updateUser(userId, payload)

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      })

      setTimeout(() => {
        window.location.href = "/admin/administration/user-list"
      }, 2000)
    } catch (err) {
      console.error("Error updating user:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update user",
      })
      setError(err.message || "Failed to update user")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <style>{`
        .disabled-field {
          background-color: #e9ecef !important;
          cursor: not-allowed !important;
          color: #6c757d !important;
        }

        .disabled-field:focus {
          background-color: #e9ecef !important;
          color: #6c757d !important;
          border-color: #dee2e6 !important;
          box-shadow: none !important;
        }

        .disabled-field::placeholder {
          color: #6c757d;
        }

        .help-text {
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 0.25rem;
          display: block;
        }

        .editable-indicator {
          font-size: 0.75rem;
          color: #2575fc;
          font-weight: 600;
          margin-top: 0.25rem;
          display: block;
        }
      `}</style>

      <div className="row g-3">
        {/* Full Name - EDITABLE */}
        <div className="col-md-6">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-control"
            placeholder="Full Name"
            value={form.fullName}
            onChange={onChange}
            required
          />
          <span className="editable-indicator">
            <i className="bi bi-pencil"></i> Editable
          </span>
        </div>

        {/* Email - READ-ONLY */}
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control disabled-field"
            placeholder="Email Address"
            value={form.email}
            disabled
            readOnly
          />
          <span className="help-text">Only Name and Position can be edited</span>
        </div>

        {/* Position - EDITABLE */}
        <div className="col-md-6">
          <label htmlFor="position" className="form-label">
            Position
          </label>
          <input
            type="text"
            id="position"
            name="position"
            className="form-control"
            placeholder="Position"
            value={form.position}
            onChange={onChange}
          />
          <span className="editable-indicator">
            <i className="bi bi-pencil"></i> Editable
          </span>
        </div>

        {/* Layer - READ-ONLY */}
        <div className="col-md-6">
          <label htmlFor="layer" className="form-label">
            Layer
          </label>
          <input
            type="text"
            id="layer"
            name="layer"
            className="form-control disabled-field"
            placeholder="Layer"
            value={form.layer}
            disabled
            readOnly
          />
          <span className="help-text">Only Name and Position can be edited</span>
        </div>

        {/* Status - READ-ONLY */}
        <div className="col-md-6">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <input
            type="text"
            id="status"
            name="status"
            className="form-control disabled-field"
            placeholder="Status"
            value={form.status}
            disabled
            readOnly
          />
          <span className="help-text">Only Name and Position can be edited</span>
        </div>

        {/* Created Date - READ-ONLY */}
        <div className="col-md-6">
          <label htmlFor="createdAt" className="form-label">
            Created Date
          </label>
          <input
            type="text"
            id="createdAt"
            name="createdAt"
            className="form-control disabled-field"
            placeholder="Created Date"
            value={form.createdAt ? new Date(form.createdAt).toLocaleDateString() : ""}
            disabled
            readOnly
          />
          <span className="help-text">Only Name and Position can be edited</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Updating...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Update User
            </>
          )}
        </button>
        <a href="/admin/administration/user-list" className="btn btn-secondary ms-2">
          Cancel
        </a>
      </div>
    </form>
  )
}
