"use client"

import { useMemo, useState, useEffect } from "react"
import { partnerApi } from "../../api/partnerApi"
import { usersApi } from "../../api/usersApi"
import { loginApi } from "../../api/loginApi"
import { useParams } from "react-router-dom"
import Swal from "sweetalert2"
import Can from "../Can"

export default function EditUserForm({ userId: propUserId }) {
  const { userId: paramUserId } = useParams()
  const userId = propUserId || paramUserId
  const [tab, setTab] = useState("profile")
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    position: "",
    partnerId: null,
    isSalesman: false,
    remarks: "",
  })

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [partners, setPartners] = useState([])
  const [partnersLoading, setPartnersLoading] = useState(false)
  const [currentCompany, setCurrentCompany] = useState(null)

  const [moduleAccess, setModuleAccess] = useState({})
  const [accessGroupsByModule, setAccessGroupsByModule] = useState({})
  const [accessGroupsLoading, setAccessGroupsLoading] = useState({})
  const [loadedAccessGroups, setLoadedAccessGroups] = useState({})

  // ---- CONSTANTS
  const agentLayerMap = useMemo(
    () => ({
      company: { type: "Company", layer: "company" },
      "marine-agent": { type: "Marine Agent", layer: "marine-agent" },
      "commercial-agent": { type: "Commercial Agent", layer: "commercial-agent" },
      "selling-agent": { type: "Selling Agent", layer: "selling-agent" },
    }),
    [],
  )

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

  useEffect(() => {
    fetchCurrentCompany()
    fetchPartners()
    fetchUserData()
  }, [userId])

  const fetchCurrentCompany = async () => {
    try {
      const response = await loginApi.getCompanyProfile()
      if (response.data) {
        setCurrentCompany(response.data)
      }
    } catch (err) {
      console.error("Error fetching current company:", err)
    }
  }

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
          partnerId: user.partnerId || "company",
          isSalesman: user.isSalesman || false,
          remarks: user.remarks || "",
        })

        if (user.moduleAccess && Array.isArray(user.moduleAccess)) {
          const accessMap = {}
          const groupDetailsMap = {}

          user.moduleAccess.forEach((access) => {
            const moduleCode = access.moduleCode
            const groupId = access.accessGroupId._id
            const groupDetails = access.accessGroupId

            if (!accessMap[moduleCode]) {
              accessMap[moduleCode] = []
            }
            if (!groupDetailsMap[moduleCode]) {
              groupDetailsMap[moduleCode] = []
            }

            accessMap[moduleCode].push(groupId)
            groupDetailsMap[moduleCode].push(groupDetails)
          })

          setModuleAccess(accessMap)
          setLoadedAccessGroups(groupDetailsMap)
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err)
      setError(err.message || "Failed to load user data")
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    if (form.partnerId) {
      fetchAccessGroupsForPartner()
    } else {
      setAccessGroupsByModule({})
    }
  }, [form.partnerId])

  const fetchPartners = async () => {
    try {
      setPartnersLoading(true)
      const response = await partnerApi.getPartnersList()
      setPartners(response.data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching partners:", err)
      setError("Failed to load partners")
    } finally {
      setPartnersLoading(false)
    }
  }

  const fetchAccessGroupsForPartner = async () => {
    if (!form.partnerId) return

    let selectedLayer = "company"

    if (form.partnerId !== "company") {
      const selectedPartner = partners.find((p) => p._id === form.partnerId)
      if (selectedPartner) {
        selectedLayer = (
          selectedPartner.layer?.toLowerCase() ||
          selectedPartner.type?.toLowerCase() ||
          "commercial-agent"
        )
          .replace(/\s+/g, "-")
          .replace("marine", "marine-agent")
          .replace("commercial", "commercial-agent")
          .replace("selling", "selling-agent")
      }
    }

    try {
      const groupedAccessGroups = {}

      for (const module of modules) {
        try {
          setAccessGroupsLoading((prev) => ({ ...prev, [module.code]: true }))
          const response = await usersApi.getAccessGroupsByModuleLayer(module.code, selectedLayer)
          const accessGroups = response.data?.accessGroups || []
          const loadedGroups = loadedAccessGroups[module.code] || []

          const merged = [
            ...loadedGroups,
            ...accessGroups.filter((ag) => !loadedGroups.some((lg) => lg._id === ag._id)),
          ]

          groupedAccessGroups[module.code] = merged
        } catch (err) {
          console.error(`Error fetching access groups for ${module.code}:`, err)
          groupedAccessGroups[module.code] = loadedAccessGroups[module.code] || []
        } finally {
          setAccessGroupsLoading((prev) => ({ ...prev, [module.code]: false }))
        }
      }

      setAccessGroupsByModule(groupedAccessGroups)
      setError(null)
    } catch (err) {
      console.error("Error fetching access groups:", err)
      setError("Failed to load access groups")
    }
  }

  const getLayerFromPartner = () => {
    if (!form.partnerId) return null

    if (form.partnerId === "company") {
      return agentLayerMap["company"]
    }

    const selectedPartner = partners.find((p) => p._id === form.partnerId)
    if (!selectedPartner) return null

    const layer = (selectedPartner.layer?.toLowerCase() || selectedPartner.type?.toLowerCase() || "commercial-agent")
      .replace(/\s+/g, "-")
      .replace("marine", "marine-agent")
      .replace("commercial", "commercial-agent")
      .replace("selling", "selling-agent")

    return agentLayerMap[layer] || null
  }

  const layerInfo = getLayerFromPartner()

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }))
  }

  const onSelectAccess = (moduleCode, value) => {
    if (value) {
      setModuleAccess((s) => ({
        ...s,
        [moduleCode]: [value],
      }))
    }
  }

  const onRemoveAccess = (moduleCode, valueToRemove) => {
    setModuleAccess((s) => ({
      ...s,
      [moduleCode]: (s[moduleCode] || []).filter((id) => id !== valueToRemove),
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      if (form.partnerId && form.partnerId !== "company") {
        const selectedPartner = partners.find((p) => p._id === form.partnerId)
        if (!selectedPartner) {
          setError("Selected partner is invalid")
          setLoading(false)
          return
        }
      } else if (!form.partnerId) {
        setError("Partner Assignment is required")
        setLoading(false)
        return
      }

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
        email: form.email,
        position: form.position,
        layer: layerInfo?.layer,
        isSalesman: form.isSalesman,
        partnerId: form.partnerId === "company" ? null : form.partnerId,
        remarks: form.remarks,
        moduleAccess: moduleAccessArray,
      }

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

      const response = await usersApi.updateUser(userId, payload)

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

  const partnersByLayer = useMemo(() => {
    const grouped = {
      company: null,
      "marine-agent": [],
      "commercial-agent": [],
      "selling-agent": [],
    }

    partners.forEach((partner) => {
      const layer = (partner.layer?.toLowerCase() || partner.type?.toLowerCase() || "commercial-agent")
        .replace(/\s+/g, "-")
        .replace("marine", "marine-agent")
        .replace("commercial", "commercial-agent")
        .replace("selling", "selling-agent")

      if (grouped[layer] !== undefined && layer !== "company") {
        grouped[layer].push(partner)
      }
    })

    return grouped
  }, [partners])

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
        <div className={`tab-pane fade ${tab === "profile" ? "show active" : ""}`} id="profile" role="tabpanel">
          <div className="row g-3">
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
                onChange={onChange}
                required
              />
            </div>
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

            <div className="col-md-6">
              <label htmlFor="partnerId" className="form-label">
                Partner Assignment
              </label>
              <select
                id="partnerId"
                name="partnerId"
                className="form-select"
                value={form.partnerId || ""}
                onChange={onChange}
                disabled={partnersLoading}
                required
              >
                <option value="">Select</option>
                {!partnersLoading && (
                  <>
                    <optgroup label="Company">
                      <option value="company">{currentCompany?.companyName || "Current Company"}</option>
                    </optgroup>

                    {partnersByLayer["marine-agent"] && partnersByLayer["marine-agent"].length > 0 && (
                      <optgroup label="Marine Agent">
                        {partnersByLayer["marine-agent"].map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.name}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {partnersByLayer["commercial-agent"] && partnersByLayer["commercial-agent"].length > 0 && (
                      <optgroup label="Commercial Agent">
                        {partnersByLayer["commercial-agent"].map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.name}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {partnersByLayer["selling-agent"] && partnersByLayer["selling-agent"].length > 0 && (
                      <optgroup label="Selling Agent">
                        {partnersByLayer["selling-agent"].map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                )}
              </select>

              {layerInfo && (
                <div className={`agent-info mt-3`}>
                  <div>
                    <strong>Agent Type:</strong> <span id="agentType">{layerInfo.type}</span>
                  </div>
                  <div>
                    <strong>Organizational Layer:</strong> <span id="agentLayer">{layerInfo.layer}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Is Salesman</label>
              <div>
                <label
                  className="status-toggle"
                  style={{ position: "relative", display: "inline-block", width: 50, height: 24 }}
                >
                  <input
                    type="checkbox"
                    name="isSalesman"
                    checked={form.isSalesman}
                    onChange={onChange}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    className="slider"
                    style={{
                      position: "absolute",
                      cursor: "pointer",
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
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        <div className={`tab-pane fade ${tab === "access" ? "show active" : ""}`} id="access" role="tabpanel">
          {!layerInfo ? (
            <div id="moduleAccessContainer" className="mt-3 text-center text-muted">
              <i className="bi bi-shield-lock fs-1 mb-3"></i>
              <p>Select a Partner Assignment in User Profile to configure Module Access</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* UPDATE permission gate for submit button */}
      <Can action="update" path="/admin/administration/user">
        <button type="submit" className="btn btn-turquoise mt-4" disabled={loading}>
          {loading ? "Updating User..." : "Update User"}
        </button>
      </Can>
    </form>
  )
}
