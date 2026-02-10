import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Can from "../Can";
import CanDisable from "../CanDisable";
import { apiFetch, API_BASE_URL } from "../../api/apiClient";
import { getFullImageUrl } from "../../utils/imageUrl";

// Placeholder image for failed loads
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23f0f0f0' width='40' height='40'/%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='%23999' text-anchor='middle' dy='.3em'%3E?%3C/text%3E%3C/svg%3E";

export default function ShipsListTable() {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [view, setView] = useState("table");
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ships
  const fetchShips = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch("/api/ships?page=1&limit=100&search=", {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch ships");
      }

      const data = await response.json();
      console.log("[v0] Ships API Response:", data);

      let shipsList = [];
      if (data?.data?.ships && Array.isArray(data.data.ships)) {
        shipsList = data.data.ships;
      } else if (Array.isArray(data?.data)) {
        shipsList = data.data;
      }

      setShips(shipsList);
    } catch (err) {
      console.error("[v0] Error fetching ships:", err);
      setError("Failed to load ships");
      setShips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShips();
  }, []);

  useEffect(() => {
    const el = tableRef.current;
    if (!el || !ships.length || !window.DataTable) return;

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
  }, [ships]);

  const handleEdit = (shipId) => {
    navigate(`/company/ship-trip/edit-ship/${shipId}`);
  };

  const handleDelete = async (shipId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This ship will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await apiFetch(`/api/ships/${shipId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete ship");
        }

        await fetchShips();

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Ship has been deleted successfully.",
          timer: 2000,
        });
      } catch (err) {
        console.error("[v0] Error deleting ship:", err);
        Swal.fire({ icon: "error", title: "Error", text: "Failed to delete ship" });
      }
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="content-page-header">
          <h5>Ships</h5>
          <div className="list-btn" style={{ justifySelf: "end" }}>
            <ul className="filter-list">
              <li>
                <Can action="create">
                  <Link className="btn btn-turquoise" to="/company/ship-trip/add-ship">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Ship
                  </Link>
                </Can>
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

      {error && (
        <div className="row mb-3">
          <div className="col-sm-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      )}

      {loading && (
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {!loading && (
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
                        <th>Documents</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ships.length > 0 ? (
                        ships.map((s) => (
                          <tr key={s._id}>
                            <td><input type="checkbox" /></td>
                            <td>
                              <strong>{s.name}</strong>
                            </td>
                            <td>{s.imoNumber || "—"}</td>
                            <td>{s.shipType || "—"}</td>
                            <td>{s.yearBuilt || "—"}</td>
                            <td>{s.flagState || "—"}</td>
                            <td>
                              <span className={`status-badge ${s.status === "Active" ? "status-active" : "status-inactive"}`}>
                                {s.status || "Active"}
                              </span>
                            </td>
                            <td>
                              <small>
                                Passenger: {s.passengerCapacity?.reduce((sum, p) => sum + (p.seats || 0), 0) || 0} seats<br />
                                Cargo: {s.cargoCapacity?.reduce((sum, c) => sum + (c.totalWeightTons || 0), 0) || 0} tons<br />
                                Vehicle: {s.vehicleCapacity?.reduce((sum, v) => sum + (v.totalWeightTons || 0), 0) || 0} tons
                              </small>
                            </td>
                            <td>
                              {s.documents && s.documents.length > 0 ? (
                                <div className="d-flex gap-1 flex-wrap" style={{ alignItems: "center" }}>
                                  {s.documents.slice(0, 3).map((doc, idx) => (
                                    <div key={idx} style={{ position: "relative" }}>
                                      {doc.fileType === "image" ? (
                                        <img 
                                          src={getFullImageUrl(doc.fileUrl)} 
                                          alt={doc.fileName}
                                          crossOrigin="anonymous"
                                          onError={(e) => {
                                            e.currentTarget.src = PLACEHOLDER_IMAGE;
                                          }}
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "4px",
                                            objectFit: "cover",
                                            cursor: "pointer",
                                            border: "1px solid #ddd"
                                          }}
                                          title={doc.fileName}
                                          onClick={() => window.open(getFullImageUrl(doc.fileUrl), '_blank')}
                                        />
                                      ) : doc.fileType === "pdf" ? (
                                        <div 
                                          style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "4px",
                                            backgroundColor: "#f8d7da",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            border: "1px solid #ddd"
                                          }}
                                          title={doc.fileName}
                                          onClick={() => window.open(getFullImageUrl(doc.fileUrl), '_blank')}
                                        >
                                          <i className="bi bi-file-pdf" style={{ fontSize: "20px", color: "#dc3545" }}></i>
                                        </div>
                                      ) : null}
                                    </div>
                                  ))}
                                  {s.documents.length > 3 && (
                                    <span className="badge bg-secondary" style={{ fontSize: "12px" }}>
                                      +{s.documents.length - 3}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted">No docs</span>
                              )}
                            </td>
                            <td className="action-buttons">
                              <CanDisable action="update">
                                <button 
                                  className="btn btn-sm btn-outline-primary me-1"
                                  onClick={() => handleEdit(s._id)}
                                >
                                  <i className="bi bi-pencil" />
                                </button>
                              </CanDisable>
                              <CanDisable action="delete">
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(s._id)}
                                >
                                  <i className="bi bi-trash" />
                                </button>
                              </CanDisable>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center text-muted">
                            No ships found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!loading && (
        <div id="gridView" className="row g-3" style={{ display: view === "grid" ? "flex" : "none" }}>
          {ships.length > 0 ? (
            ships.map((s) => (
              <div className="col-md-6 col-lg-4" key={s._id}>
                <div className="card card-purple">
                  <div className="card-body">
                    <h5 className="mb-2">{s.name}</h5>
                    <div className="ship-details">
                      <p><small>IMO: {s.imoNumber || "—"}</small></p>
                      <p><small>Type: {s.shipType || "—"}</small></p>
                      <p><small>Year Built: {s.yearBuilt || "—"}</small></p>
                      <p><small>Flag State: {s.flagState || "—"}</small></p>
                      <p><small>Status: <span className={`status-badge ${s.status === "Active" ? "status-active" : "status-inactive"}`}>{s.status || "Active"}</span></small></p>
                      <p><small>Capacity → Passenger: {s.passengerCapacity?.reduce((sum, p) => sum + (p.seats || 0), 0) || 0} seats, Cargo: {s.cargoCapacity?.reduce((sum, c) => sum + (c.totalWeightTons || 0), 0) || 0} tons, Vehicle: {s.vehicleCapacity?.reduce((sum, v) => sum + (v.totalWeightTons || 0), 0) || 0} tons</small></p>
                      
                      {/* Documents Section */}
                      {s.documents && s.documents.length > 0 && (
                        <div className="mt-3 pt-3" style={{ borderTop: "1px solid #e0e0e0" }}>
                          <p><small><strong>Documents ({s.documents.length}):</strong></small></p>
                          <div className="d-flex gap-2 flex-wrap">
                            {s.documents.map((doc, idx) => (
                              <div key={idx} style={{ position: "relative" }}>
                                {doc.fileType === "image" ? (
                                  <img 
                                    src={getFullImageUrl(doc.fileUrl)} 
                                    alt={doc.fileName}
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                                    }}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "4px",
                                      objectFit: "cover",
                                      cursor: "pointer",
                                      border: "1px solid #ddd"
                                    }}
                                    title={doc.fileName}
                                    onClick={() => window.open(getFullImageUrl(doc.fileUrl), '_blank')}
                                  />
                                ) : doc.fileType === "pdf" ? (
                                  <div 
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "4px",
                                      backgroundColor: "#f8d7da",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      border: "1px solid #ddd"
                                    }}
                                    title={doc.fileName}
                                    onClick={() => window.open(getFullImageUrl(doc.fileUrl), '_blank')}
                                  >
                                    <i className="bi bi-file-pdf" style={{ fontSize: "24px", color: "#dc3545" }}></i>
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="card-actions">
                      <CanDisable action="update">
                        <button 
                          className="btn btn-sm btn-primary me-1"
                          onClick={() => handleEdit(s._id)}
                        >
                          ✏ Edit
                        </button>
                      </CanDisable>
                      <CanDisable action="delete">
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(s._id)}
                        >
                          🗑 Delete
                        </button>
                      </CanDisable>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted">
              No ships found
            </div>
          )}
        </div>
      )}
    </>
  );
}
