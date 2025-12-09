import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

/**
 * AddCommissionPage
 * - keeps all original classes / ids
 * - attaches the same DOM-based handlers that the HTML page used:
 *   - checkbox toggles for passenger/cargo/vehicle sections
 *   - dynamic add/remove fields for cabins/types/routes
 * - this approach keeps generated DOM structure identical to HTML/CSS expectations
 */
export default function AddCommissionPage() {
  useEffect(() => {
    // Helper: toggle section visibility by class 'd-none'
    const passengerCheckbox = document.getElementById("chkPassenger");
    const cargoCheckbox = document.getElementById("chkCargo");
    const vehicleCheckbox = document.getElementById("chkVehicle");

    function toggleSection(cb, sectionId) {
      if (!cb) return;
      const section = document.getElementById(sectionId);
      const handler = (e) => {
        if (!section) return;
        section.classList.toggle("d-none", !e.target.checked);
      };
      cb.addEventListener("change", handler);
      // run initial state
      handler({ target: cb });
      return () => cb.removeEventListener("change", handler);
    }

    const cleanups = [];
    cleanups.push(toggleSection(passengerCheckbox, "passengerSection"));
    cleanups.push(toggleSection(cargoCheckbox, "cargoSection"));
    cleanups.push(toggleSection(vehicleCheckbox, "vehicleSection"));

    // addField function (same markup as original)
    function addField(containerId, optionsHtml) {
      const container = document.getElementById(containerId);
      if (!container) return null;
      const div = document.createElement("div");
      div.className = "input-group mb-2";
      div.innerHTML = `<select class="form-select">${optionsHtml}</select>
        <button class="btn btn-outline-danger remove-field">&times;</button>`;
      container.appendChild(div);
      return div;
    }

    // attach click handlers for add buttons
    const addPassengerCabinBtn = document.getElementById("addPassengerCabin");
    const addPassengerTypeBtn = document.getElementById("addPassengerType");
    const addCargoTypeBtn = document.getElementById("addCargoType");
    const addVehicleTypeBtn = document.getElementById("addVehicleType");
    const addRouteBtn = document.getElementById("addRoute");

    const onAddPassengerCabin = () =>
      addField("passengerCabins", "<option>Economy</option><option>Business</option><option>First</option>");
    const onAddPassengerType = () =>
      addField("passengerTypes", "<option>Adult</option><option>Child</option><option>Infant</option><option>Student</option><option>Senior</option>");
    const onAddCargoType = () =>
      addField("cargoTypes", "<option>General Cargo</option><option>Dangerous Goods</option><option>Perishable Goods</option><option>Livestock</option><option>Refrigerated</option>");
    const onAddVehicleType = () =>
      addField("vehicleTypes", "<option>Car</option><option>Truck</option><option>Motorcycle</option><option>RV</option><option>Trailer</option>");
    const onAddRoute = () => {
      const container = document.getElementById("routes");
      if (!container) return;
      const div = document.createElement("div");
      div.className = "input-group mb-2";
      div.innerHTML = `
        <input type="text" class="form-control" placeholder="From">
        <input type="text" class="form-control" placeholder="To">
        <button class="btn btn-outline-danger remove-field">&times;</button>`;
      container.appendChild(div);
    };

    if (addPassengerCabinBtn) addPassengerCabinBtn.addEventListener("click", onAddPassengerCabin);
    if (addPassengerTypeBtn) addPassengerTypeBtn.addEventListener("click", onAddPassengerType);
    if (addCargoTypeBtn) addCargoTypeBtn.addEventListener("click", onAddCargoType);
    if (addVehicleTypeBtn) addVehicleTypeBtn.addEventListener("click", onAddVehicleType);
    if (addRouteBtn) addRouteBtn.addEventListener("click", onAddRoute);

    // Remove field: delegate
    function onDocumentClickForRemove(e) {
      if (!(e.target instanceof Element)) return;
      if (e.target.classList.contains("remove-field")) {
        const parent = e.target.parentElement;
        if (parent) parent.remove();
      }
    }
    document.addEventListener("click", onDocumentClickForRemove);

    // cleanup on unmount
    return () => {
      cleanups.forEach((fn) => fn && fn());
      if (addPassengerCabinBtn) addPassengerCabinBtn.removeEventListener("click", onAddPassengerCabin);
      if (addPassengerTypeBtn) addPassengerTypeBtn.removeEventListener("click", onAddPassengerType);
      if (addCargoTypeBtn) addCargoTypeBtn.removeEventListener("click", onAddCargoType);
      if (addVehicleTypeBtn) addVehicleTypeBtn.removeEventListener("click", onAddVehicleType);
      if (addRouteBtn) addRouteBtn.removeEventListener("click", onAddRoute);
      document.removeEventListener("click", onDocumentClickForRemove);
    };
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <style>{`
            .route-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
            .delete-route { cursor:pointer; color:red; font-size:18px; }
          `}</style>

          {/* Back Button */}
          <div className="mb-3">
            <a href="/company/commission" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back
            </a>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Commission Rule</h5>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Rule Name</label>
                      <input type="text" className="form-control" placeholder="Enter rule name" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Commission Provider</label>
                      <select className="form-select">
                        <option>Company A</option>
                        <option>Partner 1</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Applied to Layer</label>
                      <select className="form-select">
                        <option>Company</option>
                        <option>Marine Agent</option>
                        <option>Commercial Agent</option>
                        <option>Selling Agent</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Partner</label>
                      <select className="form-select">
                        <option>All Child Partners</option>
                        <option>Partner1</option>
                        <option>Partner2</option>
                        <option>Partner3</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Commission Value</label>
                    <div className="input-group">
                      <input type="number" className="form-control" id="valueInput" placeholder="Enter value" />
                      <select id="valueType" style={{ border: "1px solid #dee2e6" }}>
                        <option value="%">%</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Service Types</label>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input service-checkbox" type="checkbox" id="chkPassenger" />
                      <label className="form-check-label" htmlFor="chkPassenger">Passenger</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input service-checkbox" type="checkbox" id="chkCargo" />
                      <label className="form-check-label" htmlFor="chkCargo">Cargo</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input service-checkbox" type="checkbox" id="chkVehicle" />
                      <label className="form-check-label" htmlFor="chkVehicle">Vehicle</label>
                    </div>
                  </div>

                  {/* Passenger Section (hidden by default with d-none) */}
                  <div id="passengerSection" className="mb-3 d-none">
                    <label className="form-label">Passenger Cabins</label>
                    <div id="passengerCabins">
                      <div className="input-group mb-2">
                        <select className="form-select">
                          <option>Economy</option>
                          <option>Business</option>
                          <option>First</option>
                        </select>
                        <button className="btn btn-outline-danger remove-field">&times;</button>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary" id="addPassengerCabin">+ Add Cabin</button>
                    <br />
                    <label className="form-label mt-3">Passenger Types</label>
                    <div id="passengerTypes">
                      <div className="input-group mb-2">
                        <select className="form-select">
                          <option>Adult</option>
                          <option>Child</option>
                          <option>Infant</option>
                          <option>Student</option>
                          <option>Senior</option>
                        </select>
                        <button className="btn btn-outline-danger remove-field">&times;</button>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary" id="addPassengerType">+ Add Passenger Type</button>
                  </div>

                  {/* Cargo Section */}
                  <div id="cargoSection" className="mb-3 d-none">
                    <label className="form-label">Cargo Types</label>
                    <div id="cargoTypes">
                      <div className="input-group mb-2">
                        <select className="form-select">
                          <option>General Cargo</option>
                          <option>Dangerous Goods</option>
                          <option>Perishable Goods</option>
                          <option>Livestock</option>
                          <option>Refrigerated</option>
                        </select>
                        <button className="btn btn-outline-danger remove-field">&times;</button>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary" id="addCargoType">+ Add Cargo Type</button>
                  </div>

                  {/* Vehicle Section */}
                  <div id="vehicleSection" className="mb-3 d-none">
                    <label className="form-label">Vehicle Types</label>
                    <div id="vehicleTypes">
                      <div className="input-group mb-2">
                        <select className="form-select">
                          <option>Car</option>
                          <option>Truck</option>
                          <option>Motorcycle</option>
                          <option>RV</option>
                          <option>Trailer</option>
                        </select>
                        <button className="btn btn-outline-danger remove-field">&times;</button>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-primary" id="addVehicleType">+ Add Vehicle Type</button>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Visa Type</label>
                      <select className="form-select">
                        <option value="">Select Visa Type</option>
                        <option value="tourist">Tourist</option>
                        <option value="transit">Transit</option>
                        <option value="business">Business</option>
                        <option value="student">Student</option>
                        <option value="work">Work</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Effective Date</label>
                      <input type="date" className="form-control" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Route</label>
                    <div id="routes">
                      <div className="input-group mb-2">
                        <input type="text" className="form-control" placeholder="Muscat" />
                        <input type="text" className="form-control" placeholder="Dubai" />
                        <button className="btn btn-outline-danger remove-field">&times;</button>
                      </div>
                    </div>
                    <a className="btn btn-sm btn-primary" id="addRoute" style={{ cursor: "pointer" }}>+ Add Route</a>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary me-2">Cancel</button>
                    <button className="btn btn-turquoise">Save Rule</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
