"use client"

// src/pages/BusinessPartnersPage.jsx
import { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import PartnerList from "../components/businessPartners/PartnerList"
import PartnerKanban from "../components/businessPartners/PartnerKanban"
import PartnerModal from "../components/businessPartners/PartnerModal"
import { partnerApi } from "../api/partnerApi"
import { CirclesWithBar } from "react-loader-spinner"
import Swal from "sweetalert2"

export default function BusinessPartnersPage() {
  const [view, setView] = useState("list") // "list" | "kanban"
  const [modalOpen, setModalOpen] = useState(false)
  const [partners, setPartners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingPartner, setEditingPartner] = useState(null) // Track partner being edited

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await partnerApi.getPartnersList()
      setPartners(response.data || [])
    } catch (err) {
      console.error("[v0] Error fetching partners:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPartner = async (payload) => {
    try {
      setLoading(true)
      if (editingPartner) {
        await partnerApi.updatePartner(editingPartner._id, payload)
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Partner updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        })
      } else {
        await partnerApi.addPartner(payload)
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Partner added successfully.",
          timer: 2000,
          showConfirmButton: false,
        })
      }
      await fetchPartners() // refresh the list
      setModalOpen(false)
      setEditingPartner(null)
    } catch (err) {
      console.error("[v0] Error saving partner:", err)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save partner: " + err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePartner = (partner) => {
    setEditingPartner(partner)
    setModalOpen(true)
  }

  const handleDisablePartner = async (partner) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to disable this partner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, disable it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await partnerApi.disablePartner(partner._id)
          Swal.fire("Disabled!", "Partner has been disabled.", "success")
          await fetchPartners()
        } catch (err) {
          Swal.fire("Error", "Failed to disable partner: " + err.message, "error")
        }
      }
    })
  }

  const handleEnablePartner = async (partner) => {
    try {
      await partnerApi.enablePartner(partner._id)
      Swal.fire("Enabled!", "Partner has been enabled.", "success")
      await fetchPartners()
    } catch (err) {
      Swal.fire("Error", "Failed to enable partner: " + err.message, "error")
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setEditingPartner(null)
  }

  const handleAddClick = () => {
    setEditingPartner(null)
    setModalOpen(true)
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
              <h5>Partners</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <button id="add-partner-btn" className="btn btn-turquoise" onClick={handleAddClick}>
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i> Add New Partner
                    </button>
                  </li>
                  <li>
                    <div className="me-5">
                      <a
                        id="list-btn"
                        className={`btn btn-sm btn-outline-secondary me-2 ${view === "list" ? "active" : ""}`}
                        style={{ padding: 5, borderRadius: 5 }}
                        onClick={() => setView("list")}
                      >
                        <i className="fa-solid fa-bars fa-lg"></i>
                      </a>
                      <a
                        id="kanban-btn"
                        className={`btn btn-sm btn-outline-secondary ${view === "kanban" ? "active" : ""}`}
                        style={{ padding: 5, borderRadius: 5 }}
                        onClick={() => setView("kanban")}
                      >
                        <i className="fa-solid fa-th-large fa-lg"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="card card-table p-2 d-flex">
            <div className="card-body">
              {loading ? (
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
              ) : error ? (
                <p className="text-danger">Error: {error}</p>
              ) : (
                <>
                  {view === "list" ? (
                    <PartnerList
                      partners={partners}
                      onUpdate={handleUpdatePartner}
                      onDisable={handleDisablePartner}
                      onEnable={handleEnablePartner}
                    />
                  ) : (
                    <PartnerKanban partners={partners} />
                  )}
                </>
              )}
            </div>

            <PartnerModal
              open={modalOpen}
              onClose={handleModalClose}
              onSave={handleAddPartner}
              editingPartner={editingPartner}
              allPartners={partners}
            />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
