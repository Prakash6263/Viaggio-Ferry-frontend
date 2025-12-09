"use client"

import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"

export default function BankAndCashAccountsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [accountType, setAccountType] = useState("Cash")

  useEffect(() => {
    if (window.jQuery && window.jQuery.fn.DataTable) {
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
  }, [])

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible)
  }

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value)
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header">
            <h5>Bank & Cash Accounts</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list">
                <li>
                  <button className="btn btn-turquoise" onClick={toggleForm}>
                    <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                    {isFormVisible ? "Hide Form" : "Add New bank Accounts"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}

        {/* Add New Account Form (Hidden by default, toggled via state) */}
        {isFormVisible && (
          <div className="row">
            <div className="col-sm-12">
              <div className="card p-4 mb-4">
                <h5 className="mb-3">Add New Account</h5>
                <form id="accountForm" className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Layer</label>
                    <input type="text" id="layer" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Partner Account</label>
                    <input type="text" id="partnerAccount" className="form-control" required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Account Type</label>
                    <select
                      id="accountType"
                      className="form-select"
                      required
                      value={accountType}
                      onChange={handleAccountTypeChange}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Account Name</label>
                    <input type="text" id="accountName" className="form-control" required />
                  </div>

                  <div className={`col-md-12 ${accountType === "Bank" ? "" : "d-none"}`} id="bankAccountNoContainer">
                    <label className="form-label">Bank Account No</label>
                    <input type="text" id="bankAccountNo" className="form-control" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Currency</label>
                    <select id="currency" className="form-select" required defaultValue="USD">
                      <option>SDG</option>
                      <option>SAR</option>
                      <option>EGP</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Ledger Code in CoA</label>
                    <input type="text" id="ledgerCode" className="form-control" required />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Note</label>
                    <textarea id="note" rows="2" className="form-control"></textarea>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-turquoise">
                      Create Account
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
                        <th>Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Company</td>
                        <td>N/A</td>
                        <td>Cash</td>
                        <td>Main Cash</td>
                        <td>N/A</td>
                        <td>USD</td>
                        <td>1100</td>
                        <td>Main cash account for daily transactions</td>
                      </tr>
                      <tr>
                        <td>Company</td>
                        <td>N/A</td>
                        <td>Bank</td>
                        <td>BOK Bank</td>
                        <td>123456789</td>
                        <td>USD</td>
                        <td>1101</td>
                        <td>Primary bank account</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
