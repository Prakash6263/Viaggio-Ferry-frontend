'use client';

import React, { useEffect, useRef, useState } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import Swal from "sweetalert2";
import Can from "../Can";
import { payloadTypesApi } from "../../api/payloadTypesApi";

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

export default function PayloadTypeTable({ type, onEdit, onRefresh }) {
  const tableRef = useRef(null);
  const [payloadTypes, setPayloadTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPayloadTypes, setFilteredPayloadTypes] = useState([]);

  // Fetch payload types for current category
  const fetchPayloadTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await payloadTypesApi.getPayloadTypes(
        currentPage,
        100,
        type
      );

      // Handle different response formats
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data?.payloadTypes && Array.isArray(response.data.payloadTypes)) {
        data = response.data.payloadTypes;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response?.payloadTypes && Array.isArray(response.payloadTypes)) {
        data = response.payloadTypes;
      } else if (response?.list && Array.isArray(response.list)) {
        data = response.list;
      }

      // Ensure all fields are properly formatted
      const cleanedData = data.map(item => ({
        ...item,
        description: typeof item.description === 'object' ? String(item.description) : (item.description || ''),
        name: typeof item.name === 'object' ? String(item.name) : item.name,
      }));

      setPayloadTypes(cleanedData);
    } catch (err) {
      console.error("[v0] Error fetching payload types:", err);
      setError("Failed to load payload types");
      setPayloadTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayloadTypes();
  }, [type, currentPage]);

  // Initialize DataTable after data is loaded
  useEffect(() => {
    const el = tableRef.current;
    if (!el || !payloadTypes.length || !window.DataTable) return;

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
    });

    el._dt = dt;
    return () => {
      try {
        dt.destroy();
      } catch (err) {}
      if (el) el._dt = null;
    };
  }, [payloadTypes]);

  const handleEdit = (payloadType) => {
    // Ensure category is set for modal targeting
    const payloadWithCategory = {
      ...payloadType,
      category: type,
    };
    onEdit(payloadWithCategory);
  };

  const handleDelete = async (payloadTypeId) => {
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
        await payloadTypesApi.deletePayloadType(payloadTypeId);

        // Reload fresh data from backend
        await fetchPayloadTypes();

        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Payload type has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        // Trigger parent refresh
        onRefresh();
      } catch (err) {
        console.error("[v0] Error deleting payload type:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete payload type",
        });
      }
    }
  };

  const getTableHeaders = () => {
    const baseHeaders = ["Type Name", "Code", "Description", "Status"];
    const typeSpecificHeaders = {
      passenger: ["Age Range"],
      cargo: ["Max Weight (kg)", "Dimensions (L×W×H)"],
      vehicle: ["Max Weight (kg)", "Dimensions (L×W×H)"],
    };
    return [...baseHeaders, ...(typeSpecificHeaders[type] || []), "Created By", "Updated By", "Updated At", "Actions"];
  };

  const renderTypeSpecificColumns = (payloadType) => {
    switch (type) {
      case "passenger":
        let ageRange = payloadType.ageRange;
        let ageRangeDisplay = "—";
        
        // Handle different ageRange formats
        if (typeof ageRange === 'object' && ageRange !== null && ageRange.from !== undefined && ageRange.to !== undefined) {
          ageRangeDisplay = `${ageRange.from} - ${ageRange.to}`;
        } else if (typeof ageRange === 'string') {
          ageRangeDisplay = ageRange;
        }
        
        return <td>{ageRangeDisplay}</td>;
      case "cargo":
        return (
          <>
            <td>{payloadType.maxWeight || "—"}</td>
            <td>{payloadType.dimensions || "—"}</td>
          </>
        );
      case "vehicle":
        return (
          <>
            <td>{payloadType.maxWeight || "—"}</td>
            <td>{payloadType.dimensions || "—"}</td>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-3">
            <div
              className="card-body d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
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
                  id={`payloadTypeTable${type}`}
                  className="table table-striped"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      {getTableHeaders().map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payloadTypes.length > 0 ? (
                      payloadTypes.map((payloadType) => (
                        <tr key={payloadType._id}>
                          <td>
                            <strong>{payloadType.name}</strong>
                          </td>
                          <td>{payloadType.code}</td>
                          <td>{payloadType.description || "—"}</td>
                          <td>
                            <span
                              className={`badge ${payloadType.status === "Active"
                                ? "badge-active"
                                : "badge-inactive"
                              }`}
                            >
                              {payloadType.status || "Active"}
                            </span>
                          </td>
                          {renderTypeSpecificColumns(payloadType)}
                          <td>{formatActor(payloadType.createdBy)}</td>
                          <td>
                            {payloadType.updatedBy
                              ? formatActor(payloadType.updatedBy)
                              : "—"}
                          </td>
                          <td>
                            {payloadType.updatedAt
                              ? new Date(payloadType.updatedAt).toLocaleString()
                              : "—"}
                          </td>
                          <td className="action-buttons">
                            <Can
                              action="update"
                              path="/company/settings/payload-type"
                            >
                              <button
                                className="btn btn-sm btn-outline-primary me-1"
                                title="Edit"
                                onClick={() => handleEdit(payloadType)}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                            </Can>
                            <Can
                              action="delete"
                              path="/company/settings/payload-type"
                            >
                              <button
                                className="btn btn-sm btn-outline-danger"
                                title="Delete"
                                onClick={() => handleDelete(payloadType._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </Can>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={getTableHeaders().length}
                          className="text-center text-muted"
                        >
                          No payload types found
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
