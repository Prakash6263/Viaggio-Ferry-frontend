import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Swal from "sweetalert2";

// Demo trip data (keyed by id)
const DEMO_TRIPS = {
  "alloc-001": {
    tripCode: "TRP001",
    tripName: "Mumbai Ferry",
    ship: "MV Voyager",
    departurePort: "Mumbai",
    arrivalPort: "Goa",
    departureDate: "2026-04-10",
    arrivalDate: "2026-04-10",
  },
  "alloc-002": {
    tripCode: "TRP002",
    tripName: "Goa Ferry",
    ship: "MV Explorer",
    departurePort: "Goa",
    arrivalPort: "Mumbai",
    departureDate: "2026-04-15",
    arrivalDate: "2026-04-15",
  },
  "alloc-003": {
    tripCode: "TRP003",
    tripName: "Coastal Express",
    ship: "MV Neptune",
    departurePort: "Chennai",
    arrivalPort: "Colombo",
    departureDate: "2026-05-01",
    arrivalDate: "2026-05-02",
  },
};

const DEMO_AGENTS = [
  { id: "agent-001", name: "Marine Agent A" },
  { id: "agent-002", name: "Commercial Agent B" },
  { id: "agent-003", name: "Selling Agent C" },
];

const AVAILABILITY_TYPES = ["Passenger", "Cargo", "Vehicle"];

// Demo cabins by availability type
const DEMO_CABINS = {
  Passenger: [
    { id: "cabin-a", name: "Cabin A", totalSeats: 100, alreadyAllocated: 30 },
    { id: "cabin-b", name: "Cabin B", totalSeats: 50, alreadyAllocated: 10 },
    { id: "cabin-c", name: "Cabin C", totalSeats: 30, alreadyAllocated: 5 },
  ],
  Cargo: [
    { id: "cargo-a", name: "Cargo Hold A", totalSeats: 500, alreadyAllocated: 120 },
    { id: "cargo-b", name: "Cargo Hold B", totalSeats: 300, alreadyAllocated: 80 },
  ],
  Vehicle: [
    { id: "vehicle-a", name: "Vehicle Deck A", totalSeats: 20, alreadyAllocated: 6 },
    { id: "vehicle-b", name: "Vehicle Deck B", totalSeats: 10, alreadyAllocated: 2 },
  ],
};

// Demo existing allocations
const INITIAL_EXISTING_ALLOCATIONS = [
  {
    id: "ea-001",
    childAgent: "Marine Agent A",
    availabilityType: "Passenger",
    cabin: "Cabin A",
    allocatedSeats: 20,
    createdDate: "2026-03-15",
  },
  {
    id: "ea-002",
    childAgent: "Commercial Agent B",
    availabilityType: "Passenger",
    cabin: "Cabin B",
    allocatedSeats: 10,
    createdDate: "2026-03-16",
  },
];

export default function AllocateToChildPage() {
  const { id } = useParams();
  const trip = DEMO_TRIPS[id] || DEMO_TRIPS["alloc-001"];

  // Form state
  const [selectedAgent, setSelectedAgent] = useState("");
  const [availabilityType, setAvailabilityType] = useState("Passenger");
  const [remarks, setRemarks] = useState("");
  const [cabinAllocations, setCabinAllocations] = useState({});
  const [existingAllocations, setExistingAllocations] = useState(INITIAL_EXISTING_ALLOCATIONS);
  const [isSaving, setIsSaving] = useState(false);

  const cabins = DEMO_CABINS[availabilityType] || [];

  // Handle cabin allocation input change
  const handleCabinAllocChange = (cabinId, value) => {
    const cabin = cabins.find((c) => c.id === cabinId);
    if (!cabin) return;
    const remaining = cabin.totalSeats - cabin.alreadyAllocated;
    const parsed = parseInt(value) || 0;

    if (parsed > remaining) {
      Swal.fire({
        icon: "warning",
        title: "Exceeds Remaining Seats",
        text: `You can allocate at most ${remaining} seats for ${cabin.name}.`,
        timer: 2500,
        showConfirmButton: false,
      });
      setCabinAllocations((prev) => ({ ...prev, [cabinId]: remaining }));
      return;
    }
    setCabinAllocations((prev) => ({ ...prev, [cabinId]: parsed < 0 ? 0 : parsed }));
  };

  // When availability type changes, reset allocations
  const handleAvailabilityTypeChange = (type) => {
    setAvailabilityType(type);
    setCabinAllocations({});
  };

  // Handle save allocation
  const handleSave = (e) => {
    e.preventDefault();

    if (!selectedAgent) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please select a child agent." });
      return;
    }

    const allocatedCabins = cabins.filter((c) => cabinAllocations[c.id] > 0);
    if (allocatedCabins.length === 0) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please allocate seats to at least one cabin." });
      return;
    }

    setIsSaving(true);

    // Simulate save
    setTimeout(() => {
      const agentName = DEMO_AGENTS.find((a) => a.id === selectedAgent)?.name || selectedAgent;
      const newRows = allocatedCabins.map((c, i) => ({
        id: `ea-new-${Date.now()}-${i}`,
        childAgent: agentName,
        availabilityType,
        cabin: c.name,
        allocatedSeats: cabinAllocations[c.id],
        createdDate: new Date().toISOString().split("T")[0],
      }));

      setExistingAllocations((prev) => [...prev, ...newRows]);
      setSelectedAgent("");
      setRemarks("");
      setCabinAllocations({});
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

  // Handle delete existing allocation
  const handleDeleteAllocation = (allocId) => {
    Swal.fire({
      title: "Delete Allocation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setExistingAllocations((prev) => prev.filter((a) => a.id !== allocId));
        Swal.fire({ icon: "success", title: "Deleted", timer: 1500, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Back Button */}
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
                <div className="form-group">
                  <label className="form-label">Trip Code</label>
                  <input type="text" className="form-control" value={trip.tripCode} readOnly />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label">Trip Name</label>
                  <input type="text" className="form-control" value={trip.tripName} readOnly />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label className="form-label">Ship</label>
                  <input type="text" className="form-control" value={trip.ship} readOnly />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Departure Port</label>
                  <input type="text" className="form-control" value={trip.departurePort} readOnly />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Arrival Port</label>
                  <input type="text" className="form-control" value={trip.arrivalPort} readOnly />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Departure Date</label>
                  <input type="text" className="form-control" value={trip.departureDate} readOnly />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label className="form-label">Arrival Date</label>
                  <input type="text" className="form-control" value={trip.arrivalDate} readOnly />
                </div>
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
                    >
                      <option value="">-- Select Child Agent --</option>
                      {DEMO_AGENTS.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
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
                      {AVAILABILITY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
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
                      <th>Total Seats</th>
                      <th>Already Allocated</th>
                      <th>Remaining Seats</th>
                      <th>Allocate Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cabins.map((cabin) => {
                      const remaining = cabin.totalSeats - cabin.alreadyAllocated;
                      const allocated = cabinAllocations[cabin.id] || 0;
                      const displayRemaining = remaining - allocated;
                      return (
                        <tr key={cabin.id}>
                          <td>{cabin.name}</td>
                          <td>{cabin.totalSeats}</td>
                          <td>{cabin.alreadyAllocated}</td>
                          <td>
                            <span className={displayRemaining < 5 ? "text-danger fw-bold" : ""}>
                              {displayRemaining}
                            </span>
                          </td>
                          <td style={{ width: "160px" }}>
                            <input
                              type="number"
                              className="form-control"
                              min={0}
                              max={remaining}
                              value={allocated === 0 ? "" : allocated}
                              placeholder="0"
                              onChange={(e) => handleCabinAllocChange(cabin.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Form Actions */}
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
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Allocation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Allocations Table */}
        <div className="card">
          <div className="card-header">
            <h6 className="card-title mb-0">
              <i className="fe fe-list me-2"></i>Existing Allocations
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Child Agent</th>
                    <th>Availability Type</th>
                    <th>Cabin</th>
                    <th>Allocated Seats</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {existingAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted">
                        No allocations yet
                      </td>
                    </tr>
                  ) : (
                    existingAllocations.map((alloc) => (
                      <tr key={alloc.id}>
                        <td>{alloc.childAgent}</td>
                        <td>
                          <span className="badge badge-primary-light">{alloc.availabilityType}</span>
                        </td>
                        <td>{alloc.cabin}</td>
                        <td>{alloc.allocatedSeats}</td>
                        <td>{alloc.createdDate}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            title="View"
                            onClick={() =>
                              Swal.fire({
                                title: "Allocation Detail",
                                html: `<div class="text-start">
                                  <p><strong>Child Agent:</strong> ${alloc.childAgent}</p>
                                  <p><strong>Type:</strong> ${alloc.availabilityType}</p>
                                  <p><strong>Cabin:</strong> ${alloc.cabin}</p>
                                  <p><strong>Allocated Seats:</strong> ${alloc.allocatedSeats}</p>
                                  <p><strong>Created:</strong> ${alloc.createdDate}</p>
                                </div>`,
                                icon: "info",
                              })
                            }
                          >
                            <i className="fe fe-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary me-1"
                            title="Edit"
                            onClick={() =>
                              Swal.fire({
                                icon: "info",
                                title: "Edit",
                                text: "Edit functionality will connect to API in the next phase.",
                              })
                            }
                          >
                            <i className="fe fe-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDeleteAllocation(alloc.id)}
                          >
                            <i className="fe fe-trash-2"></i>
                          </button>
                        </td>
                      </tr>
                    ))
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
