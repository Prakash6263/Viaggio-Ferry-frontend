import React from "react";
import EditTripDetailsTab from "./EditTripDetailsTab";
import EditAvailabilityManagement from "./EditAvailabilityManagement";
import EditTripTicketingRulesTab from "./EditTripTicketingRulesTab";

export default function EditTripTabsContainer({
  mainTab,
  setMainTab,
  availInnerTab,
  setAvailInnerTab,
  form,
  onFormChange,
  onStatusChange,
  ships,
  ports,
  loadingData,
  passengers,
  cargo,
  vehicles,
  selectedTripCapacity,
  selectedTripAvailability,
  updatePassenger,
  removePassenger,
  addPassenger,
  updateCargo,
  removeCargo,
  addCargo,
  updateVehicle,
  removeVehicle,
  addVehicle,
  onSaveAvailability,
  agents,
  partners,
  setAgents,
  removeAgent,
  removeAgentLine,
  updateAgentLine,
  addAgentLine,
  addAgent,
  updateExistingAgentAllocation,
  onSaveAgentAllocations,
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
    <div>
      {/* preserve small style block for capacity-grid etc. */}
      <style>{`
        .hidden { display: none !important; }
        .capacity-grid { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 1rem; }
        @media (max-width: 767px) { .capacity-grid { grid-template-columns: 1fr; } }
        .allocation-section { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
        .agent-block { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
      `}</style>

      <div>
        {/* Main Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              id="tripDetailsBtn"
              className={`nav-link tab-button ${mainTab === "details" ? "active" : ""}`}
              onClick={() => setMainTab("details")}
            >
              Trip Details
            </button>
          </li>
          <li className="nav-item">
            <button
              id="availabilityBtn"
              className={`nav-link tab-button ${mainTab === "availability" ? "active" : ""}`}
              onClick={() => setMainTab("availability")}
            >
              Availability Management
            </button>
          </li>
          <li className="nav-item">
            <button
              id="tripTicketingRulesBtn"
              className={`nav-link tab-button ${mainTab === "ticketing" ? "active" : ""}`}
              onClick={() => setMainTab("ticketing")}
            >
              Trip Ticketing Rules
            </button>
          </li>
        </ul>

        {/* Trip Details */}
        <div className={mainTab === "details" ? "" : "hidden"}>
          <EditTripDetailsTab
            form={form}
            onFormChange={onFormChange}
            onStatusChange={onStatusChange}
            ships={ships}
            ports={ports}
            loadingData={loadingData}
          />
        </div>

        {/* Availability Management */}
        <div className={mainTab === "availability" ? "" : "hidden"}>
          <EditAvailabilityManagement
            availInnerTab={availInnerTab}
            setAvailInnerTab={setAvailInnerTab}
            passengers={passengers}
            cargo={cargo}
            vehicles={vehicles}
            selectedTripCapacity={selectedTripCapacity}
            selectedTripAvailability={selectedTripAvailability}
            agents={agents}
            partners={partners}
            updatePassenger={updatePassenger}
            removePassenger={removePassenger}
            addPassenger={addPassenger}
            updateCargo={updateCargo}
            removeCargo={removeCargo}
            addCargo={addCargo}
            updateVehicle={updateVehicle}
            removeVehicle={removeVehicle}
            addVehicle={addVehicle}
            setAgents={setAgents}
            removeAgent={removeAgent}
            removeAgentLine={removeAgentLine}
            updateAgentLine={updateAgentLine}
            addAgentLine={addAgentLine}
            addAgent={addAgent}
            updateExistingAgentAllocation={updateExistingAgentAllocation}
            onSaveAvailability={onSaveAvailability}
            onSaveAgentAllocations={onSaveAgentAllocations}
          />
        </div>

        {/* Trip Ticketing Rules */}
        <div className={mainTab === "ticketing" ? "" : "hidden"}>
          <EditTripTicketingRulesTab
            tripRules={tripRules}
            ticketingRulesByType={ticketingRulesByType}
            assignedTripRules={assignedTripRules}
            updateTripRule={updateTripRule}
            handleRuleTypeChange={handleRuleTypeChange}
            removeTripRule={removeTripRule}
            addTripRule={addTripRule}
            onSaveTicketingRules={onSaveTicketingRules}
          />
        </div>
      </div>
    </div>
  );
}
