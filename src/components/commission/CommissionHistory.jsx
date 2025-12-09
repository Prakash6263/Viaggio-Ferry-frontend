// src/components/commission/CommissionHistory.jsx
import React from "react";

/**
 * CommissionHistory
 * - keeps original markup & classes for styling parity
 */
export default function CommissionHistory({ items = [] }) {
  const sample = [
    { id: 1, type: "Updated", title: "Company to Marine Commission", text: "Commission changed from 4% to 5%", by: "John Doe", date: "12 Aug 2023, 10:30 AM" },
    { id: 2, type: "Created", title: "Marine to Commercial Commission", text: "New commission rule created with 4% rate", by: "Jane Smith", date: "10 Aug 2023, 2:15 PM" }
  ];

  const data = items.length ? items : sample;

  return (
    <div className="history-card">
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select className="form-select">
            <option>All Rules</option>
            <option>Company to Marine</option>
            <option>Commercial to Selling</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select">
            <option>All Actions</option>
            <option>Created</option>
            <option>Updated</option>
            <option>Activated</option>
            <option>Deleted</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <div className="col-md-1 d-grid">
          <button className="btn btn-primary">Apply</button>
        </div>
      </div>

      {data.map((h) => (
        <div key={h.id} className="history-item border-start border-4 border-primary-subtle mb-3">
          <span className={`badge ${h.type === "Created" ? "bg-success" : "bg-primary"}`}>{h.type}</span>
          <h6 className="mt-2">{h.title}</h6>
          <p>{h.text}</p>
          <div className="d-flex justify-content-between">
            <span className="history-meta">By {h.by} • {h.date}</span>
            <a href="#" className="view-link">View Details</a>
          </div>
        </div>
      ))}
    </div>
  );
}
