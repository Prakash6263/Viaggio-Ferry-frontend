// src/pages/CompanyEditPromotion.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Can from "../components/Can";
import { tripsApi } from "../api/tripsApi";
import { promotionApi } from "../api/promotionApi";
import { payloadTypesApi } from "../api/payloadTypesApi";

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
  const [selectedTripData, setSelectedTripData] = useState(null);

  // Trips state
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState(null);

  // Payload types state
  const [passengerPayloadTypes, setPassengerPayloadTypes] = useState([]);
  const [cargoPayloadTypes, setCargoPayloadTypes] = useState([]);
  const [vehiclePayloadTypes, setVehiclePayloadTypes] = useState([]);

  // Handle trip selection to get cabin details
  const handleTripChange = (tripId) => {
    setSelectedTrip(tripId);
    if (tripId) {
      const trip = trips.find(t => t._id === tripId);
      setSelectedTripData(trip || null);
      // Reset conditions when trip changes
      if (trip?.tripCapacityDetails) {
        const passengerCabins = trip.tripCapacityDetails.passenger || [];
        
        if (passengerCabins.length > 0) {
          setPassengerConditions([{ id: 1, cabinId: passengerCabins[0].cabinId, cabinName: passengerCabins[0].cabinName, payloadTypeId: "", payloadTypeName: "" }]);
        }
        // Reset cargo and vehicle with payload type structure
        setCargoConditions([{ id: 1, payloadTypeId: "", payloadTypeName: "" }]);
        setVehicleConditions([{ id: 1, payloadTypeId: "", payloadTypeName: "" }]);
      }
    } else {
      setSelectedTripData(null);
    }
  };

  // benefits
  const [passengerEnabled, setPassengerEnabled] = useState(false);
  const [passengerValue, setPassengerValue] = useState("");
  const [passengerType, setPassengerType] = useState("percentage");
  const [passengerBasis, setPassengerBasis] = useState("quantity"); // quantity or totalValue
  const [passengerMinValue, setPassengerMinValue] = useState("");
  const [passengerBuyX, setPassengerBuyX] = useState("");
  const [passengerGetY, setPassengerGetY] = useState("");
  const [passengerConditions, setPassengerConditions] = useState([
    { id: 1, cabinId: "", cabinName: "", payloadTypeId: "", payloadTypeName: "" }
  ]);
  
  const [cargoEnabled, setCargoEnabled] = useState(false);
  const [cargoValue, setCargoValue] = useState("");
  const [cargoType, setCargoType] = useState("percentage");
  const [cargoBasis, setCargoBasis] = useState("quantity"); // quantity or totalValue
  const [cargoMinValue, setCargoMinValue] = useState("");
  const [cargoBuyX, setCargoBuyX] = useState("");
  const [cargoGetY, setCargoGetY] = useState("");
  const [cargoConditions, setCargoConditions] = useState([
    { id: 1, payloadTypeId: "", payloadTypeName: "" }
  ]);
  
  const [vehicleEnabled, setVehicleEnabled] = useState(false);
  const [vehicleValue, setVehicleValue] = useState("");
  const [vehicleType, setVehicleType] = useState("percentage");
  const [vehicleBasis, setVehicleBasis] = useState("quantity"); // quantity or totalValue
  const [vehicleMinValue, setVehicleMinValue] = useState("");
  const [vehicleBuyX, setVehicleBuyX] = useState("");
  const [vehicleGetY, setVehicleGetY] = useState("");
  const [vehicleConditions, setVehicleConditions] = useState([
    { id: 1, payloadTypeId: "", payloadTypeName: "" }
  ]);

  // Eligibility condition handlers - Passenger
  const addPassengerCondition = () => {
    const passengerCabins = selectedTripData?.tripCapacityDetails?.passenger || [];
    const defaultCabin = passengerCabins[0] || { cabinId: "", cabinName: "" };
    setPassengerConditions(prev => [...prev, { id: Date.now(), cabinId: defaultCabin.cabinId, cabinName: defaultCabin.cabinName, payloadTypeId: "", payloadTypeName: "" }]);
  };
  const removePassengerCondition = (id) => {
    setPassengerConditions(prev => prev.filter(c => c.id !== id));
  };
  const updatePassengerCondition = (id, field, value) => {
    setPassengerConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Eligibility condition handlers - Cargo
  const addCargoCondition = () => {
    setCargoConditions(prev => [...prev, { id: Date.now(), payloadTypeId: "", payloadTypeName: "" }]);
  };
  const removeCargoCondition = (id) => {
    setCargoConditions(prev => prev.filter(c => c.id !== id));
  };
  const updateCargoCondition = (id, field, value) => {
    setCargoConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Eligibility condition handlers - Vehicle
  const addVehicleCondition = () => {
    setVehicleConditions(prev => [...prev, { id: Date.now(), payloadTypeId: "", payloadTypeName: "" }]);
  };
  const removeVehicleCondition = (id) => {
    setVehicleConditions(prev => prev.filter(c => c.id !== id));
  };
  const updateVehicleCondition = (id, field, value) => {
    setVehicleConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  // Fetch trips and promotion data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch trips
        const tripsResponse = await tripsApi.getTrips(1, 100);
        let fetchedTrips = [];
        if (tripsResponse && tripsResponse.data && tripsResponse.data.trips) {
          fetchedTrips = tripsResponse.data.trips;
          setTrips(fetchedTrips);
        }

        // Fetch passenger payload types
        try {
          const payloadTypesResponse = await payloadTypesApi.getPayloadTypes(1, 100, "passenger");
          if (payloadTypesResponse && payloadTypesResponse.data && payloadTypesResponse.data.payloadTypes) {
            setPassengerPayloadTypes(payloadTypesResponse.data.payloadTypes);
          }
        } catch (error) {
          console.error("[v0] Error fetching passenger payload types:", error.message);
        }

        // Fetch cargo payload types
        try {
          const cargoPayloadTypesResponse = await payloadTypesApi.getPayloadTypes(1, 100, "cargo");
          if (cargoPayloadTypesResponse && cargoPayloadTypesResponse.data && cargoPayloadTypesResponse.data.payloadTypes) {
            setCargoPayloadTypes(cargoPayloadTypesResponse.data.payloadTypes);
          }
        } catch (error) {
          console.error("[v0] Error fetching cargo payload types:", error.message);
        }

        // Fetch vehicle payload types
        try {
          const vehiclePayloadTypesResponse = await payloadTypesApi.getPayloadTypes(1, 100, "vehicle");
          if (vehiclePayloadTypesResponse && vehiclePayloadTypesResponse.data && vehiclePayloadTypesResponse.data.payloadTypes) {
            setVehiclePayloadTypes(vehiclePayloadTypesResponse.data.payloadTypes);
          }
        } catch (error) {
          console.error("[v0] Error fetching vehicle payload types:", error.message);
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
            // Find and set the trip data for cabin dropdowns
            const tripData = fetchedTrips.find(t => t._id === promo.trip._id);
            if (tripData) {
              setSelectedTripData(tripData);
              // Initialize conditions with first cabin from each category
              if (tripData.tripCapacityDetails?.passenger?.length > 0) {
                const cabin = tripData.tripCapacityDetails.passenger[0];
                setPassengerConditions([{ id: 1, cabinId: cabin.cabinId, cabinName: cabin.cabinName, payloadTypeId: "", payloadTypeName: "" }]);
              }
              // Initialize cargo and vehicle with payload type structure
              setCargoConditions([{ id: 1, payloadTypeId: "", payloadTypeName: "" }]);
              setVehicleConditions([{ id: 1, payloadTypeId: "", payloadTypeName: "" }]);
            }
          }
          
          // Set service promotions from API response
          if (promo.servicePromotions) {
            const sp = promo.servicePromotions;
            
            // Set passenger service promotion
            if (sp.passenger) {
              setPassengerEnabled(sp.passenger.isEnabled || false);
              if (sp.passenger.isEnabled) {
                setPassengerBasis(sp.passenger.calculationType || "quantity");
                if (sp.passenger.calculationType === "quantity") {
                  setPassengerBuyX(sp.passenger.buyX?.toString() || "");
                  setPassengerGetY(sp.passenger.getY?.toString() || "");
                } else if (sp.passenger.calculationType === "totalValue") {
                  setPassengerMinValue(sp.passenger.minValue?.toString() || "");
                  setPassengerType(sp.passenger.discountType || "percentage");
                  setPassengerValue(sp.passenger.discountValue?.toString() || "");
                }
                // Set passenger eligibility conditions
                if (sp.passenger.eligibility && sp.passenger.eligibility.length > 0) {
                  const passengerConds = sp.passenger.eligibility.map((e, idx) => ({
                    id: idx + 1,
                    cabinId: e.cabinId?._id || e.cabinId || "",
                    cabinName: e.cabinId?.name || "",
                    payloadTypeId: e.passengerTypeId?._id || e.passengerTypeId || "",
                    payloadTypeName: e.passengerTypeId?.name || "",
                  }));
                  setPassengerConditions(passengerConds);
                }
              }
            }
            
            // Set cargo service promotion
            if (sp.cargo) {
              setCargoEnabled(sp.cargo.isEnabled || false);
              if (sp.cargo.isEnabled) {
                setCargoBasis(sp.cargo.calculationType || "quantity");
                if (sp.cargo.calculationType === "quantity") {
                  setCargoBuyX(sp.cargo.buyX?.toString() || "");
                  setCargoGetY(sp.cargo.getY?.toString() || "");
                } else if (sp.cargo.calculationType === "totalValue") {
                  setCargoMinValue(sp.cargo.minValue?.toString() || "");
                  setCargoType(sp.cargo.discountType || "percentage");
                  setCargoValue(sp.cargo.discountValue?.toString() || "");
                }
                // Set cargo eligibility conditions
                if (sp.cargo.eligibility && sp.cargo.eligibility.length > 0) {
                  const cargoConds = sp.cargo.eligibility.map((e, idx) => ({
                    id: idx + 1,
                    payloadTypeId: e.payloadId?._id || e.payloadId || "",
                    payloadTypeName: e.payloadId?.name || "",
                  }));
                  setCargoConditions(cargoConds);
                }
              }
            }
            
            // Set vehicle service promotion
            if (sp.vehicle) {
              setVehicleEnabled(sp.vehicle.isEnabled || false);
              if (sp.vehicle.isEnabled) {
                setVehicleBasis(sp.vehicle.calculationType || "quantity");
                if (sp.vehicle.calculationType === "quantity") {
                  setVehicleBuyX(sp.vehicle.buyX?.toString() || "");
                  setVehicleGetY(sp.vehicle.getY?.toString() || "");
                } else if (sp.vehicle.calculationType === "totalValue") {
                  setVehicleMinValue(sp.vehicle.minValue?.toString() || "");
                  setVehicleType(sp.vehicle.discountType || "percentage");
                  setVehicleValue(sp.vehicle.discountValue?.toString() || "");
                }
                // Set vehicle eligibility conditions
                if (sp.vehicle.eligibility && sp.vehicle.eligibility.length > 0) {
                  const vehicleConds = sp.vehicle.eligibility.map((e, idx) => ({
                    id: idx + 1,
                    payloadTypeId: e.payloadId?._id || e.payloadId || "",
                    payloadTypeName: e.payloadId?.name || "",
                  }));
                  setVehicleConditions(vehicleConds);
                }
              }
            }
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

    // Validate service promotions
    if (passengerEnabled && passengerBasis === "quantity") {
      const buyXVal = parseInt(passengerBuyX);
      const getYVal = parseInt(passengerGetY);
      if (!buyXVal || buyXVal <= 0 || !getYVal || getYVal <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Passenger Benefit",
          text: "Please enter valid Buy X and Get Y values (greater than 0) for passenger",
        });
        return;
      }
    }
    if (passengerEnabled && passengerBasis === "totalValue") {
      const minVal = parseInt(passengerMinValue);
      const discountVal = parseInt(passengerValue);
      if (!minVal || minVal <= 0 || !discountVal || discountVal <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Passenger Benefit",
          text: "Please enter valid Min Value and Discount Value (greater than 0) for passenger",
        });
        return;
      }
    }

    if (cargoEnabled && cargoBasis === "quantity") {
      const buyXVal = parseInt(cargoBuyX);
      const getYVal = parseInt(cargoGetY);
      if (!buyXVal || buyXVal <= 0 || !getYVal || getYVal <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Cargo Benefit",
          text: "Please enter valid Buy X and Get Y values (greater than 0) for cargo",
        });
        return;
      }
    }
    if (cargoEnabled && cargoBasis === "totalValue") {
      const minVal = parseInt(cargoMinValue);
      const discountVal = parseInt(cargoValue);
      if (!minVal || minVal <= 0 || !discountVal || discountVal <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Cargo Benefit",
          text: "Please enter valid Min Value and Discount Value (greater than 0) for cargo",
        });
        return;
      }
    }

    if (vehicleEnabled && vehicleBasis === "quantity") {
      const buyXVal = parseInt(vehicleBuyX);
      const getYVal = parseInt(vehicleGetY);
      if (!buyXVal || buyXVal <= 0 || !getYVal || getYVal <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Vehicle Benefit",
          text: "Please enter valid Buy X and Get Y values (greater than 0) for vehicle",
        });
        return;
      }
    }
    if (vehicleEnabled && vehicleBasis === "totalValue") {
      const minVal = parseInt(vehicleMinValue);
      const discountVal = parseInt(vehicleValue);
      if (!minVal || minVal <= 0 || !discountVal || discountVal <= 0) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Vehicle Benefit",
          text: "Please enter valid Min Value and Discount Value (greater than 0) for vehicle",
        });
        return;
      }
    }

    // Build servicePromotions object
    const servicePromotions = {};

    // Passenger service promotion
    if (passengerEnabled) {
      const passengerEligibility = passengerConditions
        .filter(c => c.cabinId && c.payloadTypeId) // Both required for passenger
        .map(c => ({
          passengerTypeId: c.payloadTypeId,
          cabinId: c.cabinId,
        }));

      // Build passenger promo object
      const passengerPromo = {
        isEnabled: true,
        calculationType: passengerBasis,
        eligibility: passengerEligibility,
      };

      if (passengerBasis === "quantity") {
        const buyXVal = parseInt(passengerBuyX) || 0;
        const getYVal = parseInt(passengerGetY) || 0;
        if (buyXVal > 0) passengerPromo.buyX = buyXVal;
        if (getYVal > 0) passengerPromo.getY = getYVal;
      } else if (passengerBasis === "totalValue") {
        const minVal = parseInt(passengerMinValue) || 0;
        const discountVal = parseInt(passengerValue) || 0;
        if (minVal > 0) passengerPromo.minValue = minVal;
        if (discountVal > 0) {
          passengerPromo.discountType = passengerType;
          passengerPromo.discountValue = discountVal;
        }
      }
      
      // Always add passenger if enabled
      servicePromotions.passenger = passengerPromo;
    }

    // Cargo service promotion
    if (cargoEnabled) {
      const cargoEligibility = cargoConditions
        .filter(c => c.payloadTypeId)
        .map(c => ({
          payloadId: c.payloadTypeId,
        }));

      const cargoPromo = {
        isEnabled: true,
        calculationType: cargoBasis,
        eligibility: cargoEligibility,
      };

      if (cargoBasis === "quantity") {
        const buyXVal = parseInt(cargoBuyX) || 0;
        const getYVal = parseInt(cargoGetY) || 0;
        if (buyXVal > 0) cargoPromo.buyX = buyXVal;
        if (getYVal > 0) cargoPromo.getY = getYVal;
      } else if (cargoBasis === "totalValue") {
        const minVal = parseInt(cargoMinValue) || 0;
        const discountVal = parseInt(cargoValue) || 0;
        if (minVal > 0) cargoPromo.minValue = minVal;
        if (discountVal > 0) {
          cargoPromo.discountType = cargoType;
          cargoPromo.discountValue = discountVal;
        }
      }
      
      // Always add cargo if enabled
      servicePromotions.cargo = cargoPromo;
    }

    // Vehicle service promotion
    if (vehicleEnabled) {
      const vehicleEligibility = vehicleConditions
        .filter(c => c.payloadTypeId)
        .map(c => ({
          payloadId: c.payloadTypeId,
        }));

      const vehiclePromo = {
        isEnabled: true,
        calculationType: vehicleBasis,
        eligibility: vehicleEligibility,
      };

      if (vehicleBasis === "quantity") {
        const buyXVal = parseInt(vehicleBuyX) || 0;
        const getYVal = parseInt(vehicleGetY) || 0;
        if (buyXVal > 0) vehiclePromo.buyX = buyXVal;
        if (getYVal > 0) vehiclePromo.getY = getYVal;
      } else if (vehicleBasis === "totalValue") {
        const minVal = parseInt(vehicleMinValue) || 0;
        const discountVal = parseInt(vehicleValue) || 0;
        if (minVal > 0) vehiclePromo.minValue = minVal;
        if (discountVal > 0) {
          vehiclePromo.discountType = vehicleType;
          vehiclePromo.discountValue = discountVal;
        }
      }
      
      // Always add vehicle if enabled
      servicePromotions.vehicle = vehiclePromo;
    }

    // Build final payload
    const payload = {
      promotionName: promoName,
      description: promoDesc,
      promotionBasis: basis,
      status: status,
      ...(basis === "Period" && {
        startDate: startDate ? new Date(startDate).toISOString().split('T')[0] : null,
        endDate: endDate ? new Date(endDate).toISOString().split('T')[0] : null,
      }),
      ...(basis === "Trip" && { trip: selectedTrip }),
      servicePromotions,
    };

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
        {/* Back Button - outside Can so always visible */}
        <div className="mb-3">
          <Link to="/company/partner-management/promotions" className="btn btn-turquoise">
            <i className="bi bi-arrow-left"></i> Back to List
          </Link>
        </div>

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
                      <div className="mt-3">
                        <label className="form-label">Select Trip</label>
                        <select id="trip-select" className="form-select" value={selectedTrip} onChange={(e) => handleTripChange(e.target.value)} disabled={tripsLoading}>
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
                                    <label className="form-label">Buy X</label>
                                    <input
                                      placeholder="Buy quantity (e.g., 2)"
                                      className="form-control"
                                      type="number"
                                      min="1"
                                      value={passengerBuyX}
                                      onChange={(e) => setPassengerBuyX(e.target.value)}
                                    />
                                  </div>
                                  <div className="col-md-6">
                                    <label className="form-label">Get Y Free</label>
                                    <input
                                      placeholder="Get quantity free (e.g., 1)"
                                      className="form-control"
                                      type="number"
                                      min="1"
                                      value={passengerGetY}
                                      onChange={(e) => setPassengerGetY(e.target.value)}
                                    />
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
                                      value={condition.cabinId}
                                      onChange={(e) => {
                                        const cabin = selectedTripData?.tripCapacityDetails?.passenger?.find(c => c.cabinId === e.target.value);
                                        updatePassengerCondition(condition.id, "cabinId", e.target.value);
                                        updatePassengerCondition(condition.id, "cabinName", cabin?.cabinName || "");
                                      }}
                                    >
                                      <option value="">-- Select Cabin --</option>
                                      {selectedTripData?.tripCapacityDetails?.passenger?.map((cabin) => (
                                        <option key={cabin.cabinId} value={cabin.cabinId}>{cabin.cabinName}</option>
                                      ))}
                                    </select>
                                    <select
                                      className="form-select"
                                      value={condition.payloadTypeId}
                                      onChange={(e) => {
                                        const payloadType = passengerPayloadTypes.find(p => p._id === e.target.value);
                                        updatePassengerCondition(condition.id, "payloadTypeId", e.target.value);
                                        updatePassengerCondition(condition.id, "payloadTypeName", payloadType?.name || "");
                                      }}
                                    >
                                      <option value="">-- Select Payload Type --</option>
                                      {passengerPayloadTypes.map((pt) => (
                                        <option key={pt._id} value={pt._id}>{pt.name}</option>
                                      ))}
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
                                  className="btn btn-success btn-sm mt-2"
                                  onClick={addPassengerCondition}
                                  disabled={!selectedTripData?.tripCapacityDetails?.passenger?.length}
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
                                      value={condition.payloadTypeId}
                                      onChange={(e) => {
                                        const payloadType = cargoPayloadTypes.find(p => p._id === e.target.value);
                                        updateCargoCondition(condition.id, "payloadTypeId", e.target.value);
                                        updateCargoCondition(condition.id, "payloadTypeName", payloadType?.name || "");
                                      }}
                                    >
                                      <option value="">-- Select Payload Type --</option>
                                      {cargoPayloadTypes.map((pt) => (
                                        <option key={pt._id} value={pt._id}>{pt.name}</option>
                                      ))}
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
                                  disabled={cargoPayloadTypes.length === 0}
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
                                      value={condition.payloadTypeId}
                                      onChange={(e) => {
                                        const payloadType = vehiclePayloadTypes.find(p => p._id === e.target.value);
                                        updateVehicleCondition(condition.id, "payloadTypeId", e.target.value);
                                        updateVehicleCondition(condition.id, "payloadTypeName", payloadType?.name || "");
                                      }}
                                    >
                                      <option value="">-- Select Payload Type --</option>
                                      {vehiclePayloadTypes.map((pt) => (
                                        <option key={pt._id} value={pt._id}>{pt.name}</option>
                                      ))}
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
                                  disabled={vehiclePayloadTypes.length === 0}
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
                    <Link to="/company/partner-management/promotions" className="btn btn-turquoise" style={{ pointerEvents: isSaving ? "none" : "auto", opacity: isSaving ? 0.65 : 1 }}>
                      <i className="bi bi-arrow-left"></i> Back to List
                    </Link>
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
