"use client"

import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import { bankCashAccountsApi } from "../api/bankCashAccountsApi"
import { currencyApi } from "../api/currencyApi"
import { partnerApi } from "../api/partnerApi"
import Swal from "sweetalert2"

const LAYER_OPTIONS = ["Company", "Marine", "Commercial", "Selling"]

export default function BankAndCashAccountsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [accountType, setAccountType] = useState("Cash")
  const [layer, setLayer] = useState("Company")
  const [accounts, setAccounts] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [partners, setPartners] = useState([])
  const [filteredPartners, setFilteredPartners] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAccountsAndData()
  }, [])

  useEffect(() => {
    if (accounts.length > 0 && window.jQuery && window.jQuery.fn.DataTable) {
      if (window.jQuery.fn.DataTable.isDataTable("#example")) {
        window.jQuery("#example").DataTable().destroy()
      }
      window.jQuery("#example").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
      })
    }
  }, [accounts])

  useEffect(() => {
    if (layer === "Company") {
      setFilteredPartners([])
    } else {
      const filtered = partners.filter((partner) => partner.layer === layer)
      setFilteredPartners(filtered)
    }
  }, [layer, partners])

  const fetchAccountsAndData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [accountsData, currenciesData, partnersData] = await Promise.all([
        bankCashAccountsApi.getAccounts(1, 50),
        currencyApi.getCompanyCurrencies(1, 100),
        partnerApi.getPartnersList(),
      ])

      setAccounts(accountsData.data || [])
      setCurrencies(currenciesData.data || [])
      setPartners(partnersData.data || [])
    } catch (err) {
      console.error("Error loading data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible)
    setError(null)
  }

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value)
  }

  const handleLayerChange = (e) => {
    setLayer(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.target)
      const submitData = {
        layer: formData.get("layer"),
        accountType: formData.get("accountType"),
        accountName: formData.get("accountName"),
        currency: formData.get("currency"),
        note: formData.get("note"),
        companyId: localStorage.getItem("companyId"),
      }

      if (accountType === "Bank") {
        submitData.bankAccountNo = formData.get("bankAccountNo")
      }

      if (layer !== "Company") {
        submitData.partnerAccount = formData.get("partnerAccount")
      }

      await bankCashAccountsApi.createAccount(submitData)
      await fetchAccountsAndData()

      e.target.reset()
      setAccountType("Cash")
      setLayer("Company")
      setIsFormVisible(false)

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Account created successfully!",
        timer: 2000,
        showConfirmButton: false,
      })
    } catch (err) {
      console.error("Form submission error:", err)
      setError(err.message)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to create account",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getCurrencyCode = (currencyId) => {
    const currency = currencies.find((c) => c._id === currencyId)
    return currency ? currency.currencyCode : currencyId
  }

  const getPartnerName = (partnerData) => {
    if (!partnerData) return "N/A"
    if (typeof partnerData === "object") {
      return partnerData.name || partnerData.partnerName || "N/A"
    }
    const partner = partners.find((p) => p._id === partnerData)
    return partner ? partner.name || partner.partnerName : "N/A"
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="page-header">
          <div className="content-page-header">
            <h5>Bank & Cash Accounts</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list">
                <li>
                  <button className="btn btn-turquoise" onClick={toggleForm}>
                    <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                    {isFormVisible ? "Hide Form" : "Add New Bank Account"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
          </div>
        )}

        {isFormVisible && (
          <div className="row">
            <div className="col-sm-12">
              <div className="card p-4 mb-4">
                <h5 className="mb-3">Add New Account</h5>
                <form id="accountForm" className="row g-4" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label">Layer *</label>
                    <select name="layer" className="form-select" value={layer} onChange={handleLayerChange} required>
                      {LAYER_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {layer !== "Company" && (
                    <div className="col-md-6">
                      <label className="form-label">Partner Account *</label>
                      <select name="partnerAccount" className="form-select" required>
                        <option value="">Select Partner</option>
                        {filteredPartners.map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.name || partner.partnerName}
                          </option>
                        ))}
                      </select>
                      {filteredPartners.length === 0 && layer !== "Company" && (
                        <small className="text-muted">No partners available for {layer} layer</small>
                      )}
                    </div>
                  )}

                  <div className="col-md-6">
                    <label className="form-label">Account Type *</label>
                    <select
                      name="accountType"
                      className="form-select"
                      value={accountType}
                      onChange={handleAccountTypeChange}
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Account Name *</label>
                    <input type="text" name="accountName" className="form-control" required />
                  </div>

                  {accountType === "Bank" && (
                    <div className="col-md-6">
                      <label className="form-label">Bank Account No</label>
                      <input type="text" name="bankAccountNo" className="form-control" />
                    </div>
                  )}

                  <div className="col-md-6">
                    <label className="form-label">Currency *</label>
                    <select name="currency" className="form-select" required>
                      <option value="">Select Currency</option>
                      {currencies.map((currency) => (
                        <option key={currency._id} value={currency._id}>
                          {currency.currencyCode}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Ledger Code in CoA</label>
                    <input type="text" name="ledgerCode" className="form-control" readOnly />
                    <small className="text-muted">Auto-generated by system</small>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Note</label>
                    <textarea name="note" rows="2" className="form-control"></textarea>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-turquoise" disabled={submitting || loading}>
                      {submitting ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-2">
              <div className="card-body">
                {loading && accounts.length === 0 ? (
                  <div className="text-center p-4">
                    <p>Loading accounts...</p>
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="text-center p-4">
                    <p>No accounts found. Create one to get started.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered" id="example">
                      <thead>
                        <tr>
                          <th>Layer</th>
                          <th>Partner Account</th>
                          <th>Account Type</th>
                          <th>Account Name</th>
                          <th>Bank Account No</th>
                          <th>Currency</th>
                          <th>Ledger Code</th>
                          <th>Status</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account) => (
                          <tr key={account._id}>
                            <td>{account.layer || "N/A"}</td>
                            <td>{getPartnerName(account.partnerAccount)}</td>
                            <td>{account.accountType}</td>
                            <td>{account.accountName}</td>
                            <td>{account.bankAccountNo || "N/A"}</td>
                            <td>{getCurrencyCode(account.currency)}</td>
                            <td>{account.ledgerCode || "N/A"}</td>
                            <td>
                              <span className={`badge ${account.status === "Active" ? "bg-success" : "bg-danger"}`}>
                                {account.status}
                              </span>
                            </td>
                            <td>{account.note || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
