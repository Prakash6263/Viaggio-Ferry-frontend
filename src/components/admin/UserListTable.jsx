'use client';

import { useEffect, useState } from "react"
import { usersApi } from "../../api/usersApi"
import Swal from "sweetalert2"
import { CirclesWithBar } from "react-loader-spinner"
import { Link } from "react-router-dom"
import CanDisable from "../CanDisable"

export default function UserListTable() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("Active")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchUsers()
  }, [status])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await usersApi.getUsersList(1, 500, status, "createdAt", "desc")

      if (response.success) {
        setUsers(response.data.users || [])
      } else {
        Swal.fire("Error", "Failed to fetch users", "error")
      }
    } catch (err) {
      console.error("Error fetching users:", err)
      Swal.fire("Error", "Failed to fetch users: " + err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower)) ||
      (user.position && user.position.toLowerCase().includes(searchLower)) ||
      (user.layer && user.layer.toLowerCase().includes(searchLower))
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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
            Swal.fire("Success!", `User status updated to ${newStatus}`, "success")
            
            // Update local state
            setUsers(prevUsers => 
              prevUsers.map(user => 
                user._id === userId ? { ...user, status: newStatus } : user
              )
            );
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
            Swal.fire("Deleted!", "User has been deleted.", "success")
            
            // ✅ IMMEDIATELY update local state
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
          } else {
            Swal.fire("Error", "Failed to delete user", "error")
          }
        } catch (err) {
          console.error("Error deleting user:", err)
          Swal.fire("Error", "Failed to delete user: " + err.message, "error")
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

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  if (loading && users.length === 0) {
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

        {/* Filters and Search */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2">
            {/* Status Filter */}
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: "150px" }}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="All">All</option>
            </select>

            {/* Items per page */}
            <select
              className="form-select form-select-sm"
              style={{ maxWidth: "120px" }}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>

          {/* Search */}
          <div className="d-flex gap-2">
            <div className="input-group input-group-sm" style={{ maxWidth: "250px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table table-striped"
            style={{ width: "100%" }}
          >
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
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user._id}>
                    <td><strong>{user.fullName || "N/A"}</strong></td>
                    <td>{user.email || "N/A"}</td>
                    <td>{user.position || "N/A"}</td>
                    <td>
                      <span className={`badge ${getLayerBadgeClass(user.layer)} badge-agent`}>
                        {formatLayer(user.layer)}
                      </span>
                    </td>
                    <td>{user.agent?.name || "Company"}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={user.status === "Active"}
                          onChange={() => handleStatusChange(user._id, user.status)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <CanDisable action="update">
                        <Link
                          to={`/company/administration/edit-user/${user._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                      </CanDisable>
                      <CanDisable action="delete">
                        <button
                          className="btn btn-outline-danger btn-sm ms-1"
                          onClick={() => handleDelete(user._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </CanDisable>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    {searchTerm ? "No matching users found" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Custom Pagination */}
          {filteredUsers.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}