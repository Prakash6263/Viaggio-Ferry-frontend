"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CirclesWithBar } from "react-loader-spinner"
import { taxApi } from "../../api/taxApi"
import Swal from "sweetalert2"

export default function TaxesListTable() {
  const navigate = useNavigate()
  const [taxes, setTaxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTaxes()
  }, [])

  const fetchTaxes = async () => {
    try {
      setLoading(true)
      const response = await taxApi.getCompanyTaxes()
      setTaxes(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error("[v0] Error fetching taxes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = (taxId) => {
    navigate(`/company/administration/edit-tax/${taxId}`)
  }

  const handleDelete = async (taxId) => {
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
        const response = await taxApi.deleteTax(taxId)
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.message || "Tax has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          })
          fetchTaxes()
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete tax",
        })
        console.error("[v0] Delete error:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    const el = document.getElementById("taxesTable")
    if (!el || !window.DataTable || loading) return

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
  }, [loading, taxes])

  if (loading && taxes.length === 0) {
    return (
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
    )
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>
  }

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        <style>{`
          .status-label{display:inline-block;min-width:40px;text-align:center;padding:.25rem .5rem;border-radius:.25rem;font-weight:500}
          .badge-active{background:#22c55e;color:#fff}
          .badge-inactive{background:#e5e7eb;color:#111827}
        `}</style>

        <div className="table-responsive">
          <table id="taxesTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Tax Code</th>
                <th>Tax Name</th>
                <th>Tax Value</th>
                <th>Tax Type</th>
                <th>Form</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {taxes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    No taxes found
                  </td>
                </tr>
              ) : (
                taxes.map((tax) => (
                  <tr key={tax._id}>
                    <td>{tax.code}</td>
                    <td>{tax.name}</td>
                    <td>{tax.value}</td>
                    <td>{tax.type}</td>
                    <td>{tax.form}</td>
                    <td>
                      <span className={`badge ${tax.status === "Active" ? "badge-active" : "badge-inactive"}`}>
                        {tax.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleUpdate(tax._id)}
                        title="Edit Tax"
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(tax._id)}
                        title="Delete Tax"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
