'use client';

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CirclesWithBar } from "react-loader-spinner";
import { shipsApi } from "../../api/shipsApi";
import { cabinsApi } from "../../api/cabinsApi";

export default function AddShipForm({ shipId = null, initialData = null }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cabinsLoading, setCabinsLoading] = useState(false);
  const [cabins, setCabins] = useState({
    passenger: [],
    cargo: [],
    vehicle: [],
  });
  const [cabinsCache, setCabinsCache] = useState({
    passenger: false,
    cargo: false,
    vehicle: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    imoNumber: "",
    mmsiNumber: "",
    shipType: "",
    yearBuilt: "",
    flagState: "",
    classificationSociety: "",
    status: "Active",
    remarks: "",
    technical: {},
    passengerCapacity: [{ cabinId: "", quantity: 0 }],
    cargoCapacity: [{ cabinId: "", quantity: 0 }],
    vehicleCapacity: [{ cabinId: "", quantity: 0 }],
  });

  // Load initial ship data if editing
  useEffect(() => {
    if (shipId && initialData) {
      console.log("[v0] Loading initial ship data:", initialData);
      setFormData({
        name: initialData.name || "",
        imoNumber: initialData.imoNumber || "",
        mmsiNumber: initialData.mmsiNumber || "",
        shipType: initialData.shipType || "",
        yearBuilt: initialData.yearBuilt || "",
        flagState: initialData.flagState || "",
        classificationSociety: initialData.classificationSociety || "",
        status: initialData.status || "Active",
        remarks: initialData.remarks || "",
        technical: initialData.technical || {},
        passengerCapacity: initialData.passengerCapacity || [{ cabinId: "", quantity: 0 }],
        cargoCapacity: initialData.cargoCapacity || [{ cabinId: "", quantity: 0 }],
        vehicleCapacity: initialData.vehicleCapacity || [{ cabinId: "", quantity: 0 }],
      });
    }
  }, [shipId, initialData]);

  // Fetch cabins for a specific type with caching
  const fetchCabinsByType = async (type) => {
    if (cabinsCache[type]) return; // Already cached

    try {
      setCabinsLoading(true);
      const response = await cabinsApi.getCabinsByType(type);

      let cabinsList = [];
      if (response?.data?.cabins && Array.isArray(response.data.cabins)) {
        cabinsList = response.data.cabins;
      } else if (response?.cabins && Array.isArray(response.cabins)) {
        cabinsList = response.cabins;
      }

      console.log(`[v0] Loaded ${type} cabins:`, cabinsList);

      setCabins((prev) => ({
        ...prev,
        [type]: cabinsList,
      }));

      setCabinsCache((prev) => ({
        ...prev,
        [type]: true,
      }));
    } catch (error) {
      console.error(`[v0] Error fetching ${type} cabins:`, error);
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: `Failed to load ${type} cabin options`,
      });
    } finally {
      setCabinsLoading(false);
    }
  };

  // Fetch cabins when component mounts
  useEffect(() => {
    fetchCabinsByType("passenger");
    fetchCabinsByType("cargo");
    fetchCabinsByType("vehicle");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCapacityRowChange = (type, index, field, value) => {
    const rows = [...formData[type]];
    rows[index] = {
      ...rows[index],
      [field]: field === "quantity" ? parseInt(value) || 0 : value,
    };
    setFormData((prev) => ({
      ...prev,
      [type]: rows,
    }));
  };

  const addCapacityRow = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], { cabinId: "", quantity: 0 }],
    }));
  };

  const removeCapacityRow = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.imoNumber || !formData.shipType || !formData.yearBuilt || !formData.flagState) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all required fields",
      });
      return;
    }

    // Validate capacity rows
    const validateCapacity = (type) => {
      return formData[type].every((row) => row.cabinId && row.quantity > 0);
    };

    if (formData.passengerCapacity.length > 0 && !validateCapacity("passengerCapacity")) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Passenger Capacity",
        text: "Please fill all passenger capacity fields",
      });
      return;
    }

    if (formData.cargoCapacity.length > 0 && !validateCapacity("cargoCapacity")) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Cargo Capacity",
        text: "Please fill all cargo capacity fields",
      });
      return;
    }

    if (formData.vehicleCapacity.length > 0 && !validateCapacity("vehicleCapacity")) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Vehicle Capacity",
        text: "Please fill all vehicle capacity fields",
      });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        imoNumber: formData.imoNumber,
        mmsiNumber: formData.mmsiNumber,
        shipType: formData.shipType,
        yearBuilt: formData.yearBuilt,
        flagState: formData.flagState,
        classificationSociety: formData.classificationSociety,
        status: formData.status,
        remarks: formData.remarks,
        technical: formData.technical,
        passengerCapacity: formData.passengerCapacity,
        cargoCapacity: formData.cargoCapacity,
        vehicleCapacity: formData.vehicleCapacity,
      };

      if (shipId) {
        await shipsApi.updateShip(shipId, payload);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ship updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await shipsApi.createShip(payload);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Ship created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setTimeout(() => {
        navigate("/company/ship-trip/ships");
      }, 2000);
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save ship",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && shipId) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <CirclesWithBar
          height="80"
          width="80"
          color="#05468f"
          outerCircleColor="#05468f"
          innerCircleColor="#05468f"
          barColor="#05468f"
          ariaLabel="circles-with-bar-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
      {/* General Info Section */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">
            Ship Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Enter ship name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            IMO Number <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="imoNumber"
            placeholder="e.g., IMO1234567"
            value={formData.imoNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">MMSI Number</label>
          <input
            type="text"
            className="form-control"
            name="mmsiNumber"
            placeholder="Enter MMSI number"
            value={formData.mmsiNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Ship Type <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="shipType"
            placeholder="e.g., Passenger Ferry"
            value={formData.shipType}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">
            Year Built <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="yearBuilt"
            placeholder="e.g., 2015"
            value={formData.yearBuilt}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">
            Flag State <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="flagState"
            placeholder="e.g., Oman"
            value={formData.flagState}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Classification Society</label>
          <input
            type="text"
            className="form-control"
            name="classificationSociety"
            placeholder="Enter classification society"
            value={formData.classificationSociety}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Remarks</label>
        <textarea
          className="form-control"
          name="remarks"
          rows="3"
          placeholder="Add remarks about this ship"
          value={formData.remarks}
          onChange={handleInputChange}
        ></textarea>
      </div>

      {/* Passenger Capacity Section */}
      <CapacitySection
        title="Passenger Capacity"
        type="passengerCapacity"
        rows={formData.passengerCapacity}
        cabins={cabins.passenger}
        onRowChange={handleCapacityRowChange}
        onAddRow={addCapacityRow}
        onRemoveRow={removeCapacityRow}
        cabinsLoading={cabinsLoading}
      />

      {/* Cargo Capacity Section */}
      <CapacitySection
        title="Cargo Capacity (tons)"
        type="cargoCapacity"
        rows={formData.cargoCapacity}
        cabins={cabins.cargo}
        onRowChange={handleCapacityRowChange}
        onAddRow={addCapacityRow}
        onRemoveRow={removeCapacityRow}
        cabinsLoading={cabinsLoading}
      />

      {/* Vehicle Capacity Section */}
      <CapacitySection
        title="Vehicle Capacity"
        type="vehicleCapacity"
        rows={formData.vehicleCapacity}
        cabins={cabins.vehicle}
        onRowChange={handleCapacityRowChange}
        onAddRow={addCapacityRow}
        onRemoveRow={removeCapacityRow}
        cabinsLoading={cabinsLoading}
      />

      {/* Form Actions */}
      <div className="mt-4">
        <button
          type="submit"
          className="btn btn-turquoise"
          disabled={loading}
        >
          {loading ? "Saving..." : (shipId ? "Update" : "Create")} Ship
        </button>
      </div>
    </form>
  );
}

function CapacitySection({ title, type, rows, cabins, onRowChange, onAddRow, onRemoveRow, cabinsLoading }) {
  return (
    <div className="mb-3">
      <h6 className="mb-2">{title}</h6>
      <div className="table-responsive">
        <table className="table table-sm table-bordered mb-0">
          <thead className="table-light">
            <tr>
              <th>Cabin Type</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={row.cabinId}
                    onChange={(e) => onRowChange(type, index, "cabinId", e.target.value)}
                    disabled={cabinsLoading || cabins.length === 0}
                  >
                    <option value="">
                      {cabinsLoading ? "Loading..." : "Select Cabin Type"}
                    </option>
                    {cabins.map((cabin) => (
                      <option key={cabin._id} value={cabin._id}>
                        {cabin.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="0"
                    value={row.quantity}
                    onChange={(e) => onRowChange(type, index, "quantity", e.target.value)}
                    placeholder="0"
                  />
                </td>
                <td>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemoveRow(type, index)}
                      title="Remove this row"
                    >
                      <i className="far fa-trash-alt"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-outline-primary mt-2"
        onClick={() => onAddRow(type)}
        disabled={cabinsLoading || cabins.length === 0}
      >
        <i className="fa fa-plus me-1"></i>
        Add Line
      </button>
    </div>
  );
}
