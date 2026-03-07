import React from "react";

export default function TripTicketingRulesTab({
  form,
  trips,
  tripRules,
  ticketingRulesByType,
  loadingData,
  handleTripSelection,
  addTripRule,
  removeTripRule,
  updateTripRule,
  handleRuleTypeChange,
  onSaveTicketingRules
}) {
  return (
    <div id="tripTicketingRulesTab">
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Select Trip for Rules</label>
          <select 
            className="form-select" 
            value={form.trip || ""} 
            onChange={(e) => handleTripSelection(e.target.value)}
          >
            <option value="">-- Select a Trip --</option>
            {trips.map((trip) => (
              <option key={trip._id} value={trip._id}>
                {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
              </option>
            ))}
          </select>
          {loadingData && <small className="text-muted">Loading trips...</small>}
        </div>
      </div>

      <h5 className="mb-3">Trip Ticketing Rules</h5>

      <div id="trip-rules-container">
        {tripRules.map((rule) => (
          <div className="capacity-grid align-items-center mb-2" key={rule.id}>
            <select 
              className="form-select" 
              value={rule.ruleType} 
              onChange={(e) => {
                updateTripRule(rule.id, "ruleType", e.target.value);
                handleRuleTypeChange(rule.id, e.target.value);
              }}
            >
              <option value="">Select Type</option>
              <option value="Void">Void</option>
              <option value="Refund">Refund</option>
              <option value="Reissue">Reissue</option>
            </select>

            <select 
              className="form-select" 
              name="rulename" 
              value={rule.ruleName} 
              onChange={(e) => updateTripRule(rule.id, "ruleName", e.target.value)}
            >
              <option value="">Select Rule</option>
              {rule.ruleType && ticketingRulesByType[rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE"]?.map((ticketRule) => (
                <option key={ticketRule._id} value={ticketRule.ruleName}>
                  {ticketRule.ruleName} ({ticketRule.ruleType})
                </option>
              ))}
            </select>

            <button 
              type="button" 
              className="btn btn-sm btn-danger remove-trip-rule" 
              onClick={() => removeTripRule(rule.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button 
        type="button" 
        id="addTripRuleLine" 
        className="btn btn-outline-secondary btn-sm mt-2" 
        onClick={addTripRule}
      >
        Add Line
      </button>

      <div className="d-flex justify-content-end mt-3">
        <button 
          type="button" 
          className="btn btn-success" 
          onClick={onSaveTicketingRules}
        >
          Save Rules
        </button>
      </div>
    </div>
  );
}