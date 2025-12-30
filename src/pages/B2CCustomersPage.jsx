"use client"

// src/pages/B2CCustomersPage.jsx
import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import CustomerList from "../components/customers/CustomerList"
import CustomerForm from "../components/customers/CustomerForm"
import { b2cApi } from "../api/b2cApi" // Added b2cApi import
import { CirclesWithBar } from "react-loader-spinner" // import loader component
import Swal from "sweetalert2" // import SweetAlert2

export default function B2CCustomersPage() {
  const [view, setView] = useState("list") // "list" | "form"
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false) // Added loading state
  const [statusFilter, setStatusFilter] = useState("Active") // Added statusFilter state, default to "Active"
  const partners = ["Partner A", "Partner B", "Partner C"]
  const nationalities = ["USA", "Canada", "UK", "Egypt", "Saudi Arabia", "UAE", "Qatar", "Germany", "France", "Japan"]
  const countryCodes = [
    { code: "+1", name: "USA/Canada" },
    { code: "+44", name: "UK" },
    { code: "+91", name: "India" },
    { code: "+20", name: "Egypt" },
    { code: "+966", name: "Saudi Arabia" },
    { code: "+971", name: "UAE" },
    { code: "+974", name: "Qatar" },
    { code: "+49", name: "Germany" },
    { code: "+33", name: "France" },
    { code: "+81", name: "Japan" },
  ]

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await b2cApi.getUsers({ status: statusFilter, page: 1, limit: 10 })
      if (response.success) {
        // Map API data to component format
        const mappedData = response.data.map((user) => ({
          id: user._id,
          name: user.name,
          partner: user.partner || "N/A", // Updated mapping to use user.partner directly and fallback to "N/A" if null
          nationality: user.nationality,
          countryCode: "", // API doesn't provide separate code, mapped in whatsapp
          whatsappNumber: user.whatsappNumber,
          street: user.address?.street,
          city: user.address?.city,
          country: user.address?.country,
          status: user.status,
        }))
        setCustomers(mappedData)
      }
    } catch (error) {
      console.error("[v0] Error fetching B2C users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [statusFilter]) // Refetch when statusFilter changes

  const handleAddClick = () => setView("form")
  const handleCancel = () => setView("list")

  const handleSaveCustomer = (data) => {
    // In real app, call API to save
    console.log("[v0] Saving customer:", data)
    setCustomers((prev) => [...prev, { id: Date.now(), ...data }])
    setView("list")
  }

  const handleDelete = async (id) => {
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
      setLoading(true) // show loader during deletion
      try {
        const res = await b2cApi.deleteUser(id)
        if (res.success) {
          setCustomers((prev) => prev.filter((c) => c.id !== id))
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "B2C user has been deleted.",
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete user: " + error.message,
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
    setLoading(true) // show loader during status toggle
    try {
      const res = await b2cApi.toggleStatus(id, newStatus)
      if (res.success) {
        setCustomers((prev) => prev.filter((c) => c.id !== id))

        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: `User status changed to ${newStatus} successfully.`,
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to toggle status: " + error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id, updated) => {
    // Edit button is commented out in list, but keeping function for form if needed
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)))
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {view === "list" ? (
            <div id="listViewContainer">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>B2C Customers</h5>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center">
                    <label htmlFor="statusFilter" className="me-2 mb-0 fw-medium text-nowrap">
                      Filter Status:
                    </label>
                    <select
                      id="statusFilter"
                      className="form-select"
                      style={{ width: "auto" }}
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="Active">Active Users</option>
                      <option value="Inactive">Inactive Users</option>
                    </select>
                  </div>
                  <button
                    id="addNewBtn"
                    className="btn btn-turquoise fw-medium btn-hover-transform"
                    onClick={handleAddClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 me-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add New Customer
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card-table card p-3">
                    <div className="card-body">
                      {loading ? (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ minHeight: "400px" }}
                        >
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
                      ) : (
                        <CustomerList
                          customers={customers}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onToggleStatus={handleToggleStatus} // Added onToggleStatus prop
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div id="formViewContainer">
              <div className="card-table card p-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Add New Customer</h5>
                    <button
                      id="cancelBtn"
                      className="btn btn-secondary fw-medium btn-hover-transform"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>

                  <CustomerForm
                    partners={partners}
                    nationalities={nationalities}
                    countryCodes={countryCodes}
                    onCancel={handleCancel}
                    onSave={handleSaveCustomer}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  )
}
