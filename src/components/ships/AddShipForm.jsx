'use client';

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFetch } from "../../api/apiClient";
import { cabinsApi } from "../../api/cabinsApi";
import { shipsApi } from "../../api/shipsApi";
import Can from "../Can";

function emptyPassengerRow() {
  return { id: Date.now() + Math.random(), cabinId: "", cabinName: "", totalWeightKg: "", seats: "" };
}
function emptyCargoRow() {
  return { id: Date.now() + Math.random(), cabinId: "", cabinName: "", totalWeightTons: "", spots: "" };
}
function emptyVehicleRow() {
  return { id: Date.now() + Math.random(), cabinId: "", cabinName: "", totalWeightTons: "", spots: "" };
}

export default function AddShipForm() {
  const navigate = useNavigate();
  const { id: shipId } = useParams();
  const isEditMode = !!shipId;

  // general info
  const [form, setForm] = useState({
    name: "",
    imoNumber: "",
    mmsiNumber: "",
    flagState: "",
    shipType: "",
    yearBuilt: "",
    classificationSociety: "",
    status: "Active",
    remarks: "",
    technical: {
      grossTonnage: "",
      netTonnage: "",
      loa: "",
      beam: "",
      draft: "",
    },
  });

  const [passengers, setPassengers] = useState([emptyPassengerRow()]);
  const [cargo, setCargo] = useState([emptyCargoRow()]);
  const [vehicles, setVehicles] = useState([emptyVehicleRow()]);

  // Cabin data
  const [passengerCabins, setPassengerCabins] = useState([]);
  const [cargoCabins, setCargoCabins] = useState([]);
  const [vehicleCabins, setVehicleCabins] = useState([]);

  // Loading and validation states
  const [loading, setLoading] = useState(false);
  const [loadingCabins, setLoadingCabins] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch cabins on mount
  useEffect(() => {
    fetchCabins();
  }, []);

  // Fetch ship data if editing
  useEffect(() => {
    if (isEditMode && shipId) {
      fetchShip();
    }
  }, [shipId, isEditMode]);

  const fetchShip = async () => {
    try {
      setLoading(true);
      
      // Use shipsApi.getShipById
      const response = await shipsApi.getShipById(shipId);

      // API returns { success, message, data: { ship object } }
      // Extract the ship object from data property
      const ship = response?.data;

      if (ship && ship.name) {
        setForm({
          name: ship.name || "",
          imoNumber: ship.imoNumber || "",
          mmsiNumber: ship.mmsiNumber || "",
          flagState: ship.flagState || "",
          shipType: ship.shipType || "",
          yearBuilt: ship.yearBuilt || "",
          classificationSociety: ship.classificationSociety || "",
          status: ship.status || "Active",
          remarks: ship.remarks || "",
          technical: ship.technical || {
            grossTonnage: "",
            netTonnage: "",
            loa: "",
            beam: "",
            draft: "",
          },
        });

        setPassengers(ship.passengerCapacity && ship.passengerCapacity.length > 0 
          ? ship.passengerCapacity.map((p, idx) => ({ 
              id: idx, 
              cabinId: p.cabinId, 
              cabinName: p.cabinName, 
              totalWeightKg: p.totalWeightKg, 
              seats: p.seats 
            }))
          : [emptyPassengerRow()]
        );

        setCargo(ship.cargoCapacity && ship.cargoCapacity.length > 0 
          ? ship.cargoCapacity.map((c, idx) => ({ 
              id: idx, 
              cabinId: c.cabinId, 
              cabinName: c.cabinName, 
              totalWeightTons: c.totalWeightTons, 
              spots: c.spots 
            }))
          : [emptyCargoRow()]
        );

        setVehicles(ship.vehicleCapacity && ship.vehicleCapacity.length > 0 
          ? ship.vehicleCapacity.map((v, idx) => ({ 
              id: idx, 
              cabinId: v.cabinId, 
              cabinName: v.cabinName, 
              totalWeightTons: v.totalWeightTons, 
              spots: v.spots 
            }))
          : [emptyVehicleRow()]
        );

        console.log("[v0] Form data populated successfully");
      } else {
        console.error("[v0] Could not extract ship data from response");
        Swal.fire({ icon: "error", title: "Error", text: "Unable to load ship data" });
      }
    } catch (err) {
      console.error("[v0] Error fetching ship:", err);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load ship data: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchCabins = async () => {
    try {
      setLoadingCabins(true);

      // Fetch all three cabin types in parallel
      const [passengerRes, cargoRes, vehicleRes] = await Promise.all([
        cabinsApi.getCabins(1, 100, "", "passenger").catch(() => ({ data: { cabins: [] } })),
        cabinsApi.getCabins(1, 100, "", "cargo").catch(() => ({ data: { cabins: [] } })),
        cabinsApi.getCabins(1, 100, "", "vehicle").catch(() => ({ data: { cabins: [] } })),
      ]);

      setPassengerCabins(passengerRes?.data?.cabins || []);
      setCargoCabins(cargoRes?.data?.cabins || []);
      setVehicleCabins(vehicleRes?.data?.cabins || []);
    } catch (err) {
      console.error("[v0] Error fetching cabins:", err);
    } finally {
      setLoadingCabins(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onTechnicalChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      technical: { ...s.technical, [name]: value },
    }));
  };

  const addPassenger = () => setPassengers((a) => [...a, emptyPassengerRow()]);
  const removePassenger = (id) => {
    if (passengers.length === 1) {
      Swal.fire({ icon: "warning", title: "Warning", text: "At least one row is required" });
      return;
    }
    setPassengers((a) => a.filter((r) => r.id !== id));
  };
  const updatePassenger = (id, key, value) => setPassengers((a) => a.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const addCargo = () => setCargo((a) => [...a, emptyCargoRow()]);
  const removeCargo = (id) => {
    if (cargo.length === 1) {
      Swal.fire({ icon: "warning", title: "Warning", text: "At least one row is required" });
      return;
    }
    setCargo((a) => a.filter((r) => r.id !== id));
  };
  const updateCargo = (id, key, value) => setCargo((a) => a.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const addVehicle = () => setVehicles((a) => [...a, emptyVehicleRow()]);
  const removeVehicle = (id) => {
    if (vehicles.length === 1) {
      Swal.fire({ icon: "warning", title: "Warning", text: "At least one row is required" });
      return;
    }
    setVehicles((a) => a.filter((r) => r.id !== id));
  };
  const updateVehicle = (id, key, value) => setVehicles((a) => a.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Ship name is required";
    if (!form.imoNumber) newErrors.imoNumber = "IMO number is required";
    if (!form.shipType) newErrors.shipType = "Ship type is required";
    if (!form.flagState) newErrors.flagState = "Flag state is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({ icon: "error", title: "Validation Error", text: "Please fill in all required fields" });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        imoNumber: form.imoNumber,
        mmsiNumber: form.mmsiNumber,
        shipType: form.shipType,
        yearBuilt: form.yearBuilt,
        flagState: form.flagState,
        classificationSociety: form.classificationSociety,
        status: form.status,
        remarks: form.remarks,
        technical: form.technical,
        passengerCapacity: passengers.map(p => ({
          cabinId: p.cabinId,
          cabinName: p.cabinName,
          totalWeightKg: parseFloat(p.totalWeightKg) || 0,
          seats: parseInt(p.seats) || 0,
        })),
        cargoCapacity: cargo.map(c => ({
          cabinId: c.cabinId,
          cabinName: c.cabinName,
          totalWeightTons: parseFloat(c.totalWeightTons) || 0,
          spots: parseInt(c.spots) || 0,
        })),
        vehicleCapacity: vehicles.map(v => ({
          cabinId: v.cabinId,
          cabinName: v.cabinName,
          totalWeightTons: parseFloat(v.totalWeightTons) || 0,
          spots: parseInt(v.spots) || 0,
        })),
      };

      console.log("[v0] Ship payload:", payload);

      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode ? `/api/ships/${shipId}` : "/api/ships";

      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save ship");
      }

      Swal.fire({
        icon: "success",
        title: isEditMode ? "Ship Updated" : "Ship Created",
        text: isEditMode ? "Ship updated successfully" : "Ship created successfully",
        timer: 2000,
      });

      navigate("/company/ship-trip/ships");
    } catch (err) {
      console.error("[v0] Error saving ship:", err);
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to save ship" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      {/* General Information */}
      <div className="section-box" style={{border:"none"}}>
        <h6>General Information</h6>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Ship Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              name="name" 
              value={form.name} 
              onChange={onChange} 
              placeholder="Enter ship name"
            />
            {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
          </div>
          <div className="col-md-6">
            <label>Ship IMO Number <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${errors.imoNumber ? 'is-invalid' : ''}`}
              name="imoNumber" 
              value={form.imoNumber} 
              onChange={onChange}
              placeholder="e.g., IMO1234567"
            />
            {errors.imoNumber && <div className="invalid-feedback d-block">{errors.imoNumber}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Ship MMSI Number</label>
            <input 
              type="text" 
              className="form-control" 
              name="mmsiNumber" 
              value={form.mmsiNumber} 
              onChange={onChange}
              placeholder="Enter MMSI number"
            />
          </div>
          <div className="col-md-6">
            <label>Flag State / Registration Country <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className={`form-control ${errors.flagState ? 'is-invalid' : ''}`}
              name="flagState" 
              value={form.flagState} 
              onChange={onChange}
              placeholder="e.g., Oman"
            />
            {errors.flagState && <div className="invalid-feedback d-block">{errors.flagState}</div>}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Ship Type <span className="text-danger">*</span></label>
            <select 
              className={`form-select ${errors.shipType ? 'is-invalid' : ''}`}
              name="shipType" 
              value={form.shipType} 
              onChange={onChange}
            >
              <option value="">Select Ship Type</option>
              <option value="passenger">Passenger</option>
              <option value="vehicle">Vehicle</option>
              <option value="cargo">Cargo</option>
            </select>
            {errors.shipType && <div className="invalid-feedback d-block">{errors.shipType}</div>}
          </div>
          <div className="col-md-6">
            <label>Year Built</label>
            <input 
              type="text" 
              className="form-control" 
              name="yearBuilt" 
              value={form.yearBuilt} 
              onChange={onChange}
              placeholder="e.g., 2015"
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Classification Society</label>
            <input 
              type="text" 
              className="form-control" 
              name="classificationSociety" 
              value={form.classificationSociety} 
              onChange={onChange}
              placeholder="e.g., ABS, DNV"
            />
          </div>
          <div className="col-md-6">
            <label>Active/Inactive Status</label>
            <select className="form-select" name="status" value={form.status} onChange={onChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label>Remarks/Notes</label>
          <textarea 
            className="form-control" 
            rows="3" 
            name="remarks" 
            value={form.remarks} 
            onChange={onChange}
            placeholder="Enter any additional remarks"
          />
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Technical Specifications</h6>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Gross Tonnage (GT)</label>
            <input 
              type="number" 
              className="form-control" 
              name="grossTonnage" 
              value={form.technical.grossTonnage} 
              onChange={onTechnicalChange}
              placeholder="0"
              step="0.01"
            />
          </div>
          <div className="col-md-4">
            <label>Net Tonnage (NT)</label>
            <input 
              type="number" 
              className="form-control" 
              name="netTonnage" 
              value={form.technical.netTonnage} 
              onChange={onTechnicalChange}
              placeholder="0"
              step="0.01"
            />
          </div>
          <div className="col-md-4">
            <label>Length Overall (LOA) (in meters)</label>
            <input 
              type="number" 
              className="form-control" 
              name="loa" 
              value={form.technical.loa} 
              onChange={onTechnicalChange}
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Beam (in meters)</label>
            <input 
              type="number" 
              className="form-control" 
              name="beam" 
              value={form.technical.beam} 
              onChange={onTechnicalChange}
              placeholder="0"
              step="0.01"
            />
          </div>
          <div className="col-md-6">
            <label>Draft (in meters)</label>
            <input 
              type="number" 
              className="form-control" 
              name="draft" 
              value={form.technical.draft} 
              onChange={onTechnicalChange}
              placeholder="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Passenger Capacity */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Passenger Capacity</h6>
        {loadingCabins && <div className="text-muted small mb-2">Loading cabins...</div>}
        <div id="passengerContainer">
          {passengers.map((r) => (
            <div className="row mb-2 passenger-row" key={r.id}>
              <div className="col-md-3">
                <label>Cabin</label>
                <select 
                  className="form-select" 
                  value={r.cabinId} 
                  onChange={(e) => {
                    const cabin = passengerCabins.find(c => c._id === e.target.value);
                    updatePassenger(r.id, "cabinId", e.target.value);
                    if (cabin) updatePassenger(r.id, "cabinName", cabin.name);
                  }}
                >
                  <option value="">Select a cabin</option>
                  {passengerCabins.map(cabin => (
                    <option key={cabin._id} value={cabin._id}>{cabin.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Total Weight kg</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={r.totalWeightKg} 
                  onChange={(e) => updatePassenger(r.id, "totalWeightKg", e.target.value)}
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-3">
                <label>Number of Seats</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={r.seats} 
                  onChange={(e) => updatePassenger(r.id, "seats", e.target.value)}
                  placeholder="0"
                  step="1"
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button 
                  type="button" 
                  className="btn btn-danger btn-sm remove-line" 
                  onClick={() => removePassenger(r.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm" id="addPassenger" onClick={addPassenger}>
          + Add Line
        </button>
      </div>

      {/* Cargo Capacity */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Cargo Capacity</h6>
        {loadingCabins && <div className="text-muted small mb-2">Loading cabins...</div>}
        <div id="cargoContainer">
          {cargo.map((r) => (
            <div className="row mb-2 cargo-row" key={r.id}>
              <div className="col-md-3">
                <label>Cabin</label>
                <select 
                  className="form-select" 
                  value={r.cabinId} 
                  onChange={(e) => {
                    const cabin = cargoCabins.find(c => c._id === e.target.value);
                    updateCargo(r.id, "cabinId", e.target.value);
                    if (cabin) updateCargo(r.id, "cabinName", cabin.name);
                  }}
                >
                  <option value="">Select a cabin</option>
                  {cargoCabins.map(cabin => (
                    <option key={cabin._id} value={cabin._id}>{cabin.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Total Weight (metric tons)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={r.totalWeightTons} 
                  onChange={(e) => updateCargo(r.id, "totalWeightTons", e.target.value)}
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-3">
                <label>Spots</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={r.spots} 
                  onChange={(e) => updateCargo(r.id, "spots", e.target.value)}
                  placeholder="0"
                  step="1"
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button 
                  type="button" 
                  className="btn btn-danger btn-sm remove-line" 
                  onClick={() => removeCargo(r.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm" id="addCargo" onClick={addCargo}>
          + Add Line
        </button>
      </div>

      {/* Vehicle Capacity */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Vehicle Capacity</h6>
        {loadingCabins && <div className="text-muted small mb-2">Loading cabins...</div>}
        <div id="vehicleContainer">
          {vehicles.map((r) => (
            <div className="row mb-2 vehicle-row" key={r.id}>
              <div className="col-md-3">
                <label>Cabin</label>
                <select 
                  className="form-select" 
                  value={r.cabinId} 
                  onChange={(e) => {
                    const cabin = vehicleCabins.find(c => c._id === e.target.value);
                    updateVehicle(r.id, "cabinId", e.target.value);
                    if (cabin) updateVehicle(r.id, "cabinName", cabin.name);
                  }}
                >
                  <option value="">Select a cabin</option>
                  {vehicleCabins.map(cabin => (
                    <option key={cabin._id} value={cabin._id}>{cabin.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Total Weight (metric tons)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={r.totalWeightTons} 
                  onChange={(e) => updateVehicle(r.id, "totalWeightTons", e.target.value)}
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div className="col-md-3">
                <label>Spots</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={r.spots} 
                  onChange={(e) => updateVehicle(r.id, "spots", e.target.value)}
                  placeholder="0"
                  step="1"
                />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button 
                  type="button" 
                  className="btn btn-danger btn-sm remove-line" 
                  onClick={() => removeVehicle(r.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm" id="addVehicle" onClick={addVehicle}>
          + Add Line
        </button>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-start mt-4">
        <button 
          type="button" 
          className="btn btn-secondary me-2" 
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Back
        </button>
        <Can action={isEditMode ? "update" : "create"} path="/company/ship-trip/ships">
          <button 
            type="submit" 
            className="btn btn-turquoise"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              isEditMode ? "Update Ship" : "Save Ship"
            )}
          </button>
        </Can>
      </div>
    </form>
  );
}
