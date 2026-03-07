import React from "react";
import TripDetailsTab from "./TripDetailsTab";
import AddAvailabilityTab from "./AddAvailabilityTab";
import AllocateAgentTab from "./AllocateAgentTab";
import TripTicketingRulesTab from "./TripTicketingRulesTab";

export default function TripTabsContainer({
  // Tab state
  mainTab,
  setMainTab,
  availInnerTab,
  setAvailInnerTab,

  // Form and trip data
  form,
  onFormChange,
  ships,
  ports,
  trips,
  partners,
  loadingData,
  
  // Availability data
  passengers,
  cargo,
  vehicles,
  selectedTripCapacity,
  selectedTripAvailability,
  
  // Agents data
  agents,
  setAgents,
  
  // Ticketing rules
  tripRules,
  ticketingRulesByType,
  
  // Handlers
  handleTripSelection,
  onSaveTrip,
  addPassenger,
  removePassenger,
  updatePassenger,
  addCargo,
  removeCargo,
  updateCargo,
  addVehicle,
  removeVehicle,
  updateVehicle,
  onSaveAvailability,
  addAgent,
  removeAgent,
  addAgentLine,
  removeAgentLine,
  updateAgentLine,
  onSaveAgentAllocations,
  addTripRule,
  removeTripRule,
  updateTripRule,
  handleRuleTypeChange,
  onSaveTicketingRules
}) {
  return (
    <div>
      {/* Main Tabs Navigation */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            id="tripDetailsBtn"
            type="button"
            className={`nav-link tab-button ${mainTab === "details" ? "active" : ""}`}
            onClick={() => setMainTab("details")}
            style={{
              backgroundColor: mainTab === "details" ? "#1abc9c" : "transparent",
              color: mainTab === "details" ? "white" : "inherit",
              border: mainTab === "details" ? "1px solid #1abc9c" : "1px solid #ccc"
            }}
          >
            Trip Details
          </button>
        </li>
        <li className="nav-item">
          <button
            id="availabilityManagementBtn"
            type="button"
            className={`nav-link tab-button ${mainTab === "availability" ? "active" : ""}`}
            onClick={() => setMainTab("availability")}
            style={{
              backgroundColor: mainTab === "availability" ? "#1abc9c" : "transparent",
              color: mainTab === "availability" ? "white" : "inherit",
              border: mainTab === "availability" ? "1px solid #1abc9c" : "1px solid #ccc"
            }}
          >
            Availability Management
          </button>
        </li>
        <li className="nav-item">
          <button
            id="tripTicketingRulesBtn"
            type="button"
            className={`nav-link tab-button ${mainTab === "ticketing" ? "active" : ""}`}
            onClick={() => setMainTab("ticketing")}
            style={{
              backgroundColor: mainTab === "ticketing" ? "#1abc9c" : "transparent",
              color: mainTab === "ticketing" ? "white" : "inherit",
              border: mainTab === "ticketing" ? "1px solid #1abc9c" : "1px solid #ccc"
            }}
          >
            Trip Ticketing Rules
          </button>
        </li>
      </ul>

      {/* Trip Details Tab */}
      {mainTab === "details" && (
        <TripDetailsTab
          form={form}
          onFormChange={onFormChange}
          onSaveTrip={onSaveTrip}
          ships={ships}
          ports={ports}
          loadingData={loadingData}
        />
      )}

      {/* Availability Management Tab */}
      {mainTab === "availability" && (
        <div id="availabilityTab">
          {/* Inner tabs for availability */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                id="addAvailabilityBtn"
                type="button"
                className={`nav-link tab-button ${availInnerTab === "add" ? "active" : ""}`}
                onClick={() => setAvailInnerTab("add")}
                style={{
                  backgroundColor: availInnerTab === "add" ? "#1abc9c" : "transparent",
                  color: availInnerTab === "add" ? "white" : "inherit",
                  border: availInnerTab === "add" ? "1px solid #1abc9c" : "1px solid #ccc"
                }}
              >
                Add Availability
              </button>
            </li>
            <li className="nav-item">
              <button
                id="allocateAvailabilityBtn"
                type="button"
                className={`nav-link tab-button ${availInnerTab === "allocate" ? "active" : ""}`}
                onClick={() => setAvailInnerTab("allocate")}
                style={{
                  backgroundColor: availInnerTab === "allocate" ? "#1abc9c" : "transparent",
                  color: availInnerTab === "allocate" ? "white" : "inherit",
                  border: availInnerTab === "allocate" ? "1px solid #1abc9c" : "1px solid #ccc"
                }}
              >
                Allocate to Agent
              </button>
            </li>
          </ul>

          {/* Add Availability Content */}
          {availInnerTab === "add" && (
            <AddAvailabilityTab
              form={form}
              trips={trips}
              passengers={passengers}
              cargo={cargo}
              vehicles={vehicles}
              selectedTripCapacity={selectedTripCapacity}
              loadingData={loadingData}
              handleTripSelection={handleTripSelection}
              addPassenger={addPassenger}
              removePassenger={removePassenger}
              updatePassenger={updatePassenger}
              addCargo={addCargo}
              removeCargo={removeCargo}
              updateCargo={updateCargo}
              addVehicle={addVehicle}
              removeVehicle={removeVehicle}
              updateVehicle={updateVehicle}
              onSaveAvailability={onSaveAvailability}
            />
          )}

          {/* Allocate to Agent Content */}
          {availInnerTab === "allocate" && (
            <AllocateAgentTab
              form={form}
              trips={trips}
              agents={agents}
              partners={partners}
              selectedTripAvailability={selectedTripAvailability}
              loadingData={loadingData}
              handleTripSelection={handleTripSelection}
              addAgent={addAgent}
              removeAgent={removeAgent}
              addAgentLine={addAgentLine}
              removeAgentLine={removeAgentLine}
              updateAgentLine={updateAgentLine}
              setAgents={setAgents}
              onSaveAgentAllocations={onSaveAgentAllocations}
            />
          )}
        </div>
      )}

      {/* Ticketing Rules Tab */}
      {mainTab === "ticketing" && (
        <TripTicketingRulesTab
          form={form}
          trips={trips}
          tripRules={tripRules}
          ticketingRulesByType={ticketingRulesByType}
          loadingData={loadingData}
          handleTripSelection={handleTripSelection}
          addTripRule={addTripRule}
          removeTripRule={removeTripRule}
          updateTripRule={updateTripRule}
          handleRuleTypeChange={handleRuleTypeChange}
          onSaveTicketingRules={onSaveTicketingRules}
        />
      )}
    </div>
  );
}