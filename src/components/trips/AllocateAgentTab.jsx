import React from "react";

export default function AllocateAgentTab({
  form,
  trips,
  agents,
  partners,
  selectedTripAvailability,
  loadingData,
  handleTripSelection,
  addAgent,
  removeAgent,
  addAgentLine,
  removeAgentLine,
  updateAgentLine,
  setAgents,
  onSaveAgentAllocations
}) {
  return (
    <div id="allocateAvailabilityContent">
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Select Trip for Allocation</label>
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

      <div id="agent-allocation-container">
        {agents.map((agent) => (
          <div className="agent-block" key={agent.id}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6>Agent Details</h6>
              <button 
                type="button" 
                className="btn btn-sm btn-danger remove-agent" 
                onClick={() => removeAgent(agent.id)}
              >
                Remove Agent
              </button>
            </div>

            <select 
              className="form-select mb-3" 
              value={agent.agentName} 
              onChange={(e) => {
                const selectedPartner = partners.find(p => p.name === e.target.value);
                setAgents((a) => a.map((ag) => 
                  ag.id === agent.id 
                    ? { ...ag, agentName: e.target.value, agentId: selectedPartner?._id || "" } 
                    : ag
                ));
              }}
            >
              <option value="">-- Select a Partner --</option>
              {partners.map((partner) => (
                <option key={partner._id} value={partner.name}>
                  {partner.name}
                </option>
              ))}
            </select>

            <div className="allocation-section">
              <h6>Passenger Allocation</h6>
              <div className="passenger-lines">
                {agent.passengerLines.map((line) => {
                  const selectedPassenger = selectedTripAvailability.passenger.find(p => p.cabin._id === line.select);
                  return (
                    <div className="mb-3" key={line.id}>
                      <div className="capacity-grid align-items-center">
                        <select 
                          className="form-select" 
                          value={line.select} 
                          onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "select", e.target.value)}
                        >
                          <option value="">Select</option>
                          {selectedTripAvailability.passenger.map((p) => (
                            <option key={p.cabin._id} value={p.cabin._id}>
                              {p.cabin.name} (Remaining: {p.remainingSeats})
                            </option>
                          ))}
                        </select>
                        <input 
                          className="form-control" 
                          placeholder="Qty" 
                          value={line.qty} 
                          onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "qty", e.target.value)} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger" 
                          onClick={() => removeAgentLine(agent.id, "passenger", line.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {selectedPassenger && (
                        <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                          Remaining: {selectedPassenger.remainingSeats}
                        </small>
                      )}
                    </div>
                  );
                })}
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary add-passenger-line" 
                onClick={() => addAgentLine(agent.id, "passenger")}
              >
                Add Passenger Line
              </button>
            </div>

            <div className="allocation-section">
              <h6>Cargo Allocation</h6>
              <div className="cargo-lines">
                {agent.cargoLines.map((line) => {
                  const selectedCargo = selectedTripAvailability.cargo.find(c => c.cabin._id === line.select);
                  return (
                    <div className="mb-3" key={line.id}>
                      <div className="capacity-grid align-items-center">
                        <select 
                          className="form-select" 
                          value={line.select} 
                          onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "select", e.target.value)}
                        >
                          <option value="">Select</option>
                          {selectedTripAvailability.cargo.map((c) => (
                            <option key={c.cabin._id} value={c.cabin._id}>
                              {c.cabin.name} (Remaining: {c.remainingSeats})
                            </option>
                          ))}
                        </select>
                        <input 
                          className="form-control" 
                          placeholder="Qty" 
                          value={line.qty} 
                          onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "qty", e.target.value)} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger" 
                          onClick={() => removeAgentLine(agent.id, "cargo", line.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {selectedCargo && (
                        <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                          Remaining: {selectedCargo.remainingSeats}
                        </small>
                      )}
                    </div>
                  );
                })}
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary add-cargo-line" 
                onClick={() => addAgentLine(agent.id, "cargo")}
              >
                Add Cargo Line
              </button>
            </div>

            <div className="allocation-section">
              <h6>Vehicle Allocation</h6>
              <div className="vehicle-lines">
                {agent.vehicleLines.map((line) => {
                  const selectedVehicle = selectedTripAvailability.vehicle.find(v => v.cabin._id === line.select);
                  return (
                    <div className="mb-3" key={line.id}>
                      <div className="capacity-grid align-items-center">
                        <select 
                          className="form-select" 
                          value={line.select} 
                          onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "select", e.target.value)}
                        >
                          <option value="">Select</option>
                          {selectedTripAvailability.vehicle.map((v) => (
                            <option key={v.cabin._id} value={v.cabin._id}>
                              {v.cabin.name} (Remaining: {v.remainingSeats})
                            </option>
                          ))}
                        </select>
                        <input 
                          className="form-control" 
                          placeholder="Qty" 
                          value={line.qty} 
                          onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "qty", e.target.value)} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-sm btn-danger" 
                          onClick={() => removeAgentLine(agent.id, "vehicle", line.id)}
                        >
                          Remove
                        </button>
                      </div>
                      {selectedVehicle && (
                        <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                          Remaining: {selectedVehicle.remainingSeats}
                        </small>
                      )}
                    </div>
                  );
                })}
              </div>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary add-vehicle-line" 
                onClick={() => addAgentLine(agent.id, "vehicle")}
              >
                Add Vehicle Line
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button" 
        id="addAgentLine" 
        className="btn btn-sm btn-outline-secondary" 
        onClick={addAgent}
      >
        Add Another Agent
      </button>

      <div className="text-end mt-3">
        <button 
          type="button" 
          className="btn btn-success" 
          onClick={onSaveAgentAllocations}
        >
          Save Allocation
        </button>
      </div>
    </div>
  );
}