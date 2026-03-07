import React from "react";

export default function EditTripTicketingRulesTab({
  tripRules,
  ticketingRulesByType,
  assignedTripRules,
  updateTripRule,
  handleRuleTypeChange,
  removeTripRule,
  addTripRule,
  onSaveTicketingRules
}) {
  return (
    <div id="tripTicketingRulesTab">
      <h5 className="mb-3">Trip Ticketing Rules{assignedTripRules.length > 0 && <span className="badge bg-success ms-2">{assignedTripRules.length} rules assigned</span>}</h5>

      <div id="trip-rules-container">
        {tripRules.map((rule) => (
          <div className="capacity-grid align-items-center mb-2" key={rule.id}>
            <select className="form-select" value={rule.ruleType} onChange={(e) => {
              updateTripRule(rule.id, "ruleType", e.target.value);
              handleRuleTypeChange(rule.id, e.target.value);
            }}>
              <option value="">Select Type</option>
              <option value="Void">Void</option>
              <option value="Refund">Refund</option>
              <option value="Reissue">Reissue</option>
            </select>

            <select className="form-select" name="rulename" value={rule.ruleId} onChange={(e) => {
              const selectedRuleId = e.target.value;
              const ruleTypeKey = rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE";
              const availableRules = ticketingRulesByType[ruleTypeKey] || [];
              const selectedRule = availableRules.find(tr => tr._id === selectedRuleId);
              updateTripRule(rule.id, "ruleId", selectedRuleId);
              if (selectedRule) {
                updateTripRule(rule.id, "ruleName", selectedRule.ruleName);
              }
            }}>
              {!rule.isFromBackend && !rule.ruleId && <option value="">Select Rule</option>}
              {rule.ruleType &&
                (ticketingRulesByType[
                  rule.ruleType === "Void"
                    ? "VOID"
                    : rule.ruleType === "Refund"
                      ? "REFUND"
                      : "REISSUE"
                ] || []).map((ticketRule) => (
                  <option key={ticketRule._id} value={ticketRule._id}>
                    {ticketRule.ruleName}
                  </option>
                ))}
            </select>

            {!rule.isFromBackend && (
              <button type="button" className="btn btn-sm btn-danger remove-trip-rule" onClick={() => removeTripRule(rule.id)}>Remove</button>
            )}
          </div>
        ))}
      </div>

      <button type="button" id="addTripRuleLine" className="btn btn-outline-secondary btn-sm mt-2" onClick={addTripRule}>Add Line</button>

      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-success" onClick={onSaveTicketingRules}>Save Rules</button>
      </div>
    </div>
  );
}
