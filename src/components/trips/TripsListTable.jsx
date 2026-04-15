'use client';

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CirclesWithBar } from "react-loader-spinner";
import Can from "../Can";
import CanDisable from "../CanDisable";
import { tripsApi } from "../../api/tripsApi";

export default function TripsListTable() {
  const tableRef = useRef(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch trips on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripsApi.getTrips(1, 100, "");
      console.log("[v0] Trips API response:", response);
      
      const tripsList = response?.data?.trips || [];
      setTrips(tripsList);
    } catch (error) {
      console.error("[v0] Error fetching trips:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId, tripCode) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm Delete",
        text: `Are you sure you want to delete trip "${tripCode}"? This action will delete the trip and all related data.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading state
      Swal.fire({
        title: "Deleting Trip",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Call delete API
      const response = await tripsApi.deleteTrip(tripId);
      console.log("[v0] Trip deleted successfully:", response);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Trip deleted successfully.",
        confirmButtonText: "OK"
      }).then(() => {
        fetchTrips();
      });
    } catch (error) {
      console.error("[v0] Error deleting trip:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete trip. Please try again."
      });
    }
  };

  useEffect(() => {
    const el = tableRef.current;
    if (!el || !window.DataTable || trips.length === 0) return;

    try { if (el._dt) { el._dt.destroy(); el._dt = null; } } catch {}
    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true
    });
    el._dt = dt;
    return () => { try { dt.destroy(); } catch {} if (el) el._dt = null; };
  }, [trips]);

  return (
    <>
      <div className="page-header">
        <div className="content-page-header">
          <h5>Scheduled Ferry Trips</h5>
          <div className="list-btn" style={{ justifySelf: "end" }}>
            <ul className="filter-list">
              <li>
                <Can action="create" path="/company/ship-trip/trips">
                  <Link className="btn btn-turquoise" to="/company/ship-trip/add-trip">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Trip
                  </Link>
                </Can>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-2">
            <div className="card-body">
              {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                  <CirclesWithBar
                    height="100"
                    width="100"
                    color="#05468f"
                    outerCircleColor="#05468f"
                    innerCircleColor="#05468f"
                    barColor="#05468f"
                    ariaLabel="circles-with-bar-loading"
                    visible={true}
                  />
                </div>
              )}

              {!loading && (
                <div className="table-responsive">
                  <table ref={tableRef} id="tripsTable" className="table table-bordered" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Trip Name</th>
                        <th>Departure / Arrival</th>
                        <th>Vessel</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center">No trips found</td>
                        </tr>
                      ) : (
                        trips.map(t => (
                          <tr key={t._id}>
                            <td>{t.tripCode}</td>
                            <td>{`${t.departurePort?.name} → ${t.arrivalPort?.name}`}</td>
                            <td>{t.ship?.name}</td>
                            <td>{t.status}</td>
                            <td className="action-buttons">
                              <Can action="update" path="/company/ship-trip/trips">
                                <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/company/ship-trip/edit-trip/${t._id}`)}><i className="bi bi-pencil" /></button>
                              </Can>
                              <Can action="delete" path="/company/ship-trip/trips">
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTrip(t._id, t.tripCode)}><i className="bi bi-trash" /></button>
                              </Can>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
