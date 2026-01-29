'use client';

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import Swal from "sweetalert2";
import Can from "../Can";
import { portsApi } from "../../api/portsApi";

export default function PortsListTable() {
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [ports, setPorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch ports data
    const fetchPorts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await portsApi.getPorts(1, 100, "");

            console.log("[v0] Ports API Response:", response);

            // Handle different response formats - API returns { data: [], pagination: {} }
            let data = [];

            if (response?.data?.ports && Array.isArray(response.data.ports)) {
                data = response.data.ports;
            } else {
                console.warn("[v0] Unexpected ports response format:", response);
            }


            console.log("[v0] Parsed Ports Data:", data);
            setPorts(data);
        } catch (err) {
            console.error("[v0] Error fetching ports:", err);
            setError("Failed to load ports");
            setPorts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPorts();
    }, []);

    // Initialize DataTable after ports are loaded
    useEffect(() => {
        const el = tableRef.current;
        if (!el || !ports.length || !window.DataTable) return;

        try {
            if (el._dt) {
                el._dt.destroy();
                el._dt = null;
            }
        } catch (err) { }

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
            } catch (err) { }
            if (el) el._dt = null;
        };
    }, [ports]);

    const handleEdit = (portId) => {
        navigate(`/company/settings/port/${portId}`);
    };

    const handleDelete = async (portId) => {
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
               await portsApi.deletePort(portId);

// Reload fresh data from backend
await fetchPorts();

                // Show success message
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Port has been deleted successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                // Revert optimistic update on error
                console.error("[v0] Error deleting port:", err);
                setPorts(ports); // Restore the port back to the list

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Failed to delete port",
                });
            }
        }
    };

    // Format created by actor
    const formatActor = (actor) => {
        if (!actor) return "Unknown";
        if (actor.type === "company") {
            return `${actor.name} (Company)`;
        }
        if (actor.type === "user") {
            return `${actor.name} (User — ${actor.layer || "N/A"})`;
        }
        return "System";
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
                                    id="portsTable"
                                    className="table table-striped"
                                    style={{ width: "100%" }}
                                >
                                    <thead>
                                        <tr>
                                            <th>Port Name</th>
                                            <th>Port Code</th>
                                            <th>Country</th>
                                            <th>Timezone</th>
                                            <th>Status</th>
                                            <th>Created By</th>
                                            <th>Updated By</th>
                                            <th>Updated At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ports.length > 0 ? (
                                            ports.map((port) => (
                                                <tr key={port._id}>
                                                    <td>
                                                        <strong>{port.name}</strong>
                                                    </td>
                                                    <td>{port.code}</td>
                                                    <td>{port.country}</td>
                                                    <td>{port.timezone}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${port.status === "Active"
                                                                    ? "badge-active"
                                                                    : "badge-inactive"
                                                                }`}
                                                        >
                                                            {port.status || "Active"}
                                                        </span>
                                                    </td>
                                                    <td>{formatActor(port.createdBy)}</td>

                                                    <td>
                                                        {port.updatedBy ? formatActor(port.updatedBy) : "—"}
                                                    </td>

                                                    <td>
                                                        {port.updatedAt
                                                            ? new Date(port.updatedAt).toLocaleString()
                                                            : "—"}
                                                    </td>

                                                    <td className="action-buttons">

                                                        <Can action="update" path="/company/settings/port">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-1"
                                                                title="Edit Port"
                                                                onClick={() => handleEdit(port._id)}
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>
                                                        </Can>
                                                        <Can action="delete" path="/company/settings/port">
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Delete Port"
                                                                onClick={() => handleDelete(port._id)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </Can>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted">
                                                    No ports found
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
