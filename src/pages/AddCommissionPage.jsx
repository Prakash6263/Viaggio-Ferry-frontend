import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { companyApi } from "../api/companyapi";
import { usersApi } from "../api/usersApi";
import { partnerApi } from "../api/partnerApi";
import { portsApi } from "../api/portsApi";
import { cabinsApi } from "../api/cabinsApi";
import { payloadTypesApi } from "../api/payloadTypesApi";
import { commissionApi } from "../api/commissionApi";

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

// Helper function to decode JWT and get layer
const getLayerFromToken = () => {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return null

    const decoded = JSON.parse(atob(token.split(".")[1]))
    return decoded.layer
  } catch (error) {
    console.error("[v0] Error decoding token for layer:", error)
    return null
  }
}

// Helper function to normalize layer value (removes -agent suffix and converts to lowercase)
const normalizeLayerValue = (layer) => {
  if (!layer) return ""
  // Convert to lowercase and remove "-agent" suffix if present
  const normalized = layer.toLowerCase().replace(/-agent$/, "").replace(/ agent$/i, "")
  return normalized
}

// Helper function to map current layer to next applicable layer
// Returns exact backend enum values: "Company", "Marine Agent", "Commercial Agent", "Selling Agent"
// If provider layer is company → applied layer is "Marine Agent"
// If provider layer is marine/marine-agent → applied layer is "Commercial Agent"
// If provider layer is commercial/commercial-agent → applied layer is "Selling Agent"
const getNextApplicableLayer = (currentLayer) => {
  const layerHierarchy = {
    "company": "Marine Agent",       // company → Marine Agent
    "marine": "Commercial Agent",    // marine → Commercial Agent
    "commercial": "Selling Agent",   // commercial → Selling Agent
    "selling": null                  // No next layer for selling agent
  }
  
  const normalizedLayer = normalizeLayerValue(currentLayer)
  return layerHierarchy[normalizedLayer] || null
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
  const [providerLayer, setProviderLayer] = useState("");
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
  const [passengerCabins, setPassengerCabins] = useState([]);
  const [passengerTypes, setPassengerTypes] = useState(["Adult"]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [routes, setRoutes] = useState([{ from: "", to: "" }]);
  const [expiryDate, setExpiryDate] = useState("");
  const [priority, setPriority] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper functions for add/remove/update items
  const addItem = (setter, arr, valueToAdd) => setter([...arr, valueToAdd]);
  const removeItem = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
  const updateItem = (setter, arr, idx, val) => setter(arr.map((a, i) => i === idx ? val : a));

  // Determine login role from JWT token
  useEffect(() => {
    const role = getLoginRoleFromToken();
    setLoginRole(role);
    
    // Extract user ID from JWT token
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.id || decoded.userId || decoded._id);
      }
    } catch (error) {
      console.error("[v0] Failed to extract user ID from token:", error);
    }
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
            const providerName = userData.fullName || userData.name || userData.username || userData.email || "Unknown";
            const userLayer = userData.layer || userData.role || "Company";

            setProvider(providerName);
            setProviderLayer(userLayer);
            
            // Set applied layer to next applicable layer based on provider layer
            const nextLayer = getNextApplicableLayer(userLayer);
            setAppliedLayer(nextLayer || userLayer);

            console.log("[v0] User profile loaded - Provider:", providerName, "Layer:", userLayer, "Applied Layer:", nextLayer);
          }
        } else if (loginRole === "company") {
          // For company login: Get company name and set layer as "Company"
          const response = await companyApi.getCompanyProfile();

          if (response.data) {
            const companyData = response.data;
            const providerName = companyData.companyName || "Unknown";

            setProvider(providerName);
            setProviderLayer("company");
            
// Company layer always maps to Marine Agent
            setAppliedLayer("Marine Agent");
            
            console.log("[v0] Company profile loaded - Provider:", providerName, "Provider Layer: company", "Applied Layer: Marine Agent");
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

  const onSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!ruleName.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Rule Name is required",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!value || value <= 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Commission Value must be greater than 0",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!effectiveDate) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Effective Date is required",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!expiryDate) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Expiry Date is required",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!appliedLayer) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Applied Layer is required",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!passenger && !cargo && !vehicle) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Select at least one Service Type",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!currentUserId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "User not loaded. Please refresh and try again.",
        confirmButtonText: "OK",
      });
      return;
    }

    // Build service details according to API spec
    const serviceDetails = {
      passenger: passenger ? passengerCabins
        .filter(cabinId => cabinId) // Filter out empty cabin IDs
        .map((cabinId) => {
          const payloadType = passengerPayloadTypes.length > 0 ? passengerPayloadTypes[0] : null;
          // Only include if payloadTypeId exists, otherwise skip this entry
          if (payloadType?._id) {
            return {
              payloadTypeId: payloadType._id,
              cabinId: cabinId
            };
          }
          return null;
        })
        .filter(item => item !== null) // Remove null entries
      : [],
      cargo: cargo ? cargoTypes
        .filter(cabinId => cabinId) // Filter out empty cabin IDs
        .map((cabinId) => ({
          cabinId: cabinId
        }))
      : [],
      vehicle: vehicle ? vehicleTypes
        .filter(cabinId => cabinId) // Filter out empty cabin IDs
        .map((cabinId) => ({
          cabinId: cabinId
        }))
      : []
    };

    // Build routes according to API spec - only include valid routes
    const routesData = routes
      .filter(route => route.from && route.to)
      .map((route) => {
        const fromPort = ports.find(p => p.name === route.from);
        const toPort = ports.find(p => p.name === route.to);
        return {
          routeFrom: fromPort?._id || "",
          routeTo: toPort?._id || ""
        };
      });

    // Determine providerType based on login role
    let providerType = "Company";
    if (loginRole === "partner") {
      providerType = "Partner";
    }

    // Convert valueType to match backend VALUE_TYPES ["percentage", "fixed"]
    const convertedValueType = valueType === "%" ? "percentage" : valueType === "fixed" ? "fixed" : valueType.toLowerCase();
    
    if (!["percentage", "fixed"].includes(convertedValueType)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Value Type must be percentage or fixed",
        confirmButtonText: "OK",
      });
      return;
    }

    // Build payload according to API spec
    const payload = {
      ruleName,
      provider: currentUserId,
      providerType,
      appliedLayer,
      partnerScope: partnerSelection === "All Child Partners" ? "AllChildPartners" : "SpecificPartner",
      commissionType: convertedValueType,
      commissionValue: parseInt(value),
      valueType: convertedValueType,
      serviceDetails,
      routes: routesData,
      effectiveDate: new Date(effectiveDate).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      priority: parseInt(priority)
    };
    
    // Add optional fields only if they have values
    if (visaType) {
      payload.visaType = visaType;
    }

    // Add partner ID only if partnerScope is SpecificPartner
    if (partnerSelection !== "All Child Partners") {
      const selectedPartner = childPartners.find(p => p.name === partnerSelection);
      if (selectedPartner) {
        payload.partner = selectedPartner._id;
      }
    }

    console.log("[v0] Submitting commission rule:", payload);

    try {
      setIsSubmitting(true);
      const response = await commissionApi.createRule(payload);

      if (response.success || response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message || "Commission rule created successfully",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/company/commission";
          }
        });
      }
    } catch (error) {
      console.error("[v0] Error creating rule:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create rule. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <form onSubmit={onSave}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Rule Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter rule name"
                        value={ruleName}
                        onChange={e => setRuleName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Commission Provider <span style={{ color: "red" }}>*</span></label>
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
                      <label className="form-label">Applied Layer <span style={{ color: "red" }}>*</span></label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={appliedLayer} 
                        readOnly 
                        disabled
                        style={{ backgroundColor: "#f8f9fa", cursor: "not-allowed" }}
                      />
                      <small className="text-muted d-block mt-1">
                        Automatically determined based on provider layer: {providerLayer}
                      </small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Partner <span style={{ color: "red" }}>*</span></label>
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
                    <label className="form-label">Commission Value <span style={{ color: "red" }}>*</span></label>
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
                  <label className="form-label d-block">Service Types <span style={{ color: "red" }}>*</span></label>
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
                              <option key={cabin._id} value={cabin._id}>
                                {cabin.name || cabin.cabinName}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setPassengerCabins, passengerCabins, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setPassengerCabins, passengerCabins, "")}>+ Add Cabin</button>

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
                              <option key={cabin._id} value={cabin._id}>
                                {cabin.name || cabin.cabinName}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setCargoTypes, cargoTypes, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setCargoTypes, cargoTypes, "")}>+ Add Cabin</button>

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
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setCargoPayloadTypes, cargoPayloadTypes, {name: "", code: ""})}>+ Add Cargo Type</button>
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
                              <option key={cabin._id} value={cabin._id}>
                                {cabin.name || cabin.cabinName}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setVehicleTypes, vehicleTypes, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setVehicleTypes, vehicleTypes, "")}>+ Add Cabin</button>

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
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setVehiclePayloadTypes, vehiclePayloadTypes, {name: "", code: ""})}>+ Add Vehicle Type</button>
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
                      <label className="form-label">Effective Date <span style={{ color: "red" }}>*</span></label>
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
                      {routes && routes.map((route, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <select className="form-select" value={route.from} onChange={e => updateItem(setRoutes, routes, idx, { ...route, from: e.target.value })} disabled={loadingPorts}>
                            <option value="">From Port</option>
                            {ports && ports.map((port) => (
                              <option key={port._id} value={port.name}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          <select className="form-select" value={route.to} onChange={e => updateItem(setRoutes, routes, idx, { ...route, to: e.target.value })} disabled={loadingPorts}>
                            <option value="">To Port</option>
                            {ports && ports.map((port) => (
                              <option key={port._id} value={port.name}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-outline-danger remove-field" onClick={() => removeItem(setRoutes, routes, idx)}>&times;</button>
                        </div>
                      ))}
                    </div>
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => addItem(setRoutes, routes, { from: "", to: "" })}>+ Add Route</button>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Expiry Date <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="date"
                        className="form-control"
                        value={expiryDate}
                        onChange={e => setExpiryDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                      >
                        <option value="1">1 - Highest</option>
                        <option value="2">2 - High</option>
                        <option value="3">3 - Medium</option>
                        <option value="4">4 - Low</option>
                        <option value="5">5 - Lowest</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <a href="/company/commission" className="btn btn-secondary me-2">Cancel</a>
                    <button type="submit" className="btn btn-turquoise" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Rule"}
                    </button>
                  </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
