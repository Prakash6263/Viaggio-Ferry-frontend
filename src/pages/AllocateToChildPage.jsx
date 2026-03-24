import React, { useEffect, useMemo, useState } from "react";
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

  // Form state — multi-block (one block per allocation type)
  const [selectedAgent, setSelectedAgent]   = useState("");
  const [isSaving, setIsSaving]             = useState(false);
  // addBlocks: [{ type: "passenger", cabinValues: { [cabinId]: number } }, ...]
  const [addBlocks, setAddBlocks]           = useState([{ type: "", cabinValues: {} }]);

  // Edit state — multi-block
  const [editingAlloc, setEditingAlloc]     = useState(null);
  // editBlocks: [{ type, cabinValues }]
  const [editBlocks, setEditBlocks]         = useState([]);

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
        // type is now managed per-block in addBlocks
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

  // Seed the first add-block type once myAllocation loads
  useEffect(() => {
    if (myAllocation?.allocations?.length > 0) {
      setAddBlocks([{ type: myAllocation.allocations[0].type, cabinValues: {} }]);
    }
  }, [myAllocation]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getCabinsForType = (type, allocation = myAllocation) => {
    if (!allocation) return [];
    const typeData = (allocation.allocations || []).find((a) => a.type === type);
    return typeData?.cabins || [];
  };

  const availableTypes = (myAllocation?.allocations || []).map((a) => a.type);

  // Build a flat map of cabinId -> cabinName from myAllocation so plain ID strings can be resolved
  const cabinNameMap = useMemo(() => {
    const map = {};
    (myAllocation?.allocations || []).forEach((typeAlloc) => {
      (typeAlloc.cabins || []).forEach((c) => {
        if (c.cabin?._id && c.cabin?.name) {
          map[c.cabin._id] = c.cabin.name;
        }
      });
    });
    return map;
  }, [myAllocation]);

  // Returns types not yet used in the given blocks array (to prevent duplicates)
  const unusedTypes = (blocks) => {
    const used = blocks.map((b) => b.type);
    return availableTypes.filter((t) => !used.includes(t));
  };

  const validateCabinChange = (cabinId, value, cabins, setFn, blockIndex, isEdit) => {
    const cabin = cabins.find((c) => c.cabin._id === cabinId);
    if (!cabin) return;
    const parsed = Math.max(0, parseInt(value) || 0);
    
    // In edit mode, account for the previously allocated amount
    const currentBlockValues = isEdit ? editBlocks[blockIndex]?.cabinValues : addBlocks[blockIndex]?.cabinValues;
    const previouslyAllocated = currentBlockValues?.[cabinId] || 0;
    const maxAllowed = cabin.remainingSeats + previouslyAllocated;
    
    if (parsed > maxAllowed) {
      Swal.fire({
        icon: "warning",
        title: "Exceeds Remaining Seats",
        text: `Max ${maxAllowed} seats available for ${cabin.cabin.name}.`,
        timer: 2500,
        showConfirmButton: false,
      });
      setFn((prev) => {
        const updated = [...prev];
        updated[blockIndex] = { ...updated[blockIndex], cabinValues: { ...updated[blockIndex].cabinValues, [cabinId]: maxAllowed } };
        return updated;
      });
      return;
    }
    setFn((prev) => {
      const updated = [...prev];
      updated[blockIndex] = { ...updated[blockIndex], cabinValues: { ...updated[blockIndex].cabinValues, [cabinId]: parsed } };
      return updated;
    });
  };

  // ─── Add form block handlers ───────────────────────────────────────────────
  const handleAddBlockTypeChange = (blockIndex, type) => {
    setAddBlocks((prev) => {
      const updated = [...prev];
      updated[blockIndex] = { type, cabinValues: {} };
      return updated;
    });
  };

  const handleAddBlockCabinChange = (blockIndex, cabinId, value) => {
    const cabins = getCabinsForType(addBlocks[blockIndex].type);
    validateCabinChange(cabinId, value, cabins, setAddBlocks, blockIndex, false);
  };

  const handleAddBlock = () => {
    const nextTypes = unusedTypes(addBlocks);
    if (nextTypes.length === 0) return; // all types already added
    setAddBlocks((prev) => [...prev, { type: nextTypes[0], cabinValues: {} }]);
  };

  const handleRemoveAddBlock = (blockIndex) => {
    setAddBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please select a child agent." });
      return;
    }
    const allocations = addBlocks
      .filter((b) => b.type)
      .map((b) => {
        const cabins = getCabinsForType(b.type);
        return {
          type: b.type,
          cabins: cabins
            .filter((c) => (b.cabinValues[c.cabin._id] || 0) > 0)
            .map((c) => ({ cabin: c.cabin._id, allocatedSeats: b.cabinValues[c.cabin._id] })),
        };
      })
      .filter((a) => a.cabins.length > 0);

    if (allocations.length === 0) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please allocate seats to at least one cabin." });
      return;
    }

    const payload = { tripId: tripData?._id, childAgentId: selectedAgent, allocations };

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
      setAddBlocks([{ type: availableTypes[0] || "", cabinValues: {} }]);
      // Dispatch event for all allocation pages to re-fetch
      window.dispatchEvent(new CustomEvent("allocationDataChanged"));
      await fetchChildAllocations();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Edit form block handlers ──────────────────────────────────────────────
  const handleEditClick = (alloc) => {
    // Build editBlocks from the existing allocations, pre-filled with saved seat values
    const blocks = (alloc.allocations || []).map((typeAlloc) => {
      const type = typeAlloc.type;
      const cabinValues = {};
      getCabinsForType(type).forEach((c) => {
        const existing = (typeAlloc.cabins || []).find((fc) => {
          const fcId = typeof fc.cabin === "object" ? fc.cabin?._id : fc.cabin;
          return fcId === c.cabin._id;
        });
        cabinValues[c.cabin._id] = existing?.allocatedSeats || 0;
      });
      return { type, cabinValues };
    });
    // If no blocks yet, seed with first available type
    setEditBlocks(blocks.length > 0 ? blocks : [{ type: availableTypes[0] || "", cabinValues: {} }]);
    setEditingAlloc(alloc);
    setTimeout(() => {
      document.getElementById("edit-allocation-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleEditBlockTypeChange = (blockIndex, type) => {
    setEditBlocks((prev) => {
      const updated = [...prev];
      // Pre-fill with existing values for this type from editingAlloc
      const existingType = (editingAlloc?.allocations || []).find((a) => a.type === type);
      const cabinValues = {};
      getCabinsForType(type).forEach((c) => {
        const existing = (existingType?.cabins || []).find((fc) => {
          const fcId = typeof fc.cabin === "object" ? fc.cabin?._id : fc.cabin;
          return fcId === c.cabin._id;
        });
        cabinValues[c.cabin._id] = existing?.allocatedSeats || 0;
      });
      updated[blockIndex] = { type, cabinValues };
      return updated;
    });
  };

  const handleEditBlockCabinChange = (blockIndex, cabinId, value) => {
    const cabins = getCabinsForType(editBlocks[blockIndex].type);
    validateCabinChange(cabinId, value, cabins, setEditBlocks, blockIndex, true);
  };

  const handleAddEditBlock = () => {
    const nextTypes = unusedTypes(editBlocks);
    if (nextTypes.length === 0) return;
    setEditBlocks((prev) => [...prev, { type: nextTypes[0], cabinValues: {} }]);
  };

  const handleRemoveEditBlock = (blockIndex) => {
    setEditBlocks((prev) => prev.filter((_, i) => i !== blockIndex));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingAlloc) return;
    const allocations = editBlocks
      .filter((b) => b.type)
      .map((b) => {
        const cabins = getCabinsForType(b.type);
        return {
          type: b.type,
          cabins: cabins
            .filter((c) => (b.cabinValues[c.cabin._id] || 0) > 0)
            .map((c) => ({ cabin: c.cabin._id, allocatedSeats: b.cabinValues[c.cabin._id] })),
        };
      })
      .filter((a) => a.cabins.length > 0);

    if (allocations.length === 0) {
      Swal.fire({ icon: "warning", title: "Required", text: "Please allocate seats to at least one cabin." });
      return;
    }
    const payload = { allocations };
    try {
      setIsSaving(true);
      await allocationApi.updateAllocation(editingAlloc._id, payload);
      Swal.fire({ icon: "success", title: "Updated", text: "Allocation updated successfully.", timer: 2000, showConfirmButton: false });
      setEditingAlloc(null);
      setEditBlocks([]);
      
      // Dispatch event for all allocation pages to re-fetch
      window.dispatchEvent(new CustomEvent("allocationDataChanged"));
      
      // Refetch child allocations and related data
      await Promise.all([
        fetchChildAllocations(),
        fetchData()
      ]);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditingAlloc(null);
    setEditBlocks([]);
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
      // Dispatch event for all allocation pages to re-fetch
      window.dispatchEvent(new CustomEvent("allocationDataChanged"));
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
            <CirclesWithBar height="100" width="100" color="#05468f" outerCircleColor="#05468f" innerCircleColor="#05468f" barColor="#05468f" visible={true} />
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
              </div>

              {/* Allocation type blocks */}
              {addBlocks.map((block, blockIndex) => {
                const blockCabins = getCabinsForType(block.type);
                const usedTypes = addBlocks.map((b) => b.type);
                return (
                  <div key={blockIndex} className="border rounded p-3 mb-3" style={{ background: "#f9fafb" }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="col-md-5 ps-0">
                        <label className="form-label mb-1">Availability Type <span className="text-danger">*</span></label>
                        <select
                          className="form-select"
                          value={block.type}
                          onChange={(e) => handleAddBlockTypeChange(blockIndex, e.target.value)}
                        >
                          {availableTypes.map((t) => (
                            <option key={t} value={t} disabled={usedTypes.includes(t) && t !== block.type}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      {addBlocks.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger mt-3"
                          onClick={() => handleRemoveAddBlock(blockIndex)}
                          title="Remove this type"
                        >
                          <i className="fe fe-trash-2 me-1"></i>Remove
                        </button>
                      )}
                    </div>

                    <h6 className="fw-semibold mb-3">Cabin Allocation</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered mb-0">
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
                          {blockCabins.length === 0 ? (
                            <tr><td colSpan={5} className="text-center text-muted">No cabins available</td></tr>
                          ) : (
                            blockCabins.map((cabin) => {
                              const inputVal = block.cabinValues[cabin.cabin._id] || 0;
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
                                      onChange={(e) => handleAddBlockCabinChange(blockIndex, cabin.cabin._id, e.target.value)}
                                    />
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* Add another type button */}
              {unusedTypes(addBlocks).length > 0 && (
                <div className="mb-3">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleAddBlock}>
                    <i className="fe fe-plus me-1"></i>Add Allocation Type
                  </button>
                </div>
              )}

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
                  <div className="col-md-6">
                    <label className="form-label">Child Agent</label>
                    <input type="text" className="form-control" value={editingAlloc.agent?.name || "-"} readOnly />
                  </div>
                </div>

                {/* Edit allocation type blocks */}
                {editBlocks.map((block, blockIndex) => {
                  const blockCabins = getCabinsForType(block.type);
                  const usedTypes = editBlocks.map((b) => b.type);
                  return (
                    <div key={blockIndex} className="border rounded p-3 mb-3" style={{ background: "#f9fafb" }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="col-md-5 ps-0">
                          <label className="form-label mb-1">Availability Type <span className="text-danger">*</span></label>
                          <select
                            className="form-select"
                            value={block.type}
                            onChange={(e) => handleEditBlockTypeChange(blockIndex, e.target.value)}
                          >
                            {availableTypes.map((t) => (
                              <option key={t} value={t} disabled={usedTypes.includes(t) && t !== block.type}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        {editBlocks.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger mt-3"
                            onClick={() => handleRemoveEditBlock(blockIndex)}
                            title="Remove this type"
                          >
                            <i className="fe fe-trash-2 me-1"></i>Remove
                          </button>
                        )}
                      </div>

                      <h6 className="fw-semibold mb-3">Cabin Allocation</h6>
                      <div className="table-responsive">
                        <table className="table table-bordered mb-0">
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
                            {blockCabins.length === 0 ? (
                              <tr><td colSpan={5} className="text-center text-muted">No cabins available</td></tr>
                            ) : (
                              blockCabins.map((cabin) => {
                                const inputVal = block.cabinValues[cabin.cabin._id] || 0;
                                // When editing, add back the previously allocated amount to get true available seats
                                // then subtract the new input value to show live remaining
                                const previouslyAllocated = block.cabinValues[cabin.cabin._id] || 0;
                                const liveRemaining = cabin.remainingSeats + previouslyAllocated - inputVal;
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
                                        max={cabin.remainingSeats + previouslyAllocated}
                                        value={inputVal === 0 ? "" : inputVal}
                                        placeholder="0"
                                        onChange={(e) => handleEditBlockCabinChange(blockIndex, cabin.cabin._id, e.target.value)}
                                      />
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}

                {/* Add another type to edit */}
                {unusedTypes(editBlocks).length > 0 && (
                  <div className="mb-3">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleAddEditBlock}>
                      <i className="fe fe-plus me-1"></i>Add Allocation Type
                    </button>
                  </div>
                )}

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={handleEditCancel}>Cancel</button>
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
                          ? (cabin.cabin?.name || cabinNameMap[cabinKey] || "-")
                          : (cabinNameMap[cabinKey] || cabinKey || "-");
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
                              <span className="service-badge">
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
