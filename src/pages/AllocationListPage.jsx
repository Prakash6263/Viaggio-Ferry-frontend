import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { allocationApi } from "../api/allocationApi";
import { CirclesWithBar } from "react-loader-spinner";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getTripStatusClass(status) {
  if (!status) return "badge badge-secondary-light";
  switch (status.toUpperCase()) {
    case "SCHEDULED": return "badge badge-primary-light";
    case "ACTIVE":    return "badge badge-success-light";
    case "COMPLETED": return "badge badge-secondary-light";
    case "CANCELLED": return "badge badge-danger-light";
    default:          return "badge badge-secondary-light";
  }
}

export default function AllocationListPage() {
  const tableRef = useRef(null);
  const dtRef    = useRef(null);

  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await allocationApi.getMyTrips(1, 100);
        setAllocations(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || !tableRef.current || !window.DataTable) return;

    if (dtRef.current) {
      try { dtRef.current.destroy(); } catch {}
      dtRef.current = null;
    }

    dtRef.current = new window.DataTable(tableRef.current, {
      paging: true,
      pageLength: 10,
      searching: true,
      ordering: true,
      info: true,
      columnDefs: [{ orderable: false, targets: -1 }],
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });

    return () => {
      if (dtRef.current) {
        try { dtRef.current.destroy(); } catch {}
        dtRef.current = null;
      }
    };
  }, [allocations, loading]);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="page-header">
          <div className="content-page-header">
            <h5>My Allocations</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">

                {loading && (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <CirclesWithBar
                      height="60"
                      width="60"
                      color="#1aafa5"
                      outerCircleColor="#1aafa5"
                      innerCircleColor="#1aafa5"
                      barColor="#1aafa5"
                      visible={true}
                    />
                  </div>
                )}

                {!loading && error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                {!loading && !error && (
                  <div className="table-responsive">
                    <table
                      ref={tableRef}
                      className="table table-striped"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>Trip Code</th>
                          <th>Trip Name</th>
                          <th>Ship</th>
                          <th>Departure Port</th>
                          <th>Arrival Port</th>
                          <th>Departure Date</th>
                          <th>Passenger Allocated</th>
                          <th>Cargo Allocated</th>
                          <th>Vehicle Allocated</th>
                          <th>Trip Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allocations.length > 0 ? (
                          allocations.map((alloc) => (
                            <tr key={alloc.allocationId}>
                              <td>{alloc.trip?.tripCode || "-"}</td>
                              <td>{alloc.trip?.tripName || "-"}</td>
                              <td>{alloc.trip?.ship?.name || "-"}</td>
                              <td>{alloc.trip?.departurePort?.name || "-"}</td>
                              <td>{alloc.trip?.arrivalPort?.name || "-"}</td>
                              <td>{formatDate(alloc.trip?.departureDateTime)}</td>
                              <td>{alloc.allocatedPassengerSeats ?? 0}</td>
                              <td>{alloc.allocatedCargoSeats ?? 0}</td>
                              <td>{alloc.allocatedVehicleSeats ?? 0}</td>
                              <td>
                                <span className={getTripStatusClass(alloc.trip?.status)}>
                                  {alloc.trip?.status || "-"}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/company/partner-management/allocation/${alloc.allocationId}/allocate`}
                                  className="btn btn-sm btn-turquoise me-1"
                                  title="Allocate to Child"
                                >
                                  <i className="fe fe-share-2"></i> Allocate
                                </Link>
                                <Link
                                  to={`/company/partner-management/allocation/${alloc.allocationId}/view`}
                                  className="btn btn-sm btn-outline-primary"
                                  title="View Allocation"
                                >
                                  <i className="fe fe-eye"></i> View
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="text-center">No allocations found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
