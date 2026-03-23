import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Swal from "sweetalert2";
import { partnerApi } from "../api/partnerApi";
import { allocationApi } from "../api/allocationApi";
import { CirclesWithBar } from "react-loader-spinner";

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function AllocateToChildPage() {
  const { id } = useParams();

  // API data
  const [tripData, setTripData]           = useState(null);
  const [myAllocation, setMyAllocation]   = useState(null);
  const [childAllocations, setChildAllocations] = useState([]);
  const [pageLoading, setPageLoading]     = useState(true);
  const [pageError, setPageError]         = useState(null);

  // Child agents dropdown
  const [childAgents, setChildAgents]     = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);

  // Form state
  const [selectedAgent, setSelectedAgent]       = useState("");
  const [availabilityType, setAvailabilityType] = useState("passenger");
  const [remarks, setRemarks]                   = useState("");
  const [cabinAllocations, setCabinAllocations] = useState({});
  const [isSaving, setIsSaving]                 = useState(false);

  // Fetch allocation detail by finding the matching allocationId in the list + child agents in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setPageLoading(true);
        setPageError(null);
        const [allocRes, agentsRes] = await Promise.all([
          allocationApi.getMyTrips(1, 100),
          partnerApi.getChildPartnersForSelect().catch(() => ({ data: [] })),
        ]);

        // Find the entry whose allocationId matches the URL param
        const allRecords = allocRes?.data || [];
        const record = allRecords.find((r) => r.allocationId === id);

        if (!record) {
          throw new Error("Allocation not found.");
        }

        setTripData(record.trip || null);
        setMyAllocation(record || null);
        setChildAllocations(record.childAllocations || []);
        setChildAgents(agentsRes?.data || []);
      } catch (err) {
        setPageError(err.message);
      } finally {
        setPageLoading(false);
        setAgentsLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Get cabins for selected availability type from myAllocation.allocations
  const getCabinsForType = () => {
    if (!myAllocation) return [];
    const typeData = myAllocation.allocations?.find((a) => a.type === availabilityType);
    return typeData?.cabins || [];
  };

  const cabins = getCabinsForType();

  // Handle cabin qty input
  const handleCabinAllocChange = (cabinId, value) => {
    const cabin = cabins.find((c) => c.cabin._id === cabinId);
    if (!cabin) return;
    const remaining = cabin.remainingSeats;
    const parsed = Math.max(0, parseInt(value) || 0);
    if (parsed > remaining) {
      Swal.fire({
        icon: "warning",
        title: "Exceeds Remaining Seats",
        text: `You can allocate at most ${remaining} seats for ${cabin.cabin.name}.`,
        timer: 2500,
        showConfirmButton: false,
      });
      setCabinAllocations((prev) => ({ ...prev, [cabinId]: remaining }));
      return;
    }
    setCabinAllocations((prev) => ({ ...prev, [cabinId]: parsed }));
  };

  const handleAvailabilityTypeChange = (type) => {
    setAvailabilityType(type);
    setCabinAllocations({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please select a child agent." });
      return;
    }
    const allocatedCabins = cabins.filter((c) => (cabinAllocations[c.cabin._id] || 0) > 0);
    if (allocatedCabins.length === 0) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please allocate seats to at least one cabin." });
      return;
    }
    setIsSaving(true);
    // TODO: connect to POST API
    setTimeout(() => {
      setIsSaving(false);
      Swal.fire({
        icon: "success",
        title: "Allocation Saved",
        text: "Seats have been successfully allocated to the child agent.",
        timer: 2000,
        showConfirmButton: false,
      });
    }, 800);
  };

  if (pageLoading) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="d-flex justify-content-center align-items-center py-5">
            <CirclesWithBar height="60" width="60" color="#1aafa5" outerCircleColor="#1aafa5" innerCircleColor="#1aafa5" barColor="#1aafa5" visible={true} />
          </div>
        </PageWrapper>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="alert alert-danger">{pageError}</div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="mb-3">
          <Link to="/company/partner-management/allocation" className="btn btn-turquoise">
            <i className="bi bi-arrow-left"></i> Back to My Allocations
          </Link>
        </div>

        <div className="page-header">
          <div className="content-page-header">
            <h5>Allocate to Child Agent</h5>
          </div>
        </div>

        {/* Trip Information (Read Only) */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="card-title mb-0">
              <i className="fe fe-info me-2"></i>Trip Information
            </h6>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Trip Code</label>
                <input type="text" className="form-control" value={tripData?.tripCode || "-"} readOnly />
              </div>
              <div className="col-md-4">
                <label className="form-label">Trip Name</label>
                <input type="text" className="form-control" value={tripData?.tripName || "-"} readOnly />
              </div>
              <div className="col-md-4">
                <label className="form-label">Ship</label>
                <input type="text" className="form-control" value={tripData?.ship?.name || "-"} readOnly />
              </div>
              <div className="col-md-3">
                <label className="form-label">Departure Port</label>
                <input type="text" className="form-control" value={tripData?.departurePort?.name || "-"} readOnly />
              </div>
              <div className="col-md-3">
                <label className="form-label">Arrival Port</label>
                <input type="text" className="form-control" value={tripData?.arrivalPort?.name || "-"} readOnly />
              </div>
              <div className="col-md-3">
                <label className="form-label">Departure Date</label>
                <input type="text" className="form-control" value={formatDate(tripData?.departureDateTime)} readOnly />
              </div>
              <div className="col-md-3">
                <label className="form-label">Arrival Date</label>
                <input type="text" className="form-control" value={formatDate(tripData?.arrivalDateTime)} readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Allocation Form */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="card-title mb-0">
              <i className="fe fe-share-2 me-2"></i>Allocation Form
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-4">
                {/* Child Agent */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Child Agent <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      disabled={agentsLoading}
                    >
                      <option value="">
                        {agentsLoading ? "Loading..." : "-- Select Child Agent --"}
                      </option>
                      {childAgents.map((agent) => (
                        <option key={agent._id} value={agent._id}>{agent.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Availability Type */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Availability Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={availabilityType}
                      onChange={(e) => handleAvailabilityTypeChange(e.target.value)}
                    >
                      {(myAllocation?.allocations || []).map((a) => (                        <option key={a.type} value={a.type}>
                          {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Remarks */}
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Optional remarks..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Cabin Allocation Table */}
              <h6 className="fw-semibold mb-3">Cabin Allocation</h6>
              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Cabin</th>
                      <th>Allocated Seats</th>
                      <th>Allocated to Children</th>
                      <th>Remaining Seats</th>
                      <th>Allocate Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cabins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">No cabins available</td>
                      </tr>
                    ) : (
                      cabins.map((cabin) => {
                        const inputVal = cabinAllocations[cabin.cabin._id] || 0;
                        const liveRemaining = cabin.remainingSeats - inputVal;
                        return (
                          <tr key={cabin.cabin._id}>
                            <td>{cabin.cabin.name}</td>
                            <td>{cabin.allocatedSeats}</td>
                            <td>{cabin.allocatedToChildren}</td>
                            <td>
                              <span className={liveRemaining < 5 ? "text-danger fw-bold" : ""}>
                                {liveRemaining}
                              </span>
                            </td>
                            <td style={{ width: "160px" }}>
                              <input
                                type="number"
                                className="form-control"
                                min={0}
                                max={cabin.remainingSeats}
                                value={inputVal === 0 ? "" : inputVal}
                                placeholder="0"
                                onChange={(e) => handleCabinAllocChange(cabin.cabin._id, e.target.value)}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link
                  to="/company/partner-management/allocation"
                  className="btn btn-turquoise"
                  style={{ pointerEvents: isSaving ? "none" : "auto", opacity: isSaving ? 0.65 : 1 }}
                >
                  <i className="bi bi-arrow-left"></i> Back to List
                </Link>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Saving...</>
                  ) : (
                    "Save Allocation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Child Allocations Table */}
        <div className="card">
          <div className="card-header">
            <h6 className="card-title mb-0">
              <i className="fe fe-list me-2"></i>Child Allocations
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Child Agent</th>
                    <th>Layer</th>
                    <th>Availability Type</th>
                    <th>Cabin</th>
                    <th>Allocated Seats</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {childAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">No child allocations yet</td>
                    </tr>
                  ) : (
                    childAllocations.flatMap((alloc) =>
                      alloc.allocations.flatMap((typeAlloc) =>
                        typeAlloc.cabins.map((cabin, i) => (
                          <tr key={`${alloc._id}-${typeAlloc.type}-${i}`}>
                            <td>{alloc.agent?.name || "-"}</td>
                            <td>{alloc.agent?.layer || "-"}</td>
                            <td>
                              <span className="badge badge-primary-light">
                                {typeAlloc.type.charAt(0).toUpperCase() + typeAlloc.type.slice(1)}
                              </span>
                            </td>
                            <td>{cabin.cabin?.name || "-"}</td>
                            <td>{cabin.allocatedSeats}</td>
                            <td>{formatDate(alloc.createdAt)}</td>
                          </tr>
                        ))
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </PageWrapper>
    </div>
  );
}
