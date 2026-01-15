"use client"

import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import { accessGroupsApi } from "../api/accessGroupsApi"
import Swal from "sweetalert2"
import { CirclesWithBar } from "react-loader-spinner"

const moduleSubmodules = {
  settings: [
    { name: "Company Profile", code: "company-profile", permissions: ["Read", "Write", "Edit"] },
    { name: "Roles & Permissions", code: "roles-permissions", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Load Types", code: "load-types", permissions: ["Read", "Write", "Edit", "Delete"] },
    {
      name: "Partners Classifications",
      code: "partners-classifications",
      permissions: ["Read", "Write", "Edit", "Delete"],
    },
    { name: "Ports", code: "ports", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Cabins", code: "cabins", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Payload Type", code: "payload-type", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  administration: [
    { name: "Users", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Currency", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Taxes", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Promotions", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Contact Messages", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Term & Conditions", permissions: ["Read", "Write", "Edit"] },
  ],
  "ship-trips": [
    { name: "Ships", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Trips", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  "partners-management": [
    { name: "Business Partners", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Service Partners", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Salesmen", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Markup & Discount Board", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Commission Board", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  "sales-bookings": [
    { name: "Price List", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Ticketing Rules", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Bookings & Tickets", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Excess Baggage Tickets", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  "checkin-boardings": [
    { name: "Passenger Checking In", permissions: ["Read", "Write"] },
    { name: "Cargo Checking In", permissions: ["Read", "Write"] },
    { name: "Vehicle Checking In", permissions: ["Read", "Write"] },
    { name: "Passenger Boarding", permissions: ["Read", "Write"] },
    { name: "Vehicle Boarding", permissions: ["Read", "Write"] },
    { name: "Trip Completion & Closure", permissions: ["Read", "Write"] },
  ],
  finance: [
    { name: "Chart of Accounts", code: "chart-of-accounts", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Bank & Cash Accounts", code: "bank-cash-accounts", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Journal Entries", code: "journal-entries", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Agent Top up Deposits", code: "agent-topup-deposits", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Payments & Receipts", code: "payments-receipts", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "General Ledger", code: "general-ledger", permissions: ["Read"] },
    { name: "Trial Balance", code: "trial-balance", permissions: ["Read"] },
    { name: "Income Statement", code: "income-statement", permissions: ["Read"] },
    { name: "Balance Sheet", code: "balance-sheet", permissions: ["Read"] },
  ],
  website: [
    {
      name: "Issue Passenger Tickets",
      code: "issue-passenger-tickets",
      permissions: ["Read", "Write", "Edit", "Delete"],
    },
    {
      name: "Issue Cargo Bills",
      code: "issue-cargo-bills",
      permissions: ["Read", "Write", "Edit", "Delete"],
    },
    {
      name: "Issue Vehicles Tickets",
      code: "issue-vehicle-tickets",
      permissions: ["Read", "Write", "Edit", "Delete"],
    },
  ],
}

export default function AddGroupPermission() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const groupIdFromUrl = queryParams.get("id")

  const [groupName, setGroupName] = useState("")
  const [groupCode, setGroupCode] = useState("")
  const [moduleName, setModuleName] = useState("")
  const [layer, setLayer] = useState("")
  const [status, setStatus] = useState(true) // true = Active
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPermissions, setSelectedPermissions] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [groupId, setGroupId] = useState(null)

  useEffect(() => {
    if (groupIdFromUrl) {
      loadGroupData(groupIdFromUrl)
    }
  }, [groupIdFromUrl])

  const loadGroupData = async (id) => {
    try {
      setLoading(true)
      const response = await accessGroupsApi.getAccessGroupById(id)
      const group = response.data

      setGroupId(group._id)
      setGroupName(group.groupName)
      setGroupCode(group.groupCode)
      setModuleName(group.moduleCode)
      setLayer(group.layer)
      setStatus(group.isActive)
      setIsEditMode(true)

      // Convert permissions array to selected format
      const permMap = {}
      group.permissions.forEach((perm) => {
        const key = perm.submoduleCode
        permMap[key] = {
          canRead: perm.canRead || false,
          canWrite: perm.canWrite || false,
          canEdit: perm.canEdit || false,
          canDelete: perm.canDelete || false,
        }
      })
      setSelectedPermissions(permMap)
      setError(null)
    } catch (err) {
      setError("Failed to load group data: " + err.message)
      console.error("Error loading group:", err)
    } finally {
      setLoading(false)
    }
  }

  const submodules = useMemo(() => (moduleName ? moduleSubmodules[moduleName] || [] : []), [moduleName])

  const handlePermissionChange = (submoduleCode, permissionType) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [submoduleCode]: {
        ...prev[submoduleCode],
        [permissionType]: !prev[submoduleCode]?.[permissionType],
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!groupName || !groupCode || !moduleName || !layer) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "warning",
      })
      return
    }

    try {
      setSaving(true)

      // Build permissions array from selected permissions
      const permissions = Object.entries(selectedPermissions).map(([submoduleCode, perms]) => ({
        submoduleCode,
        canRead: perms.canRead || false,
        canWrite: perms.canWrite || false,
        canEdit: perms.canEdit || false,
        canDelete: perms.canDelete || false,
      }))

      const groupData = {
        groupName,
        groupCode,
        moduleCode: moduleName,
        layer,
        isActive: status,
        permissions,
      }

      if (isEditMode && groupId) {
        // Update existing group
        await accessGroupsApi.updateAccessGroup(groupId, groupData)
        Swal.fire({
          title: "Success!",
          text: "Access group updated successfully",
          icon: "success",
          timer: 1500,
        })
      } else {
        // Create new group
        await accessGroupsApi.createAccessGroup(groupData)
        Swal.fire({
          title: "Success!",
          text: "Access group created successfully",
          icon: "success",
          timer: 1500,
        })
      }

      // Navigate back to list
      setTimeout(() => {
        window.location.href = "/company/settings/role-permission"
      }, 500)
    } catch (err) {
      setError("Failed to save access group: " + err.message)
      Swal.fire({
        title: "Error!",
        text: "Failed to save access group: " + err.message,
        icon: "error",
      })
      console.error("Error saving group:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <Link to="/company/settings/role-permission" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <h5 className="mb-3">{isEditMode ? "Edit Access Rights Group" : "Add New Access Rights Group"}</h5>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                  )}

                  {loading && (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                      <CirclesWithBar
                        height="100"
                        width="100"
                        color="#05468f"
                        outerCircleColor="#05468f"
                        innerCircleColor="#05468f"
                        barColor="#05468f"
                        ariaLabel="circles-with-bar-loading"
                        visible={true}
                      />
                    </div>
                  )}

                  {!loading && (
                    <form id="groupForm" onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="groupName" className="form-label">
                            Group Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="groupName"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="groupCode" className="form-label">
                            Group Code <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="groupCode"
                            placeholder="Enter group code"
                            value={groupCode}
                            onChange={(e) => setGroupCode(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label htmlFor="moduleName" className="form-label">
                            Module Name <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="moduleName"
                            value={moduleName}
                            onChange={(e) => {
                              setModuleName(e.target.value)
                              setSelectedPermissions({})
                            }}
                            required
                          >
                            <option value="">Select Module</option>
                            <option value="settings">Settings</option>
                            <option value="administration">Administration</option>
                            <option value="ship-trips">Ship & Trips</option>
                            <option value="partners-management">Partners Management</option>
                            <option value="sales-bookings">Sales & Bookings</option>
                            <option value="checkin-boardings">Checkin & Boardings</option>
                            <option value="finance">Finance</option>
                            <option value="website">Website</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="layer" className="form-label">
                            Layer <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            id="layer"
                            value={layer}
                            onChange={(e) => setLayer(e.target.value)}
                            required
                          >
                            <option value="">Select Layer</option>
                            <option value="company">Company</option>
                            <option value="marine-agent">Marine Agent</option>
                            <option value="commercial-agent">Commercial Agent</option>
                            <option value="selling-agent">Selling Agent</option>
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Status</label>
                          <div>
                            <label className="status-toggle">
                              <input
                                type="checkbox"
                                id="status"
                                checked={status}
                                onChange={(e) => setStatus(e.target.checked)}
                              />
                              <span className="slider"></span>
                            </label>
                            <span className="ms-2">{status ? "Active" : "Inactive"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <h6 className="mb-3">Submodules Permissions</h6>
                        <div id="permissionsContainer">
                          {moduleName && submodules.length > 0 ? (
                            <div className="module-actions">
                              <table className="table submodule-table">
                                <thead>
                                  <tr>
                                    <th>Submodule</th>
                                    <th>Read</th>
                                    <th>Write</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {submodules.map((submodule) => {
                                    const submoduleKey = submodule.code
                                    const hasRead = submodule.permissions.includes("Read")
                                    const hasWrite = submodule.permissions.includes("Write")
                                    const hasEdit = submodule.permissions.includes("Edit")
                                    const hasDelete = submodule.permissions.includes("Delete")

                                    const selected = selectedPermissions[submoduleKey] || {
                                      canRead: false,
                                      canWrite: false,
                                      canEdit: false,
                                      canDelete: false,
                                    }

                                    return (
                                      <tr key={submoduleKey}>
                                        <td className="submodule-name">{submodule.name}</td>

                                        {/* Read */}
                                        <td className="permission-cell">
                                          {hasRead ? (
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`${submoduleKey}-read`}
                                                checked={selected.canRead || false}
                                                onChange={() => handlePermissionChange(submoduleKey, "canRead")}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`${submoduleKey}-read`}
                                              ></label>
                                            </div>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>

                                        {/* Write */}
                                        <td className="permission-cell">
                                          {hasWrite ? (
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`${submoduleKey}-write`}
                                                checked={selected.canWrite || false}
                                                onChange={() => handlePermissionChange(submoduleKey, "canWrite")}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`${submoduleKey}-write`}
                                              ></label>
                                            </div>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>

                                        {/* Edit */}
                                        <td className="permission-cell">
                                          {hasEdit ? (
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`${submoduleKey}-edit`}
                                                checked={selected.canEdit || false}
                                                onChange={() => handlePermissionChange(submoduleKey, "canEdit")}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`${submoduleKey}-edit`}
                                              ></label>
                                            </div>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>

                                        {/* Delete */}
                                        <td className="permission-cell">
                                          {hasDelete ? (
                                            <div className="form-check">
                                              <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`${submoduleKey}-delete`}
                                                checked={selected.canDelete || false}
                                                onChange={() => handlePermissionChange(submoduleKey, "canDelete")}
                                              />
                                              <label
                                                className="form-check-label"
                                                htmlFor={`${submoduleKey}-delete`}
                                              ></label>
                                            </div>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="empty-state">
                              <i className="bi bi-folder2-open text-primary"></i>
                              <p>Select a module to view and configure submodule permissions</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-end mt-3">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => {
                            window.location.href = "/company/settings/role-permission"
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn btn-turquoise" disabled={saving}>
                          {saving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
