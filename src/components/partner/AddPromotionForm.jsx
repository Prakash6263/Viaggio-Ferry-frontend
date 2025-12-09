import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPromotionForm() {
  const navigate = useNavigate();

  // Basic
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("active");

  // basis: "period" or "trip"
  const [basis, setBasis] = useState("period");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [trip, setTrip] = useState("");

  // service toggles
  const [enablePassenger, setEnablePassenger] = useState(false);
  const [enableCargo, setEnableCargo] = useState(false);
  const [enableVehicle, setEnableVehicle] = useState(false);

  // benefit types
  const [passengerType, setPassengerType] = useState("quantity");
  const [cargoType, setCargoType] = useState("quantity");
  const [vehicleType, setVehicleType] = useState("quantity");

  // passenger benefit
  const [pBuyQty, setPBuyQty] = useState(1);
  const [pFreeQty, setPFreeQty] = useState(1);
  const [pValueMin, setPValueMin] = useState("");
  const [pDiscountVal, setPDiscountVal] = useState("");
  const [pDiscountUnit, setPDiscountUnit] = useState("percentage");
  const [pConds, setPConds] = useState([{ id: 1, type: "adult", cabin: "economy" }]);

  // cargo benefit
  const [cBuyQty, setCBuyQty] = useState(1);
  const [cFreeQty, setCFreeQty] = useState(1);
  const [cValueMin, setCValueMin] = useState("");
  const [cDiscountVal, setCDiscountVal] = useState("");
  const [cDiscountUnit, setCDiscountUnit] = useState("percentage");
  const [cConds, setCConds] = useState([{ id: 1, cargo: "general" }]);

  // vehicle benefit
  const [vBuyQty, setVBuyQty] = useState(1);
  const [vFreeQty, setVFreeQty] = useState(1);
  const [vValueMin, setVValueMin] = useState("");
  const [vDiscountVal, setVDiscountVal] = useState("");
  const [vDiscountUnit, setVDiscountUnit] = useState("percentage");
  const [vConds, setVConds] = useState([{ id: 1, vehicle: "car" }]);

  const addPCond = () => setPConds((a) => [...a, { id: Date.now(), type: "adult", cabin: "economy" }]);
  const rmPCond = (id) => setPConds((a) => a.filter((x) => x.id !== id));

  const addCCond = () => setCConds((a) => [...a, { id: Date.now(), cargo: "general" }]);
  const rmCCond = (id) => setCConds((a) => a.filter((x) => x.id !== id));

  const addVCond = () => setVConds((a) => [...a, { id: Date.now(), vehicle: "car" }]);
  const rmVCond = (id) => setVConds((a) => a.filter((x) => x.id !== id));

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name, desc, status,
      basis, period: { startAt, endAt }, trip,
      passenger: enablePassenger ? { type: passengerType, pBuyQty, pFreeQty, pValueMin, pDiscountVal, pDiscountUnit, conditions: pConds } : null,
      cargo: enableCargo ? { type: cargoType, cBuyQty, cFreeQty, cValueMin, cDiscountVal, cDiscountUnit, conditions: cConds } : null,
      vehicle: enableVehicle ? { type: vehicleType, vBuyQty, vFreeQty, vValueMin, vDiscountVal, vDiscountUnit, conditions: vConds } : null,
    };
    console.log("Save promotion:", payload);
    navigate("/company/partner-management/promotions");
  };

  return (
    <form id="promotion-form" onSubmit={onSubmit}>
      {/* Basic Promotion Details */}
      <div className="form-group">
        <label htmlFor="promo-name">Promotion Name</label>
        <input id="promo-name" className="form-control" placeholder="e.g., Summer Travel Special"
               value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="promo-desc">Description</label>
        <textarea id="promo-desc" className="form-control" placeholder="Brief description of the promotion"
                  value={desc} onChange={(e) => setDesc(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="promo-status">Active Status</label>
        <select id="promo-status" className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      {/* Promotion Basis */}
      <div className="form-group">
        <label>Promotion Basis</label>
        <div className="radio-group">
          <label><input type="radio" name="basis" value="period" checked={basis === "period"} onChange={() => setBasis("period")} /> Based on Period</label>
          <label><input type="radio" name="basis" value="trip" checked={basis === "trip"} onChange={() => setBasis("trip")} /> Based on Trip</label>
        </div>

        {/* Period fields */}
        <div id="period-basis" className="basis-fields" style={{ display: basis === "period" ? "block" : "none" }}>
          <div className="form-group">
            <label htmlFor="start-date">Start Date & Time</label>
            <input id="start-date" type="datetime-local" className="form-control" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">End Date & Time</label>
            <input id="end-date" type="datetime-local" className="form-control" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
          </div>
        </div>

        {/* Trip fields */}
        <div id="trip-basis" className="basis-fields" style={{ display: basis === "trip" ? "block" : "none" }}>
          <div className="form-group">
            <label htmlFor="trip-select">Select Trip</label>
            <select id="trip-select" className="form-control" value={trip} onChange={(e) => setTrip(e.target.value)}>
              <option value="">-- Select a Trip --</option>
              <option value="morning-express">Morning Express</option>
              <option value="afternoon-cruiser">Afternoon Cruiser</option>
              <option value="evening-sunset">Evening Sunset</option>
              <option value="midnight-ferry">Midnight Ferry</option>
              <option value="weekend-getaway">Weekend Getaway</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==== Benefits & Eligibility (Passenger / Cargo / Vehicle) ==== */}
      <div className="service-benefit-section">
        <h2 className="service-benefit-title"><i className="fas fa-gift"></i> Promotion Benefits & Eligibility</h2>

        {/* Passenger */}
        <div className="service-benefit-card">
          <div className="service-benefit-header"><h3><i className="fas fa-users"></i> Passenger Tickets</h3></div>
          <div className="service-benefit-body">
            <div className="service-enable">
              <input id="passenger-benefit-enabled" type="checkbox" className="service-checkbox" checked={enablePassenger} onChange={(e) => setEnablePassenger(e.target.checked)} />
              <label htmlFor="passenger-benefit-enabled">Enable promotion for passenger tickets</label>
            </div>

            {enablePassenger && (
              <>
                <div className="benefit-type-selector">
                  <label><input type="radio" name="passenger-benefit-type" value="quantity" checked={passengerType === "quantity"} onChange={() => setPassengerType("quantity")} /> Based on Ticket Quantity</label>
                  <label><input type="radio" name="passenger-benefit-type" value="value" checked={passengerType === "value"} onChange={() => setPassengerType("value")} /> Based on Total Ticket Value</label>
                </div>

                {passengerType === "quantity" ? (
                  <div id="passenger-quantity-benefit" className="benefit-fields">
                    <div className="form-group"><label>Buy X Tickets</label><input type="number" className="form-control" min="1" value={pBuyQty} onChange={(e) => setPBuyQty(+e.target.value || 0)} /></div>
                    <div className="form-group"><label>Get Y Tickets Free</label><input type="number" className="form-control" min="1" value={pFreeQty} onChange={(e) => setPFreeQty(+e.target.value || 0)} /></div>
                  </div>
                ) : (
                  <div id="passenger-value-benefit" className="benefit-fields">
                    <div className="form-group"><label>Buy Total Value</label><input type="number" step="any" className="form-control" placeholder="Minimum purchase amount" value={pValueMin} onChange={(e) => setPValueMin(e.target.value)} /></div>
                    <div className="form-group">
                      <label>Gets Discount</label>
                      <div className="discount-input-group">
                        <input type="number" step="any" className="form-control" placeholder="Discount amount" value={pDiscountVal} onChange={(e) => setPDiscountVal(e.target.value)} />
                        <select className="form-control" value={pDiscountUnit} onChange={(e) => setPDiscountUnit(e.target.value)}>
                          <option value="percentage">%</option>
                          <option value="fixed">$</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                <div className="service-eligibility">
                  <h4 className="service-eligibility-title"><i className="fas fa-user-check"></i> Eligibility Conditions</h4>
                  <div className="conditions-list" id="passenger-conditions">
                    {pConds.map((c) => (
                      <div key={c.id} className="condition-row">
                        <select className="form-control" value={c.type} onChange={(e) => setPConds((arr) => arr.map(x => x.id === c.id ? { ...x, type: e.target.value } : x))}>
                          <option value="adult">Adult</option><option value="child">Child</option><option value="senior">Senior</option><option value="student">Student</option>
                        </select>
                        <select className="form-control" value={c.cabin} onChange={(e) => setPConds((arr) => arr.map(x => x.id === c.id ? { ...x, cabin: e.target.value } : x))}>
                          <option value="economy">Economy</option><option value="business">Business</option><option value="suite">Suite</option>
                        </select>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => rmPCond(c.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" id="add-passenger-condition" className="btn btn-primary" onClick={addPCond}><i className="fas fa-plus"></i> Add Condition</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cargo */}
        <div className="service-benefit-card">
          <div className="service-benefit-header"><h3><i className="fas fa-box"></i> Cargo Tickets</h3></div>
          <div className="service-benefit-body">
            <div className="service-enable">
              <input id="cargo-benefit-enabled" type="checkbox" className="service-checkbox" checked={enableCargo} onChange={(e) => setEnableCargo(e.target.checked)} />
              <label htmlFor="cargo-benefit-enabled">Enable promotion for cargo tickets</label>
            </div>

            {enableCargo && (
              <>
                <div className="benefit-type-selector">
                  <label><input type="radio" name="cargo-benefit-type" value="quantity" checked={cargoType === "quantity"} onChange={() => setCargoType("quantity")} /> Based on Ticket Quantity</label>
                  <label><input type="radio" name="cargo-benefit-type" value="value" checked={cargoType === "value"} onChange={() => setCargoType("value")} /> Based on Total Ticket Value</label>
                </div>

                {cargoType === "quantity" ? (
                  <div id="cargo-quantity-benefit" className="benefit-fields">
                    <div className="form-group"><label>Buy X Tickets</label><input type="number" className="form-control" min="1" value={cBuyQty} onChange={(e) => setCBuyQty(+e.target.value || 0)} /></div>
                    <div className="form-group"><label>Get Y Tickets Free</label><input type="number" className="form-control" min="1" value={cFreeQty} onChange={(e) => setCFreeQty(+e.target.value || 0)} /></div>
                  </div>
                ) : (
                  <div id="cargo-value-benefit" className="benefit-fields">
                    <div className="form-group"><label>Buy Total Value</label><input type="number" step="any" className="form-control" placeholder="Minimum purchase amount" value={cValueMin} onChange={(e) => setCValueMin(e.target.value)} /></div>
                    <div className="form-group">
                      <label>Gets Discount</label>
                      <div className="discount-input-group">
                        <input type="number" step="any" className="form-control" placeholder="Discount amount" value={cDiscountVal} onChange={(e) => setCDiscountVal(e.target.value)} />
                        <select className="form-control" value={cDiscountUnit} onChange={(e) => setCDiscountUnit(e.target.value)}>
                          <option value="percentage">%</option><option value="fixed">$</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cargo eligibility */}
                <div className="service-eligibility">
                  <h4 className="service-eligibility-title"><i className="fas fa-user-check"></i> Eligibility Conditions</h4>
                  <div className="conditions-list" id="cargo-conditions">
                    {cConds.map((c) => (
                      <div key={c.id} className="condition-row">
                        <select className="form-control" value={c.cargo} onChange={(e) => setCConds((arr) => arr.map(x => x.id === c.id ? { ...x, cargo: e.target.value } : x))}>
                          <option value="general">General Goods</option><option value="hazardous">Hazardous</option><option value="refrigerated">Refrigerated</option><option value="oversized">Oversized</option>
                        </select>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => rmCCond(c.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" id="add-cargo-condition" className="btn btn-primary" onClick={addCCond}><i className="fas fa-plus"></i> Add Condition</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Vehicle */}
        <div className="service-benefit-card">
          <div className="service-benefit-header"><h3><i className="fas fa-car"></i> Vehicle Tickets</h3></div>
          <div className="service-benefit-body">
            <div className="service-enable">
              <input id="vehicle-benefit-enabled" type="checkbox" className="service-checkbox" checked={enableVehicle} onChange={(e) => setEnableVehicle(e.target.checked)} />
              <label htmlFor="vehicle-benefit-enabled">Enable promotion for vehicle tickets</label>
            </div>

            {enableVehicle && (
              <>
                <div className="benefit-type-selector">
                  <label><input type="radio" name="vehicle-benefit-type" value="quantity" checked={vehicleType === "quantity"} onChange={() => setVehicleType("quantity")} /> Based on Ticket Quantity</label>
                  <label><input type="radio" name="vehicle-benefit-type" value="value" checked={vehicleType === "value"} onChange={() => setVehicleType("value")} /> Based on Total Ticket Value</label>
                </div>

                {vehicleType === "quantity" ? (
                  <div id="vehicle-quantity-benefit" className="benefit-fields">
                    <div className="form-group"><label>Buy X Tickets</label><input type="number" className="form-control" min="1" value={vBuyQty} onChange={(e) => setVBuyQty(+e.target.value || 0)} /></div>
                    <div className="form-group"><label>Get Y Tickets Free</label><input type="number" className="form-control" min="1" value={vFreeQty} onChange={(e) => setVFreeQty(+e.target.value || 0)} /></div>
                  </div>
                ) : (
                  <div id="vehicle-value-benefit" className="benefit-fields">
                    <div className="form-group"><label>Buy Total Value</label><input type="number" step="any" className="form-control" placeholder="Minimum purchase amount" value={vValueMin} onChange={(e) => setVValueMin(e.target.value)} /></div>
                    <div className="form-group">
                      <label>Gets Discount</label>
                      <div className="discount-input-group">
                        <input type="number" step="any" className="form-control" placeholder="Discount amount" value={vDiscountVal} onChange={(e) => setVDiscountVal(e.target.value)} />
                        <select className="form-control" value={vDiscountUnit} onChange={(e) => setVDiscountUnit(e.target.value)}>
                          <option value="percentage">%</option><option value="fixed">$</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicle eligibility */}
                <div className="service-eligibility">
                  <h4 className="service-eligibility-title"><i className="fas fa-user-check"></i> Eligibility Conditions</h4>
                  <div className="conditions-list" id="vehicle-conditions">
                    {vConds.map((c) => (
                      <div key={c.id} className="vehicle-condition-row">
                        <select className="form-control" value={c.vehicle} onChange={(e) => setVConds((arr) => arr.map(x => x.id === c.id ? { ...x, vehicle: e.target.value } : x))}>
                          <option value="car">Car</option><option value="motorcycle">Motorcycle</option><option value="rv">RV</option><option value="truck">Truck</option>
                        </select>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => rmVCond(c.id)}><i className="fas fa-trash"></i></button>
                      </div>
                    ))}
                  </div>
                  <button type="button" id="add-vehicle-condition" className="btn btn-primary" onClick={addVCond}><i className="fas fa-plus"></i> Add Condition</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Cancel</button>
      <button type="submit" className="btn btn-turquoise" id="save-promotion-btn">Save Promotion</button>
    </form>
  );
}
