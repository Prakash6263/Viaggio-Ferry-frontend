'use client';

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import Swal from "sweetalert2";
import Can from "../Can";
import { cabinsApi } from "../../api/cabinsApi";

// Helper function to format actor
function formatActor(actor) {
  if (!actor) return "Unknown";
  if (actor.type === "company") {
    return `${actor.name} (Company)`;
  }
  if (actor.type === "user") {
    return `${actor.name} (User — ${actor.layer || "N/A"})`;
  }
  return "System";
}

export default function CabinListTable() {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get type from URL - should be passenger, vehicle, or cargo
  const type = searchParams.get("type") || "passenger";

  // Fetch cabins for the current type
  const fetchCabins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cabinsApi.getCabins(1, 100, "", type);

      console.log("[v0] Cabins API Response:", response);

      // Handle different response formats
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data?.cabins && Array.isArray(response.data.cabins)) {
        // API returns { data: { cabins: [...] } }
        data = response.data.cabins;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response?.cabins && Array.isArray(response.cabins)) {
        data = response.cabins;
      } else if (response?.list && Array.isArray(response.list)) {
        data = response.list;
      }

      console.log("[v0] Parsed Cabins Data:", data);
      setCabins(data);
    } catch (err) {
      console.error("[v0] Error fetching cabins:", err);
      setError("Failed to load cabins");
      setCabins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, [type]);

  // Initialize DataTable after cabins are loaded - matches Port pattern exactly
  useEffect(() => {
    const el = tableRef.current;
    if (!el || !cabins.length || !window.DataTable) return;

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
      try {
        dt.destroy();
      } catch (err) {}
      if (el) el._dt = null;
    };
  }, [cabins]);

  const handleEdit = (cabinId) => {
    navigate(`/company/settings/cabin/${cabinId}`);
  };

  const handleDelete = async (cabinId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Optimistic UI update - remove from table immediately
        const updatedCabins = cabins.filter((c) => c._id !== cabinId);
        setCabins(updatedCabins);

        // Make API call in background
        await cabinsApi.deleteCabin(cabinId);

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Cabin has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        // Revert optimistic update on error
        console.error("[v0] Error deleting cabin:", err);
        setCabins(cabins);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete cabin",
        });
      }
    }
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

      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-3">
            <div className="card-body">
              <div className="table-responsive">
                <table
                  ref={tableRef}
                  id={`cabins-${type}-table`}
                  className="table table-striped"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>Cabin Name</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cabins.length > 0 ? (
                      cabins.map((cabin) => (
                        <tr key={cabin._id}>
                          <td>
                            <strong>{cabin.name}</strong>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                cabin.status === "Active"
                                  ? "badge-active"
                                  : "badge-inactive"
                              }`}
                            >
                              {cabin.status || "Active"}
                            </span>
                          </td>
                          <td>{formatActor(cabin.createdBy)}</td>
                          <td className="action-buttons">
                            <Can action="update" path="/company/settings/cabin">
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                title="Edit Cabin"
                                onClick={() => handleEdit(cabin._id)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            </Can>
                            <Can action="delete" path="/company/settings/cabin">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete Cabin"
                                onClick={() => handleDelete(cabin._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </Can>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-muted">
                          No cabins found
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
    </>
  );
}
