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

  // Service type state management (React way, like AddRulePage)
  const [passenger, setPassenger] = useState(false);
  const [cargo, setCargo] = useState(false);
  const [vehicle, setVehicle] = useState(false);

  // Dynamic lists for service types
  const [passengerCabins, setPassengerCabins] = useState(["Economy"]);
  const [passengerTypes, setPassengerTypes] = useState(["Adult"]);
  const [cargoTypes, setCargoTypes] = useState(["General Cargo"]);
  const [vehicleTypes, setVehicleTypes] = useState(["Car"]);
  const [routes, setRoutes] = useState([{ from: "Muscat", to: "Dubai" }]);

  // Helper functions for add/remove/update items
  const addItem = (setter, arr, valueToAdd) => setter([...arr, valueToAdd]);
  const removeItem = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
  const updateItem = (setter, arr, idx, val) => setter(arr.map((a, i) => i === idx ? val : a));

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
                      <input className="form-check-input" type="checkbox" checked={passenger} onChange={e => setPassenger(e.target.checked)} id="chkPassenger" />
                      <label className="form-check-label" htmlFor="chkPassenger">Passenger</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" checked={cargo} onChange={e => setCargo(e.target.checked)} id="chkCargo" />
                      <label className="form-check-label" htmlFor="chkCargo">Cargo</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" checked={vehicle} onChange={e => setVehicle(e.target.checked)} id="chkVehicle" />
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
                            <select className="form-select" value={val} onChange={e => updateItem(setPassengerCabins, passengerCabins, idx, e.target.value)}>
                              <option value="">Select Cabin</option>
                              {cabins && cabins.filter(c => c.type === 'passenger').map((cabin) => (
                                <option key={cabin._id} value={cabin.name || cabin.cabinName}>
                                  {cabin.name || cabin.cabinName}
                                </option>
                              ))}
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setPassengerCabins, passengerCabins, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setPassengerCabins, passengerCabins, "Economy")}>+ Add Cabin</button>

                      <label className="form-label mt-3">Passenger Types</label>
                      <div id="passengerTypes">
                        {passengerTypes.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e => updateItem(setPassengerTypes, passengerTypes, idx, e.target.value)}>
                              <option value="">Select Passenger Type</option>
                              {passengerPayloadTypes && passengerPayloadTypes.map((payloadType) => (
                                <option key={payloadType._id} value={payloadType.name}>
                                  {payloadType.name} ({payloadType.code})
                                </option>
                              ))}
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setPassengerTypes, passengerTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setPassengerTypes, passengerTypes, "Adult")}>+ Add Passenger Type</button>
                    </div>
                  )}

                  {/* Cargo Section */}
                  {cargo && (
                    <div id="cargoSection" className="mb-3">
                      <label className="form-label">Cargo Cabins</label>
                      <div id="cargoCabins">
                        {cargoTypes.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e => updateItem(setCargoTypes, cargoTypes, idx, e.target.value)}>
                              <option value="">Select Cabin</option>
                              {cabins && cabins.filter(c => c.type === 'cargo').map((cabin) => (
                                <option key={cabin._id} value={cabin.name || cabin.cabinName}>
                                  {cabin.name || cabin.cabinName}
                                </option>
                              ))}
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setCargoTypes, cargoTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setCargoTypes, cargoTypes, "General Cargo")}>+ Add Cabin</button>

                      <label className="form-label mt-3">Cargo Types</label>
                      <div id="cargoPayloadTypes">
                        {cargoPayloadTypes && cargoPayloadTypes.map((payloadType, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={payloadType.name || ""} onChange={e => {
                              const updated = [...cargoPayloadTypes];
                              updated[idx] = { ...payloadType, name: e.target.value };
                              setCargoPayloadTypes(updated);
                            }}>
                              <option value="">Select Cargo Type</option>
                              {cargoPayloadTypes && cargoPayloadTypes.map((type) => (
                                <option key={type._id} value={type.name}>
                                  {type.name} ({type.code})
                                </option>
                              ))}
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setCargoPayloadTypes, cargoPayloadTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setCargoPayloadTypes, cargoPayloadTypes, { name: "", code: "" })}>+ Add Cargo Type</button>
                    </div>
                  )}

                  {/* Vehicle Section */}
                  {vehicle && (
                    <div id="vehicleSection" className="mb-3">
                      <label className="form-label">Vehicle Cabins</label>
                      <div id="vehicleCabins">
                        {vehicleTypes.map((val, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={val} onChange={e => updateItem(setVehicleTypes, vehicleTypes, idx, e.target.value)}>
                              <option value="">Select Cabin</option>
                              {cabins && cabins.filter(c => c.type === 'vehicle').map((cabin) => (
                                <option key={cabin._id} value={cabin.name || cabin.cabinName}>
                                  {cabin.name || cabin.cabinName}
                                </option>
                              ))}
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setVehicleTypes, vehicleTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setVehicleTypes, vehicleTypes, "Car")}>+ Add Cabin</button>

                      <label className="form-label mt-3">Vehicle Types</label>
                      <div id="vehiclePayloadTypes">
                        {vehiclePayloadTypes && vehiclePayloadTypes.map((payloadType, idx) => (
                          <div className="input-group mb-2" key={idx}>
                            <select className="form-select" value={payloadType.name || ""} onChange={e => {
                              const updated = [...vehiclePayloadTypes];
                              updated[idx] = { ...payloadType, name: e.target.value };
                              setVehiclePayloadTypes(updated);
                            }}>
                              <option value="">Select Vehicle Type</option>
                              {vehiclePayloadTypes && vehiclePayloadTypes.map((type) => (
                                <option key={type._id} value={type.name}>
                                  {type.name} ({type.code})
                                </option>
                              ))}
                            </select>
                            <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setVehiclePayloadTypes, vehiclePayloadTypes, idx)}>&times;</button>
                          </div>
                        ))}
                      </div>
                      <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setVehiclePayloadTypes, vehiclePayloadTypes, { name: "", code: "" })}>+ Add Vehicle Type</button>
                    </div>
                  )}

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
