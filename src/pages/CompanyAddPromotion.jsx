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
  const [passengerBasis, setPassengerBasis] = useState("quantity"); // quantity or totalValue
  const [passengerMinValue, setPassengerMinValue] = useState("");
  const [passengerConditions, setPassengerConditions] = useState([
    { id: 1, passengerType: "Adult", class: "Economy" }
  ]);
  
  const [cargoEnabled, setCargoEnabled] = useState(false);
  const [cargoValue, setCargoValue] = useState("");
  const [cargoType, setCargoType] = useState("percentage");
  const [cargoBasis, setCargoBasis] = useState("quantity"); // quantity or totalValue
  const [cargoMinValue, setCargoMinValue] = useState("");
  const [cargoBuyX, setCargoBuyX] = useState("");
  const [cargoGetY, setCargoGetY] = useState("");
  const [cargoConditions, setCargoConditions] = useState([
    { id: 1, cargoType: "General Goods" }
  ]);
  
  const [vehicleEnabled, setVehicleEnabled] = useState(false);
  const [vehicleValue, setVehicleValue] = useState("");
  const [vehicleType, setVehicleType] = useState("percentage");
  const [vehicleBasis, setVehicleBasis] = useState("quantity"); // quantity or totalValue
  const [vehicleMinValue, setVehicleMinValue] = useState("");
  const [vehicleBuyX, setVehicleBuyX] = useState("");
  const [vehicleGetY, setVehicleGetY] = useState("");
  const [vehicleConditions, setVehicleConditions] = useState([
    { id: 1, vehicleType: "Car" }
  ]);

  // Eligibility condition handlers - Passenger
  const addPassengerCondition = () => {
    setPassengerConditions(prev => [...prev, { id: Date.now(), passengerType: "Adult", class: "Economy" }]);
  };
  const removePassengerCondition = (id) => {
    setPassengerConditions(prev => prev.filter(c => c.id !== id));
  };
  const updatePassengerCondition = (id, field, value) => {
    setPassengerConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Eligibility condition handlers - Cargo
  const addCargoCondition = () => {
    setCargoConditions(prev => [...prev, { id: Date.now(), cargoType: "General Goods" }]);
  };
  const removeCargoCondition = (id) => {
    setCargoConditions(prev => prev.filter(c => c.id !== id));
  };
  const updateCargoCondition = (id, field, value) => {
    setCargoConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Eligibility condition handlers - Vehicle
  const addVehicleCondition = () => {
    setVehicleConditions(prev => [...prev, { id: Date.now(), vehicleType: "Car" }]);
  };
  const removeVehicleCondition = (id) => {
    setVehicleConditions(prev => prev.filter(c => c.id !== id));
  };
  const updateVehicleCondition = (id, field, value) => {
    setVehicleConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const [isSaving, setIsSaving] = useState(false);

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
                      placeholder="Brief description of the promotion"
                    />
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

                  {/* Promotion Basis */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Promotion Basis</label>
                    <div className="d-flex gap-4 align-items-center mt-2">
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
                        <label className="form-check-label" htmlFor="basis-period">Based on Period</label>
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
                        <label className="form-check-label" htmlFor="basis-trip">Based on Trip</label>
                      </div>
                    </div>

                    {basis === "period" && (
                      <div className="mt-3 p-3 border rounded">
                        <div className="mb-3">
                          <label className="form-label">Start Date &amp; Time</label>
                          <input
                            id="start-date"
                            type="datetime-local"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="mb-0">
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
                    )}

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
                    <div className="d-flex align-items-center gap-2 mb-3 p-2 rounded" style={{ backgroundColor: '#e8f4fc' }}>
                      <i className="fa fa-gift text-primary"></i>
                      <span className="fw-bold text-primary">Promotion Benefits &amp; Eligibility</span>
                    </div>

                    {/* Passenger Tickets */}
                    <div className="border rounded mb-3">
                      <div className="d-flex align-items-center gap-2 p-2 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                        <i className="fa fa-users text-primary"></i>
                        <span className="fw-bold">Passenger Tickets</span>
                      </div>
                      <div className="p-3">
                        <div className="form-check mb-3">
                          <input
                            id="passenger-benefit-enabled"
                            type="checkbox"
                            className="form-check-input"
                            checked={passengerEnabled}
                            onChange={(e) => setPassengerEnabled(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="passenger-benefit-enabled">
                            Enable promotion for passenger tickets
                          </label>
                        </div>

                        {passengerEnabled && (
                          <>
                            <div className="d-flex gap-4 mb-3">
                              <div className="form-check">
                                <input
                                  id="passenger-basis-quantity"
                                  className="form-check-input"
                                  type="radio"
                                  name="passengerBasis"
                                  checked={passengerBasis === "quantity"}
                                  onChange={() => setPassengerBasis("quantity")}
                                />
                                <label className="form-check-label" htmlFor="passenger-basis-quantity">Based on Ticket Quantity</label>
                              </div>
                              <div className="form-check">
                                <input
                                  id="passenger-basis-total"
                                  className="form-check-input"
                                  type="radio"
                                  name="passengerBasis"
                                  checked={passengerBasis === "totalValue"}
                                  onChange={() => setPassengerBasis("totalValue")}
                                />
                                <label className="form-check-label" htmlFor="passenger-basis-total">Based on Total Ticket Value</label>
                              </div>
                            </div>

                            {passengerBasis === "totalValue" && (
                              <div className="p-3 border rounded mb-3">
                                <div className="mb-3">
                                  <label className="form-label">Buy Total Value</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Minimum purchase amount"
                                    value={passengerMinValue}
                                    onChange={(e) => setPassengerMinValue(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Gets Discount</label>
                                  <div className="d-flex gap-2">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Discount amount"
                                      value={passengerValue}
                                      onChange={(e) => setPassengerValue(e.target.value)}
                                    />
                                    <select
                                      className="form-select"
                                      style={{ width: 100 }}
                                      value={passengerType}
                                      onChange={(e) => setPassengerType(e.target.value)}
                                    >
                                      <option value="percentage">%</option>
                                      <option value="fixed">Fixed</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {passengerBasis === "quantity" && (
                              <div className="p-3 border rounded mb-3">
                                <div className="row g-2">
                                  <div className="col-md-6">
                                    <input
                                      placeholder="Discount amount"
                                      className="form-control"
                                      type="number"
                                      value={passengerValue}
                                      onChange={(e) => setPassengerValue(e.target.value)}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <select
                                      className="form-select"
                                      value={passengerType}
                                      onChange={(e) => setPassengerType(e.target.value)}
                                    >
                                      <option value="percentage">Percentage (%)</option>
                                      <option value="fixed">Fixed Amount</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Eligibility Conditions */}
                            <div className="border rounded">
                              <div className="d-flex align-items-center gap-2 p-2 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                                <i className="fa fa-filter text-primary"></i>
                                <span className="fw-bold">Eligibility Conditions</span>
                              </div>
                              <div className="p-3">
                                {passengerConditions.map((condition) => (
                                  <div key={condition.id} className="d-flex gap-2 align-items-center mb-2">
                                    <select
                                      className="form-select"
                                      value={condition.passengerType}
                                      onChange={(e) => updatePassengerCondition(condition.id, "passengerType", e.target.value)}
                                    >
                                      <option value="Adult">Adult</option>
                                      <option value="Child">Child</option>
                                      <option value="Infant">Infant</option>
                                      <option value="Senior">Senior</option>
                                    </select>
                                    <select
                                      className="form-select"
                                      value={condition.class}
                                      onChange={(e) => updatePassengerCondition(condition.id, "class", e.target.value)}
                                    >
                                      <option value="Economy">Economy</option>
                                      <option value="Business">Business</option>
                                      <option value="First">First</option>
                                    </select>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => removePassengerCondition(condition.id)}
                                      disabled={passengerConditions.length === 1}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm mt-2"
                                  onClick={addPassengerCondition}
                                >
                                  + Add Condition
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Cargo Tickets */}
                    <div className="border rounded mb-3">
                      <div className="d-flex align-items-center gap-2 p-2 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                        <i className="fa fa-cube text-primary"></i>
                        <span className="fw-bold">Cargo Tickets</span>
                      </div>
                      <div className="p-3">
                        <div className="form-check mb-3">
                          <input
                            id="cargo-benefit-enabled"
                            type="checkbox"
                            className="form-check-input"
                            checked={cargoEnabled}
                            onChange={(e) => setCargoEnabled(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="cargo-benefit-enabled">
                            Enable promotion for cargo tickets
                          </label>
                        </div>

                        {cargoEnabled && (
                          <>
                            <div className="d-flex gap-4 mb-3">
                              <div className="form-check">
                                <input
                                  id="cargo-basis-quantity"
                                  className="form-check-input"
                                  type="radio"
                                  name="cargoBasis"
                                  checked={cargoBasis === "quantity"}
                                  onChange={() => setCargoBasis("quantity")}
                                />
                                <label className="form-check-label" htmlFor="cargo-basis-quantity">Based on Ticket Quantity</label>
                              </div>
                              <div className="form-check">
                                <input
                                  id="cargo-basis-total"
                                  className="form-check-input"
                                  type="radio"
                                  name="cargoBasis"
                                  checked={cargoBasis === "totalValue"}
                                  onChange={() => setCargoBasis("totalValue")}
                                />
                                <label className="form-check-label" htmlFor="cargo-basis-total">Based on Total Ticket Value</label>
                              </div>
                            </div>

                            {cargoBasis === "totalValue" && (
                              <div className="p-3 border rounded mb-3">
                                <div className="mb-3">
                                  <label className="form-label">Buy Total Value</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Minimum purchase amount"
                                    value={cargoMinValue}
                                    onChange={(e) => setCargoMinValue(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Gets Discount</label>
                                  <div className="d-flex gap-2">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Discount amount"
                                      value={cargoValue}
                                      onChange={(e) => setCargoValue(e.target.value)}
                                    />
                                    <select
                                      className="form-select"
                                      style={{ width: 100 }}
                                      value={cargoType}
                                      onChange={(e) => setCargoType(e.target.value)}
                                    >
                                      <option value="percentage">%</option>
                                      <option value="fixed">Fixed</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {cargoBasis === "quantity" && (
                              <div className="p-3 border rounded mb-3">
                                <div className="mb-3">
                                  <label className="form-label">Buy X Tickets</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="1"
                                    value={cargoBuyX}
                                    onChange={(e) => setCargoBuyX(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Get Y Tickets Free</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="1"
                                    value={cargoGetY}
                                    onChange={(e) => setCargoGetY(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Eligibility Conditions */}
                            <div className="border rounded">
                              <div className="d-flex align-items-center gap-2 p-2 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                                <i className="fa fa-filter text-primary"></i>
                                <span className="fw-bold">Eligibility Conditions</span>
                              </div>
                              <div className="p-3">
                                {cargoConditions.map((condition) => (
                                  <div key={condition.id} className="d-flex gap-2 align-items-center mb-2">
                                    <select
                                      className="form-select"
                                      value={condition.cargoType}
                                      onChange={(e) => updateCargoCondition(condition.id, "cargoType", e.target.value)}
                                    >
                                      <option value="General Goods">General Goods</option>
                                      <option value="Fragile">Fragile</option>
                                      <option value="Perishable">Perishable</option>
                                      <option value="Hazardous">Hazardous</option>
                                      <option value="Oversized">Oversized</option>
                                    </select>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => removeCargoCondition(condition.id)}
                                      disabled={cargoConditions.length === 1}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm mt-2"
                                  onClick={addCargoCondition}
                                >
                                  + Add Condition
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Tickets */}
                    <div className="border rounded mb-3">
                      <div className="d-flex align-items-center gap-2 p-2 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                        <i className="fa fa-car text-primary"></i>
                        <span className="fw-bold">Vehicle Tickets</span>
                      </div>
                      <div className="p-3">
                        <div className="form-check mb-3">
                          <input
                            id="vehicle-benefit-enabled"
                            type="checkbox"
                            className="form-check-input"
                            checked={vehicleEnabled}
                            onChange={(e) => setVehicleEnabled(e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="vehicle-benefit-enabled">
                            Enable promotion for vehicle tickets
                          </label>
                        </div>

                        {vehicleEnabled && (
                          <>
                            <div className="d-flex gap-4 mb-3">
                              <div className="form-check">
                                <input
                                  id="vehicle-basis-quantity"
                                  className="form-check-input"
                                  type="radio"
                                  name="vehicleBasis"
                                  checked={vehicleBasis === "quantity"}
                                  onChange={() => setVehicleBasis("quantity")}
                                />
                                <label className="form-check-label" htmlFor="vehicle-basis-quantity">Based on Ticket Quantity</label>
                              </div>
                              <div className="form-check">
                                <input
                                  id="vehicle-basis-total"
                                  className="form-check-input"
                                  type="radio"
                                  name="vehicleBasis"
                                  checked={vehicleBasis === "totalValue"}
                                  onChange={() => setVehicleBasis("totalValue")}
                                />
                                <label className="form-check-label" htmlFor="vehicle-basis-total">Based on Total Ticket Value</label>
                              </div>
                            </div>

                            {vehicleBasis === "totalValue" && (
                              <div className="p-3 border rounded mb-3">
                                <div className="mb-3">
                                  <label className="form-label">Buy Total Value</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Minimum purchase amount"
                                    value={vehicleMinValue}
                                    onChange={(e) => setVehicleMinValue(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Gets Discount</label>
                                  <div className="d-flex gap-2">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder="Discount amount"
                                      value={vehicleValue}
                                      onChange={(e) => setVehicleValue(e.target.value)}
                                    />
                                    <select
                                      className="form-select"
                                      style={{ width: 100 }}
                                      value={vehicleType}
                                      onChange={(e) => setVehicleType(e.target.value)}
                                    >
                                      <option value="percentage">%</option>
                                      <option value="fixed">Fixed</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            )}

                            {vehicleBasis === "quantity" && (
                              <div className="p-3 border rounded mb-3">
                                <div className="mb-3">
                                  <label className="form-label">Buy X Tickets</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="1"
                                    value={vehicleBuyX}
                                    onChange={(e) => setVehicleBuyX(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="form-label">Get Y Tickets Free</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="1"
                                    value={vehicleGetY}
                                    onChange={(e) => setVehicleGetY(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Eligibility Conditions */}
                            <div className="border rounded">
                              <div className="d-flex align-items-center gap-2 p-2 border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                                <i className="fa fa-filter text-primary"></i>
                                <span className="fw-bold">Eligibility Conditions</span>
                              </div>
                              <div className="p-3">
                                {vehicleConditions.map((condition) => (
                                  <div key={condition.id} className="d-flex gap-2 align-items-center mb-2">
                                    <select
                                      className="form-select"
                                      value={condition.vehicleType}
                                      onChange={(e) => updateVehicleCondition(condition.id, "vehicleType", e.target.value)}
                                    >
                                      <option value="Car">Car</option>
                                      <option value="Motorcycle">Motorcycle</option>
                                      <option value="Truck">Truck</option>
                                      <option value="Bus">Bus</option>
                                      <option value="Van">Van</option>
                                    </select>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={() => removeVehicleCondition(condition.id)}
                                      disabled={vehicleConditions.length === 1}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-success btn-sm mt-2"
                                  onClick={addVehicleCondition}
                                >
                                  + Add Condition
                                </button>
                              </div>
                            </div>
                          </>
                        )}
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
