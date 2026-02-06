'use client';

import { useState, useEffect, useMemo } from "react"
import { usersApi } from "../../api/usersApi"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"

export default function EditUserForm() {
  const { userId } = useParams()
  const [tab, setTab] = useState("profile")
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    position: "",
    layer: "",
    agentName: "",
    isSalesman: false,
    remarks: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [moduleAccess, setModuleAccess] = useState({})
  const [accessGroupsByModule, setAccessGroupsByModule] = useState({})
  const [accessGroupsLoading, setAccessGroupsLoading] = useState({})

  const modules = useMemo(
    () => [
      { code: "settings", name: "Settings" },
      { code: "administration", name: "Administration" },
      { code: "ship-trips", name: "Ship & Trips" },
      { code: "partners-management", name: "Partners Management" },
      { code: "sales-bookings", name: "Sales & Bookings" },
      { code: "checkin-boardings", name: "Check-in & Boardings" },
      { code: "finance", name: "Finance" },
    ],
    [],
  )

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData()
  }, [userId])

  // Fetch access groups for all modules after user data is loaded
  useEffect(() => {
    if (form.layer) {
      modules.forEach((module) => {
        fetchAccessGroups(module.code, form.layer)
      })
    }
  }, [form.layer, modules])

  const fetchAccessGroups = async (moduleCode, layer) => {
    try {
      setAccessGroupsLoading((prev) => ({ ...prev, [moduleCode]: true }))
      const response = await usersApi.getAccessGroupsByModuleLayer(moduleCode, layer)
      if (response.data) {
        setAccessGroupsByModule((prev) => ({
          ...prev,
          [moduleCode]: response.data.accessGroups || [],
        }))
      }
    } catch (err) {
      console.error(`Error fetching access groups for ${moduleCode}:`, err)
    } finally {
      setAccessGroupsLoading((prev) => ({ ...prev, [moduleCode]: false }))
    }
  }

  const fetchUserData = async () => {
    try {
      setInitialLoading(true)
      const response = await usersApi.getUserById(userId)
      if (response.data) {
        const user = response.data
        
        // Determine agent/partner name
        let agentName = ""
        if (user.agent && user.agent.name) {
          agentName = user.agent.name
        } else if (user.layer === "company") {
          agentName = "company"
        }
        
        setForm({
          fullName: user.fullName || "",
          email: user.email || "",
          position: user.position || "",
          layer: user.layer || "",
          agentName: agentName,
          isSalesman: user.isSalesman || false,
          remarks: user.remarks || "",
        })

        // Process module access from API response
        // moduleAccess comes as array: [{moduleCode, accessGroupId: {_id, groupName, ...}}, ...]
        // Convert to object format: {moduleCode: [accessGroupId._id], ...}
        if (user.moduleAccess && Array.isArray(user.moduleAccess)) {
          const moduleAccessMap = {}
          
          user.moduleAccess.forEach((access) => {
            if (access.moduleCode && access.accessGroupId) {
              // Store the access group ID (not the full object)
              if (!moduleAccessMap[access.moduleCode]) {
                moduleAccessMap[access.moduleCode] = []
              }
              moduleAccessMap[access.moduleCode].push(access.accessGroupId._id || access.accessGroupId)
            }
          })
          
          setModuleAccess(moduleAccessMap)
        } else {
          setModuleAccess({})
        }
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

  const onSelectAccess = (moduleCode, accessGroupId) => {
    setModuleAccess((prev) => ({
      ...prev,
      [moduleCode]: accessGroupId ? [accessGroupId] : [],
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      // Only send fullName, position, and moduleAccess in the payload
      const moduleAccessArray = []
      Object.entries(moduleAccess).forEach(([moduleCode, accessGroupIds]) => {
        const ids = Array.isArray(accessGroupIds) ? accessGroupIds : [accessGroupIds]
        ids.forEach((id) => {
          if (id) {
            moduleAccessArray.push({
              moduleCode,
              accessGroupId: id,
            })
          }
        })
      })

      const payload = {
        fullName: form.fullName,
        position: form.position,
        moduleAccess: moduleAccessArray,
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
        window.location.href = "/company/administration/user-list"
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

      <ul className="nav nav-tabs" id="userTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${tab === "profile" ? "active" : ""}`}
            onClick={() => setTab("profile")}
            role="tab"
            aria-selected={tab === "profile"}
          >
            User Profile
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${tab === "access" ? "active" : ""}`}
            onClick={() => setTab("access")}
            role="tab"
            aria-selected={tab === "access"}
          >
            Module Access
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3" id="userTabsContent">
        {/* User Profile Tab */}
        <div className={`tab-pane fade ${tab === "profile" ? "show active" : ""}`} id="profile" role="tabpanel">
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
                className="form-control"
                placeholder="Email Address"
                value={form.email}
                disabled
                readOnly
                style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
              />
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
            </div>

            {/* Partner Assignment - READ-ONLY */}
            <div className="col-md-6">
              <label className="form-label">Partner Assignment</label>
              <input
                type="text"
                className="form-control"
                value={form.agentName}
                disabled
                readOnly
                style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
              />
              {form.agentName && form.layer && (
                <div className="agent-info mt-2" style={{ paddingTop: "8px" }}>
                  <div>
                    <strong>Agent Type:</strong> <span>{form.layer.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  </div>
                  <div>
                    <strong>Organizational Layer:</strong> <span>{form.layer}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Fields Row */}
          <div className="row g-3 mt-2">

            {/* Is Salesman - READ-ONLY */}
            <div className="col-md-6">
              <label className="form-label">Is Salesman</label>
              <div>
                <label
                  className="status-toggle"
                  style={{ position: "relative", display: "inline-block", width: 50, height: 24, opacity: 0.6, cursor: "not-allowed" }}
                >
                  <input
                    type="checkbox"
                    checked={form.isSalesman}
                    disabled
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    className="slider"
                    style={{
                      position: "absolute",
                      cursor: "not-allowed",
                      inset: 0,
                      backgroundColor: form.isSalesman ? "#2575fc" : "#ccc",
                      transition: ".4s",
                      borderRadius: 24,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      height: 16,
                      width: 16,
                      left: form.isSalesman ? 30 : 4,
                      bottom: 4,
                      backgroundColor: "#fff",
                      transition: ".4s",
                      borderRadius: "50%",
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Remarks - READ-ONLY */}
            <div className="col-md-12">
              <label htmlFor="remarks" className="form-label">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows="3"
                className="form-control"
                placeholder="Additional remarks"
                value={form.remarks}
                disabled
                readOnly
                style={{ backgroundColor: "#e9ecef", color: "#6c757d" }}
              />
            </div>
          </div>
        </div>

        {/* Module Access Tab */}
        <div className={`tab-pane fade ${tab === "access" ? "show active" : ""}`} id="access" role="tabpanel">
          <div className="table-responsive mt-2">
            <table className="table table-bordered">
              <thead>
                <tr style={{ backgroundColor: "#001f4d", color: "#fff" }}>
                  <th style={{ color: "#fff" }}>Module</th>
                  <th style={{ color: "#fff" }}>Access Rights Group</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => {
                  const accessGroups = accessGroupsByModule[module.code] || []
                  const isLoading = accessGroupsLoading[module.code]
                  const selectedValues = moduleAccess[module.code] || []

                  return (
                    <tr key={module.code}>
                      <td>{module.name}</td>
                      <td>
                        <select
                          className="form-select"
                          value={selectedValues[0] || ""}
                          onChange={(e) => {
                            if (e.target.value) {
                              onSelectAccess(module.code, e.target.value)
                            } else {
                              onSelectAccess(module.code, "")
                            }
                          }}
                          disabled={isLoading}
                        >
                          <option value="">Select Role</option>
                          {accessGroups.length > 0 ? (
                            accessGroups.map((group) => (
                              <option key={group._id} value={group._id}>
                                {group.groupName}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              {isLoading ? "Loading..." : "No Groups Available"}
                            </option>
                          )}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-turquoise mt-4" disabled={loading}>
        {loading ? "Updating User..." : "Update User"}
      </button>
    </form>
  )
}
