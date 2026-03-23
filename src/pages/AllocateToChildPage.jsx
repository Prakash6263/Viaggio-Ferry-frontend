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
  const { id } = useParams(); // id = trip._id

  // API data
  const [tripData, setTripData]             = useState(null);
  const [myAllocation, setMyAllocation]     = useState(null);
  const [childAllocations, setChildAllocations] = useState([]);
  const [pageLoading, setPageLoading]       = useState(true);
  const [pageError, setPageError]           = useState(null);

  // Child agents dropdown
  const [childAgents, setChildAgents]       = useState([]);
  const [agentsLoading, setAgentsLoading]   = useState(true);

  // Form state
  const [selectedAgent, setSelectedAgent]   = useState("");
  const [availabilityType, setAvailabilityType] = useState("passenger");
  const [cabinAllocations, setCabinAllocations] = useState({});
  const [isSaving, setIsSaving]             = useState(false);

  // Edit state — modal-style form above the table
  const [editingAlloc, setEditingAlloc]     = useState(null); // full alloc object
  const [editType, setEditType]             = useState("passenger");
  const [editCabinValues, setEditCabinValues] = useState({});

  // ─── Fetch trip + allocation data ─────────────────────────────────────────
  const fetchData = async () => {
    try {
      setPageLoading(true);
      setPageError(null);
      const [allocRes, agentsRes] = await Promise.all([
        allocationApi.getMyTrips(1, 100),
        partnerApi.getChildPartnersForSelect().catch(() => ({ data: [] })),
      ]);

      // id from URL is trip._id — find the matching record
      const allRecords = allocRes?.data || [];
      const record = allRecords.find((r) => r.trip?._id === id);

      if (!record) throw new Error("Allocation not found.");

      setTripData(record.trip || null);
      setMyAllocation(record || null);
      setChildAgents(agentsRes?.data || []);

      if (record.allocations?.length > 0) {
        setAvailabilityType(record.allocations[0].type);
      }
    } catch (err) {
      setPageError(err.message);
    } finally {
      setPageLoading(false);
      setAgentsLoading(false);
    }
  };

  // ─── Fetch child allocations separately ───────────────────────────────────
  const fetchChildAllocations = async () => {
    try {
      const res = await allocationApi.getChildAllocations(id);
      setChildAllocations(res?.data || []);
    } catch (err) {
      console.error("[v0] Child allocations fetch error:", err.message);
      setChildAllocations([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchChildAllocations();
  }, [id]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getCabinsForType = (type = availabilityType, allocation = myAllocation) => {
    if (!allocation) return [];
    const typeData = (allocation.allocations || []).find((a) => a.type === type);
    return typeData?.cabins || [];
  };

  const cabins = getCabinsForType();

  const handleCabinAllocChange = (cabinId, value, cabinList, stateObj, setFn) => {
    const cabin = cabinList.find((c) => c.cabin._id === cabinId);
    if (!cabin) return;
    const parsed = Math.max(0, parseInt(value) || 0);
    if (parsed > cabin.remainingSeats) {
      Swal.fire({
        icon: "warning",
        title: "Exceeds Remaining Seats",
        text: `Max ${cabin.remainingSeats} seats available for ${cabin.cabin.name}.`,
        timer: 2500,
        showConfirmButton: false,
      });
      setFn((prev) => ({ ...prev, [cabinId]: cabin.remainingSeats }));
      return;
    }
    setFn((prev) => ({ ...prev, [cabinId]: parsed }));
  };

  const handleAvailabilityTypeChange = (type) => {
    setAvailabilityType(type);
    setCabinAllocations({});
  };

  // ─── Create allocation ────────────────────────────────────────────────────
  const handleSave = async (e) => {
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

    const payload = {
      tripId: tripData?._id,
      childAgentId: selectedAgent,
      allocations: [
        {
          type: availabilityType,
          cabins: allocatedCabins.map((c) => ({
            cabin: c.cabin._id,
            allocatedSeats: cabinAllocations[c.cabin._id],
          })),
        },
      ],
    };

    try {
      setIsSaving(true);
      await allocationApi.createChildAllocation(payload);
      Swal.fire({
        icon: "success",
        title: "Allocation Saved",
        text: "Seats have been successfully allocated to the child agent.",
        timer: 2000,
        showConfirmButton: false,
      });
      setSelectedAgent("");
      setCabinAllocations({});
      await fetchChildAllocations();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Edit allocation ──────────────────────────────────────────────────────
  const handleEditClick = (alloc) => {
    const firstType = alloc.allocations?.[0];
    const type = firstType?.type || "passenger";
    // Build initial seat values keyed by cabin._id from myAllocation cabins
    const initialValues = {};
    const editCabins = getCabinsForType(type);
    editCabins.forEach((c) => {
      const existing = (firstType?.cabins || []).find((fc) => {
        const fcId = typeof fc.cabin === "object" ? fc.cabin?._id : fc.cabin;
        return fcId === c.cabin._id;
      });
      initialValues[c.cabin._id] = existing?.allocatedSeats || 0;
    });
    setEditType(type);
    setEditCabinValues(initialValues);
    setEditingAlloc(alloc);
    // Scroll to edit form
    setTimeout(() => {
      document.getElementById("edit-allocation-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleEditTypeChange = (type) => {
    setEditType(type);
    // Re-init cabin values for the new type
    const initialValues = {};
    const existingType = (editingAlloc?.allocations || []).find((a) => a.type === type);
    getCabinsForType(type).forEach((c) => {
      const existing = (existingType?.cabins || []).find((fc) => {
        const fcId = typeof fc.cabin === "object" ? fc.cabin?._id : fc.cabin;
        return fcId === c.cabin._id;
      });
      initialValues[c.cabin._id] = existing?.allocatedSeats || 0;
    });
    setEditCabinValues(initialValues);
  };

  const handleEditCabinChange = (cabinId, value) => {
    const editCabins = getCabinsForType(editType);
    const cabin = editCabins.find((c) => c.cabin._id === cabinId);
    if (!cabin) return;
    const parsed = Math.max(0, parseInt(value) || 0);
    if (parsed > cabin.remainingSeats) {
      Swal.fire({
        icon: "warning",
        title: "Exceeds Remaining Seats",
        text: `Max ${cabin.remainingSeats} seats available for ${cabin.cabin.name}.`,
        timer: 2500,
        showConfirmButton: false,
      });
      setEditCabinValues((prev) => ({ ...prev, [cabinId]: cabin.remainingSeats }));
      return;
    }
    setEditCabinValues((prev) => ({ ...prev, [cabinId]: parsed }));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingAlloc) return;
    const editCabins = getCabinsForType(editType);
    const allocatedCabins = editCabins.filter((c) => (editCabinValues[c.cabin._id] || 0) > 0);
    if (allocatedCabins.length === 0) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please allocate seats to at least one cabin." });
      return;
    }
    const payload = {
      allocations: [
        {
          type: editType,
          cabins: allocatedCabins.map((c) => ({
            cabin: c.cabin._id,
            allocatedSeats: editCabinValues[c.cabin._id],
          })),
        },
      ],
    };
    try {
      setIsSaving(true);
      await allocationApi.updateAllocation(editingAlloc._id, payload);
      Swal.fire({ icon: "success", title: "Updated", text: "Allocation updated successfully.", timer: 2000, showConfirmButton: false });
      setEditingAlloc(null);
      setEditCabinValues({});
      await fetchChildAllocations();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditingAlloc(null);
    setEditCabinValues({});
  };

  // ─── Delete allocation ────────────────────────────────────────────────────
  const handleDelete = async (allocationObjectId) => {
    const result = await Swal.fire({
      title: "Delete Allocation?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;
    try {
      await allocationApi.deleteAllocation(allocationObjectId);
      setChildAllocations((prev) => prev.filter((a) => a._id !== allocationObjectId));
      Swal.fire({ icon: "success", title: "Deleted", text: "Allocation deleted successfully.", timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    }
  };

  // ─── Render guards ────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="main-wrapper">
        <Header /><Sidebar />
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
        <Header /><Sidebar />
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
            <h6 className="card-title mb-0"><i className="fe fe-info me-2"></i>Trip Information</h6>
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
            <h6 className="card-title mb-0"><i className="fe fe-share-2 me-2"></i>Allocation Form</h6>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              <div className="row g-3 mb-4">
                {/* Child Agent */}
                <div className="col-md-6">
                  <label className="form-label">Child Agent <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    disabled={agentsLoading}
                  >
                    <option value="">{agentsLoading ? "Loading..." : "-- Select Child Agent --"}</option>
                    {childAgents.map((agent) => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Type */}
                <div className="col-md-6">
                  <label className="form-label">Availability Type <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={availabilityType}
                    onChange={(e) => handleAvailabilityTypeChange(e.target.value)}
                  >
                    {(myAllocation?.allocations || []).map((a) => (
                      <option key={a.type} value={a.type}>
                        {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                      </option>
                    ))}
                  </select>
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
                      <tr><td colSpan={5} className="text-center text-muted">No cabins available</td></tr>
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
                              <span className={liveRemaining < 5 ? "text-danger fw-bold" : ""}>{liveRemaining}</span>
                            </td>
                            <td style={{ width: "160px" }}>
                              <input
                                type="number"
                                className="form-control"
                                min={0}
                                max={cabin.remainingSeats}
                                value={inputVal === 0 ? "" : inputVal}
                                placeholder="0"
                                onChange={(e) => handleCabinAllocChange(cabin.cabin._id, e.target.value, cabins, cabinAllocations, setCabinAllocations)}
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
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? (
                    <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Saving...</>
                  ) : "Save Allocation"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Edit Allocation Form — shown only when editing */}
        {editingAlloc && (
          <div className="card mb-4 border border-warning" id="edit-allocation-form">
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#fff8e1" }}>
              <h6 className="card-title mb-0">
                <i className="fe fe-edit me-2"></i>Edit Allocation — {editingAlloc.agent?.name || ""}
              </h6>
              <button type="button" className="btn-close" onClick={handleEditCancel} aria-label="Close"></button>
            </div>
            <div className="card-body">
              <form onSubmit={handleEditSave}>
                <div className="row g-3 mb-4">
                  {/* Child Agent — read-only */}
                  <div className="col-md-6">
                    <label className="form-label">Child Agent</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingAlloc.agent?.name || "-"}
                      readOnly
                    />
                  </div>

                  {/* Availability Type */}
                  <div className="col-md-6">
                    <label className="form-label">Availability Type <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={editType}
                      onChange={(e) => handleEditTypeChange(e.target.value)}
                    >
                      {(myAllocation?.allocations || []).map((a) => (
                        <option key={a.type} value={a.type}>
                          {a.type.charAt(0).toUpperCase() + a.type.slice(1)}
                        </option>
                      ))}
                    </select>
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
                      {getCabinsForType(editType).length === 0 ? (
                        <tr><td colSpan={5} className="text-center text-muted">No cabins available</td></tr>
                      ) : (
                        getCabinsForType(editType).map((cabin) => {
                          const inputVal = editCabinValues[cabin.cabin._id] || 0;
                          const liveRemaining = cabin.remainingSeats - inputVal;
                          return (
                            <tr key={cabin.cabin._id}>
                              <td>{cabin.cabin.name}</td>
                              <td>{cabin.allocatedSeats}</td>
                              <td>{cabin.allocatedToChildren}</td>
                              <td>
                                <span className={liveRemaining < 5 ? "text-danger fw-bold" : ""}>{liveRemaining}</span>
                              </td>
                              <td style={{ width: "160px" }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  min={0}
                                  max={cabin.remainingSeats}
                                  value={inputVal === 0 ? "" : inputVal}
                                  placeholder="0"
                                  onChange={(e) => handleEditCabinChange(cabin.cabin._id, e.target.value)}
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
                  <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? (
                      <><span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>Saving...</>
                    ) : "Update Allocation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Child Allocations Table */}
        <div className="card">
          <div className="card-header">
            <h6 className="card-title mb-0"><i className="fe fe-list me-2"></i>Child Allocations</h6>
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {childAllocations.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-muted">No child allocations yet</td></tr>
                  ) : (
                    childAllocations.flatMap((alloc) => {
                      const allCabinRows = (alloc.allocations || []).flatMap((typeAlloc, ti) =>
                        (typeAlloc.cabins || []).map((cabin, ci) => ({ typeAlloc, cabin, ti, ci }))
                      );
                      const totalRows = allCabinRows.length || 1;
                      const isActiveEdit = editingAlloc?._id === alloc._id;

                      return allCabinRows.map(({ typeAlloc, cabin, ti, ci }, rowIndex) => {
                        const cabinKey = typeof cabin.cabin === "object" ? cabin.cabin?._id : cabin.cabin;
                        const cabinName = typeof cabin.cabin === "object"
                          ? (cabin.cabin?.name || cabinKey || "-")
                          : (cabinKey || "-");
                        const isFirstRow = rowIndex === 0;

                        return (
                          <tr key={`${alloc._id}-${ti}-${ci}`} className={isActiveEdit ? "table-warning" : ""}>
                            {isFirstRow && (
                              <>
                                <td rowSpan={totalRows} className="align-middle">{alloc.agent?.name || "-"}</td>
                                <td rowSpan={totalRows} className="align-middle">{alloc.agent?.layer || "-"}</td>
                              </>
                            )}
                            <td>
                              <span className="badge badge-primary-light">
                                {typeAlloc.type.charAt(0).toUpperCase() + typeAlloc.type.slice(1)}
                              </span>
                            </td>
                            <td>{cabinName}</td>
                            <td>{cabin.allocatedSeats}</td>
                            {isFirstRow && (
                              <>
                                <td rowSpan={totalRows} className="align-middle">{formatDate(alloc.createdAt)}</td>
                                <td rowSpan={totalRows} className="align-middle">
                                  <button
                                    className={`btn btn-sm me-1 ${isActiveEdit ? "btn-warning" : "btn-outline-primary"}`}
                                    onClick={() => isActiveEdit ? handleEditCancel() : handleEditClick(alloc)}
                                    title={isActiveEdit ? "Cancel Edit" : "Edit"}
                                  >
                                    <i className={`fe ${isActiveEdit ? "fe-x" : "fe-edit"}`}></i>
                                  </button>
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(alloc._id)} title="Delete">
                                    <i className="fe fe-trash-2"></i>
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      });
                    })
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
