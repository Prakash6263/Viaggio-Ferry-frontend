'use client';

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFetch, API_BASE_URL } from "../../api/apiClient";
import { cabinsApi } from "../../api/cabinsApi";
import { shipsApi } from "../../api/shipsApi";
import { getFullImageUrl } from "../../utils/imageUrl";
import Can from "../Can";

// Placeholder image for failed loads
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='%23999' text-anchor='middle' dy='.3em'%3E?%3C/text%3E%3C/svg%3E";

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

  // Document state
  const [documents, setDocuments] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);

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

        // Set existing documents
        if (ship.documents && ship.documents.length > 0) {
          setExistingDocuments(ship.documents);
        }
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
  const updatePassenger = (id, key, value) => setPassengers((a) => a.map((r) => {
    if (r.id === id) {
      const updated = { ...r, [key]: value };
      // When seats are updated, automatically calculate totalWeightKg
      if (key === "seats" && value) {
        const seats = parseFloat(value) || 0;
        updated.totalWeightKg = (seats * 84).toString(); // 84 kg per passenger
      }
      return updated;
    }
    return r;
  }));

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

  const handleFileChange = (e) => {
    setDocuments([...e.target.files]);
  };

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

      const formData = new FormData();

      // Append all existing fields
      formData.append("name", form.name);
      formData.append("imoNumber", form.imoNumber);
      formData.append("mmsiNumber", form.mmsiNumber);
      formData.append("shipType", form.shipType);
      formData.append("yearBuilt", form.yearBuilt);
      formData.append("flagState", form.flagState);
      formData.append("classificationSociety", form.classificationSociety);
      formData.append("status", form.status);
      formData.append("remarks", form.remarks);

      // Append capacity arrays as JSON strings
      formData.append("passengerCapacity", JSON.stringify(
        passengers.map(p => ({
          cabinId: p.cabinId,
          cabinName: p.cabinName,
          totalWeightKg: parseFloat(p.totalWeightKg) || 0,
          seats: parseInt(p.seats) || 0,
        }))
      ));
      formData.append("cargoCapacity", JSON.stringify(
        cargo.map(c => ({
          cabinId: c.cabinId,
          cabinName: c.cabinName,
          totalWeightTons: parseFloat(c.totalWeightTons) || 0,
          spots: parseInt(c.spots) || 0,
        }))
      ));
      formData.append("vehicleCapacity", JSON.stringify(
        vehicles.map(v => ({
          cabinId: v.cabinId,
          cabinName: v.cabinName,
          totalWeightTons: parseFloat(v.totalWeightTons) || 0,
          spots: parseInt(v.spots) || 0,
        }))
      ));

      // Append technical specs as JSON string with numeric values
      formData.append("technical", JSON.stringify({
        grossTonnage: parseFloat(form.technical.grossTonnage) || 0,
        netTonnage: parseFloat(form.technical.netTonnage) || 0,
        loa: parseFloat(form.technical.loa) || 0,
        beam: parseFloat(form.technical.beam) || 0,
        draft: parseFloat(form.technical.draft) || 0,
      }));

      // Append files
      documents.forEach((file) => {
        formData.append("documents", file);
      });

      // Use the appropriate API method for FormData
      let response;
      if (isEditMode) {
        response = await shipsApi.updateShipWithFiles(shipId, formData);
      } else {
        response = await shipsApi.createShipWithFiles(formData);
      }

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to save ship");
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
              <option value="Container Ships">Container Ships</option>
              <option value="Bulk Carriers">Bulk Carriers</option>
              <option value="Tankers">Tankers</option>
              <option value="Ro-Ro Ships (Roll-on/Roll-off)">Ro-Ro Ships (Roll-on/Roll-off)</option>
              <option value="General Cargo Vessels">General Cargo Vessels</option>
              <option value="Refrigerated Ships (Reefers)">Refrigerated Ships (Reefers)</option>
              <option value="Cruise Ships (Passengers)">Cruise Ships (Passengers)</option>
              <option value="Ferries (Passengers)">Ferries (Passengers)</option>
              <option value="Ocean Liners (Passengers)">Ocean Liners (Passengers)</option>
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

      {/* Upload Documents */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Upload Documents (Images / PDF)</h6>
        <div className="mb-3">
          <label>Select Files</label>
          <input 
            type="file" 
            className="form-control" 
            name="documents"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
            onChange={handleFileChange}
          />
          <small className="form-text text-muted mt-2">
            Accepted formats: PNG, JPEG, JPG, WebP, PDF (Max 10 files)
          </small>
        </div>

        {/* Show selected files */}
        {documents.length > 0 && (
          <div className="mb-3">
            <h6 className="mb-2">Selected Files:</h6>
            <div className="row">
              {Array.from(documents).map((file, idx) => (
                <div key={idx} className="col-md-3 mb-2">
                  <div className="border p-2 rounded">
                    <small className="text-truncate d-block">{file.name}</small>
                    <small className="text-muted">{(file.size / 1024).toFixed(2)} KB</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show existing documents if editing */}
        {isEditMode && existingDocuments.length > 0 && (
          <div className="mb-3">
            <h6 className="mb-2">Existing Documents:</h6>
            <div className="row">
                      {existingDocuments.map((doc, idx) => (
                        <div key={idx} className="col-md-3 mb-2">
                          <div className="border p-2 rounded">
                            {doc.fileType === "image" ? (
                              <>
                                <img 
                                  src={getFullImageUrl(doc.fileUrl)} 
                                  alt={doc.fileName} 
                                  crossOrigin="anonymous"
                                  onError={(e) => {
                                    e.currentTarget.src = PLACEHOLDER_IMAGE;
                                  }}
                                  style={{ maxWidth: "100%", maxHeight: "100px", marginBottom: "8px" }}
                                />
                                <br />
                              </>
                            ) : doc.fileType === "pdf" ? (
                              <>
                                <i className="bi bi-file-pdf" style={{ fontSize: "24px", color: "red" }}></i>
                                <br />
                              </>
                            ) : null}
                            <small className="text-truncate d-block mb-2">{doc.fileName}</small>
                            <a 
                              href={getFullImageUrl(doc.fileUrl)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-sm btn-outline-primary"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
            </div>
          </div>
        )}
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
