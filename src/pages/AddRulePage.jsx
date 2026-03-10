  // src/pages/AddRulePage.jsx
import React, { useState, useEffect } from "react";
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

export default function AddRulePage() {
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("Markup");
  const [provider, setProvider] = useState("");
  const [appliedLayer, setAppliedLayer] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginRole, setLoginRole] = useState(null);
  const [childPartners, setChildPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  
  // Determine login role from JWT token
  useEffect(() => {
    const role = getLoginRoleFromToken();
    setLoginRole(role);
  }, []);
  
  // Initialize provider and layer from API based on login role (same pattern as Header)
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
  
  const [partnerSelection, setPartnerSelection] = useState("All Child Partners");
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState("%");
  const [visaType, setVisaType] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [ports, setPorts] = useState([]);
  const [loadingPorts, setLoadingPorts] = useState(false);

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
        ruleName, ruleType, provider, appliedLayer, partnerSelection, value, valueType, visaType, effectiveDate,
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
                        onChange={e=>setAppliedLayer(e.target.value)}
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
                        onChange={e=>setPartnerSelection(e.target.value)}
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

                  {/* Routes */}
                  <div className="mb-3">
                    <label className="form-label">Route</label>
                    <div id="routes">
                      {routes.map((r, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <select 
                            className="form-select" 
                            value={r.from} 
                            onChange={e=>updateItem(setRoutes, routes, idx, { ...r, from: e.target.value })}
                            disabled={loadingPorts}
                          >
                            <option value="">From</option>
                            {ports && ports.map((port) => (
                              <option key={port._id} value={port.name}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          <select 
                            className="form-select" 
                            value={r.to} 
                            onChange={e=>updateItem(setRoutes, routes, idx, { ...r, to: e.target.value })}
                            disabled={loadingPorts}
                          >
                            <option value="">To</option>
                            {ports && ports.map((port) => (
                              <option key={port._id} value={port.name}>
                                {port.name}
                              </option>
                            ))}
                          </select>
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
