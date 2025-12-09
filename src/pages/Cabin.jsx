import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { PageWrapper } from "../components/layout/PageWrapper";

const Cabin = () => {
  const [activeTab, setActiveTab] = useState("passengers");

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <div className="d-flex justify-content-between align-items-center mb-4 w-100">
                <h5>Cabin</h5>
                <div className="list-btn">
                  <ul className="filter-list">
                    <li>
                      <Link
                        to="/company/settings/add-cabin"
                        className="btn btn-turquoise"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        ></i>
                        Add New Cabin
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* Nav tabs */}
                  <ul className="nav nav-tabs mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "passengers" ? "active" : ""
                        }`}
                        data-bs-toggle="tab"
                        data-bs-target="#passengersList"
                        type="button"
                        onClick={() => setActiveTab("passengers")}
                      >
                        Passengers
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "vehicles" ? "active" : ""
                        }`}
                        data-bs-toggle="tab"
                        data-bs-target="#vehiclesList"
                        type="button"
                        onClick={() => setActiveTab("vehicles")}
                      >
                        Vehicles
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "cargo" ? "active" : ""
                        }`}
                        data-bs-toggle="tab"
                        data-bs-target="#cargoList"
                        type="button"
                        onClick={() => setActiveTab("cargo")}
                      >
                        Cargo
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* Passengers List */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "passengers" ? "show active" : ""
                      }`}
                      id="passengersList"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Cabin Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Deck 1</td>
                              <td>
                                <span className="badge badge-active">
                                  Active
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Deck 2</td>
                              <td>
                                <span className="badge badge-active">
                                  Active
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vehicles List */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "vehicles" ? "show active" : ""
                      }`}
                      id="vehiclesList"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Cabin Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Deck 1</td>
                              <td>
                                <span className="badge badge-active">
                                  Active
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Deck 2</td>
                              <td>
                                <span className="badge badge-active">
                                  Active
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Cargo List */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "cargo" ? "show active" : ""
                      }`}
                      id="cargoList"
                    >
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Cabin Name</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Deck 1</td>
                              <td>
                                <span className="badge badge-active">
                                  Active
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Deck 2</td>
                              <td>
                                <span className="badge badge-active">
                                  Active
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* /Cargo List */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default Cabin;
