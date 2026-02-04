import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function emptyPassengerRow() {
  return { id: Date.now() + Math.random(), cabin: "First class", weight: "", seats: "" };
}
function emptyCargoRow() {
  return { id: Date.now() + Math.random(), type: "Pallet", weight: "", spots: "" };
}
function emptyVehicleRow() {
  return { id: Date.now() + Math.random(), type: "Car", weight: "", spots: "" };
}

export default function AddShipForm() {
  const navigate = useNavigate();

  // general info
  const [form, setForm] = useState({
    name: "",
    imo: "",
    mmsi: "",
    flag: "",
    type: "",
    year: "",
    classification: "",
    status: "Active",
    remarks: "",
    gt: "",
    nt: "",
    loa: "",
    beam: "",
    draft: "",
  });

  const [passengers, setPassengers] = useState([emptyPassengerRow()]);
  const [cargo, setCargo] = useState([emptyCargoRow()]);
  const [vehicles, setVehicles] = useState([emptyVehicleRow()]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const addPassenger = () => setPassengers((a) => [...a, emptyPassengerRow()]);
  const removePassenger = (id) => setPassengers((a) => a.filter((r) => r.id !== id));
  const updatePassenger = (id, key, value) => setPassengers((a) => a.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const addCargo = () => setCargo((a) => [...a, emptyCargoRow()]);
  const removeCargo = (id) => setCargo((a) => a.filter((r) => r.id !== id));
  const updateCargo = (id, key, value) => setCargo((a) => a.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const addVehicle = () => setVehicles((a) => [...a, emptyVehicleRow()]);
  const removeVehicle = (id) => setVehicles((a) => a.filter((r) => r.id !== id));
  const updateVehicle = (id, key, value) => setVehicles((a) => a.map((r) => (r.id === id ? { ...r, [key]: value } : r)));

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, passengers, cargo, vehicles };
    console.log("Save Ship payload:", payload);
    // TODO: replace with API call
    // simulate save and navigate back
    alert("Ship saved (mock). Check console.");
    navigate("/company/ship-trip/ships");
  };

  return (
    <form onSubmit={onSubmit}>
      {/* General Information */}
      <div className="section-box" style={{border:"none"}}>
        <h6>General Information</h6>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Ship Name</label>
            <input type="text" className="form-control" name="name" value={form.name} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label>Ship IMO Number</label>
            <input type="text" className="form-control" name="imo" value={form.imo} onChange={onChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Ship MMSI Number</label>
            <input type="text" className="form-control" name="mmsi" value={form.mmsi} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label>Flag State / Registration Country</label>
            <input type="text" className="form-control" name="flag" value={form.flag} onChange={onChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Ship Type</label>
            <input type="text" className="form-control" name="type" value={form.type} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label>Year Built</label>
            <input type="text" className="form-control" name="year" value={form.year} onChange={onChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label>Classification Society</label>
            <input type="text" className="form-control" name="classification" value={form.classification} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label>Active/Inactive Status</label>
            <select className="form-select" name="status" value={form.status} onChange={onChange}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label>Remarks/Notes</label>
          <textarea className="form-control" rows="3" name="remarks" value={form.remarks} onChange={onChange} />
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Technical Specifications</h6>
        <div className="row mb-3">
          <div className="col-md-4">
            <label>Gross Tonnage (GT)</label>
            <input type="text" className="form-control" name="gt" value={form.gt} onChange={onChange} />
          </div>
          <div className="col-md-4">
            <label>Net Tonnage (NT)</label>
            <input type="text" className="form-control" name="nt" value={form.nt} onChange={onChange} />
          </div>
          <div className="col-md-4">
            <label>Length Overall (LOA) (in meters)</label>
            <input type="text" className="form-control" name="loa" value={form.loa} onChange={onChange} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Beam (in meters)</label>
            <input type="text" className="form-control" name="beam" value={form.beam} onChange={onChange} />
          </div>
          <div className="col-md-6">
            <label>Draft (in meters)</label>
            <input type="text" className="form-control" name="draft" value={form.draft} onChange={onChange} />
          </div>
        </div>
      </div>

      {/* Passenger Capacity */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Passenger Capacity</h6>
        <div id="passengerContainer">
          {passengers.map((r) => (
            <div className="row mb-2 passenger-row" key={r.id}>
              <div className="col-md-3">
                <label>Cabin</label>
                <select className="form-select" value={r.cabin} onChange={(e) => updatePassenger(r.id, "cabin", e.target.value)}>
                  <option>First class</option>
                  <option>Business</option>
                  <option>Economy</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Total Weight kg (Calculated)</label>
                <input type="text" className="form-control" value={r.weight} onChange={(e) => updatePassenger(r.id, "weight", e.target.value)} />
              </div>
              <div className="col-md-3">
                <label>Number of Seats</label>
                <input type="text" className="form-control" value={r.seats} onChange={(e) => updatePassenger(r.id, "seats", e.target.value)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="button" className="btn btn-danger btn-sm remove-line" onClick={() => removePassenger(r.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm" id="addPassenger" onClick={addPassenger}>Add Line</button>
      </div>

      {/* Cargo Capacity */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Cargo Capacity</h6>
        <div id="cargoContainer">
          {cargo.map((r) => (
            <div className="row mb-2 cargo-row" key={r.id}>
              <div className="col-md-3">
                <label>Type</label>
                <select className="form-select" value={r.type} onChange={(e) => updateCargo(r.id, "type", e.target.value)}>
                  <option>Pallet</option>
                  <option>Container</option>
                  <option>Bulk</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Total Weight (metric tons)</label>
                <input type="text" className="form-control" value={r.weight} onChange={(e) => updateCargo(r.id, "weight", e.target.value)} />
              </div>
              <div className="col-md-3">
                <label>Spots</label>
                <input type="text" className="form-control" value={r.spots} onChange={(e) => updateCargo(r.id, "spots", e.target.value)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="button" className="btn btn-danger btn-sm remove-line" onClick={() => removeCargo(r.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm" id="addCargo" onClick={addCargo}>Add Line</button>
      </div>

      {/* Vehicle Capacity */}
      <div className="section-box mb-3" style={{border:"none"}}>
        <h6>Vehicle Capacity</h6>
        <div id="vehicleContainer">
          {vehicles.map((r) => (
            <div className="row mb-2 vehicle-row" key={r.id}>
              <div className="col-md-3">
                <label>Type</label>
                <select className="form-select" value={r.type} onChange={(e) => updateVehicle(r.id, "type", e.target.value)}>
                  <option>Car</option>
                  <option>Bus</option>
                  <option>Truck</option>
                </select>
              </div>
              <div className="col-md-3">
                <label>Total Weight (metric tons)</label>
                <input type="text" className="form-control" value={r.weight} onChange={(e) => updateVehicle(r.id, "weight", e.target.value)} />
              </div>
              <div className="col-md-3">
                <label>Spots</label>
                <input type="text" className="form-control" value={r.spots} onChange={(e) => updateVehicle(r.id, "spots", e.target.value)} />
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <button type="button" className="btn btn-danger btn-sm remove-line" onClick={() => removeVehicle(r.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-outline-primary btn-sm" id="addVehicle" onClick={addVehicle}>Add Line</button>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-start mt-4">
        <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Back</button>
        <button type="submit" className="btn btn-turquoise">Save Ship</button>
      </div>
    </form>
  );
}
