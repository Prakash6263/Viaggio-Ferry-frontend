// src/pages/CompanyEditPromotion.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Can from "../components/Can";
import { tripsApi } from "../api/tripsApi";
import { promotionApi } from "../api/promotionApi";

export default function CompanyEditPromotion() {
  const navigate = useNavigate();
  const { id } = useParams();

  // basic fields
  const [promoName, setPromoName] = useState("");
  const [promoDesc, setPromoDesc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [basis, setBasis] = useState("Period");
  const [selectedTrip, setSelectedTrip] = useState("");

  // Trips state
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState(null);

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
  const [isLoading, setIsLoading] = useState(true);



  // Fetch trips and promotion data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trips
        const tripsResponse = await tripsApi.getTrips(1, 100);
        console.log("[v0] Trips response:", tripsResponse);
        if (tripsResponse && tripsResponse.data && tripsResponse.data.trips) {
          setTrips(tripsResponse.data.trips);
        }

        // Fetch promotion details
        const promotionResponse = await promotionApi.getPromotionById(id);
        console.log("[v0] Promotion details:", promotionResponse);
        
        if (promotionResponse && promotionResponse.data) {
          const promo = promotionResponse.data;
          
          setPromoName(promo.promotionName || "");
          setPromoDesc(promo.description || "");
          setStatus(promo.status || "Active");
          setBasis(promo.promotionBasis || "Period");
          
          // Set dates
          if (promo.startDate) {
            const startDateTime = new Date(promo.startDate);
            setStartDate(startDateTime.toISOString().slice(0, 16));
          }
          if (promo.endDate) {
            const endDateTime = new Date(promo.endDate);
            setEndDate(endDateTime.toISOString().slice(0, 16));
          }
          
          // Set trip if applicable
          if (promo.trip && promo.trip._id) {
            setSelectedTrip(promo.trip._id);
          }
          
          // Set passenger benefit
          if (promo.passengerBenefit) {
            setPassengerEnabled(promo.passengerBenefit.isEnabled);
            setPassengerValue(promo.passengerBenefit.value.toString());
            setPassengerType(promo.passengerBenefit.valueType);
          }
          
          // Set cargo benefit
          if (promo.cargoBenefit) {
            setCargoEnabled(promo.cargoBenefit.isEnabled);
            setCargoValue(promo.cargoBenefit.value.toString());
            setCargoType(promo.cargoBenefit.valueType);
          }
          
          // Set vehicle benefit
          if (promo.vehicleBenefit) {
            setVehicleEnabled(promo.vehicleBenefit.isEnabled);
            setVehicleValue(promo.vehicleBenefit.value.toString());
            setVehicleType(promo.vehicleBenefit.valueType);
          }
          
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load promotion details",
        }).then(() => navigate("/company/partner-management/promotions"));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

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

    if (basis === "Trip" && !selectedTrip) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Please select a trip",
      });
      return;
    }

    if (basis === "Period" && (!startDate || !endDate)) {
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
      promotionBasis: basis,
      status: status,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      ...(basis === "Trip" && { trip: selectedTrip }),
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

    console.log("[v0] Update promotion payload:", payload);
    updatePromotionAPI(payload);
  }

  async function updatePromotionAPI(payload) {
    try {
      setIsSaving(true);
      const response = await promotionApi.updatePromotion(id, payload);
      
      console.log("[v0] Promotion updated successfully:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.message || "Promotion updated successfully",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/company/partner-management/promotions");
      });
    } catch (error) {
      console.error("[v0] Error updating promotion:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update promotion",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="text-center p-5">
            <p>Loading promotion details...</p>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <Can action="update" path="/company/partner-management/promotions">
          <div className="page-header">
            <div className="content-page-header">
              <h5 className="card-title">Edit Promotion</h5>
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
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Scheduled">Scheduled</option>
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
                          value="Period"
                          checked={basis === "Period"}
                          onChange={() => setBasis("Period")}
                        />
                        <label className="form-check-label" htmlFor="basis-period">Based on Period</label>
                      </div>

                      <div className="form-check">
                        <input
                          id="basis-trip"
                          className="form-check-input"
                          type="radio"
                          name="basis"
                          value="Trip"
                          checked={basis === "Trip"}
                          onChange={() => setBasis("Trip")}
                        />
                        <label className="form-check-label" htmlFor="basis-trip">Based on Trip</label>
                      </div>
                    </div>

                    {basis === "Period" && (
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

                    {basis === "Trip" && (
                      <div className="mt-3 p-3 border rounded">
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

                  {/* Footer buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => window.history.back()} disabled={isSaving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Update Promotion"}
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
