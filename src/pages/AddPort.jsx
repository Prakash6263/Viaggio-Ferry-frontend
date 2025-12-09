import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

export default function AddPort() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <Link
              to="/company/settings/port"
              className="btn btn-turquoise"
            >
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <h5 className="mb-3">Add New Port</h5>

                  <form>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="portName"
                          className="form-label"
                        >
                          Port Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="portName"
                          placeholder="e.g., Port Sudan"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="portCode"
                          className="form-label"
                        >
                          Port Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="portCode"
                          placeholder="e.g., PSD"
                          required
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label
                          htmlFor="countrySelect"
                          className="form-label"
                        >
                          Country
                        </label>
                        <select
                          id="countrySelect"
                          className="form-select"
                          required
                        >
                          <option selected disabled>
                            Select Country
                          </option>
                          <option value="Sudan">Sudan</option>
                          <option value="Egypt">Egypt</option>
                          <option value="India">India</option>
                          {/* Add more countries as needed */}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label
                          htmlFor="timezone"
                          className="form-label"
                        >
                          Timezone
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="timezone"
                          placeholder="e.g., UTC+02:00"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="statusSelect"
                        className="form-label"
                      >
                        Status
                      </label>
                      <select
                        id="statusSelect"
                        className="form-select"
                      >
                        <option defaultValue="Active">Active</option>
                        <option>Inactive</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="notes"
                        className="form-label"
                      >
                        Notes
                      </label>
                      <textarea
                        className="form-control"
                        id="notes"
                        rows="3"
                        placeholder="Add a note about this port"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-turquoise"
                    >
                      Add Port
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
