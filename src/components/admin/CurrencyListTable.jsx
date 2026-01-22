// "use client"

// import { useEffect, useState } from "react"
// import { CirclesWithBar } from "react-loader-spinner"
// import { currencyApi } from "../../api/currencyApi"
// import { useNavigate } from "react-router-dom"
// import Swal from "sweetalert2"

// export default function CurrencyListTable() {
//   const navigate = useNavigate()
//   const [currencies, setCurrencies] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const fetchCurrencies = async () => {
//     try {
//       setLoading(true)
//       const response = await currencyApi.getCompanyCurrencies(1, 10)
//       const sortedCurrencies = (response.data || []).sort((a, b) => {
//         if (a.isDefault && !b.isDefault) return -1
//         if (!a.isDefault && b.isDefault) return 1
//         return 0
//       })
//       setCurrencies(sortedCurrencies)
//       setError(null)
//     } catch (err) {
//       console.error("[v0] Error fetching currencies:", err)
//       setError(err.message || "Failed to load currencies")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchCurrencies()
//   }, [])

//   const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//       hour12: true,
//     })
//   }

//   useEffect(() => {
//     const el = document.getElementById("currencyTable")
//     if (!el || !window.DataTable) return

//     // destroy if hot-reloaded
//     try {
//       if (el._dt) {
//         el._dt.destroy()
//         el._dt = null
//       }
//     } catch {}

//     const dt = new window.DataTable(el, {
//       paging: true,
//       pageLength: 10,
//       lengthMenu: [10, 25, 50, 100],
//       searching: true,
//       ordering: false, // Disable sorting to preserve default currency order
//       info: true,
//       layout: {
//         topStart: "pageLength",
//         topEnd: "search",
//         bottomStart: "info",
//         bottomEnd: "paging",
//       },
//     })

//     el._dt = dt
//     return () => {
//       try {
//         dt.destroy()
//       } catch {}
//       el._dt = null
//     }
//   }, [currencies])

//   const handleHistory = (currencyId) => {
//     navigate(`/company/administration/currency-history/${currencyId}`)
//   }

//   const handleUpdate = (currencyId) => {
//     navigate(`/company/administration/edit-currency/${currencyId}`)
//   }

//   const handleDelete = async (currencyId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//     })

//     if (result.isConfirmed) {
//       try {
//         setLoading(true) // show loader during deletion
//         const res = await currencyApi.deleteCompanyCurrency(currencyId)
//         if (res.success) {
//           Swal.fire({
//             icon: "success",
//             title: "Deleted!",
//             text: res.message || "Currency has been deleted successfully.",
//             timer: 2000,
//             showConfirmButton: false,
//           })
//           fetchCurrencies() // Refresh the list
//         }
//       } catch (err) {
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: err.message || "Failed to delete currency",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//   }

//   return (
//     <div className="card-table card p-2">
//       <div className="card-body">
//         {loading && (
//           <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
//             <CirclesWithBar
//               height="100"
//               width="100"
//               color="#05468f"
//               outerCircleColor="#05468f"
//               innerCircleColor="#05468f"
//               barColor="#05468f"
//               ariaLabel="circles-with-bar-loading"
//               visible={true}
//             />
//           </div>
//         )}

//         {error && (
//           <div className="alert alert-danger" role="alert">
//             {error}
//           </div>
//         )}

//         {!loading && !error && (
//           <div className="table-responsive">
//             <table id="currencyTable" className="table table-striped" style={{ width: "100%" }}>
//               <thead>
//                 <tr>
//                   <th>Currency Code</th>
//                   <th>Currency Name</th>
//                   <th>Date and Time</th>
//                   <th>Current Rate</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currencies.map((currency) => (
//                   <tr key={currency._id}>
//                     <td>{currency.currencyCode || "N/A"}</td>
//                     <td>{currency.currencyName || "N/A"}</td>
//                     <td>{formatDateTime(currency.lastRateUpdate)}</td>
//                     <td>{currency.currentRate ? currency.currentRate.toFixed(2) : "N/A"}</td>
//                     <td>
//                       {!currency.isDefault ? (
//                         <>
//                           <button
//                             className="btn btn-sm btn-info me-2"
//                             onClick={() => handleHistory(currency._id)}
//                             title="View History"
//                           >
//                             <i className="bi bi-clock-history"></i> History
//                           </button>
//                           <button
//                             className="btn btn-sm btn-primary me-2"
//                             onClick={() => handleUpdate(currency._id)}
//                             title="Update Currency"
//                           >
//                             <i className="bi bi-pencil"></i> Update
//                           </button>
//                           {/* <button
//                             className="btn btn-sm btn-danger"
//                             onClick={() => handleDelete(currency._id)}
//                             title="Delete Currency"
//                           >
//                             <i className="bi bi-trash"></i> Delete
//                           </button> */}
//                         </>
//                       ) : (
//                         <span className="badge bg-secondary">Default Currency</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react"
import { CirclesWithBar } from "react-loader-spinner"
import { currencyApi } from "../../api/currencyApi"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import CanDisable from "../CanDisable"

export default function CurrencyListTable() {
  const navigate = useNavigate()
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCurrencies = async () => {
    try {
      setLoading(true)
      const response = await currencyApi.getCompanyCurrencies(1, 10)
      const sortedCurrencies = (response.data || []).sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1
        if (!a.isDefault && b.isDefault) return 1
        return 0
      })
      setCurrencies(sortedCurrencies)
      setError(null)
    } catch (err) {
      console.error("[v0] Error fetching currencies:", err)
      setError(err.message || "Failed to load currencies")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrencies()
  }, [])

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  useEffect(() => {
    const el = document.getElementById("currencyTable")
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
      ordering: false, // Disable sorting to preserve default currency order
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
  }, [currencies])

  const handleHistory = (currencyId) => {
    navigate(`/company/administration/currency-history/${currencyId}`)
  }

  const handleUpdate = (currencyId) => {
    navigate(`/company/administration/edit-currency/${currencyId}`)
  }

  const handleDelete = async (currencyId) => {
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
        setLoading(true) // show loader during deletion
        const res = await currencyApi.deleteCompanyCurrency(currencyId)
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: res.message || "Currency has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          })
          fetchCurrencies() // Refresh the list
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete currency",
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
            <table id="currencyTable" className="table table-striped" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Currency Code</th>
                  <th>Currency Name</th>
                  <th>Date and Time</th>
                  <th>Current Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => (
                  <tr key={currency._id}>
                    <td>{currency.currencyCode || "N/A"}</td>
                    <td>{currency.currencyName || "N/A"}</td>
                    <td>{formatDateTime(currency.lastRateUpdate)}</td>
                    <td>{currency.currentRate ? currency.currentRate.toFixed(2) : "N/A"}</td>
                    <td>
                      {!currency.isDefault ? (
                        <>
                          <button
                            className="btn btn-sm btn-info me-2"
                            onClick={() => handleHistory(currency._id)}
                            title="View History"
                          >
                            <i className="bi bi-clock-history"></i> History
                          </button>
                          <CanDisable action="update">
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleUpdate(currency._id)}
                              title="Update Currency"
                            >
                              <i className="bi bi-pencil"></i> Update
                            </button>
                          </CanDisable>
                          {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(currency._id)}
                            title="Delete Currency"
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button> */}
                        </>
                      ) : (
                        <span className="badge bg-secondary">Default Currency</span>
                      )}
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
