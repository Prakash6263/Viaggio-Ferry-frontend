'use client';

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { cabinsApi } from "../../api/cabinsApi";

export default function CabinForm({ cabinId = null, initialData = null }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("passengers");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    passengers: {
      name: "",
      description: "",
      remarks: "",
      status: "Active",
    },
    vehicles: {
      name: "",
      description: "",
      remarks: "",
      status: "Active",
    },
    cargo: {
      name: "",
      description: "",
      remarks: "",
      status: "Active",
    },
  });

  // Load cabin data if editing
  useEffect(() => {
    if (cabinId && initialData) {
      // Map API type (passenger/vehicle/cargo) to tab key (passengers/vehicles/cargo)
      const apiTypeToTabKey = {
        passenger: "passengers",
        vehicle: "vehicles",
        cargo: "cargo",
      };
      const tabKey = apiTypeToTabKey[initialData.type] || "passengers";

      const tabData = {
        name: initialData.name || "",
        description: initialData.description || "",
        remarks: initialData.remarks || "",
        status: initialData.status || "Active",
      };
      setFormData((prevFormData) => ({
        ...prevFormData,
        [tabKey]: tabData,
      }));
      setActiveTab(tabKey);
    }
  }, [cabinId, initialData]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [activeTab]: {
        ...formData[activeTab],
        [field]: value,
      },
    });
  };

  const handleStatusToggle = (checked) => {
    setFormData({
      ...formData,
      [activeTab]: {
        ...formData[activeTab],
        status: checked ? "Active" : "Inactive",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData[activeTab];

    // Validation
    if (!data.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Cabin name is required",
      });
      return;
    }

    try {
      setLoading(true);
      // Normalize type: passengers -> passenger, vehicles -> vehicle, cargo -> cargo
      const normalizedType = activeTab === "passengers" ? "passenger" : activeTab === "vehicles" ? "vehicle" : "cargo";
      
      const payload = {
        type: normalizedType,
        name: data.name,
        description: data.description,
        remarks: data.remarks,
        status: data.status,
      };

      if (cabinId) {
        // Update existing cabin
        await cabinsApi.updateCabin(cabinId, payload);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Cabin has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        // Create new cabin
        await cabinsApi.createCabin(payload);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Cabin has been created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      // Navigate back to list
      setTimeout(() => {
        navigate("/company/settings/cabin");
      }, 2000);
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save cabin",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/company/settings/cabin");
  };

  const currentTabData = formData[activeTab];

  return (
    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
      {/* Nav tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "passengers" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("passengers")}
          >
            Passengers
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "vehicles" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("vehicles")}
          >
            Vehicles
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "cargo" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("cargo")}
          >
            Cargo
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div className={`tab-pane fade ${activeTab === "passengers" ? "show active" : ""}`}>
          <FormFields
            data={activeTab === "passengers" ? currentTabData : formData.passengers}
            onChange={activeTab === "passengers" ? handleInputChange : () => {}}
            onStatusToggle={activeTab === "passengers" ? handleStatusToggle : () => {}}
            tabType={activeTab}
          />
        </div>

        <div className={`tab-pane fade ${activeTab === "vehicles" ? "show active" : ""}`}>
          <FormFields
            data={activeTab === "vehicles" ? currentTabData : formData.vehicles}
            onChange={activeTab === "vehicles" ? handleInputChange : () => {}}
            onStatusToggle={activeTab === "vehicles" ? handleStatusToggle : () => {}}
            tabType={activeTab}
          />
        </div>

        <div className={`tab-pane fade ${activeTab === "cargo" ? "show active" : ""}`}>
          <FormFields
            data={activeTab === "cargo" ? currentTabData : formData.cargo}
            onChange={activeTab === "cargo" ? handleInputChange : () => {}}
            onStatusToggle={activeTab === "cargo" ? handleStatusToggle : () => {}}
            tabType={activeTab}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-4 d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="fa fa-save me-2"></i>
              {cabinId ? "Update" : "Create"} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Cabin
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          <i className="fa fa-times me-2"></i>
          Cancel
        </button>
      </div>
    </form>
  );
}

function FormFields({ data, onChange, onStatusToggle, tabType }) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Cabin Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter cabin name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Cabin Description</label>
        <textarea
          className="form-control"
          placeholder="Enter cabin description"
          rows={3}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Remarks</label>
        <textarea
          className="form-control"
          placeholder="Enter remarks"
          rows={2}
          value={data.remarks}
          onChange={(e) => onChange("remarks", e.target.value)}
        ></textarea>
      </div>

      <div className="mb-3 d-flex align-items-center">
        <label className="form-label me-3 mb-0">Status</label>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={`status-${tabType}`}
            checked={data.status === "Active"}
            onChange={(e) => onStatusToggle(e.target.checked)}
          />
          <label className="form-check-label" htmlFor={`status-${tabType}`}>
            {data.status === "Active" ? "Active" : "Inactive"}
          </label>
        </div>
      </div>
    </>
  );
}
