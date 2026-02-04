'use client';

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import Swal from "sweetalert2";
import Can from "../Can";
import { shipsApi } from "../../api/shipsApi";

export default function ShipsListTable() {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const [view, setView] = useState("table");

  // Fetch ships data
  const fetchShips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await shipsApi.getShips({ page, limit, search });

      console.log("[v0] Ships API Response:", response);

      let data = [];

      if (response?.data?.ships && Array.isArray(response.data.ships)) {
        data = response.data.ships;
      } else if (response?.ships && Array.isArray(response.ships)) {
        data = response.ships;
      }

      console.log("[v0] Parsed Ships Data:", data);
      setShips(data);
      setPagination(response?.pagination || {});
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
  }, [page, limit, search]);

  // Initialize DataTable after ships are loaded
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
      paging: false, // We manage pagination ourselves
      searching: false, // We manage search ourselves
      ordering: true,
      info: false,
    });

    el._dt = dt;
    return () => {
      try {
        dt.destroy();
      } catch (err) {}
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
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await shipsApi.deleteShip(shipId);

        // Reload fresh data from backend
        await fetchShips();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Ship has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("[v0] Error deleting ship:", err);

        // Handle 403 Forbidden
        if (err.message && err.message.includes("403")) {
          Swal.fire({
            icon: "error",
            title: "You don't have permission",
            didClose: () => {
              navigate("/company/dashboard");
            },
          });
        } else if (err.message && err.message.includes("401")) {
          // Handle 401 Unauthorized
          Swal.fire({
            icon: "error",
            title: "Session expired",
            didClose: () => {
              navigate("/company-login");
            },
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Something went wrong",
            text: err.message || "Failed to delete ship",
          });
        }
      }
    }
  };

  const formatCapacity = (ship) => {
    const passenger = ship.passengerCapacity
      ?.reduce((sum, item) => sum + (item.quantity || 0), 0)
      || 0;
    const cargo = ship.cargoCapacity
      ?.reduce((sum, item) => sum + (item.quantity || 0), 0)
      || 0;
    const vehicle = ship.vehicleCapacity
      ?.reduce((sum, item) => sum + (item.quantity || 0), 0)
      || 0;

    return {
      passenger,
      cargo: `${cargo} tons`,
      vehicle,
    };
  };

  if (loading) {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-3">
            <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
              <CirclesWithBar
                height="80"
                width="80"
                color="#05468f"
                outerCircleColor="#05468f"
                innerCircleColor="#05468f"
                barColor="#05468f"
                ariaLabel="circles-with-bar-loading"
                visible={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="row mb-3">
          <div className="col-sm-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        </div>
      )}

      {/* View Toggle Buttons */}
      <div className="row mb-3">
        <div className="col-sm-12">
          <div className="d-flex gap-2 justify-content-end">
            <button
              className={`btn btn-sm ${view === "table" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setView("table")}
              title="Table view"
            >
              <i className="fa-solid fa-table me-1"></i> Table
            </button>
            <button
              className={`btn btn-sm ${view === "grid" ? "btn-primary" : "btn-outline-secondary"}`}
              onClick={() => setView("grid")}
              title="Grid view"
            >
              <i className="fa-solid fa-grip me-1"></i> Grid
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    ref={tableRef}
                    id="shipsTable"
                    className="table table-striped"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
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
                      {ships.length > 0 ? (
                        ships.map((ship) => {
                          const capacity = formatCapacity(ship);
                          return (
                            <tr key={ship._id}>
                              <td>
                                <strong>{ship.name}</strong>
                              </td>
                              <td>{ship.imoNumber}</td>
                              <td>{ship.shipType}</td>
                              <td>{ship.yearBuilt}</td>
                              <td>{ship.flagState}</td>
                              <td>
                                <span
                                  className={`badge ${
                                    ship.status === "Active"
                                      ? "badge-success"
                                      : "badge-secondary"
                                  }`}
                                >
                                  {ship.status || "Active"}
                                </span>
                              </td>
                              <td>
                                <small>
                                  Passenger: {capacity.passenger}
                                  <br />
                                  Cargo: {capacity.cargo}
                                  <br />
                                  Vehicle: {capacity.vehicle}
                                </small>
                              </td>
                              <td className="action-buttons">
                                <Can action="update" path="/company/ship-trip/ships">
                                  <button
                                    className="btn btn-sm btn-outline-primary me-1"
                                    title="Edit Ship"
                                    onClick={() => handleEdit(ship._id)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </Can>
                                <Can action="delete" path="/company/ship-trip/ships">
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete Ship"
                                    onClick={() => handleDelete(ship._id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </Can>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center text-muted">
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
      {view === "grid" && (
        <div className="row g-3">
          {ships.length > 0 ? (
            ships.map((ship) => {
              const capacity = formatCapacity(ship);
              return (
                <div className="col-md-6 col-lg-4" key={ship._id}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{ship.name}</h5>
                      <p className="card-text">
                        <small className="d-block">IMO: {ship.imoNumber}</small>
                        <small className="d-block">Type: {ship.shipType}</small>
                        <small className="d-block">Year Built: {ship.yearBuilt}</small>
                        <small className="d-block">Flag State: {ship.flagState}</small>
                        <small className="d-block">
                          Status:{" "}
                          <span
                            className={`badge ${
                              ship.status === "Active"
                                ? "badge-success"
                                : "badge-secondary"
                            }`}
                          >
                            {ship.status || "Active"}
                          </span>
                        </small>
                        <small className="d-block mt-2">
                          <strong>Capacity:</strong>
                          <br />
                          Passenger: {capacity.passenger}
                          <br />
                          Cargo: {capacity.cargo}
                          <br />
                          Vehicle: {capacity.vehicle}
                        </small>
                      </p>
                      <div className="card-actions d-flex gap-2 mt-3">
                        <Can action="update" path="/company/ship-trip/ships">
                          <button
                            className="btn btn-sm btn-primary flex-grow-1"
                            onClick={() => handleEdit(ship._id)}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                        </Can>
                        <Can action="delete" path="/company/ship-trip/ships">
                          <button
                            className="btn btn-sm btn-danger flex-grow-1"
                            onClick={() => handleDelete(ship._id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </Can>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="alert alert-info text-center">No ships found</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
