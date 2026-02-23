"use client"

import { useState, useEffect } from "react"
import { usePermissions } from "../../hooks/usePermissions"

export default function TicketingRuleFormModal({ mode = "create", rule = null, onSave, onClose }) {
  const permissions = usePermissions()
  const isDisabled = !(permissions.create || permissions.update)

  // Form state
  const [formData, setFormData] = useState({
    ruleType: "REFUND",
    ruleName: "",
    payloadType: "PASSENGER",
    sameDayOnly: false,
    startOffsetDays: 0,
    restrictedWindowHours: 0,
    normalFee: { type: "NONE", value: 0 },
    restrictedPenalty: { type: "NONE", value: 0 },
    noShowPenalty: { type: "NONE", value: 0 },
    conditions: "",
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Initialize form with rule data if editing
  useEffect(() => {
    if (mode === "edit" && rule) {
      setFormData({
        ruleType: rule.ruleType || "REFUND",
        ruleName: rule.ruleName || "",
        payloadType: rule.payloadType || "PASSENGER",
        sameDayOnly: rule.sameDayOnly || false,
        startOffsetDays: rule.startOffsetDays || 0,
        restrictedWindowHours: rule.restrictedWindowHours || 0,
        normalFee: rule.normalFee || { type: "NONE", value: 0 },
        restrictedPenalty: rule.restrictedPenalty || { type: "NONE", value: 0 },
        noShowPenalty: rule.noShowPenalty || { type: "NONE", value: 0 },
        conditions: rule.conditions || "",
      })
    }
  }, [mode, rule])

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.ruleType) newErrors.ruleType = "Rule Type is required"
    if (!formData.ruleName) newErrors.ruleName = "Rule Name is required"
    if (!formData.payloadType) newErrors.payloadType = "Payload Type is required"
    if (!formData.restrictedWindowHours && formData.restrictedWindowHours !== 0) {
      newErrors.restrictedWindowHours = "Restricted Window Hours is required"
    }
    if (formData.startOffsetDays < 0) newErrors.startOffsetDays = "Start Offset Days cannot be negative"
    if (formData.normalFee.value < 0) newErrors.normalFeValue = "Normal Fee value cannot be negative"
    if (formData.restrictedPenalty.value < 0) newErrors.restrictedPenaltyValue = "Restricted Penalty value cannot be negative"
    if (formData.noShowPenalty.value < 0) newErrors.noShowPenaltyValue = "No Show Penalty value cannot be negative"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle fee/penalty changes
  const handleFeeChange = (feeType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [feeType]: {
        ...prev[feeType],
        [field]: field === "value" ? Number(value) : value,
      },
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Auto-set fee value to 0 if type is NONE
    const submitData = {
      ...formData,
      normalFee: {
        ...formData.normalFee,
        value: formData.normalFee.type === "NONE" ? 0 : formData.normalFee.value,
      },
      restrictedPenalty: {
        ...formData.restrictedPenalty,
        value: formData.restrictedPenalty.type === "NONE" ? 0 : formData.restrictedPenalty.value,
      },
      noShowPenalty: {
        ...formData.noShowPenalty,
        value: formData.noShowPenalty.type === "NONE" ? 0 : formData.noShowPenalty.value,
      },
    }

    try {
      setSubmitting(true)
      await onSave(submitData)
    } catch (error) {
      console.error("[v0] Form submission error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  // Determine which fields to show based on ruleType
  const showVoidFields = formData.ruleType === "VOID"
  const showRefundReissueFields = formData.ruleType === "REFUND" || formData.ruleType === "REISSUE"

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "create" ? "Create New Ticketing Rule" : "Edit Ticketing Rule"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={submitting}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Rule Type */}
              <div className="mb-3">
                <label htmlFor="ruleType" className="form-label">
                  Rule Type <span className="text-danger">*</span>
                </label>
                <select
                  id="ruleType"
                  name="ruleType"
                  className={`form-control ${errors.ruleType ? "is-invalid" : ""}`}
                  value={formData.ruleType}
                  onChange={handleChange}
                  disabled={isDisabled || mode === "edit"}
                >
                  <option value="VOID">VOID</option>
                  <option value="REFUND">REFUND</option>
                  <option value="REISSUE">REISSUE</option>
                </select>
                {errors.ruleType && <div className="invalid-feedback">{errors.ruleType}</div>}
              </div>

              {/* Rule Name */}
              <div className="mb-3">
                <label htmlFor="ruleName" className="form-label">
                  Rule Name <span className="text-danger">*</span>
                </label>
                <input
                  id="ruleName"
                  name="ruleName"
                  type="text"
                  className={`form-control ${errors.ruleName ? "is-invalid" : ""}`}
                  value={formData.ruleName}
                  onChange={handleChange}
                  placeholder="e.g., Refund - Next Day 3 Hours Rule"
                  disabled={isDisabled}
                />
                {errors.ruleName && <div className="invalid-feedback">{errors.ruleName}</div>}
              </div>

              {/* Payload Type */}
              <div className="mb-3">
                <label htmlFor="payloadType" className="form-label">
                  Payload Type <span className="text-danger">*</span>
                </label>
                <select
                  id="payloadType"
                  name="payloadType"
                  className={`form-control ${errors.payloadType ? "is-invalid" : ""}`}
                  value={formData.payloadType}
                  onChange={handleChange}
                  disabled={isDisabled}
                >
                  <option value="PASSENGER">PASSENGER</option>
                  <option value="CARGO">CARGO</option>
                  <option value="VEHICLE">VEHICLE</option>
                  <option value="ALL">ALL</option>
                </select>
                {errors.payloadType && <div className="invalid-feedback">{errors.payloadType}</div>}
              </div>

              {/* Conditional Fields - VOID Only */}
              {showVoidFields && (
                <>
                  <div className="mb-3 form-check">
                    <input
                      id="sameDayOnly"
                      name="sameDayOnly"
                      type="checkbox"
                      className="form-check-input"
                      checked={formData.sameDayOnly}
                      onChange={handleChange}
                      disabled={isDisabled}
                    />
                    <label htmlFor="sameDayOnly" className="form-check-label">
                      Same Day Only
                    </label>
                  </div>
                </>
              )}

              {/* Conditional Fields - REFUND/REISSUE Only */}
              {showRefundReissueFields && (
                <div className="mb-3">
                  <label htmlFor="startOffsetDays" className="form-label">
                    Start Offset Days
                  </label>
                  <input
                    id="startOffsetDays"
                    name="startOffsetDays"
                    type="number"
                    min="0"
                    className={`form-control ${errors.startOffsetDays ? "is-invalid" : ""}`}
                    value={formData.startOffsetDays}
                    onChange={handleChange}
                    disabled={isDisabled}
                  />
                  {errors.startOffsetDays && (
                    <div className="invalid-feedback">{errors.startOffsetDays}</div>
                  )}
                </div>
              )}

              {/* Restricted Window Hours */}
              <div className="mb-3">
                <label htmlFor="restrictedWindowHours" className="form-label">
                  Restricted Window Hours <span className="text-danger">*</span>
                </label>
                <input
                  id="restrictedWindowHours"
                  name="restrictedWindowHours"
                  type="number"
                  min="0"
                  className={`form-control ${errors.restrictedWindowHours ? "is-invalid" : ""}`}
                  value={formData.restrictedWindowHours}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                  disabled={isDisabled}
                />
                {errors.restrictedWindowHours && (
                  <div className="invalid-feedback">{errors.restrictedWindowHours}</div>
                )}
              </div>

              {/* Normal Fee */}
              <div className="card mb-3 p-3">
                <h6 className="mb-2">Normal Fee</h6>
                <div className="row">
                  <div className="col-md-6">
                    <label className="form-label">Type</label>
                    <select
                      className="form-control"
                      value={formData.normalFee.type}
                      onChange={(e) => handleFeeChange("normalFee", "type", e.target.value)}
                      disabled={isDisabled}
                    >
                      <option value="NONE">NONE</option>
                      <option value="FIXED">FIXED</option>
                      <option value="PERCENTAGE">PERCENTAGE</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Value</label>
                    <input
                      type="number"
                      min="0"
                      className={`form-control ${errors.normalFeValue ? "is-invalid" : ""}`}
                      value={formData.normalFee.value}
                      onChange={(e) => handleFeeChange("normalFee", "value", e.target.value)}
                      placeholder="0"
                      disabled={isDisabled || formData.normalFee.type === "NONE"}
                    />
                    {errors.normalFeValue && <div className="invalid-feedback">{errors.normalFeValue}</div>}
                  </div>
                </div>
              </div>

              {/* Restricted Penalty */}
              {showRefundReissueFields && (
                <div className="card mb-3 p-3">
                  <h6 className="mb-2">Restricted Penalty</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Type</label>
                      <select
                        className="form-control"
                        value={formData.restrictedPenalty.type}
                        onChange={(e) => handleFeeChange("restrictedPenalty", "type", e.target.value)}
                        disabled={isDisabled}
                      >
                        <option value="NONE">NONE</option>
                        <option value="FIXED">FIXED</option>
                        <option value="PERCENTAGE">PERCENTAGE</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Value</label>
                      <input
                        type="number"
                        min="0"
                        className={`form-control ${errors.restrictedPenaltyValue ? "is-invalid" : ""}`}
                        value={formData.restrictedPenalty.value}
                        onChange={(e) => handleFeeChange("restrictedPenalty", "value", e.target.value)}
                        placeholder="0"
                        disabled={isDisabled || formData.restrictedPenalty.type === "NONE"}
                      />
                      {errors.restrictedPenaltyValue && (
                        <div className="invalid-feedback">{errors.restrictedPenaltyValue}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* No Show Penalty */}
              {showRefundReissueFields && (
                <div className="card mb-3 p-3">
                  <h6 className="mb-2">No Show Penalty</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Type</label>
                      <select
                        className="form-control"
                        value={formData.noShowPenalty.type}
                        onChange={(e) => handleFeeChange("noShowPenalty", "type", e.target.value)}
                        disabled={isDisabled}
                      >
                        <option value="NONE">NONE</option>
                        <option value="FIXED">FIXED</option>
                        <option value="PERCENTAGE">PERCENTAGE</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Value</label>
                      <input
                        type="number"
                        min="0"
                        className={`form-control ${errors.noShowPenaltyValue ? "is-invalid" : ""}`}
                        value={formData.noShowPenalty.value}
                        onChange={(e) => handleFeeChange("noShowPenalty", "value", e.target.value)}
                        placeholder="0"
                        disabled={isDisabled || formData.noShowPenalty.type === "NONE"}
                      />
                      {errors.noShowPenaltyValue && (
                        <div className="invalid-feedback">{errors.noShowPenaltyValue}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Conditions */}
              <div className="mb-3">
                <label htmlFor="conditions" className="form-label">
                  Conditions
                </label>
                <textarea
                  id="conditions"
                  name="conditions"
                  className="form-control"
                  rows="3"
                  value={formData.conditions}
                  onChange={handleChange}
                  placeholder="e.g., Applies to all routes except long-haul international"
                  disabled={isDisabled}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-turquoise"
                disabled={submitting || isDisabled}
              >
                {submitting ? "Saving..." : mode === "create" ? "Create Rule" : "Update Rule"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
