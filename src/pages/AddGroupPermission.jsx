import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

const moduleSubmodules = {
  settings: [
    { name: "Company Profile", permissions: ["Read", "Write", "Edit"] },
    { name: "Roles & Permissions", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Load Types", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Partners Classifications", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Ports", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Cabins", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Payload Type", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  administration: [
    { name: "Users", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Currency", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Taxes", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Promotions", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Contact Messages", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Term & Conditions", permissions: ["Read", "Write", "Edit"] },
  ],
  "ship-trips": [
    { name: "Ships", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Trips", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  "partners-management": [
    { name: "Business Partners", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Service Partners", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Salesmen", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Markup & Discount Board", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Commission Board", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  "sales-bookings": [
    { name: "Price List", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Ticketing Rules", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Bookings & Tickets", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Excess Baggage Tickets", permissions: ["Read", "Write", "Edit", "Delete"] },
  ],
  "checkin-boardings": [
    { name: "Passenger Checking In", permissions: ["Read", "Write"] },
    { name: "Cargo Checking In", permissions: ["Read", "Write"] },
    { name: "Vehicle Checking In", permissions: ["Read", "Write"] },
    { name: "Passenger Boarding", permissions: ["Read", "Write"] },
    { name: "Vehicle Boarding", permissions: ["Read", "Write"] },
    { name: "Trip Completion & Closure", permissions: ["Read", "Write"] },
  ],
  finance: [
    { name: "Chart of Accounts", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Bank & Cash Accounts", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Journal Entries", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Agent Top up Deposits", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "Payments & Receipts", permissions: ["Read", "Write", "Edit", "Delete"] },
    { name: "General Ledger", permissions: ["Read"] },
    { name: "Trial Balance", permissions: ["Read"] },
    { name: "Income Statement", permissions: ["Read"] },
    { name: "Balance Sheet", permissions: ["Read"] },
  ],
};

export default function AddGroupPermission() {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [layer, setLayer] = useState("");
  const [status, setStatus] = useState(true); // true = Active

  const submodules = useMemo(
    () => (moduleName ? moduleSubmodules[moduleName] || [] : []),
    [moduleName]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just prevent reload; you can wire to API later
    // console.log({ groupName, groupCode, moduleName, layer, status, submodules });
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <Link
              to="/company/settings/role-permission"
              className="btn btn-turquoise"
            >
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <h5 className="mb-3">Access Rights Group Management</h5>

                  <form id="groupForm" onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="groupName" className="form-label">
                          Group Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="groupName"
                          placeholder="Enter group name"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="groupCode" className="form-label">
                          Group Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="groupCode"
                          placeholder="Enter group code"
                          value={groupCode}
                          onChange={(e) => setGroupCode(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="moduleName" className="form-label">
                          Module Name
                        </label>
                        <select
                          className="form-select"
                          id="moduleName"
                          value={moduleName}
                          onChange={(e) => setModuleName(e.target.value)}
                        >
                          <option value="">Select Module</option>
                          <option value="settings">Settings</option>
                          <option value="administration">Administration</option>
                          <option value="ship-trips">Ship & Trips</option>
                          <option value="partners-management">
                            Partners Management
                          </option>
                          <option value="sales-bookings">
                            Sales & Bookings
                          </option>
                          <option value="checkin-boardings">
                            Checkin & Boardings
                          </option>
                          <option value="finance">Finance</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="layer" className="form-label">
                          Layer
                        </label>
                        <select
                          className="form-select"
                          id="layer"
                          value={layer}
                          onChange={(e) => setLayer(e.target.value)}
                        >
                          <option value="">Select Layer</option>
                          <option value="company">Company</option>
                          <option value="marine-agent">Marine Agent</option>
                          <option value="commercial-agent">
                            Commercial Agent
                          </option>
                          <option value="selling-agent">Selling Agent</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <div>
                          <label className="status-toggle">
                            <input
                              type="checkbox"
                              id="status"
                              checked={status}
                              onChange={(e) => setStatus(e.target.checked)}
                            />
                            <span className="slider"></span>
                          </label>
                          <span className="ms-2">
                            {status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <h6 className="mb-3">Submodules Permissions</h6>
                      <div id="permissionsContainer">
                        {moduleName && submodules.length > 0 ? (
                          <div className="module-actions">
                            <table className="table submodule-table">
                              <thead>
                                <tr>
                                  <th>Submodule</th>
                                  <th>Read</th>
                                  <th>Write</th>
                                  <th>Edit</th>
                                  <th>Delete</th>
                                </tr>
                              </thead>
                              <tbody>
                                {submodules.map((submodule) => {
                                  const submoduleKey = submodule.name
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]/g, "-");
                                  const hasRead = submodule.permissions.includes(
                                    "Read"
                                  );
                                  const hasWrite =
                                    submodule.permissions.includes("Write");
                                  const hasEdit =
                                    submodule.permissions.includes("Edit");
                                  const hasDelete =
                                    submodule.permissions.includes("Delete");

                                  return (
                                    <tr key={submoduleKey}>
                                      <td className="submodule-name">
                                        {submodule.name}
                                      </td>

                                      {/* Read */}
                                      <td className="permission-cell">
                                        {hasRead ? (
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`${submoduleKey}-read`}
                                              name={`${submoduleKey}-read`}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`${submoduleKey}-read`}
                                            ></label>
                                          </div>
                                        ) : (
                                          <span className="text-muted">-</span>
                                        )}
                                      </td>

                                      {/* Write */}
                                      <td className="permission-cell">
                                        {hasWrite ? (
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`${submoduleKey}-write`}
                                              name={`${submoduleKey}-write`}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`${submoduleKey}-write`}
                                            ></label>
                                          </div>
                                        ) : (
                                          <span className="text-muted">-</span>
                                        )}
                                      </td>

                                      {/* Edit */}
                                      <td className="permission-cell">
                                        {hasEdit ? (
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`${submoduleKey}-edit`}
                                              name={`${submoduleKey}-edit`}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`${submoduleKey}-edit`}
                                            ></label>
                                          </div>
                                        ) : (
                                          <span className="text-muted">-</span>
                                        )}
                                      </td>

                                      {/* Delete */}
                                      <td className="permission-cell">
                                        {hasDelete ? (
                                          <div className="form-check">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`${submoduleKey}-delete`}
                                              name={`${submoduleKey}-delete`}
                                            />
                                            <label
                                              className="form-check-label"
                                              htmlFor={`${submoduleKey}-delete`}
                                            ></label>
                                          </div>
                                        ) : (
                                          <span className="text-muted">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="empty-state">
                            <i className="bi bi-folder2-open text-primary"></i>
                            <p>
                              Select a module to view and configure submodule
                              permissions
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-end mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => {
                          // Same behavior as Cancel in HTML: just clear form (you can also navigate back if you want)
                          setGroupName("");
                          setGroupCode("");
                          setModuleName("");
                          setLayer("");
                          setStatus(true);
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn btn-turquoise">
                        Save
                      </button>
                    </div>
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
