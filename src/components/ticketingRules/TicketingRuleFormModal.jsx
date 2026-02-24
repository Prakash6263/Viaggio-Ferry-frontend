'use client';

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { ticketingRuleApi } from "../../api/ticketingRuleApi";

export default function TicketingRuleFormModal({ onSuccess, editingData = null }) {
  const [loading, setLoading] = useState(false);
  const closeButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    ruleType: "VOID",
    ruleName: "",
    sameDayOnly: false,
    startOffsetDays: 0,
    restrictedWindowHours: "",
    normalFee: { type: "NONE", value: 0 },
    restrictedPenalty: { type: "NONE", value: 0 },
    noShowPenalty: { type: "NONE", value: 0 },
    conditions: "",
  });

  // Load data if editing
  useEffect(() => {
    if (editingData) {
      setFormData({
        ruleType: editingData.ruleType || "VOID",
        ruleName: editingData.ruleName || "",
        sameDayOnly: editingData.sameDayOnly || false,
        startOffsetDays: editingData.startOffsetDays || 0,
        restrictedWindowHours: editingData.restrictedWindowHours || "",
        normalFee: editingData.normalFee || { type: "NONE", value: 0 },
        restrictedPenalty: editingData.restrictedPenalty || { type: "NONE", value: 0 },
        noShowPenalty: editingData.noShowPenalty || { type: "NONE", value: 0 },
        conditions: editingData.conditions || "",
      });
    } else {
      setFormData({
        ruleType: "VOID",
        ruleName: "",
        sameDayOnly: false,
        startOffsetDays: 0,
        restrictedWindowHours: "",
        normalFee: { type: "NONE", value: 0 },
        restrictedPenalty: { type: "NONE", value: 0 },
        noShowPenalty: { type: "NONE", value: 0 },
        conditions: "",
      });
    }
  }, [editingData]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handlePenaltyChange = (penaltyField, subField, value) => {
    const updatedPenalty = { ...formData[penaltyField] };
    if (subField === "type") {
      updatedPenalty.type = value;
      // Auto-set value to 0 if NONE type is selected
      if (value === "NONE") {
        updatedPenalty.value = 0;
      }
    } else {
      updatedPenalty.value = value === "" ? 0 : Math.max(0, parseFloat(value) || 0);
    }
    setFormData({
      ...formData,
      [penaltyField]: updatedPenalty,
    });
  };

  const handleRuleTypeChange = (newType) => {
    setFormData({
      ...formData,
      ruleType: newType,
      // Reset conditional fields
      sameDayOnly: false,
      startOffsetDays: 0,
      normalFee: { type: "NONE", value: 0 },
      restrictedPenalty: { type: "NONE", value: 0 },
      noShowPenalty: { type: "NONE", value: 0 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.ruleName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Rule Name is required",
      });
      return;
    }

    if (!formData.restrictedWindowHours || formData.restrictedWindowHours === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Restricted Window Hours is required",
      });
      return;
    }

    if (formData.ruleType !== "VOID" && formData.startOffsetDays < 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Start Offset Days must be greater than or equal to 0",
      });
      return;
    }

    try {
      setLoading(true);

      // Prepare payload - exclude payloadType field completely
      const payload = {
        ruleType: formData.ruleType,
        ruleName: formData.ruleName.trim(),
        restrictedWindowHours: parseInt(formData.restrictedWindowHours),
        conditions: formData.conditions.trim(),
      };

      // Add conditional fields based on rule type
      if (formData.ruleType === "VOID") {
        payload.sameDayOnly = formData.sameDayOnly;
      } else if (formData.ruleType === "REFUND" || formData.ruleType === "REISSUE") {
        payload.startOffsetDays = parseInt(formData.startOffsetDays) || 0;
        payload.normalFee = {
          type: formData.normalFee.type,
          value: formData.normalFee.type === "NONE" ? 0 : parseFloat(formData.normalFee.value) || 0,
        };
        payload.restrictedPenalty = {
          type: formData.restrictedPenalty.type,
          value: formData.restrictedPenalty.type === "NONE" ? 0 : parseFloat(formData.restrictedPenalty.value) || 0,
        };
        payload.noShowPenalty = {
          type: formData.noShowPenalty.type,
          value: formData.noShowPenalty.type === "NONE" ? 0 : parseFloat(formData.noShowPenalty.value) || 0,
        };
      }

      // Call API
      if (editingData && editingData._id) {
        await ticketingRuleApi.updateTicketingRule(editingData._id, payload);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Ticketing rule has been updated successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await ticketingRuleApi.createTicketingRule(payload);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Ticketing rule has been created successfully.",
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
        text: error.message || "Failed to save ticketing rule",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFeeField = (label, fieldName) => {
    const penalty = formData[fieldName];
    return (
      <div className="mb-3">
        <label className="form-label">{label} *</label>
        <div className="row g-2">
          <div className="col-6">
            <select
              className="form-select"
              value={penalty.type}
              onChange={(e) => handlePenaltyChange(fieldName, "type", e.target.value)}
            >
              <option value="NONE">None</option>
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>
          <div className="col-6">
            <input
              type="number"
              className="form-control"
              value={penalty.value}
              onChange={(e) => handlePenaltyChange(fieldName, "value", e.target.value)}
              placeholder="Enter value"
              min="0"
              disabled={penalty.type === "NONE"}
              step={penalty.type === "PERCENTAGE" ? "0.01" : "1"}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="modal fade"
      id="ticketingRuleModal"
      tabIndex="-1"
      aria-labelledby="ticketingRuleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="ticketingRuleModalLabel">
              {editingData ? "Edit Ticketing Rule" : "Add New Ticketing Rule"}
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
              {/* Rule Type */}
              <div className="mb-3">
                <label className="form-label">Rule Type *</label>
                <select
                  className="form-select"
                  value={formData.ruleType}
                  onChange={(e) => handleRuleTypeChange(e.target.value)}
                >
                  <option value="VOID">VOID</option>
                  <option value="REFUND">REFUND</option>
                  <option value="REISSUE">REISSUE</option>
                </select>
              </div>

              {/* Rule Name */}
              <div className="mb-3">
                <label className="form-label">Rule Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ruleName}
                  onChange={(e) => handleInputChange("ruleName", e.target.value)}
                  placeholder="Enter rule name"
                />
              </div>

              {/* VOID-specific fields */}
              {formData.ruleType === "VOID" && (
                <>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sameDayOnly"
                        checked={formData.sameDayOnly}
                        onChange={(e) => handleInputChange("sameDayOnly", e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="sameDayOnly">
                        Same Day Only
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* REFUND/REISSUE-specific fields */}
              {(formData.ruleType === "REFUND" || formData.ruleType === "REISSUE") && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Start Offset Days (≥0)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.startOffsetDays}
                      onChange={(e) => handleInputChange("startOffsetDays", Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="Enter offset days"
                      min="0"
                    />
                  </div>
                </>
              )}

              {/* Restricted Window Hours (always visible) */}
              <div className="mb-3">
                <label className="form-label">Restricted Window Hours *</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.restrictedWindowHours}
                  onChange={(e) => handleInputChange("restrictedWindowHours", e.target.value)}
                  placeholder="Enter hours"
                  min="0"
                />
              </div>

              {/* Penalty fields for REFUND/REISSUE */}
              {(formData.ruleType === "REFUND" || formData.ruleType === "REISSUE") && (
                <>
                  {renderFeeField("Normal Fee", "normalFee")}
                  {renderFeeField("Restricted Penalty", "restrictedPenalty")}
                  {renderFeeField("No Show Penalty", "noShowPenalty")}
                </>
              )}

              {/* Conditions */}
              <div className="mb-3">
                <label className="form-label">Conditions</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.conditions}
                  onChange={(e) => handleInputChange("conditions", e.target.value)}
                  placeholder="Enter conditions"
                ></textarea>
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
                className="btn btn-turquoise"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
