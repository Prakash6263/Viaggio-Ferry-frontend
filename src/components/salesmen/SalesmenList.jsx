"use client"

import { useEffect, useRef, useState } from "react"
import { usersApi } from "../../api/usersApi"
import Swal from "sweetalert2"
import { CirclesWithBar } from "react-loader-spinner"

/**
 * SalesmenList
 * - Fetches salesman data from /api/users/salesman/list endpoint
 * - Uses same status update API as UserListTable (usersApi.updateUser)
 * - Uses same loader (CirclesWithBar) as UserListTable
 * - Includes pagination, filtering, and status management
 */
export default function SalesmenList({ onEdit, onDelete }) {
  const [salesmen, setSalesmen] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [status, setStatus] = useState("Active")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSalesmen, setFilteredSalesmen] = useState([])
  const tableRef = useRef(null)

  useEffect(() => {
    fetchSalesmen()
  }, [currentPage, pageSize, status, sortBy, sortOrder])

  // Handle search filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSalesmen(salesmen)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = salesmen.filter(
        (salesman) =>
          salesman.fullName?.toLowerCase().includes(term) ||
          salesman.email?.toLowerCase().includes(term) ||
          salesman.position?.toLowerCase().includes(term)
      )
      setFilteredSalesmen(filtered)
    }
  }, [searchTerm, salesmen])

  const fetchSalesmen = async () => {
    try {
      setLoading(true)
      const response = await usersApi.getSalesmenList(currentPage, pageSize, status, sortBy, sortOrder)

      if (response.success) {
        setSalesmen(response.data.users)
        setTotalPages(response.data.pagination.totalPages)
        setTotalCount(response.data.pagination.totalCount)
      } else {
        Swal.fire("Error", "Failed to fetch salesmen", "error")
      }
    } catch (err) {
      console.error("Error fetching salesmen:", err)
      Swal.fire("Error", "Failed to fetch salesmen: " + err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"

    Swal.fire({
      title: "Confirm Status Change",
      text: `Change status to ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await usersApi.updateUser(userId, { status: newStatus })
          if (response.success) {
            Swal.fire("Success!", `Salesman status updated to ${newStatus}`, "success")
            fetchSalesmen()
          } else {
            Swal.fire("Error", "Failed to update status", "error")
          }
        } catch (err) {
          console.error("Error updating status:", err)
          Swal.fire("Error", "Failed to update status: " + err.message, "error")
        }
      }
    })
  }

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await usersApi.deleteUser(userId)
          if (response.success) {
            Swal.fire("Deleted!", "Salesman has been deleted.", "success")
            fetchSalesmen()
          } else {
            Swal.fire("Error", "Failed to delete salesman", "error")
          }
        } catch (err) {
          console.error("Error deleting salesman:", err)
          Swal.fire("Error", "Failed to delete salesman: " + err.message, "error")
        }
      }
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getLayerBadgeClass = (layer) => {
    const layerMap = {
      company: "bg-primary",
      "marine-agent": "bg-info",
      "commercial-agent": "bg-success",
      "selling-agent": "bg-warning",
    }
    return layerMap[layer] || "bg-secondary"
  }

  const formatLayer = (layer) => {
    const layerNames = {
      company: "Company",
      "marine-agent": "Marine Agent",
      "commercial-agent": "Commercial Agent",
      "selling-agent": "Selling Agent",
    }
    return layerNames[layer] || layer
  }

  if (loading && salesmen.length === 0) {
    return (
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
    )
  }

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        <style>{`
          .status-label{display:inline-block;min-width:40px;text-align:center;padding:.25rem .5rem;border-radius:.25rem;font-weight:500}
          .status-yes{background-color:#ffc107;color:#212529}
          .status-no{background-color:#6c757d;color:#fff}
          .form-switch .form-check-input{width:45px;height:22px;cursor:pointer}
          .form-switch .form-check-input:checked{background-color:#0d6efd;border-color:#0d6efd}
          .badge-agent{font-weight:600}
        `}</style>

        {/* Filter Controls */}
        <div className="mb-3 d-flex gap-2 align-items-center flex-wrap">
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ maxWidth: "250px" }}
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: "150px" }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          {/* Status filter dropdown */}
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: "150px" }}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="All">All</option>
          </select>
        </div>

        <div className="table-responsive">
          <table ref={tableRef} className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Layer</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSalesmen.length > 0 ? (
                filteredSalesmen.map((salesman) => (
                  <tr key={salesman._id}>
                    <td>
                      <strong>{salesman.fullName || "N/A"}</strong>
                    </td>
                    <td>{salesman.email || "N/A"}</td>
                    <td>{salesman.position || "N/A"}</td>
                    <td>
                      <span className={`badge ${getLayerBadgeClass(salesman.layer)} badge-agent`}>
                        {formatLayer(salesman.layer)}
                      </span>
                    </td>
                    <td>{salesman.agent?.name || "Company"}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={salesman.status === "Active"}
                          onChange={() => handleStatusChange(salesman._id, salesman.status)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                    <td>{formatDate(salesman.createdAt)}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit?.(salesman._id)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm ms-1" onClick={() => handleDelete(salesman._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    {searchTerm ? "No salesmen match your search" : "No salesmen found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of{" "}
            {totalCount} salesmen
          </small>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
