// src/components/businessPartners/PartnerKanban.jsx
import React from "react";

export default function PartnerKanban({ partners = [] }) {
  const data = partners.length ? partners : [
    { id: 1, name: "Marine Transport Co.", phone: "+123456789", layer: "Marine", status: "Active" },
    { id: 2, name: "Commercial Freight Inc.", phone: "+987654321", layer: "Commercial", status: "Active" },
    { id: 3, name: "Selling Solutions Ltd.", phone: "+1122334455", layer: "Selling", status: "Inactive" },
  ];

  const columns = {
    Marine: data.filter((p) => p.layer?.toLowerCase() === "marine"),
    Commercial: data.filter((p) => p.layer?.toLowerCase() === "commercial"),
    Selling: data.filter((p) => p.layer?.toLowerCase() === "selling"),
  };

  return (
    <div id="kanban-view">
      <h4 className="mb-3">Kanban View</h4>
      <div className="kanban-board row">
        <div className="col-lg-4" id="marine-column">
          <div className="card card-purple p-0">
            <div className="card-header card-header-dashboard px-3 p-2">
              <h5 className="mb-0">Marine Agents</h5>
            </div>
            <div className="card-body" style={{ padding: "0.9rem" }}>
              {columns.Marine.map((p) => (
                <div key={p.id} className="mb-3">
                  <h6 className="mb-3">{p.name}</h6>
                  <p className="mb-3">Phone: {p.phone}</p>
                  <p>Status: {p.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4" id="commercial-column">
          <div className="card card-purple p-0">
            <div className="card-header card-header-dashboard px-3 p-2">
              <h5 className="mb-0">Commercial Agents</h5>
            </div>
            <div className="card-body" style={{ padding: "0.9rem" }}>
              {columns.Commercial.map((p) => (
                <div key={p.id} className="mb-3">
                  <h6 className="mb-3">{p.name}</h6>
                  <p className="mb-3">Phone: {p.phone}</p>
                  <p>Status: {p.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4" id="selling-column">
          <div className="card card-purple p-0">
            <div className="card-header card-header-dashboard px-3 p-2">
              <h5 className="mb-0">Selling Agents</h5>
            </div>
            <div className="card-body" style={{ padding: "0.9rem" }}>
              {columns.Selling.map((p) => (
                <div key={p.id} className="mb-3">
                  <h6 className="mb-3">{p.name}</h6>
                  <p className="mb-3">Phone: {p.phone}</p>
                  <p>Status: {p.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
