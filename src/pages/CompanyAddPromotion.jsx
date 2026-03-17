// src/pages/AddPromotionPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Can from "../components/Can";
import { tripsApi } from "../api/tripsApi";
import { promotionApi } from "../api/promotionApi";

export default function AddPromotionPage() {
  const navigate = useNavigate();
  // basic fields
  const [promoName, setPromoName] = useState("");
  const [promoDesc, setPromoDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("active");
  const [basis, setBasis] = useState("period");
  const [selectedTrip, setSelectedTrip] = useState("");

  // Trips state
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState(null);

  // Fetch trips on component mount
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setTripsLoading(true);
        setTripsError(null);
        const response = await tripsApi.getTrips(1, 100);
        console.log("[v0] Trips response:", response);
        if (response && response.data && response.data.trips) {
          setTrips(response.data.trips);
        }
      } catch (error) {
        console.error("[v0] Error fetching trips:", error.message);
        setTripsError(error.message);
      } finally {
        setTripsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // benefits
  const [passengerEnabled, setPassengerEnabled] = useState(false);
  const [passengerValue, setPassengerValue] = useState("");
  const [passengerType, setPassengerType] = useState("percentage");
  
  const [cargoEnabled, setCargoEnabled] = useState(false);
  const [cargoValue, setCargoValue] = useState("");
  const [cargoType, setCargoType] = useState("percentage");
  
  const [vehicleEnabled, setVehicleEnabled] = useState(false);
  const [vehicleValue, setVehicleValue] = useState("");
  const [vehicleType, setVehicleType] = useState("percentage");

  const [isSaving, setIsSaving] = useState(false);

  // service benefits dynamic list
  const [serviceBenefits, setServiceBenefits] = useState([
    { id: 1, title: "", amountType: "percentage", value: "" },
  ]);

  function addServiceBenefit() {
    setServiceBenefits((s) => [...s, { id: Date.now(), title: "", amountType: "percentage", value: "" }]);
  }
  function removeServiceBenefit(id) {
    setServiceBenefits((s) => s.filter((x) => x.id !== id));
  }
  function updateServiceBenefit(id, key, val) {
    setServiceBenefits((s) => s.map((x) => (x.id === id ? { ...x, [key]: val } : x)));
  }

  function savePromotion(e) {
    e.preventDefault();
    
    // Validation
    if (!promoName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Please enter promotion name",
      });
      return;
    }

    if (basis === "trip" && !selectedTrip) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Please select a trip",
      });
      return;
    }

    if (basis === "period" && (!startDate || !endDate)) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please select start and end dates",
      });
      return;
    }

    // Build payload
    const payload = {
      promotionName: promoName,
      description: promoDesc,
      promotionBasis: basis === "period" ? "Period" : "Trip",
      status: status.charAt(0).toUpperCase() + status.slice(1),
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      ...(basis === "trip" && { trip: selectedTrip }),
      passengerBenefit: {
        isEnabled: passengerEnabled,
        valueType: passengerType,
        value: passengerEnabled ? parseInt(passengerValue) || 0 : 0,
      },
      cargoBenefit: {
        isEnabled: cargoEnabled,
        valueType: cargoType,
        value: cargoEnabled ? parseInt(cargoValue) || 0 : 0,
      },
      vehicleBenefit: {
        isEnabled: vehicleEnabled,
        valueType: vehicleType,
        value: vehicleEnabled ? parseInt(vehicleValue) || 0 : 0,
      },
      serviceBenefits: serviceBenefits
        .filter((s) => s.title.trim())
        .map((s) => ({
          title: s.title,
          valueType: s.amountType,
          value: parseInt(s.value) || 0,
        })),
    };

    console.log("[v0] Save promotion payload:", payload);
    savePromotionAPI(payload);
  }

  async function savePromotionAPI(payload) {
    try {
      setIsSaving(true);
      const response = await promotionApi.createPromotion(payload);
      
      console.log("[v0] Promotion saved successfully:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.message || "Promotion created successfully",
        confirmButtonText: "OK",
      }).then(() => {
        // Navigate to promotions list after successful creation
        navigate("/company/partner-management/promotions");
      });
    } catch (error) {
      console.error("[v0] Error saving promotion:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create promotion",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <Can action="create" path="/company/partner-management/promotions">
          <div className="page-header">
            <div className="content-page-header">
              <h5 className="card-title">Add New Promotion</h5>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
            <div className="card">
              <div className="card-body" style={{ padding: 20 }}>
                <form id="promotion-form" onSubmit={savePromotion}>
                  {/* Basic fields */}
                  <div className="mb-3">
                    <label htmlFor="promo-name" className="form-label">Promotion Name</label>
                    <input
                      id="promo-name"
                      className="form-control"
                      value={promoName}
                      onChange={(e) => setPromoName(e.target.value)}
                      placeholder="e.g., Summer Travel Special"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="promo-desc" className="form-label">Description</label>
                    <textarea
                      id="promo-desc"
                      rows={3}
                      className="form-control"
                      value={promoDesc}
                      onChange={(e) => setPromoDesc(e.target.value)}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Start Date &amp; Time</label>
                      <input
                        id="start-date"
                        type="datetime-local"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date &amp; Time</label>
                      <input
                        id="end-date"
                        type="datetime-local"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Active Status</label>
                    <select
                      id="promo-status"
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>

                  {/* Basis */}
                  <div className="mb-3 p-3 border rounded">
                    <label className="form-label fw-bold">Promotion Basis</label>
                    <div className="d-flex gap-3 align-items-center mt-2">
                      <div className="form-check">
                        <input
                          id="basis-period"
                          className="form-check-input"
                          type="radio"
                          name="basis"
                          value="period"
                          checked={basis === "period"}
                          onChange={() => setBasis("period")}
                        />
                        <label className="form-check-label" htmlFor="basis-period">Period</label>
                      </div>

                      <div className="form-check">
                        <input
                          id="basis-trip"
                          className="form-check-input"
                          type="radio"
                          name="basis"
                          value="trip"
                          checked={basis === "trip"}
                          onChange={() => setBasis("trip")}
                        />
                        <label className="form-check-label" htmlFor="basis-trip">Trip</label>
                      </div>
                    </div>

                    {basis === "trip" && (
                      <div className="mt-3">
                        <label className="form-label">Select Trip</label>
                        <select id="trip-select" className="form-select" value={selectedTrip} onChange={(e) => setSelectedTrip(e.target.value)} disabled={tripsLoading}>
                          <option value="">-- Select a Trip --</option>
                          {tripsLoading && <option value="">Loading trips...</option>}
                          {tripsError && <option value="">{`Error: ${tripsError}`}</option>}
                          {trips.map((trip) => (
                            <option key={trip._id} value={trip._id}>{trip.tripName}</option>
                          ))}
                        </select>
                        {tripsError && <small className="text-danger d-block mt-2">{tripsError}</small>}
                      </div>
                    )}
                  </div>

                  {/* Promotion Benefits & Eligibility */}
                  <section className="mb-3">
                    <h6>Promotion Benefits &amp; Eligibility</h6>

                    <div className="card mb-2">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Passenger Tickets</strong>
                          <div className="text-muted small">Enable promotion for passenger tickets</div>
                        </div>
                        <div>
                          <input
                            id="passenger-benefit-enabled"
                            type="checkbox"
                            checked={passengerEnabled}
                            onChange={(e) => setPassengerEnabled(e.target.checked)}
                          />
                        </div>
                      </div>

                      {passengerEnabled && (
                        <div className="card-footer">
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input 
                                placeholder="Amount" 
                                className="form-control" 
                                type="number"
                                value={passengerValue}
                                onChange={(e) => setPassengerValue(e.target.value)}
                              />
                            </div>
                            <div className="col-md-4">
                              <select 
                                className="form-select"
                                value={passengerType}
                                onChange={(e) => setPassengerType(e.target.value)}
                              >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card mb-2">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Cargo Tickets</strong>
                          <div className="text-muted small">Enable promotion for cargo tickets</div>
                        </div>
                        <div>
                          <input
                            id="cargo-benefit-enabled"
                            type="checkbox"
                            checked={cargoEnabled}
                            onChange={(e) => setCargoEnabled(e.target.checked)}
                          />
                        </div>
                      </div>

                      {cargoEnabled && (
                        <div className="card-footer">
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input 
                                placeholder="Amount" 
                                className="form-control" 
                                type="number"
                                value={cargoValue}
                                onChange={(e) => setCargoValue(e.target.value)}
                              />
                            </div>
                            <div className="col-md-4">
                              <select 
                                className="form-select"
                                value={cargoType}
                                onChange={(e) => setCargoType(e.target.value)}
                              >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card mb-2">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Vehicle Tickets</strong>
                          <div className="text-muted small">Enable promotion for vehicle tickets</div>
                        </div>
                        <div>
                          <input
                            id="vehicle-benefit-enabled"
                            type="checkbox"
                            checked={vehicleEnabled}
                            onChange={(e) => setVehicleEnabled(e.target.checked)}
                          />
                        </div>
                      </div>
                      {vehicleEnabled && (
                        <div className="card-footer">
                          <div className="row g-2">
                            <div className="col-md-4">
                              <input 
                                placeholder="Amount" 
                                className="form-control" 
                                type="number"
                                value={vehicleValue}
                                onChange={(e) => setVehicleValue(e.target.value)}
                              />
                            </div>
                            <div className="col-md-4">
                              <select 
                                className="form-select"
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                              >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Service benefits dynamic area */}
                  <section className="mb-3">
                    <h6>Service Benefit(s)</h6>
                    <div className="d-flex flex-column gap-2">
                      {serviceBenefits.map((s) => (
                        <div key={s.id} className="d-flex gap-2 align-items-center">
                          <input
                            className="form-control"
                            value={s.title}
                            onChange={(e) => updateServiceBenefit(s.id, "title", e.target.value)}
                            placeholder="Title"
                          />
                          <select
                            className="form-select"
                            value={s.amountType}
                            onChange={(e) => updateServiceBenefit(s.id, "amountType", e.target.value)}
                            style={{ width: 160 }}
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="amount">Amount</option>
                          </select>
                          <input
                            className="form-control"
                            value={s.value}
                            onChange={(e) => updateServiceBenefit(s.id, "value", e.target.value)}
                            placeholder="Value"
                            style={{ width: 120 }}
                          />
                          <button type="button" className="btn btn-danger" onClick={() => removeServiceBenefit(s.id)}>Remove</button>
                        </div>
                      ))}
                      <div>
                        <button type="button" className="btn btn-outline-primary mt-2" onClick={addServiceBenefit}>
                          + Add Service Benefit
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Footer buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()} disabled={isSaving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Promotion"}
                    </button>
                  </div>
                </form>
              </div> {/* card-body */}
            </div> {/* card */}
          </div>
        </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
