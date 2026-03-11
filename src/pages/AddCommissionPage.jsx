import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { companyApi } from "../api/companyapi";
import { usersApi } from "../api/usersApi";
import { partnerApi } from "../api/partnerApi";
import { portsApi } from "../api/portsApi";
import { cabinsApi } from "../api/cabinsApi";
import { payloadTypesApi } from "../api/payloadTypesApi";

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
  const [cabins, setCabins] = useState([]);
  const [loadingCabins, setLoadingCabins] = useState(false);
  const [passengerPayloadTypes, setPassengerPayloadTypes] = useState([]);
  const [cargoPayloadTypes, setCargoPayloadTypes] = useState([]);
  const [vehiclePayloadTypes, setVehiclePayloadTypes] = useState([]);
  const [loadingPayloadTypes, setLoadingPayloadTypes] = useState(false);
  const [showCabinDropdown, setShowCabinDropdown] = useState(false);
  const [selectedCabins, setSelectedCabins] = useState([]);

  // Handle cabin selection with checkmarks
  const handleCabinToggle = (cabinId) => {
    setSelectedCabins(prev => 
      prev.includes(cabinId) 
        ? prev.filter(id => id !== cabinId)
        : [...prev, cabinId]
    );
  };

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
        const response = await portsApi.getPorts(1, 100);
        
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

  // Fetch cabins from API - fetch all cabins for commission rules
  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoadingCabins(true);
        const response = await cabinsApi.getCabins(1, 100, "", "");
        
        // Handle different response formats
        let cabinsList = [];
        if (response?.data?.cabins && Array.isArray(response.data.cabins)) {
          cabinsList = response.data.cabins;
        } else if (Array.isArray(response?.data)) {
          cabinsList = response.data;
        } else if (Array.isArray(response)) {
          cabinsList = response;
        }
        
        setCabins(cabinsList);
        console.log("[v0] Cabins loaded:", cabinsList.length, "cabins");
      } catch (error) {
        console.error("[v0] Failed to load cabins:", error.message);
        setCabins([]);
      } finally {
        setLoadingCabins(false);
      }
    };
    
    fetchCabins();
  }, []);

  // Fetch payload types for all categories
  useEffect(() => {
    const fetchPayloadTypes = async () => {
      try {
        setLoadingPayloadTypes(true);
        
        // Fetch passenger payload types
        const passengerResponse = await payloadTypesApi.getPayloadTypes(1, 100, "passenger");
        const passengerTypes = passengerResponse?.data?.payloadTypes || [];
        setPassengerPayloadTypes(passengerTypes);
        console.log("[v0] Passenger payload types loaded:", passengerTypes.length);
        
        // Fetch cargo payload types
        const cargoResponse = await payloadTypesApi.getPayloadTypes(1, 100, "cargo");
        const cargoTypes = cargoResponse?.data?.payloadTypes || [];
        setCargoPayloadTypes(cargoTypes);
        console.log("[v0] Cargo payload types loaded:", cargoTypes.length);
        
        // Fetch vehicle payload types
        const vehicleResponse = await payloadTypesApi.getPayloadTypes(1, 100, "vehicle");
        const vehicleTypes = vehicleResponse?.data?.payloadTypes || [];
        setVehiclePayloadTypes(vehicleTypes);
        console.log("[v0] Vehicle payload types loaded:", vehicleTypes.length);
      } catch (error) {
        console.error("[v0] Failed to load payload types:", error.message);
        setPassengerPayloadTypes([]);
        setCargoPayloadTypes([]);
        setVehiclePayloadTypes([]);
      } finally {
        setLoadingPayloadTypes(false);
      }
    };
    
    fetchPayloadTypes();
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

    // Cabin dropdown handlers
    const passengerCabinSelect = document.getElementById("passengerCabinSelect");
    const cargoCabinSelect = document.getElementById("cargoCabinSelect");
    const vehicleCabinSelect = document.getElementById("vehicleCabinSelect");

    // Payload type dropdown handlers
    const passengerPayloadTypeSelect = document.getElementById("passengerPayloadTypeSelect");
    const cargoPayloadTypeSelect = document.getElementById("cargoPayloadTypeSelect");
    const vehiclePayloadTypeSelect = document.getElementById("vehiclePayloadTypeSelect");

    const onCabinSelectChange = (selectElem, containerId) => {
      return (e) => {
        if (e.target.value) {
          addField(containerId, `<option>${e.target.value}</option>`);
          e.target.value = "";
        }
      };
    };

    const onPayloadTypeSelectChange = (selectElem, containerId) => {
      return (e) => {
        if (e.target.value) {
          addField(containerId, `<option>${e.target.value}</option>`);
          e.target.value = "";
        }
      };
    };

    if (passengerCabinSelect) passengerCabinSelect.addEventListener("change", onCabinSelectChange(passengerCabinSelect, "passengerCabins"));
    if (cargoCabinSelect) cargoCabinSelect.addEventListener("change", onCabinSelectChange(cargoCabinSelect, "cargoTypes"));
    if (vehicleCabinSelect) vehicleCabinSelect.addEventListener("change", onCabinSelectChange(vehicleCabinSelect, "vehicleTypes"));
    
    if (passengerPayloadTypeSelect) passengerPayloadTypeSelect.addEventListener("change", onPayloadTypeSelectChange(passengerPayloadTypeSelect, "passengerTypes"));
    if (cargoPayloadTypeSelect) cargoPayloadTypeSelect.addEventListener("change", onPayloadTypeSelectChange(cargoPayloadTypeSelect, "cargoTypes"));
    if (vehiclePayloadTypeSelect) vehiclePayloadTypeSelect.addEventListener("change", onPayloadTypeSelectChange(vehiclePayloadTypeSelect, "vehicleTypes"));

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
      if (passengerCabinSelect) passengerCabinSelect.removeEventListener("change", onCabinSelectChange(passengerCabinSelect, "passengerCabins"));
      if (cargoCabinSelect) cargoCabinSelect.removeEventListener("change", onCabinSelectChange(cargoCabinSelect, "cargoTypes"));
      if (vehicleCabinSelect) vehicleCabinSelect.removeEventListener("change", onCabinSelectChange(vehicleCabinSelect, "vehicleTypes"));
      if (passengerPayloadTypeSelect) passengerPayloadTypeSelect.removeEventListener("change", onPayloadTypeSelectChange(passengerPayloadTypeSelect, "passengerTypes"));
      if (cargoPayloadTypeSelect) cargoPayloadTypeSelect.removeEventListener("change", onPayloadTypeSelectChange(cargoPayloadTypeSelect, "cargoTypes"));
      if (vehiclePayloadTypeSelect) vehiclePayloadTypeSelect.removeEventListener("change", onPayloadTypeSelectChange(vehiclePayloadTypeSelect, "vehicleTypes"));
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

                  {/* Cabin Selection Button with Dropdown */}
                  <div className="mb-3" style={{ position: "relative" }}>
                    <label className="form-label d-block">Select Cabins for Commission</label>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <button 
                        type="button"
                        className="btn btn-turquoise"
                        onClick={() => setShowCabinDropdown(!showCabinDropdown)}
                        style={{ minWidth: "200px", textAlign: "left" }}
                      >
                        <i className="fa fa-cabin me-2"></i>
                        {selectedCabins.length > 0 ? `${selectedCabins.length} Cabin(s) Selected` : "Select Cabins"}
                        <i className={`fa fa-chevron-down ms-2`} style={{ float: "right" }}></i>
                      </button>
                      {selectedCabins.length > 0 && (
                        <span className="badge bg-success">{selectedCabins.length}</span>
                      )}
                    </div>

                    {/* Dropdown with Checkboxes */}
                    {showCabinDropdown && (
                      <div style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                        minWidth: "300px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        marginTop: "5px"
                      }}>
                        {loadingCabins ? (
                          <div style={{ padding: "15px", textAlign: "center" }}>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Loading cabins...
                          </div>
                        ) : cabins && cabins.length > 0 ? (
                          <div style={{ padding: "10px" }}>
                            {cabins.map((cabin) => (
                              <div key={cabin._id} style={{ padding: "8px 10px" }} className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`cabin-${cabin._id}`}
                                  checked={selectedCabins.includes(cabin._id)}
                                  onChange={() => handleCabinToggle(cabin._id)}
                                  style={{ cursor: "pointer" }}
                                />
                                <label 
                                  htmlFor={`cabin-${cabin._id}`}
                                  style={{ cursor: "pointer", marginLeft: "8px", marginBottom: 0, flex: 1 }}
                                >
                                  {cabin.name || cabin.cabinName}
                                  <span style={{ fontSize: "0.85em", color: "#666", marginLeft: "8px" }}>
                                    ({cabin.type})
                                  </span>
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ padding: "15px", textAlign: "center", color: "#666" }}>
                            No cabins available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selected Cabins Display */}
                  {selectedCabins.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">Selected Cabins</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {cabins.filter(c => selectedCabins.includes(c._id)).map((cabin) => (
                          <div 
                            key={cabin._id}
                            style={{
                              backgroundColor: "#e8f4f8",
                              border: "1px solid #20c997",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px"
                            }}
                          >
                            <i className="fa fa-check" style={{ color: "#20c997" }}></i>
                            <span>{cabin.name || cabin.cabinName}</span>
                            <button
                              type="button"
                              onClick={() => handleCabinToggle(cabin._id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#20c997",
                                cursor: "pointer",
                                fontSize: "18px",
                                marginLeft: "4px",
                                padding: 0
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                    <label className="form-label">Select Cabin</label>
                    <select 
                      className="form-select mb-3" 
                      id="passengerCabinSelect"
                      disabled={loadingCabins}
                    >
                      <option value="">Select Cabin to Add</option>
                      {cabins && cabins.filter(c => c.type === 'passenger').map((cabin) => (
                        <option key={cabin._id} value={cabin.name || cabin.cabinName}>
                          {cabin.name || cabin.cabinName}
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Select Payload Type</label>
                    <select 
                      className="form-select mb-3" 
                      id="passengerPayloadTypeSelect"
                      disabled={loadingPayloadTypes}
                    >
                      <option value="">Select Payload Type to Add</option>
                      {passengerPayloadTypes && passengerPayloadTypes.map((payloadType) => (
                        <option key={payloadType._id} value={payloadType.name}>
                          {payloadType.name} ({payloadType.code})
                        </option>
                      ))}
                    </select>

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
                    <label className="form-label">Select Cabin</label>
                    <select 
                      className="form-select mb-3" 
                      id="cargoCabinSelect"
                      disabled={loadingCabins}
                    >
                      <option value="">Select Cabin to Add</option>
                      {cabins && cabins.filter(c => c.type === 'cargo').map((cabin) => (
                        <option key={cabin._id} value={cabin.name || cabin.cabinName}>
                          {cabin.name || cabin.cabinName}
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Select Payload Type</label>
                    <select 
                      className="form-select mb-3" 
                      id="cargoPayloadTypeSelect"
                      disabled={loadingPayloadTypes}
                    >
                      <option value="">Select Payload Type to Add</option>
                      {cargoPayloadTypes && cargoPayloadTypes.map((payloadType) => (
                        <option key={payloadType._id} value={payloadType.name}>
                          {payloadType.name} ({payloadType.code})
                        </option>
                      ))}
                    </select>

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
                    <label className="form-label">Select Cabin</label>
                    <select 
                      className="form-select mb-3" 
                      id="vehicleCabinSelect"
                      disabled={loadingCabins}
                    >
                      <option value="">Select Cabin to Add</option>
                      {cabins && cabins.filter(c => c.type === 'vehicle').map((cabin) => (
                        <option key={cabin._id} value={cabin.name || cabin.cabinName}>
                          {cabin.name || cabin.cabinName}
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Select Payload Type</label>
                    <select 
                      className="form-select mb-3" 
                      id="vehiclePayloadTypeSelect"
                      disabled={loadingPayloadTypes}
                    >
                      <option value="">Select Payload Type to Add</option>
                      {vehiclePayloadTypes && vehiclePayloadTypes.map((payloadType) => (
                        <option key={payloadType._id} value={payloadType.name}>
                          {payloadType.name} ({payloadType.code})
                        </option>
                      ))}
                    </select>

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
