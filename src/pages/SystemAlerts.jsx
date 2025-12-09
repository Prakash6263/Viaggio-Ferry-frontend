import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

const alertsData = {
  1: {
    title: "**CANCELLATION**: 10:00 Sailing Piraeus-Santorini on 2025-11-15",
    date: "2025-10-01 11:30",
    type: "Critical",
    status: "New",
    content: `Dear Agents,

We regret to inform you that the 10:00 sailing from Piraeus to Santorini scheduled for November 15, 2025 has been cancelled due to unexpected maintenance requirements on the vessel.

All affected passengers have been notified and are being offered alternative sailings on the same day at 14:00 and 18:00. Please assist with rebooking as needed.

We apologize for any inconvenience this may cause and appreciate your understanding.

Best regards,
Ferry Operations Team`,
    attachments: [
      {
        name: "Cancellation Notice",
        pages: [
          "https://picsum.photos/seed/cancel1/800/600.jpg",
          "https://picsum.photos/seed/cancel2/800/600.jpg",
        ],
      },
      {
        name: "Alternative Schedule",
        pages: ["https://picsum.photos/seed/schedule1/800/600.jpg"],
      },
    ],
  },
};

const SystemAlerts = () => {
  // list | detail | form
  const [currentView, setCurrentView] = useState("list");
  const [currentAlertId, setCurrentAlertId] = useState(1);
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [selectedAgents, setSelectedAgents] = useState([
    "Marine: Agent A1",
  ]);

  const [showSeverityModal, setShowSeverityModal] = useState(false);
  const [newSeverityType, setNewSeverityType] = useState("");
  const [newSeverityDescription, setNewSeverityDescription] = useState("");

  const currentAlert = alertsData[currentAlertId];
  const currentAttachment =
    currentAlert && currentAlert.attachments
      ? currentAlert.attachments[currentAttachmentIndex]
      : null;
  const currentPages = currentAttachment ? currentAttachment.pages : [];

  // ----- view switches -----
  const goToList = () => setCurrentView("list");
  const goToForm = () => setCurrentView("form");
  const goToDetail = (id) => {
    setCurrentAlertId(Number(id));
    setCurrentAttachmentIndex(0);
    setCurrentPageIndex(0);
    setCurrentView("detail");
  };

  // ----- agents -----
  const handleAddAgent = (selectId, type) => {
    const select = document.getElementById(selectId);
    if (!select) return;
    const value = select.value;
    if (!value) return;

    const label =
      value === "all" ? `${type}: All Agents` : `${type}: ${value}`;

    setSelectedAgents((prev) => [...prev, label]);
    select.selectedIndex = 0;
  };

  const removeAgent = (index) => {
    setSelectedAgents((prev) => prev.filter((_, i) => i !== index));
  };

  // ----- severity modal -----
  const handleSeverityChange = (e) => {
    if (e.target.value === "add_new") {
      setShowSeverityModal(true);
    }
  };

  const closeSeverityModal = () => {
    setShowSeverityModal(false);
    setNewSeverityType("");
    setNewSeverityDescription("");
  };

  const addNewSeverityType = () => {
    if (!newSeverityType.trim()) return;
    // here you could push into a state list if you really want dynamic options
    closeSeverityModal();
  };

  // ----- attachments -----
  const selectAttachment = (index) => {
    setCurrentAttachmentIndex(index);
    setCurrentPageIndex(0);
  };

  const prevPage = () => {
    setCurrentPageIndex((p) => Math.max(0, p - 1));
  };

  const nextPage = () => {
    setCurrentPageIndex((p) =>
      currentPages.length ? Math.min(currentPages.length - 1, p + 1) : 0
    );
  };

  const printAttachments = () => window.print();

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          {/* --- Styles copied from your HTML --- */}
          <style>{`
/* --- List View Header and Button --- */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.btn-create {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: background-color 0.3s;
}
.btn-create:hover {
  background-color: #1e7e34;
}

/* --- Alert Display Table Styles --- */
.alert-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 40px;
}
  
.alert-table th, .alert-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.alert-table th {
//   background-color: #e9eef2;
  font-weight: 700;
  color: #555;
  text-transform: uppercase;
  font-size: 14px;
}
// .alert-table tr:hover {
//   background-color: #f9f9f9;
// }

/* Alert Severity Badges */
.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}
.badge.critical {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.badge.financial {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}
.badge.read {
  background-color: #e2e3e5;
  color: #6c757d;
}
.badge.unread {
  background-color: #cce5ff;
  color: #004085;
}

/* 3-Column Grid Layout for Form */
.form-grid-3-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.form-full-width {
  grid-column: 1 / -1;
}

.btn-submit {
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}
.btn-submit:hover {
  background-color: #0056b3;
}
.btn-cancel {
  background-color: #6c757d;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  text-decoration: none;
}
.back-link {
  display: inline-block;
  margin-bottom: 20px;
  text-decoration: none;
  color: #004d99;
  font-weight: 600;
}

/* --- 3-Column Grid for Agent Lookups --- */
.agent-grid-3-col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}
.agent-lookup-group {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  height: 100%;
}
.lookup-field {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}
.lookup-field select {
  flex-grow: 1;
  margin: 0;
  width: auto;
  padding: 8px 10px;
}
.btn-lookup {
  background: linear-gradient(90deg, #00B5AD, #00D2CB) !important;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

/* Tag list for selected agents */
#selected-agents-list {
  margin-top: 15px;
  padding: 5px 0;
  min-height: 20px;
}
.agent-tag {
  display: inline-block;
  background-color: #e0f7fa;
  color: #006064;
  padding: 5px 10px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 3px;
  font-size: 14px;
}
.tag-remove {
  color: #006064;
  margin-left: 5px;
  font-weight: bold;
  cursor: pointer;
}

.form-section-title {
  font-weight: 700;
  color: #004d99;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
  grid-column: 1 / -1;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
}

/* Alert Detail View Styles */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.detail-message {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.detail-attachments {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.attachment-header {
  padding: 15px 20px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.attachment-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}
.attachment-tab {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}
.attachment-tab.active {
  border-bottom-color: #007bff;
  color: #007bff;
  font-weight: 600;
}
.attachment-content {
  padding: 20px;
  height: 500px;
  overflow: auto;
}
.attachment-page {
  display: none;
  width: 100%;
  height: 100%;
}
.attachment-page.active {
  display: block;
}
.attachment-page img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
.attachment-controls {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  gap: 10px;
}
.page-btn {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.page-btn:hover {
  background-color: #e9ecef;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.print-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.print-btn:hover {
  background-color: #1e7e34;
}
.alert-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.alert-info h3 {
  margin-top: 0;
  color: #004d99;
}
.alert-meta {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}
.alert-content {
  line-height: 1.6;
  white-space: pre-wrap;
}
.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.action-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}
.action-btn:hover {
  background-color: #0056b3;
}
.action-btn.secondary {
  background-color: #6c757d;
}
.action-btn.secondary:hover {
  background-color: #545b62;
}

@media (max-width: 992px) {
  .form-grid-3-col, .agent-grid-3-col {
    grid-template-columns: 1fr;
  }
  .form-row {
    flex-direction: column;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
          `}</style>

          {/* LIST VIEW */}
          {currentView === "list" && (
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5>Active System Alerts</h5>
                      <button
                        type="button"
                        className="btn btn-turquoise fw-medium btn-hover-transform"
                        onClick={goToForm}
                      >
                        + Add New Customer
                      </button>
                    </div>

                    <table
                      id="example"
                      className="table table-striped alert-table"
                    >
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Type</th>
                          <th>Title</th>
                          <th>Date Posted</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(alertsData).map(([id, alert]) => (
                          <tr key={id}>
                            <td>
                              <span className="badge unread">
                                {alert.status}
                              </span>
                            </td>
                            <td>
                              <span className="badge critical">
                                {alert.type}
                              </span>
                            </td>
                            <td>{alert.title}</td>
                            <td>{alert.date}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-link p-0"
                                onClick={() => goToDetail(id)}
                              >
                                View Details / Handle Bookings
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL VIEW */}
          {currentView === "detail" && currentAlert && (
            <div className="card-table card p-3">
              <div className="card-body">
                <button
                  type="button"
                  className="btn btn-turquoise mb-3"
                  onClick={goToList}
                >
                  ← Back to Alerts List
                </button>

                <h2>Alert Details</h2>

                <div className="detail-grid">
                  {/* LEFT: MESSAGE */}
                  <div className="detail-message">
                    <div className="alert-info">
                      <h3>{currentAlert.title}</h3>
                      <div className="alert-meta">
                        <span>Date: {currentAlert.date}</span>
                        <span>Type: {currentAlert.type}</span>
                        <span>Status: {currentAlert.status}</span>
                      </div>
                    </div>
                    <div className="alert-content">
                      {currentAlert.content}
                    </div>
                    <div className="action-buttons">
                      <button className="action-btn">Mark as Read</button>
                      <button className="action-btn secondary">
                        Archive
                      </button>
                      <button className="action-btn secondary">
                        Forward
                      </button>
                    </div>
                  </div>

                  {/* RIGHT: ATTACHMENTS */}
                  <div className="detail-attachments">
                    <div className="attachment-header">
                      <span>Attachments</span>
                      <button
                        type="button"
                        className="print-btn"
                        onClick={printAttachments}
                      >
                        Print
                      </button>
                    </div>

                    <div className="attachment-tabs">
                      {currentAlert.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          className={
                            "attachment-tab" +
                            (idx === currentAttachmentIndex
                              ? " active"
                              : "")
                          }
                          onClick={() => selectAttachment(idx)}
                        >
                          {att.name}
                        </div>
                      ))}
                    </div>

                    <div className="attachment-content">
                      {currentPages.map((url, idx) => (
                        <div
                          key={idx}
                          className={
                            "attachment-page" +
                            (idx === currentPageIndex ? " active" : "")
                          }
                        >
                          <img src={url} alt={`Page ${idx + 1}`} />
                        </div>
                      ))}
                    </div>

                    {currentPages.length > 1 && (
                      <div className="attachment-controls">
                        <button
                          type="button"
                          className="page-btn"
                          onClick={prevPage}
                          disabled={currentPageIndex === 0}
                        >
                          Previous
                        </button>
                        <span>
                          Page {currentPageIndex + 1} of{" "}
                          {currentPages.length}
                        </span>
                        <button
                          type="button"
                          className="page-btn"
                          onClick={nextPage}
                          disabled={
                            currentPageIndex === currentPages.length - 1
                          }
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM VIEW */}
          {currentView === "form" && (
            <div className="card-table card p-3">
              <div className="card-body">
                <button
                  type="button"
                  className="btn btn-turquoise mb-3"
                  onClick={goToList}
                >
                  ← Back to Alerts List
                </button>

                <h2 className="mb-3">
                  System Alert Creation (Administrator Panel)
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // just demo – no backend
                    goToList();
                  }}
                >
                  <div className="form-grid-3-col">
                    <h3 className="form-section-title">Basic Information</h3>

                    <div className="form-row form-full-width">
                      <div className="form-group">
                        <label className="form-label">Alert Title</label>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="e.g., Piraeus-Santorini Route Cancellation"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Severity / Type</label>
                        <select
                          className="form-control"
                          onChange={handleSeverityChange}
                          defaultValue="critical"
                        >
                          <option value="critical">
                            Critical (Cancellation, System Down)
                          </option>
                          <option value="financial">
                            Financial (Credit, Commission)
                          </option>
                          <option value="informational">
                            Informational (Schedule, New Feature)
                          </option>
                          <option value="promotional">
                            Promotional (Offer, Discount)
                          </option>
                          <option value="add_new">+ Add New Type</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Start Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">End Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-label form-full-width">
                      Content
                    </div>

                    <div className="form-group form-full-width">
                      <label className="form-label">
                        Message Content
                      </label>
                      <textarea
                        className="form-control"
                        required
                        placeholder="Provide full details, reasoning, and required actions for agents."
                      />
                    </div>

                    <div className="form-label form-full-width">
                      Target Agents
                    </div>

                    <div className="form-group form-full-width">
                      <label className="form-label">
                        Target Individual Agent(s) by Layer
                      </label>
                      <small
                        style={{
                          display: "block",
                          marginBottom: "10px",
                        }}
                      >
                        *Alerts targeted to specific agents will override
                        broad layer targeting.
                      </small>

                      <div className="agent-grid-3-col">
                        {/* Marine */}
                        <div className="agent-lookup-group">
                          <label className="form-label">
                            Marine Agent (Layer 2)
                          </label>
                          <div className="lookup-field">
                            <select
                              id="marine_select"
                              className="form-control"
                            >
                              <option value="">Select an agent...</option>
                              <option value="all">All Marine Agents</option>
                              <option value="Agent A1">Marine Agent A1</option>
                              <option value="Agent A2">Marine Agent A2</option>
                              <option value="Agent A3">Marine Agent A3</option>
                              <option value="Agent A4">Marine Agent A4</option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-turquoise"
                              onClick={() =>
                                handleAddAgent("marine_select", "Marine")
                              }
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Commercial */}
                        <div className="agent-lookup-group">
                          <label className="form-label">
                            Commercial Agent (Layer 3)
                          </label>
                          <div className="lookup-field">
                            <select
                              id="commercial_select"
                              className="form-control"
                            >
                              <option value="">Select an agent...</option>
                              <option value="all">
                                All Commercial Agents
                              </option>
                              <option value="Agent B1">
                                Commercial Agent B1
                              </option>
                              <option value="Agent B2">
                                Commercial Agent B2
                              </option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-turquoise"
                              onClick={() =>
                                handleAddAgent(
                                  "commercial_select",
                                  "Commercial"
                                )
                              }
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Selling */}
                        <div className="agent-lookup-group">
                          <label className="form-label">
                            Selling Agent (Layer 4)
                          </label>
                          <div className="lookup-field">
                            <select
                              id="selling_select"
                              className="form-control"
                            >
                              <option value="">Select an agent...</option>
                              <option value="all">
                                All Selling Agents
                              </option>
                              <option value="Agent C1">
                                Selling Agent C1
                              </option>
                              <option value="Agent C2">
                                Selling Agent C2
                              </option>
                            </select>
                            <button
                              type="button"
                              className="btn btn-turquoise"
                              onClick={() =>
                                handleAddAgent("selling_select", "Selling")
                              }
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      <label>Selected Agents:</label>
                      <div id="selected-agents-list">
                        {selectedAgents.map((tag, idx) => (
                          <span key={idx} className="agent-tag">
                            {tag}
                            <span
                              className="tag-remove"
                              onClick={() => removeAgent(idx)}
                            >
                              ✕
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-turquoise">
                    Publish System Alert
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={goToList}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SEVERITY MODAL */}
          {showSeverityModal && (
            <div className="modal open" style={{ display: "block" }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Add New Severity Type</h3>
                  <span className="close" onClick={closeSeverityModal}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Severity Type Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newSeverityType}
                      onChange={(e) =>
                        setNewSeverityType(e.target.value)
                      }
                      placeholder="e.g., Weather Advisory"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newSeverityDescription}
                      onChange={(e) =>
                        setNewSeverityDescription(e.target.value)
                      }
                      placeholder="e.g., Weather-related alerts"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={closeSeverityModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-turquoise"
                    onClick={addNewSeverityType}
                  >
                    Add Type
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
};

export default SystemAlerts;
