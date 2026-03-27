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
import { useEffect, useRef } from "react"
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
}) {
  const tableRef = useRef(null)

  // Initialize DataTable - same config as CustomerList for consistent styling
  useEffect(() => {
    const el = tableRef.current
    if (!el || !partners.length || !window.DataTable) return

    try {
      if (el._dt) {
        el._dt.destroy()
        el._dt = null
      }
    } catch (err) {}

    const dt = new window.DataTable(el, {
      paging: false, // Disable DataTable pagination - using backend pagination
      searching: true,
      ordering: true,
      info: false, // Disable DataTable info - using custom info for backend pagination
      lengthChange: true,
      pageLength: limit,
      lengthMenu: [10, 25, 50, 100],
    })

    el._dt = dt
    return () => {
      try {
        dt.destroy()
      } catch (err) {}
      if (el) el._dt = null
    }
  }, [partners, limit])

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



      <div className="table-responsive">
        <table
          ref={tableRef}
          className="partner-table table table-striped"
          id="partnerTable"
        >
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
                <td>
                  {p.layer === "Marine"
                    ? p.parentCompany?.companyName || "-"
                    : p.parentAccount?.name || "-"}
                </td>
                <td>{p.partnerStatus || p.status}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <CanDisable action="update">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => onUpdate?.(p)}
                      title="Edit partner"
                    >
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

      {/* Bottom Controls - Backend Pagination with DataTable styling */}
      {total > 0 && (
        <div className="row mt-3">
          <div className="col-sm-12 col-md-5">
            <div className="dataTables_info">
              Showing {startRecord} to {endRecord} of {total} entries
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <div className="dataTables_paginate paging_simple_numbers">
              <ul className="pagination">
                <li className={`paginate_button page-item previous ${page <= 1 ? "disabled" : ""}`}>
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
                      <li key={item} className="paginate_button page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    ) : (
                      <li key={item} className={`paginate_button page-item ${item === page ? "active" : ""}`}>
                        <button className="page-link" onClick={() => onPageChange?.(item)}>
                          {item}
                        </button>
                      </li>
                    )
                  )}

                <li className={`paginate_button page-item next ${page >= totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => onPageChange?.(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

