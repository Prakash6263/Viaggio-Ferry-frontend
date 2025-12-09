import React, { useState } from "react";

const makeId = () => Date.now() + Math.random();

export default function AddTripForm() {
  // Tab control
  const [activeTab, setActiveTab] = useState("details"); // details | availability | ticketing

  // Main trip fields
  const [form, setForm] = useState({
    code: "",
    vessel: "",
    departurePort: "",
    arrivalPort: "",
    departureAt: "",
    arrivalAt: "",
    status: "Scheduled",
    bookingOpen: "",
    bookingClose: "",
    checkinOpen: "",
    checkinClose: "",
    boardingClose: "",
    promotion: "",
    remarks: ""
  });

  // availability arrays
  const [passengers, setPassengers] = useState([{ id: makeId(), cabin: "First class", seats: "" }]);
  const [cargo, setCargo] = useState([{ id: makeId(), type: "Pallet", spots: "" }]);
  const [vehicles, setVehicles] = useState([{ id: makeId(), type: "Car", spots: "" }]);

  // allocation to agents (array of agent objects with their allocations)
  const [agents, setAgents] = useState([{
    id: makeId(),
    agentName: "Agent Alpha",
    passengerLines: [{ id: makeId(), select: "", qty: "" }],
    cargoLines: [{ id: makeId(), select: "", qty: "" }],
    vehicleLines: [{ id: makeId(), select: "", qty: "" }]
  }]);

  // trip rules
  const [tripRules, setTripRules] = useState([{ id: makeId(), ruleType: "Void", ruleName: "" }]);

  // handlers for main form
  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  // availability handlers
  const addPassenger = () => setPassengers(a => [...a, { id: makeId(), cabin: "First class", seats: "" }]);
  const removePassenger = (id) => setPassengers(a => a.filter(x => x.id !== id));
  const updatePassenger = (id, key, value) => setPassengers(a => a.map(x => x.id === id ? { ...x, [key]: value } : x));

  const addCargo = () => setCargo(a => [...a, { id: makeId(), type: "Pallet", spots: "" }]);
  const removeCargo = (id) => setCargo(a => a.filter(x => x.id !== id));
  const updateCargo = (id, key, value) => setCargo(a => a.map(x => x.id === id ? { ...x, [key]: value } : x));

  const addVehicle = () => setVehicles(a => [...a, { id: makeId(), type: "Car", spots: "" }]);
  const removeVehicle = (id) => setVehicles(a => a.filter(x => x.id !== id));
  const updateVehicle = (id, key, value) => setVehicles(a => a.map(x => x.id === id ? { ...x, [key]: value } : x));

  // agents handlers
  const addAgent = () => setAgents(a => [...a, {
    id: makeId(),
    agentName: "",
    passengerLines: [{ id: makeId(), select: "", qty: "" }],
    cargoLines: [{ id: makeId(), select: "", qty: "" }],
    vehicleLines: [{ id: makeId(), select: "", qty: "" }]
  }]);
  const removeAgent = (id) => setAgents(a => a.filter(x => x.id !== id));
  const addAgentLine = (agentId, section) => {
    setAgents(a => a.map(ag => {
      if (ag.id !== agentId) return ag;
      const newLine = { id: makeId(), select: "", qty: "" };
      return { ...ag, [`${section}Lines`]: [...ag[`${section}Lines`], newLine] };
    }));
  };
  const removeAgentLine = (agentId, section, lineId) => {
    setAgents(a => a.map(ag => ag.id === agentId ? { ...ag, [`${section}Lines`]: ag[`${section}Lines`].filter(l => l.id !== lineId) } : ag));
  };
  const updateAgentLine = (agentId, section, lineId, key, value) => {
    setAgents(a => a.map(ag => {
      if (ag.id !== agentId) return ag;
      return {
        ...ag,
        [`${section}Lines`]: ag[`${section}Lines`].map(l => l.id === lineId ? { ...l, [key]: value } : l)
      };
    }));
  };

  // trip rules handlers
  const addRule = () => setTripRules(r => [...r, { id: makeId(), ruleType: "Void", ruleName: "" }]);
  const removeRule = (id) => setTripRules(r => r.filter(x => x.id !== id));
  const updateRule = (id, key, value) => setTripRules(r => r.map(x => x.id === id ? { ...x, [key]: value } : x));

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { form, passengers, cargo, vehicles, agents, tripRules };
    console.log("Trip submit payload:", payload);
    alert("Trip saved (mock). Check console.");
    // TODO: call API then navigate back
  };

  return (
    <form onSubmit={onSubmit}>
      {/* Tabs (buttons) */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button type="button" className={`nav-link tab-button ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>Trip Details</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link tab-button ${activeTab === "availability" ? "active" : ""}`} onClick={() => setActiveTab("availability")}>Availability Management</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link tab-button ${activeTab === "ticketing" ? "active" : ""}`} onClick={() => setActiveTab("ticketing")}>Trip Ticketing Rules</button>
        </li>
      </ul>

      {/* Trip Details */}
      {activeTab === "details" && (
        <div id="tripDetailsTab">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Trip Name/Code</label>
              <input name="code" value={form.code} onChange={onChange} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Assign Vessel</label>
              <select name="vessel" value={form.vessel} onChange={onChange} className="form-select">
                <option value="">Example Ship 1</option>
                <option value="ship2">Example Ship 2</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Departure Port</label>
              <select name="departurePort" value={form.departurePort} onChange={onChange} className="form-select">
                <option value="dubai">Dubai</option>
                <option value="muscat">Muscat</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Arrival Port</label>
              <select name="arrivalPort" value={form.arrivalPort} onChange={onChange} className="form-select">
                <option value="muscat">Muscat</option>
                <option value="dubai">Dubai</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Departure Date & Time</label>
              <input name="departureAt" value={form.departureAt} onChange={onChange} type="datetime-local" className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Arrival Date & Time</label>
              <input name="arrivalAt" value={form.arrivalAt} onChange={onChange} type="datetime-local" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={onChange} className="form-select">
                <option>Scheduled</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Booking Opening Date</label>
              <input name="bookingOpen" value={form.bookingOpen} onChange={onChange} type="datetime-local" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Booking Closing Date</label>
              <input name="bookingClose" value={form.bookingClose} onChange={onChange} type="datetime-local" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Check-in Opening Date</label>
              <input name="checkinOpen" value={form.checkinOpen} onChange={onChange} type="datetime-local" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Check-in Closing Date</label>
              <input name="checkinClose" value={form.checkinClose} onChange={onChange} type="datetime-local" className="form-control" />
            </div>

            <div className="col-md-6">
              <label className="form-label">Boarding Closing Date</label>
              <input name="boardingClose" value={form.boardingClose} onChange={onChange} type="datetime-local" className="form-control" />
            </div>

            <div className="col-md-12">
              <label className="form-label">Promotion</label>
              <select name="promotion" value={form.promotion} onChange={onChange} className="form-select">
                <option value="">None</option>
                <option value="discount10">Discount 10%</option>
                <option value="earlybird">Early Bird</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Remarks/Notes</label>
              <textarea name="remarks" value={form.remarks} onChange={onChange} className="form-control" rows={3} />
            </div>

            <div className="d-flex justify-content-end mt-3 col-12">
              <button type="submit" className="btn btn-turquoise">Save Trip</button>
            </div>
          </div>
        </div>
      )}

      {/* Availability Management */}
      {activeTab === "availability" && (
        <div id="availabilityTab">
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button type="button" className="nav-link tab-button active">Add Availability</button>
            </li>
            <li className="nav-item">
              <button type="button" className="nav-link tab-button">Allocate to Agent</button>
            </li>
          </ul>

          {/* Add Availability */}
          <div id="addAvailabilityContent">
            <h5 className="mb-3">Passenger Availability</h5>
            <div id="passenger-availability-container">
              {passengers.map(p => (
                <div className="capacity-grid align-items-center mb-2" key={p.id}>
                  <select className="form-select" value={p.cabin} onChange={(e) => updatePassenger(p.id, "cabin", e.target.value)}>
                    <option>First class</option>
                    <option>Economy</option>
                  </select>
                  <input className="form-control" placeholder="Seats" value={p.seats} onChange={(e) => updatePassenger(p.id, "seats", e.target.value)} />
                  <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removePassenger(p.id)}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addPassenger}>Add Line</button>

            <h5 className="mt-4">Cargo Availability</h5>
            <div id="cargo-availability-container">
              {cargo.map(c => (
                <div className="capacity-grid align-items-center mb-2" key={c.id}>
                  <select className="form-select" value={c.type} onChange={(e) => updateCargo(c.id, "type", e.target.value)}>
                    <option>Pallet</option>
                    <option>Container</option>
                  </select>
                  <input className="form-control" placeholder="Spots" value={c.spots} onChange={(e) => updateCargo(c.id, "spots", e.target.value)} />
                  <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removeCargo(c.id)}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addCargo}>Add Line</button>

            <h5 className="mt-4">Vehicle Availability</h5>
            <div id="vehicle-availability-container">
              {vehicles.map(v => (
                <div className="capacity-grid align-items-center mb-2" key={v.id}>
                  <select className="form-select" value={v.type} onChange={(e) => updateVehicle(v.id, "type", e.target.value)}>
                    <option>Car</option>
                    <option>Truck</option>
                  </select>
                  <input className="form-control" placeholder="Spots" value={v.spots} onChange={(e) => updateVehicle(v.id, "spots", e.target.value)} />
                  <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removeVehicle(v.id)}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addVehicle}>Add Line</button>

            {/* Agent Allocation */}
            <h5 className="mt-4">Allocate to Agent</h5>
            <div id="agent-allocation-container">
              {agents.map(agent => (
                <div className="agent-block" key={agent.id}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Agent Details</h6>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgent(agent.id)}>Remove Agent</button>
                  </div>

                  <select className="form-select mb-3" value={agent.agentName} onChange={(e) => {
                    const val = e.target.value;
                    setAgents(a => a.map(ag => ag.id === agent.id ? { ...ag, agentName: val } : ag));
                  }}>
                    <option>Agent Alpha</option>
                    <option>Agent Beta</option>
                  </select>

                  <div className="allocation-section">
                    <h6>Passenger Allocation</h6>
                    <div className="passenger-lines">
                      {agent.passengerLines.map(line => (
                        <div className="capacity-grid align-items-center mb-2" key={line.id}>
                          <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "select", e.target.value)}>
                            <option>Select</option>
                          </select>
                          <input className="form-control" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "qty", e.target.value)} placeholder="Qty" />
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "passenger", line.id)}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addAgentLine(agent.id, "passenger")}>Add Passenger Line</button>
                  </div>

                  <div className="allocation-section">
                    <h6>Cargo Allocation</h6>
                    <div className="cargo-lines">
                      {agent.cargoLines.map(line => (
                        <div className="capacity-grid align-items-center mb-2" key={line.id}>
                          <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "select", e.target.value)}>
                            <option>Select</option>
                          </select>
                          <input className="form-control" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "qty", e.target.value)} placeholder="Qty" />
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "cargo", line.id)}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addAgentLine(agent.id, "cargo")}>Add Cargo Line</button>
                  </div>

                  <div className="allocation-section">
                    <h6>Vehicle Allocation</h6>
                    <div className="vehicle-lines">
                      {agent.vehicleLines.map(line => (
                        <div className="capacity-grid align-items-center mb-2" key={line.id}>
                          <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "select", e.target.value)}>
                            <option>Select</option>
                          </select>
                          <input className="form-control" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "qty", e.target.value)} placeholder="Qty" />
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "vehicle", line.id)}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => addAgentLine(agent.id, "vehicle")}>Add Vehicle Line</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={addAgent}>Add Another Agent</button>

            <div className="text-end mt-3">
              <button type="button" className="btn btn-success" onClick={() => alert("Availability saved (mock)")}>Save Availability</button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Ticketing Rules */}
      {activeTab === "ticketing" && (
        <div id="tripTicketingRulesTab">
          <h5 className="mb-3">Trip Ticketing Rules</h5>
          <div id="trip-rules-container">
            {tripRules.map(rule => (
              <div className="capacity-grid align-items-center mb-2" key={rule.id}>
                <select className="form-select" value={rule.ruleType} onChange={(e) => updateRule(rule.id, "ruleType", e.target.value)}>
                  <option>Void</option>
                  <option>Refund</option>
                  <option>Reissue</option>
                </select>
                <select className="form-select" name="rulename" value={rule.ruleName} onChange={(e) => updateRule(rule.id, "ruleName", e.target.value)}>
                  <option>Select Rule</option>
                  <option>Rule1</option>
                  <option>Rule2</option>
                </select>
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeRule(rule.id)}>Remove</button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-outline-secondary btn-sm mt-2" onClick={addRule}>Add Line</button>

          <div className="d-flex justify-content-end mt-3">
            <button type="submit" className="btn btn-success">Save Trip</button>
          </div>
        </div>
      )}
    </form>
  );
}
