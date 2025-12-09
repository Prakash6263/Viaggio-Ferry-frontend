// src/components/ticketing/RuleCard.jsx
import React from "react";

/**
 * RuleCard - displays a single rule card exactly like HTML markup.
 * Props:
 *  - rule: { id, type, name, timeframeBefore, afterIssued, fee, conditions }
 *  - onRemove(id)
 *  - onChange(id, updatedFields)
 *
 * This component preserves classes/structure so CSS remains identical.
 */
export default function RuleCard({ rule, onRemove, onChange }) {
  const badgeColor = {
    VOID: "danger",
    REISSUE: "primary",
    REFUND: "success",
    NOSHOW: "warning",
  }[rule.type] || "primary";

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className={`badge bg-${badgeColor} badge-type`}>{rule.type}</span>
          <button type="button" className="btn btn-remove btn-sm" onClick={() => onRemove(rule.id)}>Remove</button>
        </div>

        <div className="mb-3">
          <label className="form-label">Rule Name</label>
          <input
            type="text"
            className="form-control"
            placeholder={`${rule.type} - Example`}
            value={rule.name}
            onChange={(e) => onChange(rule.id, { name: e.target.value })}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Timeframe Before Departure</label>
            <select
              className="form-select"
              value={rule.timeframeBefore || ""}
              onChange={(e) => onChange(rule.id, { timeframeBefore: e.target.value })}
            >
              <option value="">Select timeframe</option>
              <option value="24h">24 hours</option>
              <option value="48h">48 hours</option>
              <option value="72h">72 hours</option>
              <option value="1week">1 week</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">After Ticket Issued</label>
            <select
              className="form-select"
              value={rule.afterIssued || ""}
              onChange={(e) => onChange(rule.id, { afterIssued: e.target.value })}
            >
              <option value="">Select timeframe</option>
              <option value="24h">24 hours</option>
              <option value="48h">48 hours</option>
              <option value="72h">72 hours</option>
              <option value="1week">1 week</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Fee (Fixed or %)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 50 or 25%"
              value={rule.fee || ""}
              onChange={(e) => onChange(rule.id, { fee: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Conditions</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe the conditions..."
            value={rule.conditions || ""}
            onChange={(e) => onChange(rule.id, { conditions: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
