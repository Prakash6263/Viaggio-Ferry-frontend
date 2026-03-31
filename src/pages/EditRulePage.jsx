import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { companyApi } from "../api/companyapi";
import { usersApi } from "../api/usersApi";
import { partnerApi } from "../api/partnerApi";
import { portsApi } from "../api/portsApi";
import { cabinsApi } from "../api/cabinsApi";
import { payloadTypesApi } from "../api/payloadTypesApi";
import { markupDiscountApi } from "../api/markupDiscountApi";
import Swal from "sweetalert2";

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

export default function EditRulePage() {
  const { ruleId } = useParams();
  const navigate = useNavigate();

  const [ruleData, setRuleData] = useState(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleType, setRuleType] = useState("Markup");
  const [provider, setProvider] = useState("");
  const [appliedLayer, setAppliedLayer] = useState("");
  const [providerLayer, setProviderLayer] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginRole, setLoginRole] = useState(null);
  const [childPartners, setChildPartners] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  // pendingPartnerScope / pendingPartnerId hold the raw API values until childPartners loads
  const [pendingPartnerScope, setPendingPartnerScope] = useState(null);
  const [pendingPartnerId, setPendingPartnerId] = useState(null);

  const [partnerSelection, setPartnerSelection] = useState("All Child Partners");
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState("%");
  const [visaType, setVisaType] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [priority, setPriority] = useState(1);
  const [ports, setPorts] = useState([]);
  const [loadingPorts, setLoadingPorts] = useState(false);
  const [cabins, setCabins] = useState([]);
  const [loadingCabins, setLoadingCabins] = useState(false);
  const [passengerPayloadTypes, setPassengerPayloadTypes] = useState([]);
  const [cargoPayloadTypes, setCargoPayloadTypes] = useState([]);
  const [vehiclePayloadTypes, setVehiclePayloadTypes] = useState([]);
  const [loadingPayloadTypes, setLoadingPayloadTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  // service checkboxes
  const [passenger, setPassenger] = useState(false);
  const [cargo, setCargo] = useState(false);
  const [vehicle, setVehicle] = useState(false);

  // dynamic lists
  const [passengerCabins, setPassengerCabins] = useState([]);
  const [passengerTypes, setPassengerTypes] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [routes, setRoutes] = useState([{ from: "", to: "" }]);

  // helpers for add/remove
  const addItem = (setter, arr, valueToAdd) => setter([...arr, valueToAdd]);
  const removeItem = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
  const updateItem = (setter, arr, idx, val) => setter(arr.map((a, i) => i === idx ? val : a));

  // Determine login role from JWT token
  useEffect(() => {
    const role = getLoginRoleFromToken();
    setLoginRole(role);
    
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

  // Fetch rule data
  useEffect(() => {
    const fetchRuleData = async () => {
      try {
        setLoading(true);
        console.log("[v0] Fetching markup/discount rule with ID:", ruleId);

        const response = await markupDiscountApi.getRuleById(ruleId);
        console.log("[v0] Rule data response:", response);

        if (response.success && response.data) {
          const rule = response.data;
          setRuleData(rule);

          // Populate form with existing data
          setRuleName(rule.ruleName || "");

          // Use providerPartner name if available, otherwise fall back to providerCompany
          const providerName =
            rule.providerPartner?.name ||
            rule.providerCompany?.companyName ||
            rule.provider?.name ||
            rule.providerName ||
            "";
          setProvider(providerName);

          // Use appliedLayer directly from API response (do not re-derive)
          setAppliedLayer(rule.appliedLayer || "");
          setRuleType(rule.ruleType || "Markup");
          setValue(rule.ruleValue || "");
          setValueType(rule.valueType === "percentage" ? "%" : rule.valueType === "fixed" ? "Fixed" : "%");
          setVisaType(rule.visaType || "");
          setEffectiveDate(rule.effectiveDate ? new Date(rule.effectiveDate).toISOString().split('T')[0] : "");
          setExpiryDate(rule.expiryDate ? new Date(rule.expiryDate).toISOString().split('T')[0] : "");
          setPriority(rule.priority || 1);

          // Parse service details
          if (rule.serviceDetails) {
            setPassenger(rule.serviceDetails.passenger && rule.serviceDetails.passenger.length > 0);
            setCargo(rule.serviceDetails.cargo && rule.serviceDetails.cargo.length > 0);
            setVehicle(rule.serviceDetails.vehicle && rule.serviceDetails.vehicle.length > 0);

            if (rule.serviceDetails.passenger && rule.serviceDetails.passenger.length > 0) {
              // Store only the cabin IDs for the dropdown
              const cabinIds = rule.serviceDetails.passenger.map(p => p.cabinId?._id || p.cabinId);
              setPassengerCabins(cabinIds);
              
              // Set passenger types - store only the payload type IDs
              const payloadTypeIds = rule.serviceDetails.passenger
                .map(p => p.payloadTypeId?._id || p.payloadTypeId)
                .filter(Boolean);
              if (payloadTypeIds.length > 0) {
                setPassengerTypes(payloadTypeIds);
              }
            }
            if (rule.serviceDetails.cargo && rule.serviceDetails.cargo.length > 0) {
              // Store only cabin IDs for cargo
              const cargoIds = rule.serviceDetails.cargo.map(c => c.cabinId?._id || c.cabinId);
              setCargoTypes(cargoIds);
            }
            if (rule.serviceDetails.vehicle && rule.serviceDetails.vehicle.length > 0) {
              // Store only cabin IDs for vehicle
              const vehicleIds = rule.serviceDetails.vehicle.map(v => v.cabinId?._id || v.cabinId);
              setVehicleTypes(vehicleIds);
            }
          }

          // Parse routes - store port IDs for proper dropdown matching
          if (rule.routes && rule.routes.length > 0) {
            setRoutes(rule.routes.map(route => ({
              from: route.routeFrom?._id || "",
              to: route.routeTo?._id || ""
            })));
          }

          // Store partner scope and ID — will be resolved once childPartners loads
          setPendingPartnerScope(rule.partnerScope || "AllChildPartners");
          setPendingPartnerId(rule.partner?._id || null);

          console.log("[v0] Rule data loaded successfully");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load rule data",
            confirmButtonColor: "#17a2b8"
          }).then(() => {
            navigate("/company/markup");
          });
        }
      } catch (error) {
        console.error("[v0] Error fetching rule:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load rule",
          confirmButtonColor: "#17a2b8"
        }).then(() => {
          navigate("/company/markup");
        });
      } finally {
        setLoading(false);
      }
    };

    if (ruleId && loginRole) {
      fetchRuleData();
    }
  }, [ruleId, loginRole]);

  // Initialize providerLayer label only (appliedLayer already set from API data)
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        if (loginRole === "user") {
          const response = await usersApi.getCurrentProfile();

          if (response.success && response.data) {
            const userData = response.data;
            const userLayer = userData.layer || userData.role || "Company";
            setProviderLayer(userLayer);
          }
        } else if (loginRole === "company") {
          setProviderLayer("company");
        }
      } catch (error) {
        console.error("[v0] Failed to load profile data:", error.message);
      }
    };

    if (loginRole) {
      initializeUserData();
    }
  }, [loginRole]);

  // Resolve partner selection once both rule data and childPartners are loaded
  useEffect(() => {
    if (pendingPartnerScope === null) return; // rule not loaded yet

    if (pendingPartnerScope === "SpecificPartner" && pendingPartnerId) {
      // Wait until childPartners has loaded before trying to match
      if (!loadingPartners) {
        // Confirm the partner exists in the list, then set its _id
        const match = childPartners.find(p => p._id === pendingPartnerId);
        if (match) {
          setPartnerSelection(match._id);
        } else {
          // Partner not in list (maybe inactive) — still set the ID so the value is preserved
          setPartnerSelection(pendingPartnerId);
        }
      }
    } else if (pendingPartnerScope === "AllChildLayer") {
      setPartnerSelection("All Child Layer");
    } else {
      setPartnerSelection("All Child Partners");
    }
  }, [pendingPartnerScope, pendingPartnerId, childPartners, loadingPartners]);

  // Fetch child partners from API
  useEffect(() => {
    const fetchChildPartners = async () => {
      try {
        setLoadingPartners(true);
        const response = await partnerApi.getChildPartners(1, 100, "Active");

        if (response.success && response.data) {
          // getChildPartners returns paginated response: { partners: [...], total, page }
          const list = Array.isArray(response.data)
            ? response.data
            : response.data.partners || response.data.data || [];
          setChildPartners(list);
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
          console.log("[v0] Ports loaded");
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
        console.log("[v0] Cabins loaded");
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

        const cargoResponse = await payloadTypesApi.getPayloadTypes(1, 100, "cargo");
        const cargoTypes = cargoResponse?.data?.payloadTypes || [];
        setCargoPayloadTypes(cargoTypes);

        const vehicleResponse = await payloadTypesApi.getPayloadTypes(1, 100, "vehicle");
        const vehicleTypes = vehicleResponse?.data?.payloadTypes || [];
        setVehiclePayloadTypes(vehicleTypes);

        console.log("[v0] Payload types loaded");
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
        icon: "warning",
        title: "Validation Error",
        text: "Rule Name is required",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    // Markup/Discount value is optional, but if provided must be greater than 0
    if (value && value <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Rule Value must be greater than 0 if provided",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    if (!effectiveDate) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Effective Date is required",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    if (!expiryDate) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Expiry Date is required",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    // Validate ruleType matches backend RULE_TYPES
    const validRuleTypes = ["Markup", "Discount"];
    if (!ruleType || !validRuleTypes.includes(ruleType)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Rule Type must be Markup or Discount",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    // Validate appliedLayer matches backend APPLIED_LAYERS enum
    const validAppliedLayers = ["Company", "Marine Agent", "Commercial Agent", "Selling Agent"];
    if (!appliedLayer || !validAppliedLayers.includes(appliedLayer)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Applied Layer is invalid",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    if (!passenger && !cargo && !vehicle) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Select at least one Service Type",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    // Build service details according to API spec
    // For passenger: create entries for each combination of cabin and selected passenger type
    const passengerEntries = [];
    if (passenger) {
      const validCabins = passengerCabins.filter(cabinId => cabinId);
      // passengerTypes in edit mode stores IDs directly (from API response)
      const validPassengerTypeIds = passengerTypes.filter(typeId => typeId);
      
      // For each cabin and passenger type combination, create an entry
      validCabins.forEach(cabinId => {
        validPassengerTypeIds.forEach(payloadTypeId => {
          passengerEntries.push({
            payloadTypeId: payloadTypeId,
            cabinId: cabinId
          });
        });
      });
      
      // If no cabins selected but passenger types selected, still include payload types
      if (validCabins.length === 0 && validPassengerTypeIds.length > 0) {
        validPassengerTypeIds.forEach(payloadTypeId => {
          passengerEntries.push({
            payloadTypeId: payloadTypeId,
            cabinId: null
          });
        });
      }
    }

    const serviceDetails = {
      passenger: passengerEntries,
      cargo: cargo ? cargoTypes
        .filter(cabinId => cabinId)
        .map((cabinId) => ({
          cabinId: cabinId
        }))
      : [],
      vehicle: vehicle ? vehicleTypes
        .filter(cabinId => cabinId)
        .map((cabinId) => ({
          cabinId: cabinId
        }))
      : []
    };

    // Build routes according to API spec
    const routesData = routes
      .filter(route => route.from && route.to)
      .map((route) => ({
        routeFrom: route.from,
        routeTo: route.to
      }));

    // Use the currently logged-in user's ID as provider
    if (!currentUserId) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "User not loaded. Please refresh and try again.",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    const providerId = currentUserId;
    
    // Determine providerType based on login role
    let providerType = "Company";
    if (loginRole === "partner") {
      providerType = "Partner";
    }

    // Convert valueType to match backend VALUE_TYPES ["percentage", "fixed"]
    const convertedValueType = valueType === "%" ? "percentage" : valueType === "Fixed" ? "fixed" : valueType.toLowerCase();
    
    if (!["percentage", "fixed"].includes(convertedValueType)) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Value Type must be percentage or fixed",
        confirmButtonColor: "#17a2b8"
      });
      return;
    }

    // Build partnerScope and partner for payload
    let partnerScopeValue = "AllChildPartners";
    if (partnerSelection === "All Child Layer") {
      partnerScopeValue = "AllChildLayer";
    } else if (partnerSelection !== "All Child Partners") {
      // partnerSelection holds the partner _id
      partnerScopeValue = "SpecificPartner";
    }

    // Build payload according to API spec and backend model
    const payload = {
      ruleName,
      provider: providerId,
      providerType,
      appliedLayer,
      partnerScope: partnerScopeValue,
      ruleType,
      ruleValue: parseInt(value) || null,
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
    if (partnerScopeValue === "SpecificPartner") {
      // partnerSelection already holds the _id directly
      payload.partner = partnerSelection;
    }

    console.log("[v0] Updating markup/discount rule:", payload);

    try {
      setIsSubmitting(true);
      const response = await markupDiscountApi.updateRule(ruleId, payload);

      if (response.success || response.data) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.message || "Markup/Discount rule updated successfully",
          confirmButtonColor: "#17a2b8"
        }).then(() => {
          window.location.href = "/company/markup";
        });
      }
    } catch (error) {
      console.error("[v0] Error updating rule:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update rule. Please try again.",
        confirmButtonColor: "#17a2b8"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="content container-fluid">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
              <CirclesWithBar
                height="100"
                width="100"
                color="#05468f"
                outerCircleColor="#05468f"
                innerCircleColor="#05468f"
                barColor="#05468f"
                ariaLabel="circles-with-bar-loading"
                visible={true}
              />
            </div>
          </div>
        </PageWrapper>
      </div>
    );
  }

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
                <h5 className="card-title">Edit Markup/Discount Rule</h5>
              </div>
            </div>
            <div className="card-body">
              <form onSubmit={onSave}>
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Rule Name <span style={{ color: "red" }}>*</span></label>
                    <input className="form-control" value={ruleName} onChange={e => setRuleName(e.target.value)} placeholder="Enter rule name" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Rule Type <span style={{ color: "red" }}>*</span></label>
                    <select className="form-select" value={ruleType} onChange={e => setRuleType(e.target.value)}>
                      <option>Markup</option>
                      <option>Discount</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Provider <span style={{ color: "red" }}>*</span></label>
                    <input
                      className="form-control"
                      value={provider}
                      readOnly
                      placeholder="No provider"
                      title={ruleData?.providerType === "Partner" ? "Provider Partner" : "Provider Company"}
                    />
                    {ruleData?.providerType && (
                      <small className="text-muted d-block mt-1">
                        Provider Type: {ruleData.providerType}
                      </small>
                    )}
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
                      Applied layer as saved in this rule
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
                      <option value="All Child Layer">All Child Layer</option>
                      {childPartners && childPartners.map((partner) => (
                        <option key={partner._id} value={partner._id}>
                          {partner.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Commission Value</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="valueInput" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter value" />
                    <select id="valueType" value={valueType} onChange={e => setValueType(e.target.value)} className="form-select" style={{ maxWidth: 110 }}>
                      <option value="%">%</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Visa Type</label>
                    <input type="text" className="form-control" value={visaType} onChange={e => setVisaType(e.target.value)} placeholder="E.g. Schengen, Tourist" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Effective Date <span style={{ color: "red" }}>*</span></label>
                    <input type="date" className="form-control" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Expiry Date <span style={{ color: "red" }}>*</span></label>
                    <input type="date" className="form-control" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-12">
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

                <div className="mb-3">
                  <label className="form-label">Service Types <span style={{ color: "red" }}>*</span></label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="passenger"
                      checked={passenger}
                      onChange={e => setPassenger(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="passenger">
                      Passenger
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="cargo"
                      checked={cargo}
                      onChange={e => setCargo(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="cargo">
                      Cargo
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="vehicle"
                      checked={vehicle}
                      onChange={e => setVehicle(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="vehicle">
                      Vehicle
                    </label>
                  </div>
                </div>

                {passenger && (
                  <div className="mb-3">
                    <label className="form-label">Passenger Cabins</label>
                    <div>
                      {passengerCabins.map((cabin, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <select
                            className="form-select"
                            value={cabin}
                            onChange={e => updateItem(setPassengerCabins, passengerCabins, idx, e.target.value)}
                          >
                            <option value="">Select Cabin</option>
                            {cabins.filter(c => c.type === 'passenger').map(c => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                          <button className="btn btn-outline-danger" type="button" onClick={() => removeItem(setPassengerCabins, passengerCabins, idx)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => addItem(setPassengerCabins, passengerCabins, "")}
                    >
                      + Add Cabin
                    </button>

                    <label className="form-label mt-3">Passenger Types</label>
                    <div>
                      {passengerTypes.map((typeId, idx) => (
                        <div className="input-group mb-2" key={idx}>
                          <select
                            className="form-select"
                            value={typeId}
                            onChange={e => updateItem(setPassengerTypes, passengerTypes, idx, e.target.value)}
                          >
                            <option value="">Select Passenger Type</option>
                            {passengerPayloadTypes.map(pt => (
                              <option key={pt._id} value={pt._id}>{pt.name} ({pt.code})</option>
                            ))}
                          </select>
                          <button className="btn btn-outline-danger" type="button" onClick={() => removeItem(setPassengerTypes, passengerTypes, idx)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => addItem(setPassengerTypes, passengerTypes, "")}
                    >
                      + Add Passenger Type
                    </button>
                  </div>
                )}

                    {cargo && (
                      <div className="mb-3">
                        <label className="form-label">Cargo Types</label>
                        <div>
                          {cargoTypes.map((type, idx) => (
                            <div className="input-group mb-2" key={idx}>
                              <select
                                className="form-select"
                                value={type}
                                onChange={e => updateItem(setCargoTypes, cargoTypes, idx, e.target.value)}
                              >
                                <option value="">Select Type</option>
                                {cabins.filter(c => c.type === 'cargo').map(c => (
                                  <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                              </select>
                              <button className="btn btn-outline-danger" type="button" onClick={() => removeItem(setCargoTypes, cargoTypes, idx)}>
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => addItem(setCargoTypes, cargoTypes, "")}
                        >
                          + Add Type
                        </button>
                      </div>
                    )}

                    {vehicle && (
                      <div className="mb-3">
                        <label className="form-label">Vehicle Types</label>
                        <div>
                          {vehicleTypes.map((type, idx) => (
                            <div className="input-group mb-2" key={idx}>
                              <select
                                className="form-select"
                                value={type}
                                onChange={e => updateItem(setVehicleTypes, vehicleTypes, idx, e.target.value)}
                              >
                                <option value="">Select Type</option>
                                {cabins.filter(c => c.type === 'vehicle').map(c => (
                                  <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                              </select>
                              <button className="btn btn-outline-danger" type="button" onClick={() => removeItem(setVehicleTypes, vehicleTypes, idx)}>
                                <i className="bi bi-x"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => addItem(setVehicleTypes, vehicleTypes, "")}
                        >
                          + Add Type
                        </button>
                      </div>
                    )}

                <div className="mb-3">
                  <label className="form-label">Routes</label>
                  <div>
                    {routes.map((route, idx) => (
                      <div key={idx} className="row g-2 mb-2">
                        <div className="col-md-5">
                          <select
                            className="form-select"
                            value={route.from}
                            onChange={e => updateItem(setRoutes, routes, idx, { ...route, from: e.target.value })}
                          >
                            <option value="">From Port</option>
                            {ports.map(port => (
                              <option key={port._id} value={port._id}>{port.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-5">
                          <select
                            className="form-select"
                            value={route.to}
                            onChange={e => updateItem(setRoutes, routes, idx, { ...route, to: e.target.value })}
                          >
                            <option value="">To Port</option>
                            {ports.map(port => (
                              <option key={port._id} value={port._id}>{port.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <button className="btn btn-outline-danger w-100" type="button" onClick={() => removeItem(setRoutes, routes, idx)}>
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => addItem(setRoutes, routes, { from: "", to: "" })}
                  >
                    + Add Route
                  </button>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Rule"}
                  </button>
                  <a href="/company/markup" className="btn btn-secondary">
                    Cancel
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
