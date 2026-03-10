import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { companyApi } from "../api/companyapi";
import { usersApi } from "../api/usersApi";
import { partnerApi } from "../api/partnerApi";
import { portApi } from "../api/portApi";

// Helper function to decode JWT and get role
const getLoginRoleFromToken = () => {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return null

    const decoded = JSON.parse(atob(token.split(".")[1]))
    return decoded.role || decoded.userType || decoded.layer || decoded.type || decoded.accountType
  } catch (error) {
    console.error("[v0] Error decoding token:", error)
    return null
  }
}

/**
 * AddCommissionPage
 * - keeps all original classes / ids
 * - attaches the same DOM-based handlers that the HTML page used:
 *   - checkbox toggles for passenger/cargo/vehicle sections
 *   - dynamic add/remove fields for cabins/types/routes
 * - this approach keeps generated DOM structure identical to HTML/CSS expectations
 */
export default function AddCommissionPage() {
  const [ruleName, setRuleName] = useState("");
  const [provider, setProvider] = useState("");
  const [appliedLayer, setAppliedLayer] = useState("");
  const [partnerSelection, setPartnerSelection] = useState("All Child Partners");
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState("%");
  const [visaType, setVisaType] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginRole, setLoginRole] = useState(null);
  const [childPartners, setChildPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [ports, setPorts] = useState([]);
  const [loadingPorts, setLoadingPorts] = useState(false);

  // Determine login role from JWT token
  useEffect(() => {
    const role = getLoginRoleFromToken();
    setLoginRole(role);
  }, []);

  // Initialize provider and layer from API based on login role
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setLoading(true);
        
        if (loginRole === "user") {
          // For user login: Get company name from user's company object and user's layer
          const response = await usersApi.getCurrentProfile();
          
          if (response.success && response.data) {
            const userData = response.data;
            const providerName = userData.company?.companyName || "Unknown";
            const userLayer = userData.layer || userData.role || "Company";
            
            setProvider(providerName);
            setAppliedLayer(userLayer.charAt(0).toUpperCase() + userLayer.slice(1).toLowerCase());
            
            console.log("[v0] User profile loaded - Provider:", providerName, "Layer:", userLayer);
          }
        } else if (loginRole === "company") {
          // For company login: Get company name and set layer as "Company"
          const response = await companyApi.getCompanyProfile();
          
          if (response.data) {
            const companyData = response.data;
            const providerName = companyData.companyName || "Unknown";
            
            setProvider(providerName);
            setAppliedLayer("Company");
            
            console.log("[v0] Company profile loaded - Provider:", providerName, "Layer: Company");
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load profile data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (loginRole) {
      initializeUserData();
    }
  }, [loginRole]);

  // Fetch child partners from API
  useEffect(() => {
    const fetchChildPartners = async () => {
      try {
        setLoadingPartners(true);
        const response = await partnerApi.getChildPartners(1, 100, "Active");
        
        if (response.success && response.data) {
          setChildPartners(response.data);
          console.log("[v0] Child partners loaded:", response.data.length, "partners");
        }
      } catch (error) {
        console.error("[v0] Failed to load child partners:", error.message);
      } finally {
        setLoadingPartners(false);
      }
    };
    
    fetchChildPartners();
  }, []);

  // Fetch ports from API
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        setLoadingPorts(true);
        const response = await portApi.getPorts(1, 100);
        
        if (response.success && response.data && response.data.ports) {
          setPorts(response.data.ports);
          console.log("[v0] Ports loaded:", response.data.ports.length, "ports");
        }
      } catch (error) {
        console.error("[v0] Failed to load ports:", error.message);
      } finally {
        setLoadingPorts(false);
      }
    };
    
    fetchPorts();
  }, []);

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
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter rule name"
                        value={ruleName}
                        onChange={e => setRuleName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Commission Provider</label>
                      <input 
                        className="form-control" 
                        value={provider} 
                        readOnly 
                        placeholder={loading ? "Loading..." : "No provider"}
                        disabled={loading}
                        title="Provider is automatically set to your company/profile name"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Applied to Layer</label>
                      <select 
                        className="form-select"
                        value={appliedLayer}
                        onChange={e => setAppliedLayer(e.target.value)}
                      >
                        <option value="">Select Layer</option>
                        <option value="Marine">Marine</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Selling">Selling</option>
                        <option value="company">company</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Partner</label>
                      <select 
                        className="form-select"
                        value={partnerSelection}
                        onChange={e => setPartnerSelection(e.target.value)}
                        disabled={loadingPartners}
                      >
                        <option value="All Child Partners">All Child Partners</option>
                        {childPartners && childPartners.map((partner) => (
                          <option key={partner._id} value={partner.name}>
                            {partner.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Commission Value</label>
                    <div className="input-group">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="valueInput" 
                        placeholder="Enter value"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                      />
                      <select 
                        id="valueType" 
                        style={{ border: "1px solid #dee2e6" }}
                        value={valueType}
                        onChange={e => setValueType(e.target.value)}
                      >
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
                      <select 
                        className="form-select"
                        value={visaType}
                        onChange={e => setVisaType(e.target.value)}
                      >
                        <option value="">Select Visa Type</option>
                        <option value="Tourist">Tourist</option>
                        <option value="Transit">Transit</option>
                        <option value="Business">Business</option>
                        <option value="Student">Student</option>
                        <option value="Work">Work</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Effective Date</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={effectiveDate}
                        onChange={e => setEffectiveDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Route</label>
                    <div id="routes">
                      <div className="input-group mb-2">
                        <select className="form-select" disabled={loadingPorts}>
                          <option value="">From</option>
                          {ports && ports.map((port) => (
                            <option key={port._id} value={port.name}>
                              {port.name}
                            </option>
                          ))}
                        </select>
                        <select className="form-select" disabled={loadingPorts}>
                          <option value="">To</option>
                          {ports && ports.map((port) => (
                            <option key={port._id} value={port.name}>
                              {port.name}
                            </option>
                          ))}
                        </select>
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
