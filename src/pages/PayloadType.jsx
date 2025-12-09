import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

const PayloadType = () => {
  const [activeTab, setActiveTab] = useState("passenger"); // passenger | cargo | vehicle

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Payload Type Management</h5>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* Tabs */}
                  <ul className="nav nav-tabs" id="payloadTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "passenger" ? "active" : ""
                        }`}
                        id="passenger-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#passenger"
                        type="button"
                        role="tab"
                        aria-controls="passenger"
                        aria-selected={activeTab === "passenger"}
                        onClick={() => setActiveTab("passenger")}
                      >
                        <i className="bi bi-people-fill"></i> Passenger Types
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "cargo" ? "active" : ""
                        }`}
                        id="cargo-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#cargo"
                        type="button"
                        role="tab"
                        aria-controls="cargo"
                        aria-selected={activeTab === "cargo"}
                        onClick={() => setActiveTab("cargo")}
                      >
                        <i className="bi bi-box-seam"></i> Cargo Types
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "vehicle" ? "active" : ""
                        }`}
                        id="vehicle-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#vehicle"
                        type="button"
                        role="tab"
                        aria-controls="vehicle"
                        aria-selected={activeTab === "vehicle"}
                        onClick={() => setActiveTab("vehicle")}
                      >
                        <i className="bi bi-truck-front-fill"></i> Vehicle Types
                      </button>
                    </li>
                  </ul>

                  {/* Tab Contents */}
                  <div className="tab-content" id="payloadTabsContent">
                    {/* Passenger Types Tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "passenger" ? "show active" : ""
                      }`}
                      id="passenger"
                      role="tabpanel"
                      aria-labelledby="passenger-tab"
                    >
                      <div className="row mb-3">
                        <div className="col">
                          <button
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#addPassengerModal"
                            type="button"
                          >
                            <i className="bi bi-plus-circle"></i> Add New Passenger Type
                          </button>
                        </div>
                      </div>

                      <div className="table-container">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Type Name</th>
                              <th>Code</th>
                              <th>Description</th>
                              <th>Age Range</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Adult</td>
                              <td>ADT</td>
                              <td>Standard adult passenger</td>
                              <td>12+ years</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Child</td>
                              <td>CHD</td>
                              <td>Child passenger with discount</td>
                              <td>2-11 years</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Infant</td>
                              <td>INF</td>
                              <td>Infant passenger without seat</td>
                              <td>0-23 months</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Crew</td>
                              <td>CREW</td>
                              <td>Vessel crew member</td>
                              <td>N/A</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Senior</td>
                              <td>SEN</td>
                              <td>Senior citizen with discount</td>
                              <td>60+ years</td>
                              <td>
                                <span className="status-inactive">
                                  <i className="bi bi-circle-fill"></i> Inactive
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Cargo Types Tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "cargo" ? "show active" : ""
                      }`}
                      id="cargo"
                      role="tabpanel"
                      aria-labelledby="cargo-tab"
                    >
                      <div className="row mb-3">
                        <div className="col">
                          <button
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#addCargoModal"
                            type="button"
                          >
                            <i className="bi bi-plus-circle"></i> Add New Cargo Type
                          </button>
                        </div>
                      </div>

                      <div className="table-container">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Type Name</th>
                              <th>Code</th>
                              <th>Description</th>
                              <th>Max Weight (kg)</th>
                              <th>Dimensions (L×W×H)</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Pallet A</td>
                              <td>PLA</td>
                              <td>Standard pallet type A</td>
                              <td>500</td>
                              <td>120×100×150 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Pallet B</td>
                              <td>PLB</td>
                              <td>Standard pallet type B</td>
                              <td>750</td>
                              <td>120×100×180 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Container</td>
                              <td>CON</td>
                              <td>Standard shipping container</td>
                              <td>2000</td>
                              <td>600×240×260 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Heavy Equipment</td>
                              <td>HEQ</td>
                              <td>Oversized heavy machinery</td>
                              <td>5000</td>
                              <td>Custom</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Refrigerated Cargo</td>
                              <td>REF</td>
                              <td>Temperature controlled cargo</td>
                              <td>1000</td>
                              <td>120×100×150 cm</td>
                              <td>
                                <span className="status-inactive">
                                  <i className="bi bi-circle-fill"></i> Inactive
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Vehicle Types Tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "vehicle" ? "show active" : ""
                      }`}
                      id="vehicle"
                      role="tabpanel"
                      aria-labelledby="vehicle-tab"
                    >
                      <div className="row mb-3">
                        <div className="col">
                          <button
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#addVehicleModal"
                            type="button"
                          >
                            <i className="bi bi-plus-circle"></i> Add New Vehicle Type
                          </button>
                        </div>
                      </div>

                      <div className="table-container">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Type Name</th>
                              <th>Code</th>
                              <th>Description</th>
                              <th>Max Weight (kg)</th>
                              <th>Dimensions (L×W×H)</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Sedan</td>
                              <td>SED</td>
                              <td>Standard passenger car</td>
                              <td>2000</td>
                              <td>450×180×150 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Pickup</td>
                              <td>PIK</td>
                              <td>Pickup truck</td>
                              <td>3000</td>
                              <td>550×200×180 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Bus</td>
                              <td>BUS</td>
                              <td>Passenger bus</td>
                              <td>12000</td>
                              <td>1200×250×350 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Truck</td>
                              <td>TRK</td>
                              <td>Standard truck</td>
                              <td>10000</td>
                              <td>900×250×350 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Trailer</td>
                              <td>TRL</td>
                              <td>Trailer truck</td>
                              <td>35000</td>
                              <td>1600×250×400 cm</td>
                              <td>
                                <span className="status-active">
                                  <i className="bi bi-circle-fill"></i> Active
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td>Motorcycle</td>
                              <td>MOT</td>
                              <td>Motorcycle or scooter</td>
                              <td>400</td>
                              <td>220×80×120 cm</td>
                              <td>
                                <span className="status-inactive">
                                  <i className="bi bi-circle-fill"></i> Inactive
                                </span>
                              </td>
                              <td className="action-buttons">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  type="button"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  type="button"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* /Vehicle tab */}
                  </div>

                  {/* Modals (kept same as HTML, but no inline JS) */}

                  {/* Add Passenger Modal */}
                  <div
                    className="modal fade"
                    id="addPassengerModal"
                    tabIndex="-1"
                    aria-labelledby="addPassengerModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5
                            className="modal-title"
                            id="addPassengerModalLabel"
                          >
                            Add New Passenger Type
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form id="addPassengerForm">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="passengerTypeName"
                                placeholder="Type Name"
                                required
                              />
                              <label htmlFor="passengerTypeName">
                                Type Name
                              </label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="passengerTypeCode"
                                placeholder="Code"
                                required
                              />
                              <label htmlFor="passengerTypeCode">Code</label>
                            </div>
                            <div className="form-floating mb-3">
                              <textarea
                                className="form-control"
                                id="passengerTypeDescription"
                                placeholder="Description"
                                style={{ height: "100px" }}
                              ></textarea>
                              <label htmlFor="passengerTypeDescription">
                                Description
                              </label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="passengerTypeAgeRange"
                                placeholder="Age Range"
                              />
                              <label htmlFor="passengerTypeAgeRange">
                                Age Range
                              </label>
                            </div>
                            <div className="form-check form-switch mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="passengerTypeStatus"
                                defaultChecked
                              />
                              <label
                                className="form-check-label"
                                htmlFor="passengerTypeStatus"
                              >
                                Active
                              </label>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            // onClick handler can be wired later
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Cargo Modal */}
                  <div
                    className="modal fade"
                    id="addCargoModal"
                    tabIndex="-1"
                    aria-labelledby="addCargoModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="addCargoModalLabel">
                            Add New Cargo Type
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form id="addCargoForm">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="cargoTypeName"
                                placeholder="Type Name"
                                required
                              />
                              <label htmlFor="cargoTypeName">Type Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="cargoTypeCode"
                                placeholder="Code"
                                required
                              />
                              <label htmlFor="cargoTypeCode">Code</label>
                            </div>
                            <div className="form-floating mb-3">
                              <textarea
                                className="form-control"
                                id="cargoTypeDescription"
                                placeholder="Description"
                                style={{ height: "100px" }}
                              ></textarea>
                              <label htmlFor="cargoTypeDescription">
                                Description
                              </label>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <div className="form-floating">
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="cargoTypeMaxWeight"
                                    placeholder="Max Weight (kg)"
                                  />
                                  <label htmlFor="cargoTypeMaxWeight">
                                    Max Weight (kg)
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="cargoTypeDimensions"
                                    placeholder="Dimensions"
                                  />
                                  <label htmlFor="cargoTypeDimensions">
                                    Dimensions (L×W×H)
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-check form-switch mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="cargoTypeStatus"
                                defaultChecked
                              />
                              <label
                                className="form-check-label"
                                htmlFor="cargoTypeStatus"
                              >
                                Active
                              </label>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            // onClick can be wired later
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Vehicle Modal */}
                  <div
                    className="modal fade"
                    id="addVehicleModal"
                    tabIndex="-1"
                    aria-labelledby="addVehicleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="addVehicleModalLabel">
                            Add New Vehicle Type
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <form id="addVehicleForm">
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="vehicleTypeName"
                                placeholder="Type Name"
                                required
                              />
                              <label htmlFor="vehicleTypeName">Type Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <input
                                type="text"
                                className="form-control"
                                id="vehicleTypeCode"
                                placeholder="Code"
                                required
                              />
                              <label htmlFor="vehicleTypeCode">Code</label>
                            </div>
                            <div className="form-floating mb-3">
                              <textarea
                                className="form-control"
                                id="vehicleTypeDescription"
                                placeholder="Description"
                                style={{ height: "100px" }}
                              ></textarea>
                              <label htmlFor="vehicleTypeDescription">
                                Description
                              </label>
                            </div>
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <div className="form-floating">
                                  <input
                                    type="number"
                                    className="form-control"
                                    id="vehicleTypeMaxWeight"
                                    placeholder="Max Weight (kg)"
                                  />
                                  <label htmlFor="vehicleTypeMaxWeight">
                                    Max Weight (kg)
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-floating">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="vehicleTypeDimensions"
                                    placeholder="Dimensions"
                                  />
                                  <label htmlFor="vehicleTypeDimensions">
                                    Dimensions (L×W×H)
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="form-check form-switch mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="vehicleTypeStatus"
                                defaultChecked
                              />
                              <label
                                className="form-check-label"
                                htmlFor="vehicleTypeStatus"
                              >
                                Active
                              </label>
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            // onClick can be wired later
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toast container (static UI only, no JS wired yet) */}
                  <div className="toast-container">
                    <div
                      className="toast"
                      id="notificationToast"
                      role="alert"
                      aria-live="assertive"
                      aria-atomic="true"
                    >
                      <div className="toast-header">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        <strong className="me-auto">Notification</strong>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="toast"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="toast-body" id="toastMessage">
                        Operation completed successfully!
                      </div>
                    </div>
                  </div>
                  {/* /Toast */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default PayloadType;
