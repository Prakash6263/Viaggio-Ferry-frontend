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

export default function AddCommissionPage() {
  const [commissionName, setCommissionName] = useState("");
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
  const [ports, setPorts] = useState([]);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [cabins, setCabins] = useState([]);
  const [loadingCabins, setLoadingCabins] = useState(false);
  const [passengerPayloadTypes, setPassengerPayloadTypes] = useState([]);
  const [cargoPayloadTypes, setCargoPayloadTypes] = useState([]);
  const [vehiclePayloadTypes, setVehiclePayloadTypes] = useState([]);
  const [loadingPayloadTypes, setLoadingPayloadTypes] = useState(false);

  // service checkboxes
  const [passenger, setPassenger] = useState(false);
  const [cargo, setCargo] = useState(false);
  const [vehicle, setVehicle] = useState(false);

  // dynamic lists - cabins only (no types)
  const [passengerCabins, setPassengerCabins] = useState(["Economy"]);
  const [cargoCabins, setCargoCabins] = useState(["General Cargo"]);
  const [vehicleCabins, setVehicleCabins] = useState(["Car"]);
  const [routes, setRoutes] = useState([{ from: "Muscat", to: "Dubai" }]);

  // helpers for add/remove
  const addItem = (setter, arr, valueToAdd) => setter([...arr, valueToAdd]);
  const removeItem = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
  const updateItem = (setter, arr, idx, val) => setter(arr.map((a,i) => i===idx ? val : a));

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

  // Fetch cabins from API
  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setLoadingCabins(true);
        const response = await cabinsApi.getCabins(1, 100, "", "");
        
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
        
        const passengerResponse = await payloadTypesApi.getPayloadTypes(1, 100, "passenger");
        const passengerTypes = passengerResponse?.data?.payloadTypes || [];
        setPassengerPayloadTypes(passengerTypes);
        console.log("[v0] Passenger payload types loaded:", passengerTypes.length);
        
        const cargoResponse = await payloadTypesApi.getPayloadTypes(1, 100, "cargo");
        const cargoTypes = cargoResponse?.data?.payloadTypes || [];
        setCargoPayloadTypes(cargoTypes);
        console.log("[v0] Cargo payload types loaded:", cargoTypes.length);
        
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

  const onSave = (e) => {
    e.preventDefault();
    const payload = {
      commissionName, provider, appliedLayer, partnerSelection, value, valueType, visaType, effectiveDate,
      services: { passenger, cargo, vehicle },
      passengerCabins, cargoCabins, vehicleCabins, routes
    };
    console.log("Save commission payload:", payload);
    alert("Commission saved (demo). Check console.");
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="mb-3">
            <a href="/company/commission" className="btn btn-turquoise"><i className="bi bi-arrow-left"></i> Back</a>
          </div>

          <div className="card flex-fill">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title">Add New Commission</h5>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onSave}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Commission Name</label>
                    <input className="form-control" value={commissionName} onChange={e=>setCommissionName(e.target.value)} placeholder="Enter commission name" />
                  </div>
                  <div className="col-md-6">
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
                    <input type="number" className="form-control" value={value} onChange={e=>setValue(e.target.value)} placeholder="Enter value" />
                    <select value={valueType} onChange={e=>setValueType(e.target.value)} className="form-select" style={{ maxWidth: 110 }}>
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
                    <label className="form-label">Select Cabin</label>
                    <select 
                      className="form-select mb-3" 
                      onChange={e => {
                        if (e.target.value) {
                          addItem(setPassengerCabins, passengerCabins, e.target.value);
                          e.target.value = "";
                        }
                      }}
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
                      onChange={e => {
                        if (e.target.value) {
                          addItem(setPassengerCabins, passengerCabins, e.target.value);
                          e.target.value = "";
                        }
                      }}
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
                      {passengerCabins.map((val, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <input type="text" className="form-control" value={val} readOnly />
                          <button type="button" className="btn btn-outline-danger" onClick={()=>removeItem(setPassengerCabins, passengerCabins, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setPassengerCabins, passengerCabins, "Economy")}>+ Add Cabin</button>
                  </div>
                )}

                {/* Cargo Section */}
                {cargo && (
                  <div id="cargoSection" className="mb-3">
                    <label className="form-label">Select Cabin</label>
                    <select 
                      className="form-select mb-3" 
                      onChange={e => {
                        if (e.target.value) {
                          addItem(setCargoCabins, cargoCabins, e.target.value);
                          e.target.value = "";
                        }
                      }}
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
                      onChange={e => {
                        if (e.target.value) {
                          addItem(setCargoCabins, cargoCabins, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      disabled={loadingPayloadTypes}
                    >
                      <option value="">Select Payload Type to Add</option>
                      {cargoPayloadTypes && cargoPayloadTypes.map((payloadType) => (
                        <option key={payloadType._id} value={payloadType.name}>
                          {payloadType.name} ({payloadType.code})
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Cargo Cabins</label>
                    <div id="cargoCabins">
                      {cargoCabins.map((val, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <input type="text" className="form-control" value={val} readOnly />
                          <button type="button" className="btn btn-outline-danger" onClick={()=>removeItem(setCargoCabins, cargoCabins, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setCargoCabins, cargoCabins, "General Cargo")}>+ Add Cabin</button>
                  </div>
                )}

                {/* Vehicle Section */}
                {vehicle && (
                  <div id="vehicleSection" className="mb-3">
                    <label className="form-label">Select Cabin</label>
                    <select 
                      className="form-select mb-3" 
                      onChange={e => {
                        if (e.target.value) {
                          addItem(setVehicleCabins, vehicleCabins, e.target.value);
                          e.target.value = "";
                        }
                      }}
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
                      onChange={e => {
                        if (e.target.value) {
                          addItem(setVehicleCabins, vehicleCabins, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      disabled={loadingPayloadTypes}
                    >
                      <option value="">Select Payload Type to Add</option>
                      {vehiclePayloadTypes && vehiclePayloadTypes.map((payloadType) => (
                        <option key={payloadType._id} value={payloadType.name}>
                          {payloadType.name} ({payloadType.code})
                        </option>
                      ))}
                    </select>

                    <label className="form-label">Vehicle Cabins</label>
                    <div id="vehicleCabins">
                      {vehicleCabins.map((val, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <input type="text" className="form-control" value={val} readOnly />
                          <button type="button" className="btn btn-outline-danger" onClick={()=>removeItem(setVehicleCabins, vehicleCabins, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setVehicleCabins, vehicleCabins, "Car")}>+ Add Cabin</button>
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
                        <button type="button" className="btn btn-outline-danger" onClick={()=>removeItem(setRoutes, routes, idx)}>&times;</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-sm btn-primary" onClick={()=>addItem(setRoutes, routes, { from: "", to: "" })}>+ Add Route</button>
                </div>

                <div className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => window.history.back()}>Cancel</button>
                  <button className="btn btn-turquoise">Save Commission</button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </PageWrapper>
    </div>
  );
}
