"use client"

import { useEffect, useState } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"

export default function ChartOfAccountsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false)

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
                <form id="accountForm">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Ledger Type</label>
                      <select className="form-select" defaultValue="">
                        <option disabled value="">
                          Select a Ledger Type
                        </option>
                        <option>Property Plant & Equipments</option>
                        <option>Motor Vehicles</option>
                        <option>Cash & Banks</option>
                        <option>Business Partners</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ledger Description</label>
                      <input type="text" className="form-control" placeholder="e.g., General Office Supplies" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Type Sequence</label>
                      <input type="text" className="form-control" disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ledger Code</label>
                      <input type="text" className="form-control" disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select className="form-select">
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">&nbsp; &nbsp;</label>
                      <div className="col-md-12">
                        <div className="row g-3 align-items-center p-2">
                          <div className="form-check col-lg-12 mt-4">
                            <input className="form-check-input" type="checkbox" id="systemAccount" />
                            <label className="form-label" htmlFor="systemAccount">
                              System Account
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Partner Account</label>
                      <select className="form-select">
                        <option>N/A</option>
                        <option>N/A</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary px-4">
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card-table card p-2">
              <div className="card-body">
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
                      <tr>
                        <td>
                          <a href="#">11-00001</a>
                        </td>
                        <td>Ships & Associated Equipments</td>
                        <td>Property Plant & Equipments</td>
                        <td>11</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">11-00002</a>
                        </td>
                        <td>Loading & Offloading Equipments</td>
                        <td>Property Plant & Equipments</td>
                        <td>11</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">12-00001</a>
                        </td>
                        <td>IT Equipments</td>
                        <td>Furniture & Office Equipments</td>
                        <td>12</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">12-00002</a>
                        </td>
                        <td>Furniture</td>
                        <td>Furniture & Office Equipments</td>
                        <td>12</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">12-00003</a>
                        </td>
                        <td>Office Equipments</td>
                        <td>Furniture & Office Equipments</td>
                        <td>12</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">13-00001</a>
                        </td>
                        <td>Heavy Vehicles</td>
                        <td>Motor Vehicles</td>
                        <td>13</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">13-00002</a>
                        </td>
                        <td>Light Vehicles</td>
                        <td>Motor Vehicles</td>
                        <td>13</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">21-00001</a>
                        </td>
                        <td>BOK Bank 12345</td>
                        <td>Cash & Banks</td>
                        <td>21</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">21-00002</a>
                        </td>
                        <td>BOK Bank 56541</td>
                        <td>Cash & Banks</td>
                        <td>21</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">21-00003</a>
                        </td>
                        <td>Cash Safe HQ</td>
                        <td>Cash & Banks</td>
                        <td>21</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">22-00001</a>
                        </td>
                        <td>Sabihat</td>
                        <td>Business Partners</td>
                        <td>22</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
                      </tr>
                      <tr>
                        <td>
                          <a href="#">22-00002</a>
                        </td>
                        <td>Nour</td>
                        <td>Business Partners</td>
                        <td>22</td>
                        <td>
                          <span className="badge bg-success status-badge">Active</span>
                        </td>
                        <td>Yes</td>
                        <td>N/A</td>
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
