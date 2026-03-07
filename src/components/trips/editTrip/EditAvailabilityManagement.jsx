import React from "react";
import EditAddAvailabilityTab from "./EditAddAvailabilityTab";
import EditAllocateAgentTab from "./EditAllocateAgentTab";

export default function EditAvailabilityManagement({
  availInnerTab,
  setAvailInnerTab,
  passengers,
  cargo,
  vehicles,
  selectedTripCapacity,
  selectedTripAvailability,
  agents,
  partners,
  updatePassenger,
  removePassenger,
  addPassenger,
  updateCargo,
  removeCargo,
  addCargo,
  updateVehicle,
  removeVehicle,
  addVehicle,
  setAgents,
  removeAgent,
  removeAgentLine,
  updateAgentLine,
  addAgentLine,
  addAgent,
  updateExistingAgentAllocation,
  onSaveAvailability,
  onSaveAgentAllocations
}) {
  return (
    <div id="availabilityTab">
      {/* Inner tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            id="addAvailabilityBtn"
            className={`nav-link tab-button ${availInnerTab === "add" ? "active" : ""}`}
            onClick={() => setAvailInnerTab("add")}
          >
            Add Availability
          </button>
        </li>
        <li className="nav-item">
          <button
            id="allocateAvailabilityBtn"
            className={`nav-link tab-button ${availInnerTab === "allocate" ? "active" : ""}`}
            onClick={() => setAvailInnerTab("allocate")}
          >
            Allocate to Agent
          </button>
        </li>
      </ul>

      {/* Add Availability Content */}
      {availInnerTab === "add" && (
        <EditAddAvailabilityTab
          passengers={passengers}
          cargo={cargo}
          vehicles={vehicles}
          selectedTripCapacity={selectedTripCapacity}
          updatePassenger={updatePassenger}
          removePassenger={removePassenger}
          addPassenger={addPassenger}
          updateCargo={updateCargo}
          removeCargo={removeCargo}
          addCargo={addCargo}
          updateVehicle={updateVehicle}
          removeVehicle={removeVehicle}
          addVehicle={addVehicle}
          onSaveAvailability={onSaveAvailability}
        />
      )}

      {/* Allocate to Agent Content */}
      {availInnerTab === "allocate" && (
        <EditAllocateAgentTab
          agents={agents}
          partners={partners}
          selectedTripAvailability={selectedTripAvailability}
          setAgents={setAgents}
          removeAgent={removeAgent}
          removeAgentLine={removeAgentLine}
          updateAgentLine={updateAgentLine}
          addAgentLine={addAgentLine}
          addAgent={addAgent}
          updateExistingAgentAllocation={updateExistingAgentAllocation}
          onSaveAgentAllocations={onSaveAgentAllocations}
        />
      )}
    </div>
  );
}
