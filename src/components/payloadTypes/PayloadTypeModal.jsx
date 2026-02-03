'use client';

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { payloadTypesApi } from "../../api/payloadTypesApi";

export default function PayloadTypeModal({ type, onSuccess, editingData = null }) {
  const [loading, setLoading] = useState(false);
  const closeButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active",
    maxWeight: "",
    dimensions: "",
    ageRangeFrom: "",
    ageRangeTo: "",
  });

  // Load data if editing
  useEffect(() => {
    if (editingData) {
      // Handle ageRange - could be string or object
      let ageRangeFrom = "";
      let ageRangeTo = "";
      
      if (editingData.ageRange) {
        if (typeof editingData.ageRange === 'object' && editingData.ageRange.from !== undefined) {
          ageRangeFrom = editingData.ageRange.from || "";
          ageRangeTo = editingData.ageRange.to || "";
        } else if (typeof editingData.ageRange === 'string' && editingData.ageRange.includes('-')) {
          // Handle string format like "10-12" (legacy format)
          const parts = editingData.ageRange.split('-');
          ageRangeFrom = parts[0]?.trim() || "";
          ageRangeTo = parts[1]?.trim() || "";
        }
      }
      
      setFormData({
        name: editingData.name || "",
        code: editingData.code || "",
        description: editingData.description || "",
        status: editingData.status || "Active",
        maxWeight: editingData.maxWeight || "",
        dimensions: editingData.dimensions || "",
        ageRangeFrom,
        ageRangeTo,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        status: "Active",
        maxWeight: "",
        dimensions: "",
        ageRangeFrom: "",
        ageRangeTo: "",
      });
    }
  }, [editingData]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleStatusToggle = (checked) => {
    setFormData({
      ...formData,
      status: checked ? "Active" : "Inactive",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Name is required",
      });
      return;
    }

    if (!formData.code.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Code is required",
      });
      return;
    }

    try {
      setLoading(true);

      // Build payload based on category
      const payload = {
        category: type,
        name: formData.name,
        code: formData.code,
        description: formData.description,
        status: formData.status,
      };

      // Add category-specific fields
      if (type === "passenger") {
        // Always send ageRange as an object for passenger types
        payload.ageRange = {
          from: formData.ageRangeFrom ? parseInt(formData.ageRangeFrom) : 0,
          to: formData.ageRangeTo ? parseInt(formData.ageRangeTo) : 0,
        };
      } else if (type === "cargo" || type === "vehicle") {
        // Explicitly set ageRange to null for cargo/vehicle
        payload.ageRange = null;
        payload.maxWeight = formData.maxWeight ? parseInt(formData.maxWeight) : null;
        payload.dimensions = formData.dimensions || null;
      }

      // Call API
      if (editingData && editingData._id) {
        await payloadTypesApi.updatePayloadType(editingData._id, payload);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Payload type has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await payloadTypesApi.createPayloadType(payload);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Payload type has been created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Close modal via button click
      if (closeButtonRef.current) {
        closeButtonRef.current.click();
      }

      // Trigger refresh
      onSuccess();
    } catch (error) {
      console.error("[v0] Submit Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save payload type",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = () => {
    const labels = {
      passenger: "Passenger Type",
      cargo: "Cargo Type",
      vehicle: "Vehicle Type",
    };
    return labels[type] || "Payload Type";
  };

  return (
    <div
      className="modal fade"
      id={`${type}Modal`}
      tabIndex="-1"
      aria-labelledby={`${type}ModalLabel`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${type}ModalLabel`}>
              {editingData ? `Edit ${getTypeLabel()}` : `Add New ${getTypeLabel()}`}
            </h5>
            <button
              ref={closeButtonRef}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={`Enter ${getTypeLabel().toLowerCase()} name`}
                />
              </div>

              {/* Code */}
              <div className="mb-3">
                <label className="form-label">Code *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="E.g., ADT, CHD, INF"
                  maxLength="10"
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter description"
                ></textarea>
              </div>

              {/* Passenger Type - Age Range */}
              {type === "passenger" && (
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label">Age From</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.ageRangeFrom}
                      onChange={(e) => handleInputChange("ageRangeFrom", e.target.value)}
                      placeholder="E.g., 0"
                      min="0"
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Age To</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.ageRangeTo}
                      onChange={(e) => handleInputChange("ageRangeTo", e.target.value)}
                      placeholder="E.g., 100"
                      min="0"
                    />
                  </div>
                </div>
              )}

              {/* Cargo & Vehicle Types - Max Weight */}
              {(type === "cargo" || type === "vehicle") && (
                <div className="mb-3">
                  <label className="form-label">Max Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.maxWeight}
                    onChange={(e) => handleInputChange("maxWeight", e.target.value)}
                    placeholder="E.g., 500"
                  />
                </div>
              )}

              {/* Cargo & Vehicle Types - Dimensions */}
              {(type === "cargo" || type === "vehicle") && (
                <div className="mb-3">
                  <label className="form-label">Dimensions (L×W×H cm)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange("dimensions", e.target.value)}
                    placeholder="E.g., 120×100×150"
                  />
                </div>
              )}

              {/* Status */}
              <div className="mb-3">
                <label className="form-label">Status</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`${type}Status`}
                    checked={formData.status === "Active"}
                    onChange={(e) => handleStatusToggle(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor={`${type}Status`}>
                    {formData.status === "Active" ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
