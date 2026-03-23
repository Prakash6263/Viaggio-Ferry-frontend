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

  // Init / reinit DataTable whenever data changes
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

  {
    id: "alloc-001",
    tripCode: "TRP001",
    tripName: "Mumbai Ferry",
    ship: "MV Voyager",
    departurePort: "Mumbai",
    arrivalPort: "Goa",
    departureDate: "2026-04-10",
    passengerAllocated: 80,
    cargoAllocated: 500,
    vehicleAllocated: 10,
    usedSeats: 32,
    remainingSeats: 48,
    status: "Active",
  },
  {
    id: "alloc-002",
    tripCode: "TRP002",
    tripName: "Goa Ferry",
    ship: "MV Explorer",
    departurePort: "Goa",
    arrivalPort: "Mumbai",
    departureDate: "2026-04-15",
    passengerAllocated: 60,
    cargoAllocated: 300,
    vehicleAllocated: 6,
    usedSeats: 18,
    remainingSeats: 42,
    status: "Active",
  },
  {
    id: "alloc-003",
    tripCode: "TRP003",
    tripName: "Coastal Express",
    ship: "MV Neptune",
    departurePort: "Chennai",
    arrivalPort: "Colombo",
    departureDate: "2026-05-01",
    passengerAllocated: 40,
    cargoAllocated: 200,
    vehicleAllocated: 4,
    usedSeats: 0,
    remainingSeats: 40,
    status: "Pending",
  },
];

function getStatusBadgeClass(status) {
  switch (status) {
    case "Active":
      return "badge badge-success-light";
    case "Pending":
      return "badge badge-warning-light";
    case "Completed":
      return "badge badge-primary-light";
    case "Cancelled":
      return "badge badge-danger-light";
    default:
      return "badge badge-secondary-light";
  }
}

export default function AllocationListPage() {
  const tableRef = useRef(null);
  const dtRef = useRef(null);

  useEffect(() => {
    if (!tableRef.current || !window.DataTable) return;

    // Destroy existing instance if any
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
  }, []);

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
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Departure Date</th>
                        <th>Passenger Allocated</th>
                        <th>Cargo Allocated</th>
                        <th>Vehicle Allocated</th>
                        <th>Used Seats</th>
                        <th>Remaining Seats</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_ALLOCATIONS.map((alloc) => (
                        <tr key={alloc.id}>
                          <td>{alloc.tripCode}</td>
                          <td>{alloc.tripName}</td>
                          <td>{alloc.ship}</td>
                          <td>{alloc.departurePort}</td>
                          <td>{alloc.arrivalPort}</td>
                          <td>{alloc.departureDate}</td>
                          <td>{alloc.passengerAllocated}</td>
                          <td>{alloc.cargoAllocated} kg</td>
                          <td>{alloc.vehicleAllocated}</td>
                          <td>{alloc.usedSeats}</td>
                          <td>
                            <span
                              className={
                                alloc.remainingSeats < 10
                                  ? "text-danger fw-bold"
                                  : "text-success fw-bold"
                              }
                            >
                              {alloc.remainingSeats}
                            </span>
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(alloc.status)}>
                              {alloc.status}
                            </span>
                          </td>
                          <td>
                            <Link
                              to={`/company/partner-management/allocation/${alloc.id}/allocate`}
                              className="btn btn-sm btn-turquoise me-1"
                              title="Allocate to Child"
                            >
                              <i className="fe fe-share-2"></i> Allocate
                            </Link>
                            <Link
                              to={`/company/partner-management/allocation/${alloc.id}/view`}
                              className="btn btn-sm btn-outline-primary"
                              title="View Allocation"
                            >
                              <i className="fe fe-eye"></i> View
                            </Link>
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
      </PageWrapper>
    </div>
  );
}
