import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar"
import Header from "../components/layout/Header"
import { PageWrapper } from "../components/layout/PageWrapper";

const AddCabin = () => {
  const [activeTab, setActiveTab] = useState("passengers");

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <Link to="/company/settings/cabin" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <style>
                    {`
        .toggle-label {
          display: inline-block;
          width: 50px;
          height: 25px;
          border-radius: 15px;
          background-color: #ddd;
          position: relative;
          cursor: pointer;
        }
        .toggle-checkbox {
          display: none;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #0d6efd;
        }
        .toggle-label::after {
          content: "";
          position: absolute;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: white;
          top: 2px;
          left: 2px;
          transition: all 0.3s ease;
        }
        .toggle-checkbox:checked + .toggle-label::after {
          transform: translateX(24px);
        }
      `}
                  </style>

                  <h5 className="mb-3">Add New Cabin</h5>

                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "passengers" ? "active" : ""
                        }`}
                        data-bs-toggle="tab"
                        data-bs-target="#passengersForm"
                        type="button"
                        onClick={() => setActiveTab("passengers")}
                      >
                        Passengers
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "vehicles" ? "active" : ""
                        }`}
                        data-bs-toggle="tab"
                        data-bs-target="#vehiclesForm"
                        type="button"
                        onClick={() => setActiveTab("vehicles")}
                      >
                        Vehicles
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "cargo" ? "active" : ""
                        }`}
                        data-bs-toggle="tab"
                        data-bs-target="#cargoForm"
                        type="button"
                        onClick={() => setActiveTab("cargo")}
                      >
                        Cargo
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* Passengers Form */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "passengers" ? "show active" : ""
                      }`}
                      id="passengersForm"
                    >
                      <form className="needs-validation" noValidate>
                        <div className="mb-3">
                          <label
                            htmlFor="passengers-name"
                            className="form-label"
                          >
                            Cabin Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="passengers-name"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="passengers-description"
                            className="form-label"
                          >
                            Cabin Description
                          </label>
                          <textarea
                            className="form-control"
                            id="passengers-description"
                            rows={3}
                          ></textarea>
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="passengers-remarks"
                            className="form-label"
                          >
                            Remarks
                          </label>
                          <textarea
                            className="form-control"
                            id="passengers-remarks"
                            rows={2}
                          ></textarea>
                        </div>
                        <div className="mb-3 d-flex align-items-center">
                          <label className="form-label me-3">Status</label>
                          <input
                            type="checkbox"
                            className="toggle-checkbox"
                            id="passengers-status"
                          />
                          <label
                            htmlFor="passengers-status"
                            className="toggle-label"
                          ></label>
                          <span
                            id="passengers-status-label"
                            className="ms-2"
                          >
                            Inactive
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                        >
                          Save Passenger Cabin
                        </button>
                      </form>
                    </div>

                    {/* Vehicles Form */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "vehicles" ? "show active" : ""
                      }`}
                      id="vehiclesForm"
                    >
                      <form className="needs-validation" noValidate>
                        <div className="mb-3">
                          <label
                            htmlFor="vehicles-name"
                            className="form-label"
                          >
                            Cabin Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="vehicles-name"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="vehicles-description"
                            className="form-label"
                          >
                            Cabin Description
                          </label>
                          <textarea
                            className="form-control"
                            id="vehicles-description"
                            rows={3}
                          ></textarea>
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="vehicles-remarks"
                            className="form-label"
                          >
                            Remarks
                          </label>
                          <textarea
                            className="form-control"
                            id="vehicles-remarks"
                            rows={2}
                          ></textarea>
                        </div>
                        <div className="mb-3 d-flex align-items-center">
                          <label className="form-label me-3">Status</label>
                          <input
                            type="checkbox"
                            className="toggle-checkbox"
                            id="vehicles-status"
                          />
                          <label
                            htmlFor="vehicles-status"
                            className="toggle-label"
                          ></label>
                          <span
                            id="vehicles-status-label"
                            className="ms-2"
                          >
                            Inactive
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                        >
                          Save Vehicle Cabin
                        </button>
                      </form>
                    </div>

                    {/* Cargo Form */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "cargo" ? "show active" : ""
                      }`}
                      id="cargoForm"
                    >
                      <form className="needs-validation" noValidate>
                        <div className="mb-3">
                          <label
                            htmlFor="cargo-name"
                            className="form-label"
                          >
                            Cabin Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="cargo-name"
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="cargo-description"
                            className="form-label"
                          >
                            Cabin Description
                          </label>
                          <textarea
                            className="form-control"
                            id="cargo-description"
                            rows={3}
                          ></textarea>
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="cargo-remarks"
                            className="form-label"
                          >
                            Remarks
                          </label>
                          <textarea
                            className="form-control"
                            id="cargo-remarks"
                            rows={2}
                          ></textarea>
                        </div>
                        <div className="mb-3 d-flex align-items-center">
                          <label className="form-label me-3">Status</label>
                          <input
                            type="checkbox"
                            className="toggle-checkbox"
                            id="cargo-status"
                          />
                          <label
                            htmlFor="cargo-status"
                            className="toggle-label"
                          ></label>
                          <span id="cargo-status-label" className="ms-2">
                            Inactive
                          </span>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                        >
                          Save Cargo Cabin
                        </button>
                      </form>
                    </div>
                    {/* /Cargo Form */}
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

export default AddCabin;
