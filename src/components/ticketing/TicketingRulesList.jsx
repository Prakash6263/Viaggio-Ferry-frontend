"use client"

import { useEffect, useState } from "react"
import { CirclesWithBar } from "react-loader-spinner"
import { ticketingRulesApi } from "../../api/ticketingRulesApi"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import CanDisable from "../CanDisable"

export default function TicketingRulesList() {
  const navigate = useNavigate()
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRules = async () => {
    try {
      setLoading(true)
      const response = await ticketingRulesApi.getTicketingRules(1, 100)
      setRules(response.data || [])
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching ticketing rules:", err)
      setError(err.message || "Failed to load ticketing rules")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  useEffect(() => {
    const el = document.getElementById("ticketingRulesTable")
    if (!el || !window.DataTable) return

    // destroy if hot-reloaded
    try {
      if (el._dt) {
        el._dt.destroy()
        el._dt = null
      }
    } catch {}

    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true,
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    })

    el._dt = dt
    return () => {
      try {
        dt.destroy()
      } catch {}
      el._dt = null
    }
  }, [rules])

  const formatPenalty = (penalty) => {
    if (!penalty || penalty.type === "NONE") return "-"
    if (penalty.type === "FIXED") return `₹ ${penalty.value || 0}`
    if (penalty.type === "PERCENTAGE") return `${penalty.value || 0}%`
    return "-"
  }

  const handleUpdate = (ruleId) => {
    navigate(`/company/edit-ticket-rule/${ruleId}`)
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
          fetchRules()
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

  return (
    <div className="card-table card p-2">
      <div className="card-body">
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
                  <th>Normal Fee</th>
                  <th>Restricted Penalty</th>
                  <th>No Show Penalty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule._id}>
                    <td>
                      <span className="badge bg-info">{rule.ruleType || "N/A"}</span>
                    </td>
                    <td>{rule.ruleName || "N/A"}</td>
                    <td>{rule.payloadType || "N/A"}</td>
                    <td>{formatPenalty(rule.normalFee)}</td>
                    <td>{formatPenalty(rule.restrictedPenalty)}</td>
                    <td>{formatPenalty(rule.noShowPenalty)}</td>
                    <td>
                      <CanDisable action="update" path="/sales-bookings/ticketing-rules">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleUpdate(rule._id)}
                          title="Update Rule"
                        >
                          <i className="bi bi-pencil"></i> Update
                        </button>
                      </CanDisable>
                      <CanDisable action="delete" path="/sales-bookings/ticketing-rules">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(rule._id)}
                          title="Delete Rule"
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </CanDisable>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

