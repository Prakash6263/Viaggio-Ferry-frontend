import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

export default function Port() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Ports Management</h5>

              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-turquoise"
                      to="/company/settings/add-port"
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      ></i>
                      Add New port
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
                  <div className="table-responsive">
                    <table
                      className="table table-bordered"
                      id="example" // keep same id for CSS / future DataTables
                    >
                      <thead>
                        <tr>
                          <th>Port Name</th>
                          <th>Port Code</th>
                          <th>Country</th>
                          <th>Timezone</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Port Sudan</td>
                          <td>PSD</td>
                          <td>Sudan</td>
                          <td>UTC+02:00</td>
                          <td>
                            <span className="badge badge-active">Active</span>
                          </td>
                        </tr>

                        <tr>
                          <td>Jeddah Islamic Port</td>
                          <td>JED</td>
                          <td>Saudi Arabia</td>
                          <td>UTC+03:00</td>
                          <td>
                            <span className="badge badge-active">Active</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* /table-responsive */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
