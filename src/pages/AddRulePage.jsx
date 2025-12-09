  // src/pages/AddRulePage.jsx
  import React, { useState } from "react";
  import Header from "../components/layout/Header";
  import { Sidebar } from "../components/layout/Sidebar";
  import { PageWrapper } from "../components/layout/PageWrapper";

  export default function AddRulePage() {
    const [ruleName, setRuleName] = useState("");
    const [ruleType, setRuleType] = useState("Markup");
    const [provider, setProvider] = useState("Company A");
    const [appliedLayer, setAppliedLayer] = useState("Company");
    const [partnerSelection, setPartnerSelection] = useState("All Child Partners");
    const [value, setValue] = useState("");
    const [valueType, setValueType] = useState("%");

    // service checkboxes
    const [passenger, setPassenger] = useState(false);
    const [cargo, setCargo] = useState(false);
    const [vehicle, setVehicle] = useState(false);

    // dynamic lists
    const [passengerCabins, setPassengerCabins] = useState(["Economy"]);
    const [passengerTypes, setPassengerTypes] = useState(["Adult"]);
    const [cargoTypes, setCargoTypes] = useState(["General Cargo"]);
    const [vehicleTypes, setVehicleTypes] = useState(["Car"]);
    const [routes, setRoutes] = useState([ { from: "Muscat", to: "Dubai" } ]);

    // helpers for add/remove
    const addItem = (setter, arr, valueToAdd) => setter([...arr, valueToAdd]);
    const removeItem = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
    const updateItem = (setter, arr, idx, val) => setter(arr.map((a,i) => i===idx ? val : a));

    const onSave = (e) => {
      e.preventDefault();
      const payload = {
        ruleName, ruleType, provider, appliedLayer, partnerSelection, value, valueType,
        services: { passenger, cargo, vehicle },
        passengerCabins, passengerTypes, cargoTypes, vehicleTypes, routes
      };
      console.log("Save rule payload:", payload);
      alert("Rule saved (demo). Check console.");
    };

    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="content container-fluid">
            <div className="mb-3">
              <a href="/company/markup" className="btn btn-turquoise"><i className="bi bi-arrow-left"></i> Back</a>
            </div>

            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Add New Markup/Discount Rule</h5>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={onSave}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Rule Name</label>
                      <input className="form-control" value={ruleName} onChange={e=>setRuleName(e.target.value)} placeholder="Enter rule name" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Rule Type</label>
                      <select className="form-select" value={ruleType} onChange={e=>setRuleType(e.target.value)}>
                        <option>Markup</option>
                        <option>Discount</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Provider</label>
                      <select className="form-select" value={provider} onChange={e=>setProvider(e.target.value)}>
                        <option>Company A</option>
                        <option>Partner 1</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Applied to Layer</label>
                      <select className="form-select" value={appliedLayer} onChange={e=>setAppliedLayer(e.target.value)}>
                        <option>Company</option>
                        <option>Branch</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Partner</label>
                      <select className="form-select" value={partnerSelection} onChange={e=>setPartnerSelection(e.target.value)}>
                        <option>All Child Partners</option>
                        <option>Selected Partners</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Commission Value</label>
                    <div className="input-group">
                      <input type="number" className="form-control" id="valueInput" value={value} onChange={e=>setValue(e.target.value)} placeholder="Enter value" />
                      <select id="valueType" value={valueType} onChange={e=>setValueType(e.target.value)} className="form-select" style={{ maxWidth: 110 }}>
                        <option value="%">%</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Service Types</label>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" checked={passenger} onChange={e=>setPassenger(e.target.checked)} id="chkPassenger" />
                      <label className="form-check-label" htmlFor="chkPassenger">Passenger</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" checked={cargo} onChange={e=>setCargo(e.target.checked)} id="chkCargo" />
                      <label className="form-check-label" htmlFor="chkCargo">Cargo</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" checked={vehicle} onChange={e=>setVehicle(e.target.checked)} id="chkVehicle" />
                      <label className="form-check-label" htmlFor="chkVehicle">Vehicle</label>
                    </div>
                  </div>

                  {/* Passenger Section */}
                  {passenger && (
                    <div id="passengerSection" className="mb-3">
                      <label className="form-label">Passenger Cabins</label>
                      <div id="passengerCabins">
                        {passengerCabins.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e=>updateItem(setPassengerCabins, passengerCabins, idx, e.target.value)}>
                              <option>Economy</option><option>Business</option><option>First</option>
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={()=>removeItem(setPassengerCabins, passengerCabins, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setPassengerCabins, passengerCabins, "Economy")}>+ Add Cabin</button>

                      <label className="form-label mt-3">Passenger Types</label>
                      <div id="passengerTypes">
                        {passengerTypes.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e=>updateItem(setPassengerTypes, passengerTypes, idx, e.target.value)}>
                              <option>Adult</option><option>Child</option><option>Infant</option><option>Student</option><option>Senior</option>
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={()=>removeItem(setPassengerTypes, passengerTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setPassengerTypes, passengerTypes, "Adult")}>+ Add Passenger Type</button>
                    </div>
                  )}

                  {/* Cargo Section */}
                  {cargo && (
                    <div id="cargoSection" className="mb-3">
                      <label className="form-label">Cargo Types</label>
                      <div id="cargoTypes">
                        {cargoTypes.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e=>updateItem(setCargoTypes, cargoTypes, idx, e.target.value)}>
                              <option>General Cargo</option><option>Dangerous Goods</option><option>Perishable Goods</option><option>Livestock</option><option>Refrigerated</option>
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={()=>removeItem(setCargoTypes, cargoTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setCargoTypes, cargoTypes, "General Cargo")}>+ Add Cargo Type</button>
                    </div>
                  )}

                  {/* Vehicle Section */}
                  {vehicle && (
                    <div id="vehicleSection" className="mb-3">
                      <label className="form-label">Vehicle Types</label>
                      <div id="vehicleTypes">
                        {vehicleTypes.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e=>updateItem(setVehicleTypes, vehicleTypes, idx, e.target.value)}>
                              <option>Car</option><option>Truck</option><option>Motorcycle</option><option>RV</option><option>Trailer</option>
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={()=>removeItem(setVehicleTypes, vehicleTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setVehicleTypes, vehicleTypes, "Car")}>+ Add Vehicle Type</button>
                    </div>
                  )}

                  {/* Visa & Date */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Visa Type</label>
                      <select className="form-select"><option value="">Select Visa Type</option><option value="tourist">Tourist</option></select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Effective Date</label>
                      <input type="date" className="form-control" />
                    </div>
                  </div>

                  {/* Routes */}
                  <div className="mb-3">
                    <label className="form-label">Route</label>
                    <div id="routes">
                      {routes.map((r, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <input className="form-control" value={r.from} onChange={e=>updateItem(setRoutes, routes, idx, { ...r, from: e.target.value })} placeholder="From" />
                          <input className="form-control" value={r.to} onChange={e=>updateItem(setRoutes, routes, idx, { ...r, to: e.target.value })} placeholder="To" />
                          <button type="button" className="btn btn-outline-danger remove-field" onClick={()=>removeItem(setRoutes, routes, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setRoutes, routes, { from: "", to: "" })}>+ Add Route</button>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => window.history.back()}>Cancel</button>
                    <button className="btn btn-turquoise">Save Rule</button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </PageWrapper>
      </div>
    );
  }
