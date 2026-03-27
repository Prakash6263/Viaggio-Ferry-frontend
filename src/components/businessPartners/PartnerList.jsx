// "use client"

// // src/components/businessPartners/PartnerList.jsx
// import { useEffect, useRef } from "react"

// export default function PartnerList({ partners = [], onUpdate, onDisable, onEnable }) {
//   const tableRef = useRef(null)

//   useEffect(() => {
//     const el = tableRef.current
//     if (!el) return

//     // initialize DataTable safely if DataTable available
//     if (window.DataTable) {
//       try {
//         if (el._dt) {
//           el._dt.destroy()
//           el._dt = null
//         }
//       } catch {}
//       const dt = new window.DataTable(el, {
//         paging: true,
//         pageLength: 10,
//         lengthMenu: [10, 25, 50, 100],
//         searching: true,
//         ordering: true,
//         info: true,
//       })
//       el._dt = dt
//       return () => {
//         try {
//           dt.destroy()
//         } catch {}
//         if (el) el._dt = null
//       }
//     }
//     // if DataTable not loaded, do nothing (HTML script in public/index.html can init)
//   }, [])

//   const data = partners.length
//     ? partners
//     : [
//         {
//           id: 1,
//           name: "Marine Transport Co.",
//           phone: "+123456789",
//           address: "123 Ocean St.",
//           layer: "Marine",
//           status: "Active",
//         },
//       ]

//   return (
//     <div id="list-view" className="card-table active">
//       <h4 className="mb-3">List View</h4>
//       <div className="table-responsive">
//         <table ref={tableRef} className="partner-table table table-striped" id="example">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Phone</th>
//               <th>Address</th>
//               <th>Layer</th>
//               <th>Parent Company</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((p) => (
//               <tr key={p._id || p.id}>
//                 <td>{p.name}</td>
//                 <td>{p.phone}</td>
//                 <td>{p.address}</td>
//                 <td>{p.layer}</td>
//                 <td>{p.layer === "Marine" ? p.parentCompany?.companyName || "-" : p.parentAccount?.name || "-"}</td>
//                 <td>{p.partnerStatus || p.status}</td>
//                 <td style={{ whiteSpace: "nowrap" }}>
//                   <button className="btn btn-sm btn-primary me-2" onClick={() => onUpdate?.(p)} title="Edit partner">
//                     <i className="fa fa-edit"></i>
//                   </button>
//                   {p.partnerStatus === "Active" || p.status === "Active" ? (
//                     <button
//                       className="btn btn-sm btn-warning me-2"
//                       onClick={() => onDisable?.(p)}
//                       title="Disable partner"
//                     >
//                       <i className="fa fa-ban"></i>
//                     </button>
//                   ) : (
//                     <button
//                       className="btn btn-sm btn-success me-2"
//                       onClick={() => onEnable?.(p)}
//                       title="Enable partner"
//                     >
//                       <i className="fa fa-check"></i>
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


"use client"

// src/components/businessPartners/PartnerList.jsx
import CanDisable from "../CanDisable"

export default function PartnerList({
  partners = [],
  onUpdate,
  onDisable,
  onEnable,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  searchTerm = "",
  onSearchChange,
}) {
  const data = partners.length
    ? partners
    : [
        {
          id: 1,
          name: "",
          phone: "",
          address: "",
          layer: "Do not have any partner yet. Please add a partner.",
          status: "",
        },
      ]

  const startRecord = total === 0 ? 0 : (page - 1) * limit + 1
  const endRecord = Math.min(page * limit, total)

  return (
    <div id="list-view" className="card-table active">
      <h4 className="mb-3">List View</h4>
      
      {/* Search and Filter Controls */}
      {total > 0 && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-2 align-items-center">
            <label htmlFor="partner-entries-select" className="form-label mb-0" style={{ fontSize: "0.875rem" }}>
              <span>{limit}</span> entries per page
            </label>
            <select
              id="partner-entries-select"
              className="form-select form-select-sm"
              style={{ maxWidth: "120px" }}
              value={limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
            >
              <option value="10">10 entries per page</option>
              <option value="25">25 entries per page</option>
              <option value="50">50 entries per page</option>
              <option value="100">100 entries per page</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="d-flex gap-2">
            <div className="input-group input-group-sm" style={{ maxWidth: "250px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => {
                  onSearchChange?.(e.target.value)
                }}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="partner-table table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Layer</th>
              <th>Parent Company</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p._id || p.id}>
                <td>{p.name}</td>
                <td>{p.phone}</td>
                <td>{p.address}</td>
                <td>{p.layer}</td>
                <td>{p.layer === "Marine" ? p.parentCompany?.companyName || "-" : p.parentAccount?.name || "-"}</td>
                <td>{p.partnerStatus || p.status}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <CanDisable action="update">
                    <button className="btn btn-sm btn-primary me-2" onClick={() => onUpdate?.(p)} title="Edit partner">
                      <i className="fa fa-edit"></i>
                    </button>
                  </CanDisable>
                  <CanDisable action="update">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => onDisable?.(p)}
                      title="Disable partner"
                    >
                      <i className="fa fa-ban"></i>
                    </button>
                  </CanDisable>
                  <CanDisable action="update">
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => onEnable?.(p)}
                      title="Enable partner"
                    >
                      <i className="fa fa-check"></i>
                    </button>
                  </CanDisable>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Server-side Pagination */}
      {total > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-3 px-1">
          <span className="text-muted" style={{ fontSize: "0.875rem" }}>
            Showing {startRecord} to {endRecord} of {total} entries
          </span>
          <div className="d-flex gap-2 align-items-center">
            <div>
              <select
                className="form-select form-select-sm"
                style={{ maxWidth: "100px" }}
                value={page}
                onChange={(e) => onPageChange?.(Number(e.target.value))}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Page {p}
                  </option>
                ))}
              </select>
            </div>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange?.(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push("ellipsis-" + p)
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item) =>
                    typeof item === "string" ? (
                      <li key={item} className="page-item disabled">
                        <span className="page-link">…</span>
                      </li>
                    ) : (
                      <li key={item} className={`page-item ${item === page ? "active" : ""}`}>
                        <button className="page-link" onClick={() => onPageChange?.(item)}>
                          {item}
                        </button>
                      </li>
                    )
                  )}

                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange?.(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

