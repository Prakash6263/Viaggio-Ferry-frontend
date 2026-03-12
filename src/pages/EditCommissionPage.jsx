import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
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

  export default function EditCommissionPage() {
  const { ruleId } = useParams();
  const navigate = useNavigate();

  const [ruleData, setRuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginRole, setLoginRole] = useState(null);

  const [ruleName, setRuleName] = useState("");
  const [provider, setProvider] = useState("");
  const [appliedLayer, setAppliedLayer] = useState("");
  const [partnerSelection, setPartnerSelection] = useState("All Child Partners");
  const [value, setValue] = useState("");
  const [valueType, setValueType] = useState("%");
  const [visaType, setVisaType] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
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

  const [passenger, setPassenger] = useState(false);
  const [cargo, setCargo] = useState(false);
  const [vehicle, setVehicle] = useState(false);

  const [passengerCabins, setPassengerCabins] = useState([]);
  const [passengerTypes, setPassengerTypes] = useState(["Adult"]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [routes, setRoutes] = useState([{ from: "", to: "" }]);
  const [expiryDate, setExpiryDate] = useState("");
  const [priority, setPriority] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = (setter, arr, valueToAdd) => setter([...arr, valueToAdd]);
  const removeItem = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));
  const updateItem = (setter, arr, idx, val) => setter(arr.map((a, i) => i === idx ? val : a));

  // Get login role from token
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
      console.log("[v0] Fetching commission rule with ID:", ruleId);

        const response = await commissionApi.getRuleById(ruleId);
        console.log("[v0] Rule data response:", response);

        if (response.success && response.data) {
          const rule = response.data;
          setRuleData(rule);

          // Populate form with existing data
          setRuleName(rule.ruleName || "");
          setProvider(rule.providerCompany?.companyName || rule.provider?.name || rule.providerName || "");
          setAppliedLayer(rule.appliedLayer || "");
          setValue(rule.commissionValue || rule.ruleValue || "");
          setValueType(rule.valueType === "percentage" ? "%" : rule.valueType === "fixed" ? "fixed" : "%");
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

          // Set partner selection
          if (rule.partner) {
            setPartnerSelection(rule.partner.name || "All Child Partners");
          }

          console.log("[v0] Rule data loaded successfully");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to load rule data",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/company/commission");
          });
        }
      } catch (error) {
        console.error("[v0] Error fetching rule:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to load rule",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/company/commission");
        });
      } finally {
        setLoading(false);
      }
    };

    if (ruleId && loginRole) {
      fetchRuleData();
    }
  }, [ruleId, loginRole]);

  // Initialize provider and layer
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        if (loginRole === "user") {
          const response = await usersApi.getCurrentProfile();

          if (response.success && response.data) {
            const userData = response.data;
            const providerName = userData.company?.companyName || "Unknown";
            const userLayer = userData.layer || userData.role || "Company";

            if (!provider) {
              setProvider(providerName);
              setAppliedLayer(userLayer.charAt(0).toUpperCase() + userLayer.slice(1).toLowerCase());
            }

            console.log("[v0] User profile loaded");
          }
        } else if (loginRole === "company") {
          const response = await companyApi.getCompanyProfile();

          if (response.data) {
            const companyData = response.data;
            const providerName = companyData.companyName || "Unknown";

            if (!provider) {
              setProvider(providerName);
              setAppliedLayer("Company");
            }

            console.log("[v0] Company profile loaded");
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load profile data:", error.message);
      }
    };

    if (loginRole && !provider) {
      initializeUserData();
    }
  }, [loginRole, provider]);

  // Fetch child partners
  useEffect(() => {
    const fetchChildPartners = async () => {
      try {
        setLoadingPartners(true);
        const response = await partnerApi.getChildPartners(1, 100, "Active");

        if (response.success && response.data) {
          setChildPartners(response.data);
          console.log("[v0] Child partners loaded");
        }
      } catch (error) {
        console.error("[v0] Failed to load child partners:", error.message);
      } finally {
        setLoadingPartners(false);
      }
    };

    fetchChildPartners();
  }, []);

  // Fetch ports
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

  // Fetch cabins
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

  // Fetch payload types
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

    if (!visaType) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Visa Type is required",
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

    if (!routes || routes.length === 0 || routes.some(r => !r.from || !r.to)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "At least one complete route is required (both From and To ports)",
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

    const serviceDetails = {
      passenger: passenger ? passengerCabins
        .filter(cabinId => cabinId)
        .map((cabinId, index) => ({
          payloadTypeId: passengerTypes[index] || "",
          cabinId: cabinId
        }))
        .filter(item => item.payloadTypeId)
      : [],
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

    const routesData = routes
      .filter(route => route.from && route.to)
      .map((route) => ({
        routeFrom: route.from,
        routeTo: route.to
      }));

    let providerType = "Company";
    if (loginRole === "partner") {
      providerType = "Partner";
    }

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

    const payload = {
      ruleName,
      provider: currentUserId,
      providerType,
      appliedLayer,
      partnerScope: partnerSelection === "All Child Partners" ? "AllChildPartners" : "SpecificPartner",
      commissionType: convertedValueType,
      commissionValue: parseInt(value),
      valueType: convertedValueType,
      visaType,
      serviceDetails,
      routes: routesData,
      effectiveDate: new Date(effectiveDate).toISOString(),
      expiryDate: new Date(expiryDate).toISOString(),
      priority: parseInt(priority)
    };

    if (partnerSelection !== "All Child Partners") {
      const selectedPartner = childPartners.find(p => p.name === partnerSelection);
      if (selectedPartner) {
        payload.partner = selectedPartner._id;
      }
    }

    console.log("[v0] Updating commission rule:", payload);

    try {
      setIsSubmitting(true);
      const response = await commissionApi.updateRule(ruleId, payload);

      if (response.success || response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.message || "Commission rule updated successfully",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/company/commission";
          }
        });
      }
    } catch (error) {
      console.error("[v0] Error updating rule:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update rule. Please try again.",
        confirmButtonText: "OK",
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
            <a href="/company/commission" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back
            </a>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Edit Commission Rule</h5>
                  </div>
                </div>

                <div className="card-body">
                  <form onSubmit={onSave}>
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
                        placeholder="No provider"
                        title="Provider is automatically set to your company/profile name"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Applied Layer</label>
                      <select
                        className="form-select"
                        value={appliedLayer}
                        onChange={e => setAppliedLayer(e.target.value)}
                      >
                        <option value="">Select Layer</option>
                        <option value="Company">Company</option>
                        <option value="Marine Agent">Marine Agent</option>
                        <option value="Commercial Agent">Commercial Agent</option>
                        <option value="Selling Agent">Selling Agent</option>
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

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label">Visa Type</label>
                      <input
                        type="text"
                        className="form-control"
                        value={visaType}
                        onChange={e => setVisaType(e.target.value)}
                        placeholder="E.g., Schengen, Tourist"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Effective Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={effectiveDate}
                        onChange={e => setEffectiveDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={expiryDate}
                        onChange={e => setExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-12">
                      <label className="form-label">Priority</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service Types</label>
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
                              {cabins.map(c => (
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
                    <a href="/company/commission" className="btn btn-secondary">
                      Cancel
                    </a>
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
