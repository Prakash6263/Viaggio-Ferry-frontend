import React, { useMemo, useState, useEffect } from "react";

export default function AddUserForm() {
  // ---- STATE
  const [tab, setTab] = useState("profile"); // 'profile' | 'access'
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    position: "",
    agentAssignment: "",
    isSalesman: false,
    remarks: "",
  });

  // ---- CONSTANTS (ported from HTML script)
  const agentLayerMap = useMemo(
    () => ({
      company: { type: "Company", layer: "company" },
      "marine-agent-a1": { type: "Marine Agent", layer: "marine-agent" },
      "marine-agent-a2": { type: "Marine Agent", layer: "marine-agent" },
      "commercial-agent-a1-1": { type: "Commercial Agent", layer: "commercial-agent" },
      "commercial-agent-a1-2": { type: "Commercial Agent", layer: "commercial-agent" },
      "selling-agent-a1-1-1": { type: "Selling Agent", layer: "selling-agent" },
      "selling-agent-a1-1-2": { type: "Selling Agent", layer: "selling-agent" },
    }),
    []
  );

  const accessRightsGroups = useMemo(
    () => [
      { id: 1, name: "Finance Admin", module: "finance", layer: "company" },
      { id: 2, name: "Sales Rep", module: "sales-bookings", layer: "commercial-agent" },
      { id: 3, name: "Ops Staff", module: "checkin-boardings", layer: "marine-agent" },
    ],
    []
  );

  const moduleSubmodules = useMemo(
    () => ({
      settings: ["Company Profile", "Roles & Permissions"],
      administration: ["Users", "Currency", "Taxes"],
      "ship-trips": ["Ships", "Trips"],
      "partners-management": ["Business Partners", "Service Partners"],
      "sales-bookings": ["Price List", "Bookings & Tickets"],
      "checkin-boardings": ["Passenger Checking In", "Cargo Checking In"],
      finance: ["Chart of Accounts", "Payments & Receipts"],
    }),
    []
  );

  // module access selections
  const [moduleAccess, setModuleAccess] = useState({}); // { moduleKey: groupId }

  // when agentAssignment changes, clear moduleAccess
  useEffect(() => {
    setModuleAccess({});
  }, [form.agentAssignment]);

  const layerInfo = form.agentAssignment ? agentLayerMap[form.agentAssignment] : null;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSelectAccess = (moduleKey, value) => {
    setModuleAccess((s) => ({ ...s, [moduleKey]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // assemble payload (you can post to API here)
    const payload = { ...form, moduleAccess };
    console.log("Create User payload:", payload);
    alert("User created (mock). Check console for payload.");
  };

  return (
    <form onSubmit={onSubmit}>
      {/* tabs (keep classes names from HTML) */}
      <ul className="nav nav-tabs" id="userTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${tab === "profile" ? "active" : ""}`}
            onClick={() => setTab("profile")}
            role="tab"
            aria-selected={tab === "profile"}
          >
            User Profile
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${tab === "access" ? "active" : ""}`}
            onClick={() => setTab("access")}
            role="tab"
            aria-selected={tab === "access"}
          >
            Module Access
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3" id="userTabsContent">
        {/* PROFILE TAB */}
        <div className={`tab-pane fade ${tab === "profile" ? "show active" : ""}`} id="profile" role="tabpanel">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                placeholder="Full Name"
                value={form.fullName}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="Email Address"
                value={form.email}
                onChange={onChange}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="position" className="form-label">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                className="form-control"
                placeholder="Position"
                value={form.position}
                onChange={onChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="agentAssignment" className="form-label">Partner Assignment</label>
              <select
                id="agentAssignment"
                name="agentAssignment"
                className="form-select"
                value={form.agentAssignment}
                onChange={onChange}
              >
                <option value="">Select</option>
                <optgroup label="Company">
                  <option value="company">Company</option>
                </optgroup>
                <optgroup label="Marine Agents">
                  <option value="marine-agent-a1">Marine Agent A1</option>
                  <option value="marine-agent-a2">Marine Agent A2</option>
                </optgroup>
                <optgroup label="Commercial Agents">
                  <option value="commercial-agent-a1-1">Commercial Agent A1.1</option>
                  <option value="commercial-agent-a1-2">Commercial Agent A1.2</option>
                </optgroup>
                <optgroup label="Selling Agents">
                  <option value="selling-agent-a1-1-1">Selling Agent A1.1.1</option>
                  <option value="selling-agent-a1-1-2">Selling Agent A1.1.2</option>
                </optgroup>
              </select>

              {/* agent info box (same classes) */}
              <div className={`agent-info ${layerInfo ? "" : "d-none"} mt-3`}>
                <div><strong>Agent Type:</strong> <span id="agentType">{layerInfo?.type}</span></div>
                <div><strong>Organizational Layer:</strong> <span id="agentLayer">{layerInfo?.layer}</span></div>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Is Salesman</label>
              <div>
                <label className="status-toggle" style={{ position: "relative", display: "inline-block", width: 50, height: 24 }}>
                  <input
                    type="checkbox"
                    name="isSalesman"
                    checked={form.isSalesman}
                    onChange={onChange}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    className="slider"
                    style={{
                      position: "absolute", cursor: "pointer", inset: 0, backgroundColor: form.isSalesman ? "#2575fc" : "#ccc",
                      transition: ".4s", borderRadius: 24,
                    }}
                  />
                  <span
                    style={{
                      position: "absolute", height: 16, width: 16, left: form.isSalesman ? 30 : 4, bottom: 4,
                      backgroundColor: "#fff", transition: ".4s", borderRadius: "50%",
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="col-md-12">
              <label htmlFor="remarks" className="form-label">Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                rows="3"
                className="form-control"
                placeholder="Additional remarks"
                value={form.remarks}
                onChange={onChange}
              />
            </div>
          </div>
        </div>

        {/* ACCESS TAB */}
        <div className={`tab-pane fade ${tab === "access" ? "show active" : ""}`} id="access" role="tabpanel">
          {!layerInfo ? (
            <div id="moduleAccessContainer" className="mt-3 text-center text-muted">
              <i className="bi bi-shield-lock fs-1 mb-3"></i>
              <p>Select an Agent Assignment in User Profile to configure Module Access</p>
            </div>
          ) : (
            <div className="table-responsive mt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Access Rights Group</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(moduleSubmodules).map((moduleKey) => {
                    const relevant = accessRightsGroups.filter(
                      (g) => g.module === moduleKey && g.layer === layerInfo.layer
                    );
                    return (
                      <tr key={moduleKey}>
                        <td>{moduleKey}</td>
                        <td>
                          <select
                            className="form-select"
                            value={moduleAccess[moduleKey] || ""}
                            onChange={(e) => onSelectAccess(moduleKey, e.target.value)}
                          >
                            <option value="">Select group</option>
                            {relevant.length
                              ? relevant.map((g) => (
                                  <option key={g.id} value={g.id}>
                                    {g.name}
                                  </option>
                                ))
                              : <option value="">No Groups Available</option>}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-turquoise mt-4">Create User</button>
    </form>
  );
}
