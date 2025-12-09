import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

export default function RolePermission() {
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
                    <Link
                      className="btn btn-turquoise"
                      to="/company/settings/add-group-permission"
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      ></i>
                      Add New Group Permission
                    </Link>
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
                    `}
                  </style>

                  <div className="table-responsive">
                    <table
                      id="example"
                      className="table table-striped"
                      style={{ width: "100%" }}
                    >
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
                        <tr>
                          <td>Finance Admin</td>
                          <td>FIN-001</td>
                          <td>Finance</td>
                          <td>
                            <span className="badge bg-primary">Company</span>
                          </td>
                          <td>
                            <label className="status-toggle">
                              <input type="checkbox" defaultChecked />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td className="action-buttons">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>Sales Manager</td>
                          <td>SLS-002</td>
                          <td>Sales &amp; Bookings</td>
                          <td>
                            <span className="badge bg-success">
                              Commercial Agent
                            </span>
                          </td>
                          <td>
                            <label className="status-toggle">
                              <input type="checkbox" defaultChecked />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td className="action-buttons">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>

                        <tr>
                          <td>Operations Staff</td>
                          <td>OPS-003</td>
                          <td>Checkin &amp; Boardings</td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              Selling Agent
                            </span>
                          </td>
                          <td>
                            <label className="status-toggle">
                              <input type="checkbox" />
                              <span className="slider"></span>
                            </label>
                          </td>
                          <td className="action-buttons">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* end table-responsive */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
