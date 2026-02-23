"use client"

import { useEffect, useState } from "react"
import { CirclesWithBar } from "react-loader-spinner"
import { ticketingRulesApi } from "../../api/ticketingRulesApi"
import Swal from "sweetalert2"
import CanDisable from "../CanDisable"
import Can from "../Can"
import TicketingRuleFormModal from "./TicketingRuleFormModal"

export default function TicketingRulesList() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [ruleTypeFilter, setRuleTypeFilter] = useState("")
  const [payloadTypeFilter, setPayloadTypeFilter] = useState("")

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [modalMode, setModalMode] = useState("create") // 'create' or 'edit'

  const fetchRules = async (page = 1) => {
    try {
      setLoading(true)
      const response = await ticketingRulesApi.getTicketingRules({
        page,
        limit: 10,
        search: searchTerm,
        ruleType: ruleTypeFilter,
        payloadType: payloadTypeFilter,
      })

      setRules(response.data || [])
      setCurrentPage(page)
      setTotalPages(response.pagination?.totalPages || 1)
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching ticketing rules:", err)
      setError(err.message || "Failed to load ticketing rules")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules(1)
  }, [searchTerm, ruleTypeFilter, payloadTypeFilter])

  useEffect(() => {
    const el = document.getElementById("ticketingRulesTable")
    if (!el || !window.DataTable) return

    try {
      if (el._dt) {
        el._dt.destroy()
        el._dt = null
      }
    } catch {}

    const dt = new window.DataTable(el, {
      paging: false,
      searching: false,
      ordering: false,
      info: false,
    })

    el._dt = dt
    return () => {
      try {
        dt?.destroy()
      } catch {}
      el._dt = null
    }
  }, [rules])

  // Format fee display based on type
  const formatFee = (feeObj) => {
    if (!feeObj) return "-"
    if (feeObj.type === "NONE") return "-"
    if (feeObj.type === "FIXED") return `₹ ${feeObj.value}`
    if (feeObj.type === "PERCENTAGE") return `${feeObj.value}%`
    return "-"
  }

  const handleCreateNew = () => {
    setEditingRule(null)
    setModalMode("create")
    setShowModal(true)
  }

  const handleEdit = (rule) => {
    setEditingRule(rule)
    setModalMode("edit")
    setShowModal(true)
  }

  const handleDelete = async (ruleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        setLoading(true)
        const res = await ticketingRulesApi.deleteTicketingRule(ruleId)
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: res.message || "Ticketing rule has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          })
          fetchRules(currentPage)
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete ticketing rule",
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleModalSave = async (ruleData) => {
    try {
      setLoading(true)
      if (modalMode === "create") {
        await ticketingRulesApi.createTicketingRule(ruleData)
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Ticketing rule has been created successfully.",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await ticketingRulesApi.updateTicketingRule(editingRule._id, ruleData)
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Ticketing rule has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        })
      }
      setShowModal(false)
      fetchRules(currentPage)
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || `Failed to ${modalMode} ticketing rule`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingRule(null)
  }

  return (
    <>
      <div className="card-table card p-2">
        <div className="card-body">
          {/* Filters */}
          <div className="row mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by rule name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={ruleTypeFilter}
                onChange={(e) => setRuleTypeFilter(e.target.value)}
              >
                <option value="">All Rule Types</option>
                <option value="VOID">VOID</option>
                <option value="REFUND">REFUND</option>
                <option value="REISSUE">REISSUE</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={payloadTypeFilter}
                onChange={(e) => setPayloadTypeFilter(e.target.value)}
              >
                <option value="">All Payload Types</option>
                <option value="PASSENGER">PASSENGER</option>
                <option value="CARGO">CARGO</option>
                <option value="VEHICLE">VEHICLE</option>
                <option value="ALL">ALL</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <Can action="create">
                <button
                  className="btn btn-turquoise"
                  onClick={handleCreateNew}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add Rule
                </button>
              </Can>
            </div>
          </div>

          {loading && (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
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

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="table-responsive">
              <table id="ticketingRulesTable" className="table table-striped" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Rule Type</th>
                    <th>Rule Name</th>
                    <th>Payload Type</th>
                    <th>Restricted Window (Hours)</th>
                    <th>Normal Fee</th>
                    <th>Restricted Penalty</th>
                    <th>No Show Penalty</th>
                    <th>Conditions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted py-4">
                        No ticketing rules found
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule._id}>
                        <td>
                          <span className={`badge bg-${rule.ruleType === "VOID" ? "danger" : rule.ruleType === "REFUND" ? "success" : "primary"}`}>
                            {rule.ruleType}
                          </span>
                        </td>
                        <td>{rule.ruleName || "N/A"}</td>
                        <td>{rule.payloadType || "N/A"}</td>
                        <td>{rule.restrictedWindowHours || "N/A"}</td>
                        <td>{formatFee(rule.normalFee)}</td>
                        <td>{formatFee(rule.restrictedPenalty)}</td>
                        <td>{formatFee(rule.noShowPenalty)}</td>
                        <td className="text-truncate" title={rule.conditions} style={{ maxWidth: "200px" }}>
                          {rule.conditions || "N/A"}
                        </td>
                        <td>
                          <CanDisable action="update">
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleEdit(rule)}
                              title="Edit Rule"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </CanDisable>
                          <CanDisable action="delete">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(rule._id)}
                              title="Delete Rule"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </CanDisable>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => fetchRules(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => fetchRules(page)}>
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => fetchRules(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <TicketingRuleFormModal
          mode={modalMode}
          rule={editingRule}
          onSave={handleModalSave}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
