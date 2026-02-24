// src/components/ticketing/RuleCard.jsx
import React from "react";

/**
 * RuleCard - Matches Postman collection payload structure
 * Props:
 *  - rule: Complete object with all fields from Postman collection
 *  - onRemove(id)
 *  - onChange(id, updatedFields)
 */
export default function RuleCard({ rule, onRemove, onChange }) {
  const badgeColor = {
    VOID: "danger",
    REISSUE: "primary",
    REFUND: "success",
  }[rule.ruleType] || "primary";

  // Handle nested object updates for fee structures
  const updateFee = (feeField, type, value) => {
    onChange(rule.id, {
      [feeField]: {
        type,
        value: value === "" ? 0 : parseFloat(value) || 0
      }
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* Rule Type Badge and Remove Button */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className={`badge bg-${badgeColor} badge-type`}>{rule.ruleType}</span>
          <button type="button" className="btn btn-remove btn-sm" onClick={() => onRemove(rule.id)}>
            Remove
          </button>
        </div>

        {/* Rule Name */}
        <div className="mb-3">
          <label className="form-label">Rule Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Refund - Next Day 3 Hours Rule"
            value={rule.ruleName || ""}
            onChange={(e) => onChange(rule.id, { ruleName: e.target.value })}
          />
        </div>

        {/* Same Day Only - Available for all rule types */}
        <div className="mb-3">
          <label className="form-label">
            <input
              type="checkbox"
              checked={rule.sameDayOnly || false}
              onChange={(e) => onChange(rule.id, { sameDayOnly: e.target.checked })}
            />
            {" "}Same Day Only
          </label>
        </div>

        {/* Conditional Fields Based on Rule Type */}
        {rule.ruleType === "VOID" ? (
          <>
            {/* VOID Rule: restrictedWindowHours */}
            <div className="mb-3">
              <label className="form-label">Restricted Window Hours (before departure)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 3"
                min="0"
                value={rule.restrictedWindowHours || ""}
                onChange={(e) => onChange(rule.id, { restrictedWindowHours: parseInt(e.target.value) || 0 })}
              />
            </div>
          </>
        ) : (
          <>
            {/* REFUND/REISSUE Rules: startOffsetDays and restrictedWindowHours */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Offset Days (from issue)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g., 1"
                  min="0"
                  value={rule.startOffsetDays || ""}
                  onChange={(e) => onChange(rule.id, { startOffsetDays: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Restricted Window Hours (before departure)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g., 3"
                  min="0"
                  value={rule.restrictedWindowHours || ""}
                  onChange={(e) => onChange(rule.id, { restrictedWindowHours: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </>
        )}

        {/* Normal Fee */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Normal Fee Type</label>
            <select
              className="form-select"
              value={rule.normalFee?.type || "NONE"}
              onChange={(e) => updateFee("normalFee", e.target.value, rule.normalFee?.value || 0)}
            >
              <option value="NONE">None</option>
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Normal Fee Value</label>
            <input
              type="number"
              className="form-control"
              placeholder={rule.normalFee?.type === "PERCENTAGE" ? "e.g., 25" : "e.g., 50"}
              min="0"
              value={rule.normalFee?.value || ""}
              disabled={rule.normalFee?.type === "NONE"}
              onChange={(e) => updateFee("normalFee", rule.normalFee?.type || "FIXED", e.target.value)}
            />
          </div>
        </div>

        {/* Restricted Penalty */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Restricted Penalty Type</label>
            <select
              className="form-select"
              value={rule.restrictedPenalty?.type || "NONE"}
              onChange={(e) => updateFee("restrictedPenalty", e.target.value, rule.restrictedPenalty?.value || 0)}
            >
              <option value="NONE">None</option>
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Restricted Penalty Value</label>
            <input
              type="number"
              className="form-control"
              placeholder={rule.restrictedPenalty?.type === "PERCENTAGE" ? "e.g., 25" : "e.g., 50"}
              min="0"
              value={rule.restrictedPenalty?.value || ""}
              disabled={rule.restrictedPenalty?.type === "NONE"}
              onChange={(e) => updateFee("restrictedPenalty", rule.restrictedPenalty?.type || "FIXED", e.target.value)}
            />
          </div>
        </div>

        {/* No Show Penalty */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">No Show Penalty Type</label>
            <select
              className="form-select"
              value={rule.noShowPenalty?.type || "NONE"}
              onChange={(e) => updateFee("noShowPenalty", e.target.value, rule.noShowPenalty?.value || 0)}
            >
              <option value="NONE">None</option>
              <option value="FIXED">Fixed Amount</option>
              <option value="PERCENTAGE">Percentage</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">No Show Penalty Value</label>
            <input
              type="number"
              className="form-control"
              placeholder={rule.noShowPenalty?.type === "PERCENTAGE" ? "e.g., 30" : "e.g., 100"}
              min="0"
              value={rule.noShowPenalty?.value || ""}
              disabled={rule.noShowPenalty?.type === "NONE"}
              onChange={(e) => updateFee("noShowPenalty", rule.noShowPenalty?.type || "FIXED", e.target.value)}
            />
          </div>
        </div>

        {/* Conditions */}
        <div className="mb-3">
          <label className="form-label">Conditions</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe any special conditions..."
            value={rule.conditions || ""}
            onChange={(e) => onChange(rule.id, { conditions: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
