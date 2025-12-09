import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function ShipsListTable() {
  const tableRef = useRef(null);
  const [view, setView] = useState("table"); // "table" | "grid"

  useEffect(() => {
    const el = tableRef.current;
    if (!el || !window.DataTable) return;

    // destroy old instance if exists
    try {
      if (el._dt) {
        el._dt.destroy();
        el._dt = null;
      }
    } catch (err) {}

    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true,
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });

    el._dt = dt;
    return () => {
      try { dt.destroy(); } catch {}
      if (el) el._dt = null;
    };
  }, []); // one-time init

  // sample data (replace by API)
  const ships = [
    {
      id: 1,
      name: "Marine Star",
      added: "12 Aug 2023",
      imo: "IMO1234567",
      type: "Cargo",
      year: "2015",
      flag: "Oman",
      status: "Active",
      capacity: { passenger: 200, cargo: "5000 tons", vehicle: 100 },
    },
    {
      id: 2,
      name: "Ocean Pearl",
      added: "05 Aug 2023",
      imo: "IMO7654321",
      type: "Passenger",
      year: "2010",
      flag: "UAE",
      status: "Inactive",
      capacity: { passenger: 500, cargo: "2000 tons", vehicle: 50 },
    },
  ];

  return (
    <>
      <div className="page-header">
        <div className="content-page-header">
          <h5>Ships</h5>
          <div className="list-btn" style={{ justifySelf: "end" }}>
            <ul className="filter-list">
              <li>
                <Link className="btn btn-turquoise" to="/company/ship-trip/add-ship">
                  <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Ship
                </Link>
              </li>
              <li>
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    id="showTable"
                    onClick={() => setView("table")}
                    title="Table view"
                  >
                    <i className="fa-solid fa-th-large fa-lg"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary ms-2"
                    id="showGrid"
                    onClick={() => setView("grid")}
                    title="Grid view"
                  >
                    <i className="fa-solid fa-bars fa-lg"></i>
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div id="tableView" style={{ display: view === "table" ? "block" : "none" }} className="row">
        <div className="col-sm-12">
          <div className="card-table card p-3">
            <div className="card-body">
              <div className="table-responsive">
                <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th><input type="checkbox" /></th>
                      <th>Ship Name</th>
                      <th>IMO Number</th>
                      <th>Type</th>
                      <th>Year Built</th>
                      <th>Flag State</th>
                      <th>Status</th>
                      <th>Capacity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ships.map((s) => (
                      <tr key={s.id}>
                        <td><input type="checkbox" /></td>
                        <td>
                          <strong>{s.name}</strong>
                          <br />
                          <small className="text-muted">Added: {s.added}</small>
                        </td>
                        <td>{s.imo}</td>
                        <td>{s.type}</td>
                        <td>{s.year}</td>
                        <td>{s.flag}</td>
                        <td>
                          <span className={`status-badge ${s.status === "Active" ? "status-active" : "status-inactive"}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          Passenger: {s.capacity.passenger} <br />
                          Cargo: {s.capacity.cargo} <br />
                          Vehicle: {s.capacity.vehicle}
                        </td>
                        <td className="action-buttons">
                          <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div id="gridView" className="row g-3" style={{ display: view === "grid" ? "flex" : "none" }}>
        {ships.map((s) => (
          <div className="col-md-6 col-lg-4" key={s.id}>
            <div className="card card-purple">
              <div className="card-body">
                <h5 className="mb-2">{s.name}</h5>
                <div className="ship-details">
                  <p><small>IMO: {s.imo}</small></p>
                  <p><small>Type: {s.type}</small></p>
                  <p><small>Year Built: {s.year}</small></p>
                  <p><small>Flag State: {s.flag}</small></p>
                  <p><small>Status: <span className={`status-badge ${s.status === "Active" ? "status-active" : "status-inactive"}`}>{s.status}</span></small></p>
                  <p><small>Capacity → Passenger: {s.capacity.passenger}, Cargo: {s.capacity.cargo}, Vehicle: {s.capacity.vehicle}</small></p>
                </div>
                <div className="card-actions">
                  <button className="btn btn-sm btn-turquoise me-1">👁 View</button>
                  <button className="btn btn-sm btn-primary me-1">✏ Edit</button>
                  <button className="btn btn-sm btn-danger">🗑 Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
