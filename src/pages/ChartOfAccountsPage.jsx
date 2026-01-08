"use client"

import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import { ledgerApi } from "../api/ledgerApi"
import { partnerApi } from "../api/partnerApi"
import { CirclesWithBar } from "react-loader-spinner"
import Swal from "sweetalert2"

export default function ChartOfAccountsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [ledgers, setLedgers] = useState([])
  const [loading, setLoading] = useState(true)
  const [partners, setPartners] = useState([])
  const [ledgerTypes, setLedgerTypes] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 1 })
  const [formLoading, setFormLoading] = useState(false)
  const [autoFillLoading, setAutoFillLoading] = useState(false)

  const [formData, setFormData] = useState({
    ledgerType: "",
    ledgerDescription: "",
    typeSequence: "",
    ledgerCode: "",
    ledgerSequenceNumber: "",
    status: "Active",
    systemAccount: false,
    partnerAccount: "",
    notes: "",
  })

  useEffect(() => {
    fetchLedgers()
    fetchPartners()
  }, [pagination.page])

  const fetchLedgers = async () => {
    try {
      setLoading(true)
      const response = await ledgerApi.getCompanyLedgers(pagination.page, pagination.limit)

      const ledgersData = Array.isArray(response) ? response : response.data || []
      setLedgers(ledgersData)

      if (ledgersData && ledgersData.length > 0) {
        const uniqueTypes = [...new Set(ledgersData.map((l) => l.ledgerType))]
        const typeOptions = uniqueTypes.map((type) => ({
          value: type,
          label: type,
          typeSequence: ledgersData.find((l) => l.ledgerType === type)?.typeSequence || "",
        }))
        setLedgerTypes(typeOptions)
      }

      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err) {
      console.error("[v0] Error fetching ledgers:", err)
      Swal.fire("Error", "Failed to fetch ledgers", "error")
      setLedgers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPartners = async () => {
    try {
      const response = await partnerApi.getPartnersList()
      setPartners(response.data || [])
    } catch (err) {
      console.error("[v0] Error fetching partners:", err)
      setPartners([])
    }
  }

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible)
    if (isFormVisible) {
      setFormData({
        ledgerType: "",
        ledgerDescription: "",
        typeSequence: "",
        ledgerCode: "",
        ledgerSequenceNumber: "",
        status: "Active",
        systemAccount: false,
        partnerAccount: "",
        notes: "",
      })
    }
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handleLedgerTypeChange = async (e) => {
    const selectedType = e.target.value
    const selected = ledgerTypes.find((type) => type.value === selectedType)

    setFormData((prev) => ({
      ...prev,
      ledgerType: selectedType,
      typeSequence: selected?.typeSequence || "",
      ledgerCode: "",
      ledgerSequenceNumber: "",
    }))

    if (selectedType) {
      try {
        setAutoFillLoading(true)
        const response = await ledgerApi.getLedgersByType(selectedType)

        const ledgersData = Array.isArray(response) ? response : response.data || []
        if (ledgersData && ledgersData.length > 0) {
          const baseLedger = ledgersData[0]
          setFormData((prev) => ({
            ...prev,
            ledgerCode: baseLedger.ledgerCode || "",
            ledgerSequenceNumber: baseLedger.ledgerSequenceNumber || "",
          }))
        }
      } catch (err) {
        console.error("[v0] Error fetching ledger details:", err)
      } finally {
        setAutoFillLoading(false)
      }
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!formData.ledgerType) {
      Swal.fire("Error", "Please select a ledger type", "error")
      return
    }

    try {
      setFormLoading(true)

      const submitData = {
        ledgerType: formData.ledgerType,
        ledgerDescription: formData.ledgerDescription,
        typeSequence: formData.typeSequence,
        ledgerCode: formData.ledgerCode,
        ledgerSequenceNumber: formData.ledgerSequenceNumber,
        status: formData.status,
        systemAccount: formData.systemAccount,
        partnerAccount: formData.partnerAccount || null,
        notes: formData.notes,
      }

      const response = await ledgerApi.createCompanyLedger(submitData)

      if (response.success) {
        Swal.fire("Success", "Ledger created successfully", "success")
        setFormData({
          ledgerType: "",
          ledgerDescription: "",
          typeSequence: "",
          ledgerCode: "",
          ledgerSequenceNumber: "",
          status: "Active",
          systemAccount: false,
          partnerAccount: "",
          notes: "",
        })
        setIsFormVisible(false)
        fetchLedgers()
      }
    } catch (err) {
      console.error("[v0] Error creating ledger:", err)
      Swal.fire("Error", err.message || "Failed to create ledger", "error")
    } finally {
      setFormLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header">
            <h5>Chart of Accounts</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list">
                <li>
                  <div className="d-flex justify-content-end mb-3">
                    <button type="button" className="btn btn-turquoise" id="toggleForm" onClick={toggleForm}>
                      {isFormVisible ? "Hide Form" : "Create Account"}
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        <div className="row">
          <div className="col-sm-12">
            {/* Form Card (Hidden by Default) */}
            {isFormVisible && (
              <div className="card p-4 mb-4" id="formCard">
                <form id="accountForm" onSubmit={handleFormSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Ledger Type *</label>
                      <select
                        className="form-select"
                        name="ledgerType"
                        value={formData.ledgerType}
                        onChange={handleLedgerTypeChange}
                        required
                        disabled={autoFillLoading}
                      >
                        <option value="">Select a Ledger Type</option>
                        {ledgerTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ledger Description</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ledgerDescription"
                        placeholder="e.g., General Office Supplies"
                        value={formData.ledgerDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Type Sequence</label>
                      <input
                        type="text"
                        className="form-control"
                        name="typeSequence"
                        value={formData.typeSequence}
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ledger Code</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          name="ledgerCode"
                          placeholder="Auto-filled from ledger type"
                          value={formData.ledgerCode}
                          readOnly
                          disabled={autoFillLoading}
                        />
                        {autoFillLoading && <span className="input-group-text">Loading...</span>}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ledger Sequence Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ledgerSequenceNumber"
                        placeholder="Auto-filled from ledger type"
                        value={formData.ledgerSequenceNumber}
                        readOnly
                        disabled={autoFillLoading}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">&nbsp;</label>
                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="systemAccount"
                          name="systemAccount"
                          checked={formData.systemAccount}
                          onChange={handleInputChange}
                        />
                        <label className="form-check-label" htmlFor="systemAccount">
                          System Account
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Partner Account</label>
                      <select
                        className="form-select"
                        name="partnerAccount"
                        value={formData.partnerAccount}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Not Associated --</option>
                        {partners.length > 0 ? (
                          partners.map((partner) => (
                            <option key={partner._id} value={partner._id}>
                              {partner.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No partners available</option>
                        )}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        placeholder="Additional notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-4" disabled={formLoading || autoFillLoading}>
                      {formLoading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card-table card p-2">
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
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered" id="example">
                      <thead>
                        <tr>
                          <th>Ledger Code</th>
                          <th>Ledger Description</th>
                          <th>Ledger Type</th>
                          <th>Type Sequence</th>
                          <th>Status</th>
                          <th>System Account</th>
                          <th>Partner Account</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgers.length > 0 ? (
                          ledgers.map((ledger) => (
                            <tr key={ledger._id}>
                              <td>
                                <a href="#">{ledger.ledgerCode}</a>
                              </td>
                              <td>{ledger.ledgerDescription || "N/A"}</td>
                              <td>{ledger.ledgerType}</td>
                              <td>{ledger.typeSequence}</td>
                              <td>
                                <span
                                  className={`badge ${ledger.status === "Active" ? "bg-success" : "bg-danger"} status-badge`}
                                >
                                  {ledger.status}
                                </span>
                              </td>
                              <td>{ledger.systemAccount ? "Yes" : "No"}</td>
                              <td>{ledger.partnerAccount?.name || "N/A"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No ledgers found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {ledgers.length > 0 && pagination.pages > 1 && (
                <div className="d-flex justify-content-center mt-3 pb-3">
                  <nav aria-label="Pagination">
                    <ul className="pagination">
                      <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.page === 1}
                        >
                          First
                        </button>
                      </li>
                      <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <li key={page} className={`page-item ${pagination.page === page ? "active" : ""}`}>
                          <button className="page-link" onClick={() => handlePageChange(page)}>
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pagination.page === pagination.pages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                        >
                          Next
                        </button>
                      </li>
                      <li className={`page-item ${pagination.page === pagination.pages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.pages)}
                          disabled={pagination.page === pagination.pages}
                        >
                          Last
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
