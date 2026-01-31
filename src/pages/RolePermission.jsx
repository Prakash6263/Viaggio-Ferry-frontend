// import { useEffect, useState, useRef } from "react"
// import { Link } from "react-router-dom"
// import Header from "../components/layout/Header"
// import { Sidebar } from "../components/layout/Sidebar"
// import { PageWrapper } from "../components/layout/PageWrapper"
// import { accessGroupsApi } from "../api/accessGroupsApi"
// import Swal from "sweetalert2"
// import { CirclesWithBar } from "react-loader-spinner"
// import Can from "../components/Can"
// import CanDisable from "../components/CanDisable"

// export default function RolePermission() {
//   const [groups, setGroups] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
//   const [searchQuery, setSearchQuery] = useState("")
//   const tableRef = useRef(null)

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value)
//   }

//   const handleLimitChange = (limit) => {
//     setPagination(prev => ({ ...prev, limit, page: 1 }))
//   }

//   const handlePageChange = (page) => {
//     setPagination(prev => ({ ...prev, page }))
//   }

//   useEffect(() => {
//     fetchAccessGroups()
//   }, [pagination.page, pagination.limit, searchQuery])

//   const fetchAccessGroups = async () => {
//     try {
//       setLoading(true)
//       // Call API with positional parameters (page, limit)
//       const response = await accessGroupsApi.getAccessGroupsList(pagination.page, pagination.limit)
      
//       // Handle nested response structure (response.data contains the array, response.pagination contains pagination info)
//       const groupsData = response.data || []
//       setGroups(groupsData)
      
//       // Update pagination from response
//       if (response.pagination) {
//         setPagination(prev => ({
//           ...prev,
//           total: response.pagination.total || 0,
//           pages: response.pagination.pages || 1,
//         }))
//       }
//       setError(null)
//     } catch (err) {
//       setError(err.message || "Failed to fetch access groups")
//       console.error("Error fetching access groups:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (groupId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You want to delete this access group?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc3545",
//       cancelButtonColor: "#6c757d",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     })

//     if (result.isConfirmed) {
//       try {
//         await accessGroupsApi.deleteAccessGroup(groupId)
//         Swal.fire({
//           title: "Deleted!",
//           text: "Access group deleted successfully",
//           icon: "success",
//           timer: 1500,
//         })
//         fetchAccessGroups()
//       } catch (err) {
//         Swal.fire({
//           title: "Error!",
//           text: "Failed to delete access group: " + err.message,
//           icon: "error",
//         })
//       }
//     }
//   }

//   const handleStatusToggle = async (group) => {
//     try {
//       await accessGroupsApi.toggleAccessGroupStatus(group._id, !group.isActive)
//       Swal.fire({
//         title: "Success!",
//         text: `Access group is now ${!group.isActive ? "active" : "inactive"}`,
//         icon: "success",
//         timer: 1500,
//       })
//       fetchAccessGroups()
//     } catch (err) {
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to update status: " + err.message,
//         icon: "error",
//       })
//     }
//   }

//   const getLayerBadgeClass = (layer) => {
//     const layerMap = {
//       company: "bg-primary",
//       "marine-agent": "bg-info",
//       "commercial-agent": "bg-success",
//       "selling-agent": "bg-warning text-dark",
//     }
//     return layerMap[layer] || "bg-secondary"
//   }

//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />

//       <PageWrapper>
//         <div className="content container-fluid">
//           {/* Page Header */}
//           <div className="page-header">
//             <div className="content-page-header">
//               <h5>Access Rights Group Management</h5>

//               <div className="list-btn" style={{ justifySelf: "end" }}>
//                 <ul className="filter-list">
//                   <li>
//                     <Can action="create">
//                       <Link className="btn btn-turquoise" to="/company/settings/add-group-permission">
//                         <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
//                         Add New Group Permission
//                       </Link>
//                     </Can>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           {/* /Page Header */}

//           <div className="row">
//             <div className="col-sm-12">
//               <div className="card-table card p-2">
//                 <div className="card-body">
//                   {/* Inline CSS block from HTML, kept for visual parity */}
//                   <style>
//                     {`
//                       .status-label {
//                         display: inline-block;
//                         min-width: 40px;
//                         text-align: center;
//                         padding: 0.25rem 0.5rem;
//                         border-radius: 0.25rem;
//                         font-weight: 500;
//                       }

//                       .status-yes {
//                         background-color: #ffc107;
//                         color: #212529;
//                       }

//                       .form-switch .form-check-input {
//                         width: 45px;
//                         height: 22px;
//                         cursor: pointer;
//                       }

//                       .form-switch .form-check-input:checked {
//                         background-color: #0d6efd;
//                         border-color: #0d6efd;
//                       }

//                       /* New button styles for actions */
//                       .action-buttons {
//                         display: flex;
//                         gap: 8px;
//                         align-items: center;
//                       }

//                       .action-btn {
//                         display: inline-flex;
//                         align-items: center;
//                         justify-content: center;
//                         width: 40px;
//                         height: 40px;
//                         border-radius: 8px;
//                         border: 2px solid;
//                         background: white;
//                         cursor: pointer;
//                         transition: all 0.2s ease;
//                         padding: 0;
//                       }

//                       .action-btn-edit {
//                         border-color: #007bff;
//                         color: #007bff;
//                       }

//                       .action-btn-edit:hover {
//                         background-color: #007bff;
//                         color: white;
//                       }

//                       .action-btn-delete {
//                         border-color: #dc3545;
//                         color: #dc3545;
//                       }

//                       .action-btn-delete:hover {
//                         background-color: #dc3545;
//                         color: white;
//                       }

//                       .action-btn i {
//                         font-size: 18px;
//                       }
//                     `}
//                   </style>

//                   {loading && (
//                     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
//                       <CirclesWithBar
//                         height="100"
//                         width="100"
//                         color="#05468f"
//                         outerCircleColor="#05468f"
//                         innerCircleColor="#05468f"
//                         barColor="#05468f"
//                         ariaLabel="circles-with-bar-loading"
//                         visible={true}
//                       />
//                     </div>
//                   )}

//                   {error && (
//                     <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                       {error}
//                       <button type="button" className="btn-close" onClick={() => setError(null)}></button>
//                     </div>
//                   )}

//                   {!loading && !error && (
//                     <div>
//                       {/* Pagination Controls - Top */}
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <div className="d-flex align-items-center">
//                           <select
//                             className="form-select form-select-sm"
//                             style={{ width: "80px" }}
//                             value={pagination.limit}
//                             onChange={(e) => handleLimitChange(parseInt(e.target.value))}
//                           >
//                             <option value={10}>10</option>
//                             <option value={25}>25</option>
//                             <option value={50}>50</option>
//                             <option value={100}>100</option>
//                           </select>
//                           <span className="ms-2">entries per page</span>
//                         </div>
//                       </div>

//                       <div className="table-responsive">
//                         <table ref={tableRef} className="table table-striped" id="example" style={{ width: "100%" }}>
//                           <thead>
//                             <tr>
//                               <th>Group Name</th>
//                               <th>Group Code</th>
//                               <th>Module Name</th>
//                               <th>Layer</th>
//                               <th>Status</th>
//                               <th>Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {groups.length > 0 ? (
//                               groups.map((group) => (
//                                 <tr key={group._id}>
//                                   <td>{group.groupName}</td>
//                                   <td>{group.groupCode}</td>
//                                   <td>{group.moduleCode}</td>
//                                   <td>
//                                     <span className={`badge ${getLayerBadgeClass(group.layer)}`}>
//                                       {group.layer.replace("-", " ").charAt(0).toUpperCase() +
//                                         group.layer.slice(1).replace("-", " ")}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <label className="status-toggle">
//                                       <input
//                                         type="checkbox"
//                                         checked={group.isActive}
//                                         onChange={() => handleStatusToggle(group)}
//                                       />
//                                       <span className="slider"></span>
//                                     </label>
//                                   </td>
//                                   <td style={{ whiteSpace: "nowrap" }}>
//                                     <CanDisable action="update">
//                                       <Link
//                                         to={`/company/settings/add-group-permission?id=${group._id}`}
//                                         className="btn btn-sm btn-primary me-2"
//                                         title="Edit"
//                                       >
//                                         <i className="fa fa-edit"></i>
//                                       </Link>
//                                     </CanDisable>
//                                     <CanDisable action="delete">
//                                       <button
//                                         className="btn btn-sm btn-danger"
//                                         onClick={() => handleDelete(group._id)}
//                                         title="Delete"
//                                       >
//                                         <i className="fa fa-trash"></i>
//                                       </button>
//                                     </CanDisable>
//                                   </td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="6" className="text-center py-5">
//                                   <p className="text-muted">No access groups found</p>
//                                 </td>
//                               </tr>
//                             )}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Footer Pagination */}
//                       {groups.length > 0 && (
//                         <div className="d-flex justify-content-between align-items-center mt-3">
//                           <div className="text-muted">
//                             Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
//                             {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
//                             {pagination.total} entries
//                           </div>
//                           <nav aria-label="Table pagination">
//                             <ul className="pagination mb-0">
//                               <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
//                                 <button
//                                   className="page-link"
//                                   onClick={() => handlePageChange(1)}
//                                   disabled={pagination.page === 1}
//                                 >
//                                   «
//                                 </button>
//                               </li>
//                               <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
//                                 <button
//                                   className="page-link"
//                                   onClick={() => handlePageChange(pagination.page - 1)}
//                                   disabled={pagination.page === 1}
//                                 >
//                                   ‹
//                                 </button>
//                               </li>

//                               {/* Page Numbers */}
//                               {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
//                                 let pageNum
//                                 if (pagination.pages <= 5) {
//                                   pageNum = i + 1
//                                 } else if (pagination.page <= 3) {
//                                   pageNum = i + 1
//                                 } else if (pagination.page >= pagination.pages - 2) {
//                                   pageNum = pagination.pages - 4 + i
//                                 } else {
//                                   pageNum = pagination.page - 2 + i
//                                 }
//                                 return (
//                                   <li
//                                     key={pageNum}
//                                     className={`page-item ${pagination.page === pageNum ? "active" : ""}`}
//                                   >
//                                     <button
//                                       className="page-link"
//                                       onClick={() => handlePageChange(pageNum)}
//                                     >
//                                       {pageNum}
//                                     </button>
//                                   </li>
//                                 )
//                               })}

//                               <li
//                                 className={`page-item ${pagination.page === pagination.pages ? "disabled" : ""}`}
//                               >
//                                 <button
//                                   className="page-link"
//                                   onClick={() => handlePageChange(pagination.page + 1)}
//                                   disabled={pagination.page === pagination.pages}
//                                 >
//                                   ›
//                                 </button>
//                               </li>
//                               <li
//                                 className={`page-item ${pagination.page === pagination.pages ? "disabled" : ""}`}
//                               >
//                                 <button
//                                   className="page-link"
//                                   onClick={() => handlePageChange(pagination.pages)}
//                                   disabled={pagination.page === pagination.pages}
//                                 >
//                                   »
//                                 </button>
//                               </li>
//                             </ul>
//                           </nav>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </PageWrapper>
//     </div>
//   )
// }




import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import { accessGroupsApi } from "../api/accessGroupsApi"
import Swal from "sweetalert2"
import { CirclesWithBar } from "react-loader-spinner"
import Can from "../components/Can"
import CanDisable from "../components/CanDisable"

export default function RolePermission() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [searchQuery, setSearchQuery] = useState("")
  const tableRef = useRef(null)

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleLimitChange = (limit) => {
    setPagination(prev => ({ ...prev, limit }))
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }))
  }

  useEffect(() => {
    fetchAccessGroups()
  }, [pagination.page, searchQuery])

  useEffect(() => {
    const el = tableRef.current
    if (!el) return

    // initialize DataTable safely if DataTable available
    if (window.DataTable) {
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
        if (el) el._dt = null
      }
    }
    // if DataTable not loaded, do nothing (HTML script in public/index.html can init)
  }, [groups])

  const fetchAccessGroups = async () => {
    try {
      setLoading(true)
      const response = await accessGroupsApi.getAccessGroupsList()
      setGroups(response.data || [])
      setError(null)
    } catch (err) {
      setError(err.message || "Failed to fetch access groups")
      console.error("Error fetching access groups:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (groupId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this access group?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        await accessGroupsApi.deleteAccessGroup(groupId)
        Swal.fire({
          title: "Deleted!",
          text: "Access group deleted successfully",
          icon: "success",
          timer: 1500,
        })
        fetchAccessGroups()
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete access group: " + err.message,
          icon: "error",
        })
      }
    }
  }

  const handleStatusToggle = async (group) => {
    try {
      await accessGroupsApi.toggleAccessGroupStatus(group._id, !group.isActive)
      Swal.fire({
        title: "Success!",
        text: `Access group is now ${!group.isActive ? "active" : "inactive"}`,
        icon: "success",
        timer: 1500,
      })
      fetchAccessGroups()
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update status: " + err.message,
        icon: "error",
      })
    }
  }

  const getLayerBadgeClass = (layer) => {
    const layerMap = {
      company: "bg-primary",
      "marine-agent": "bg-info",
      "commercial-agent": "bg-success",
      "selling-agent": "bg-warning text-dark",
    }
    return layerMap[layer] || "bg-secondary"
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Access Rights Group Management</h5>

              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Can action="create">
                      <Link className="btn btn-turquoise" to="/company/settings/add-group-permission">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                        Add New Group Permission
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* Inline CSS block from HTML, kept for visual parity */}
                  <style>
                    {`
                      .status-label {
                        display: inline-block;
                        min-width: 40px;
                        text-align: center;
                        padding: 0.25rem 0.5rem;
                        border-radius: 0.25rem;
                        font-weight: 500;
                      }

                      .status-yes {
                        background-color: #ffc107;
                        color: #212529;
                      }

                      .form-switch .form-check-input {
                        width: 45px;
                        height: 22px;
                        cursor: pointer;
                      }

                      .form-switch .form-check-input:checked {
                        background-color: #0d6efd;
                        border-color: #0d6efd;
                      }

                      /* New button styles for actions */
                      .action-buttons {
                        display: flex;
                        gap: 8px;
                        align-items: center;
                      }

                      .action-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 40px;
                        height: 40px;
                        border-radius: 8px;
                        border: 2px solid;
                        background: white;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        padding: 0;
                      }

                      .action-btn-edit {
                        border-color: #007bff;
                        color: #007bff;
                      }

                      .action-btn-edit:hover {
                        background-color: #007bff;
                        color: white;
                      }

                      .action-btn-delete {
                        border-color: #dc3545;
                        color: #dc3545;
                      }

                      .action-btn-delete:hover {
                        background-color: #dc3545;
                        color: white;
                      }

                      .action-btn i {
                        font-size: 18px;
                      }
                    `}
                  </style>

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

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                  )}

                  {!loading && !error && (
                    <div className="table-responsive">
                      <table ref={tableRef} className="table table-striped" id="example" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Group Name</th>
                            <th>Group Code</th>
                            <th>Module Name</th>
                            <th>Layer</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groups.length > 0 ? (
                            groups.map((group) => (
                              <tr key={group._id}>
                                <td>{group.groupName}</td>
                                <td>{group.groupCode}</td>
                                <td>{group.moduleCode}</td>
                                <td>
                                  <span className={`badge ${getLayerBadgeClass(group.layer)}`}>
                                    {group.layer.replace("-", " ").charAt(0).toUpperCase() +
                                      group.layer.slice(1).replace("-", " ")}
                                  </span>
                                </td>
                                <td>
                                  <label className="status-toggle">
                                    <input
                                      type="checkbox"
                                      checked={group.isActive}
                                      onChange={() => handleStatusToggle(group)}
                                    />
                                    <span className="slider"></span>
                                  </label>
                                </td>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  <CanDisable action="update">
                                    <Link
                                      to={`/company/settings/add-group-permission?id=${group._id}`}
                                      className="btn btn-sm btn-primary me-2"
                                      title="Edit"
                                    >
                                      <i className="fa fa-edit"></i>
                                    </Link>
                                  </CanDisable>
                                  <CanDisable action="delete">
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(group._id)}
                                      title="Delete"
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </CanDisable>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-5">
                                <p className="text-muted">No access groups found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* end table-responsive */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
