import React from "react";

export default function AddAvailabilityTab({
  form,
  trips,
  passengers,
  cargo,
  vehicles,
  selectedTripCapacity,
  loadingData,
  handleTripSelection,
  addPassenger,
  removePassenger,
  updatePassenger,
  addCargo,
  removeCargo,
  updateCargo,
  addVehicle,
  removeVehicle,
  updateVehicle,
  onSaveAvailability
}) {

  // Returns cabin names already selected in OTHER rows of the same list
  const getUsedValues = (list, valueKey, currentId) =>
    new Set(
      list
        .filter((item) => item.id !== currentId && item[valueKey])
        .map((item) => item[valueKey])
    );

  return (
    <div id="addAvailabilityContent">
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Select Trip</label>
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

      {/* ── Passenger Availability ──────────────────────────────────── */}
      <h5 className="mb-3">Passenger Availability</h5>
      <div id="passenger-availability-container">
        {passengers.map((p) => {
          const selectedCabin = selectedTripCapacity.passenger.find(
            (pc) => pc.cabinName === p.cabin
          );
          // Cabins already picked in OTHER passenger rows
          const usedCabins = getUsedValues(passengers, "cabin", p.id);
          return (
            <div className="mb-3" key={p.id}>
              <div className="capacity-grid align-items-center">
                <select
                  className="form-select"
                  value={p.cabin}
                  onChange={(e) => updatePassenger(p.id, "cabin", e.target.value)}
                >
                  <option value="">-- Select Cabin --</option>
                  {selectedTripCapacity.passenger
                    // hide cabins used in other rows; always show this row's current value
                    .filter((pc) => !usedCabins.has(pc.cabinName) || pc.cabinName === p.cabin)
                    .map((pc) => (
                      <option key={pc.cabinId} value={pc.cabinName}>
                        {pc.cabinName} (Total: {pc.totalSeat}, Remaining: {pc.remainingSeat})
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Seats"
                  value={p.seats}
                  onChange={(e) => updatePassenger(p.id, "seats", e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger remove-btn"
                  onClick={() => removePassenger(p.id)}
                >
                  Remove
                </button>
              </div>
              {selectedCabin && (
                <small className="text-danger" style={{ display: "block", marginTop: "5px" }}>
                  Remaining Seats: {selectedCabin.remainingSeat}
                </small>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        id="addPassengerLine"
        className="btn btn-sm btn-outline-secondary"
        onClick={addPassenger}
      >
        Add Line
      </button>

      {/* ── Cargo Availability ──────────────────────────────────────── */}
      <h5 className="mt-4">Cargo Availability</h5>
      <div id="cargo-availability-container">
        {cargo.map((c) => {
          const selectedHold = selectedTripCapacity.cargo.find(
            (cc) => cc.cabinName === c.type
          );
          const usedTypes = getUsedValues(cargo, "type", c.id);
          return (
            <div className="mb-3" key={c.id}>
              <div className="capacity-grid align-items-center">
                <select
                  className="form-select"
                  value={c.type}
                  onChange={(e) => updateCargo(c.id, "type", e.target.value)}
                >
                  <option value="">-- Select Hold --</option>
                  {selectedTripCapacity.cargo
                    .filter((cc) => !usedTypes.has(cc.cabinName) || cc.cabinName === c.type)
                    .map((cc) => (
                      <option key={cc.cabinId} value={cc.cabinName}>
                        {cc.cabinName} (Total: {cc.totalSeat}, Remaining: {cc.remainingSeat})
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Spots"
                  value={c.spots}
                  onChange={(e) => updateCargo(c.id, "spots", e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger remove-btn"
                  onClick={() => removeCargo(c.id)}
                >
                  Remove
                </button>
              </div>
              {selectedHold && (
                <small className="text-danger" style={{ display: "block", marginTop: "5px" }}>
                  Remaining Spots: {selectedHold.remainingSeat}
                </small>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        id="addCargoLine"
        className="btn btn-sm btn-outline-secondary"
        onClick={addCargo}
      >
        Add Line
      </button>

      {/* ── Vehicle Availability ────────────────────────────────────── */}
      <h5 className="mt-4">Vehicle Availability</h5>
      <div id="vehicle-availability-container">
        {vehicles.map((v) => {
          const selectedVehicle = selectedTripCapacity.vehicle.find(
            (vc) => vc.cabinName === v.type
          );
          const usedVehicleTypes = getUsedValues(vehicles, "type", v.id);
          return (
            <div className="mb-3" key={v.id}>
              <div className="capacity-grid align-items-center">
                <select
                  className="form-select"
                  value={v.type}
                  onChange={(e) => updateVehicle(v.id, "type", e.target.value)}
                >
                  <option value="">-- Select Vehicle Type --</option>
                  {selectedTripCapacity.vehicle
                    .filter((vc) => !usedVehicleTypes.has(vc.cabinName) || vc.cabinName === v.type)
                    .map((vc) => (
                      <option key={vc.cabinId} value={vc.cabinName}>
                        {vc.cabinName} (Total: {vc.totalSeat}, Remaining: {vc.remainingSeat})
                      </option>
                    ))}
                </select>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Spots"
                  value={v.spots}
                  onChange={(e) => updateVehicle(v.id, "spots", e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger remove-btn"
                  onClick={() => removeVehicle(v.id)}
                >
                  Remove
                </button>
              </div>
              {selectedVehicle && (
                <small className="text-danger" style={{ display: "block", marginTop: "5px" }}>
                  Remaining Spots: {selectedVehicle.remainingSeat}
                </small>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        id="addVehicleLine"
        className="btn btn-sm btn-outline-secondary"
        onClick={addVehicle}
      >
        Add Line
      </button>

      <div className="text-end mt-3">
        <button
          type="button"
          className="btn btn-success"
          onClick={onSaveAvailability}
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}