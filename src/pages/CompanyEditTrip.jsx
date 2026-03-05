// src/pages/CompanyEditTrip.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { shipsApi } from "../api/shipsApi";
import { portsApi } from "../api/portsApi";
import { tripsApi } from "../api/tripsApi";
import { partnerApi } from "../api/partnerApi";
import { ticketingRuleApi } from "../api/ticketingRuleApi";
import Swal from "sweetalert2";

const makeId = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;

export default function CompanyEditTrip() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  // Dropdown data
  const [ships, setShips] = useState([]);
  const [ports, setPorts] = useState([]);
  const [trips, setTrips] = useState([]);
  const [partners, setPartners] = useState([]);
  const [ticketingRulesByType, setTicketingRulesByType] = useState({
    VOID: [],
    REFUND: [],
    REISSUE: []
  });
  const [loadingData, setLoadingData] = useState(false);
  const [selectedTripCapacity, setSelectedTripCapacity] = useState({
    passenger: [],
    cargo: [],
    vehicle: []
  });
  const [selectedTripAvailability, setSelectedTripAvailability] = useState({
    passenger: [],
    cargo: [],
    vehicle: []
  });
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState("");
  const [availabilitiesList, setAvailabilitiesList] = useState([]);
  const [agentAllocations, setAgentAllocations] = useState([]);
  const [loadingAllocations, setLoadingAllocations] = useState(false);

  // Tab states (main tabs and inner availability tabs)
  const [mainTab, setMainTab] = useState("details"); // details | availability | ticketing
  const [availInnerTab, setAvailInnerTab] = useState("add"); // add | allocate

  // Trip details form
  const [form, setForm] = useState({
    trip: tripId || "",
    code: "",
    vessel: "",
    departurePort: "",
    arrivalPort: "",
    departureAt: "",
    arrivalAt: "",
    status: "SCHEDULED",
    bookingOpen: "",
    bookingClose: "",
    checkinOpen: "",
    checkinClose: "",
    boardingClose: "",
    promotion: "",
    remarks: ""
  });

  // Availability lines
  const [passengers, setPassengers] = useState([
    { id: makeId("p_"), trip: "", cabin: "", seats: "" }
  ]);
  const [cargo, setCargo] = useState([
    { id: makeId("c_"), trip: "", type: "", spots: "" }
  ]);
  const [vehicles, setVehicles] = useState([
    { id: makeId("v_"), trip: "", type: "", spots: "" }
  ]);

  // Agents allocation blocks
  const [agents, setAgents] = useState([
    {
      id: makeId("a_"),
      trip: "",
      agentId: "",
      agentName: "Agent Alpha",
      passengerLines: [{ id: makeId("ap_"), select: "", qty: "" }],
      cargoLines: [{ id: makeId("ac_"), select: "", qty: "" }],
      vehicleLines: [{ id: makeId("av_"), select: "", qty: "" }]
    }
  ]);

  // Ticketing rules
  const [tripRules, setTripRules] = useState([
    { id: makeId("r_"), trip: "", ruleType: "Refund", ruleName: "" }
  ]);

  // Fetch data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch all dropdown data
      const [shipsRes, portsRes, partnersRes, tripDataRes, availabilityRes] = await Promise.all([
        shipsApi.getShips(1, 100, "").catch(err => {
          console.error("[v0] Error fetching ships:", err);
          return { data: { ships: [] } };
        }),
        portsApi.getPorts(1, 100, "").catch(err => {
          console.error("[v0] Error fetching ports:", err);
          return { data: { ports: [] } };
        }),
        partnerApi.getPartnersList().catch(err => {
          console.error("[v0] Error fetching partners:", err);
          return [];
        }),
        tripsApi.getTripById(tripId).catch(err => {
          console.error("[v0] Error fetching trip:", err);
          return null;
        }),
        tripsApi.getAvailabilities(tripId).catch(err => {
          console.error("[v0] Error fetching availabilities:", err);
          return null;
        })
      ]);

      // Extract data from responses
      const shipsList = shipsRes?.data?.ships || [];
      const portsList = portsRes?.data?.ports || [];
      const partnersList = Array.isArray(partnersRes) ? partnersRes : (partnersRes?.data || []);

      console.log("[v0] Ships loaded:", shipsList);
      console.log("[v0] Ports loaded:", portsList);
      console.log("[v0] Partners loaded:", partnersList);

      setShips(shipsList);
      setPorts(portsList);
      setPartners(partnersList);

      // Fetch all ticketing rule types
      try {
        const [voidRulesRes, refundRulesRes, reissueRulesRes] = await Promise.all([
          ticketingRuleApi.getTicketingRules(1, 100, { ruleType: "VOID" }).catch(err => {
            console.error("[v0] Error fetching VOID rules:", err);
            return { data: [] };
          }),
          ticketingRuleApi.getTicketingRules(1, 100, { ruleType: "REFUND" }).catch(err => {
            console.error("[v0] Error fetching REFUND rules:", err);
            return { data: [] };
          }),
          ticketingRuleApi.getTicketingRules(1, 100, { ruleType: "REISSUE" }).catch(err => {
            console.error("[v0] Error fetching REISSUE rules:", err);
            return { data: [] };
          })
        ]);

        setTicketingRulesByType({
          VOID: voidRulesRes?.data || [],
          REFUND: refundRulesRes?.data || [],
          REISSUE: reissueRulesRes?.data || []
        });
      } catch (err) {
        console.error("[v0] Error fetching ticketing rules:", err);
      }

      // Prefill form with trip data
      if (tripDataRes) {
        const tripData = tripDataRes.data || tripDataRes;
        console.log("[v0] Trip data loaded:", tripData);

        setForm({
          trip: tripId,
          code: tripData.tripCode || "",
          vessel: tripData.ship?._id || "",
          departurePort: tripData.departurePort?._id || "",
          arrivalPort: tripData.arrivalPort?._id || "",
          departureAt: tripData.departureDateTime ? new Date(tripData.departureDateTime).toISOString().slice(0, 16) : "",
          arrivalAt: tripData.arrivalDateTime ? new Date(tripData.arrivalDateTime).toISOString().slice(0, 16) : "",
          status: tripData.status || "SCHEDULED",
          bookingOpen: tripData.bookingOpeningDate ? new Date(tripData.bookingOpeningDate).toISOString().slice(0, 16) : "",
          bookingClose: tripData.bookingClosingDate ? new Date(tripData.bookingClosingDate).toISOString().slice(0, 16) : "",
          checkinOpen: tripData.checkInOpeningDate ? new Date(tripData.checkInOpeningDate).toISOString().slice(0, 16) : "",
          checkinClose: tripData.checkInClosingDate ? new Date(tripData.checkInClosingDate).toISOString().slice(0, 16) : "",
          boardingClose: tripData.boardingClosingDate ? new Date(tripData.boardingClosingDate).toISOString().slice(0, 16) : "",
          promotion: tripData.promotion || "",
          remarks: tripData.remarks || ""
        });

        // Set trip capacity
        if (tripData.tripCapacityDetails) {
          setSelectedTripCapacity({
            passenger: tripData.tripCapacityDetails.passenger || [],
            cargo: tripData.tripCapacityDetails.cargo || [],
            vehicle: tripData.tripCapacityDetails.vehicle || []
          });
        }

        // Prefill ticketing rules
        if (tripData.ticketingRules && tripData.ticketingRules.length > 0) {
          const prefillRules = tripData.ticketingRules.map((tr, idx) => ({
            id: makeId("r_"),
            trip: tripId,
            ruleType: tr.ruleType === "VOID" ? "Void" : tr.ruleType === "REFUND" ? "Refund" : "Reissue",
            ruleName: tr.rule || ""
          }));
          setTripRules(prefillRules);
        }
      }

      // Prefill availability data
      if (availabilityRes) {
        const availData = availabilityRes.data || availabilityRes;
        console.log("[v0] Availability data loaded:", availData);

        // Handle array of availabilities
        if (Array.isArray(availData)) {
          setAvailabilitiesList(availData);
          if (availData.length > 0 && availData[0]._id) {
            setSelectedAvailabilityId(availData[0]._id);
          }
        } else if (availData._id) {
          // Handle single availability response
          setAvailabilitiesList([availData]);
          setSelectedAvailabilityId(availData._id);
        }

        // Process first availability for prefilling
        const firstAvail = Array.isArray(availData) ? availData[0] : availData;
        if (firstAvail && firstAvail.availabilityTypes && firstAvail.availabilityTypes.length > 0) {
          const passengerTypes = firstAvail.availabilityTypes.find(a => a.type === "passenger");
          const cargoTypes = firstAvail.availabilityTypes.find(a => a.type === "cargo");
          const vehicleTypes = firstAvail.availabilityTypes.find(a => a.type === "vehicle");

          setSelectedTripAvailability({
            passenger: passengerTypes?.cabins || [],
            cargo: cargoTypes?.cabins || [],
            vehicle: vehicleTypes?.cabins || []
          });

          // Prefill availability forms
          if (passengerTypes?.cabins && passengerTypes.cabins.length > 0) {
            const passengerLines = passengerTypes.cabins.map(c => ({
              id: makeId("p_"),
              trip: tripId,
              cabin: c.cabin?.name || c.cabin || "",
              seats: c.seats || ""
            }));
            setPassengers(passengerLines);
          }

          if (cargoTypes?.cabins && cargoTypes.cabins.length > 0) {
            const cargoLines = cargoTypes.cabins.map(c => ({
              id: makeId("c_"),
              trip: tripId,
              type: c.cabin?.name || c.cabin || "",
              spots: c.seats || ""
            }));
            setCargo(cargoLines);
          }

          if (vehicleTypes?.cabins && vehicleTypes.cabins.length > 0) {
            const vehicleLines = vehicleTypes.cabins.map(c => ({
              id: makeId("v_"),
              trip: tripId,
              type: c.cabin?.name || c.cabin || "",
              spots: c.seats || ""
            }));
            setVehicles(vehicleLines);
          }
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching initial data:", err);
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Could not load all data. Using empty lists."
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Handlers for form changes
  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Passenger handlers
  const addPassenger = () => setPassengers((p) => [...p, { id: makeId("p_"), cabin: "", seats: "" }]);
  const removePassenger = (id) => setPassengers((p) => p.filter((x) => x.id !== id));
  const updatePassenger = (id, key, value) => setPassengers((p) => p.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Cargo handlers
  const addCargo = () => setCargo((c) => [...c, { id: makeId("c_"), type: "", spots: "" }]);
  const removeCargo = (id) => setCargo((c) => c.filter((x) => x.id !== id));
  const updateCargo = (id, key, value) => setCargo((c) => c.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Vehicle handlers
  const addVehicle = () => setVehicles((v) => [...v, { id: makeId("v_"), type: "", spots: "" }]);
  const removeVehicle = (id) => setVehicles((v) => v.filter((x) => x.id !== id));
  const updateVehicle = (id, key, value) => setVehicles((v) => v.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Agents handlers
  const addAgent = () =>
    setAgents((a) => [
      ...a,
      {
        id: makeId("a_"),
        agentId: "",
        agentName: "",
        passengerLines: [{ id: makeId("ap_"), select: "", qty: "" }],
        cargoLines: [{ id: makeId("ac_"), select: "", qty: "" }],
        vehicleLines: [{ id: makeId("av_"), select: "", qty: "" }]
      }
    ]);
  const removeAgent = (id) => setAgents((a) => a.filter((ag) => ag.id !== id));

  const addAgentLine = (agentId, section) => {
    setAgents((a) =>
      a.map((ag) => {
        if (ag.id !== agentId) return ag;
        const newLine = { id: makeId(section + "_"), select: "", qty: "" };
        return { ...ag, [`${section}Lines`]: [...ag[`${section}Lines`], newLine] };
      })
    );
  };

  const removeAgentLine = (agentId, section, lineId) => {
    setAgents((a) =>
      a.map((ag) => (ag.id !== agentId ? ag : { ...ag, [`${section}Lines`]: ag[`${section}Lines`].filter((l) => l.id !== lineId) }))
    );
  };

  const updateAgentLine = (agentId, section, lineId, key, value) => {
    setAgents((a) =>
      a.map((ag) =>
        ag.id !== agentId
          ? ag
          : { ...ag, [`${section}Lines`]: ag[`${section}Lines`].map((l) => (l.id === lineId ? { ...l, [key]: value } : l)) }
      )
    );
  };

  // Trip rules handlers
  const addTripRule = () => setTripRules((r) => [...r, { id: makeId("r_"), ruleType: "Refund", ruleName: "" }]);
  const removeTripRule = (id) => setTripRules((r) => r.filter((x) => x.id !== id));
  const updateTripRule = (id, key, value) => setTripRules((r) => r.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  const handleRuleTypeChange = (ruleId, ruleType) => {
    setTripRules((r) => r.map((rule) => (rule.id === ruleId ? { ...rule, ruleName: "" } : rule)));
    console.log("[v0] Rule type changed to:", ruleType, "Rules available:", ticketingRulesByType);
  };

  // Fetch agent allocations for selected availability
  const fetchAgentAllocations = async (availabilityId) => {
    if (!availabilityId) {
      setAgentAllocations([]);
      return;
    }

    try {
      setLoadingAllocations(true);
      console.log("[v0] Fetching allocations for trip:", tripId, "availability:", availabilityId);
      const response = await tripsApi.getAgentAllocations(tripId, availabilityId);
      console.log("[v0] Agent allocations fetched:", response);
      setAgentAllocations(response.data || []);
    } catch (error) {
      console.error("[v0] Error fetching allocations:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load agent allocations"
      });
      setAgentAllocations([]);
    } finally {
      setLoadingAllocations(false);
    }
  };

  // Auto-load allocations when availability is selected
  useEffect(() => {
    if (selectedAvailabilityId) {
      fetchAgentAllocations(selectedAvailabilityId);
    }
  }, [selectedAvailabilityId]);

  // Save handlers
  const onSaveTrip = async (e) => {
    e.preventDefault();
    
    if (!form.code || !form.vessel || !form.departurePort || !form.arrivalPort || !form.departureAt || !form.arrivalAt) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in all required fields"
      });
      return;
    }

    try {
      Swal.fire({
        title: "Updating Trip",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const payload = {
        tripName: form.code,
        tripCode: form.code,
        ship: form.vessel,
        departurePort: form.departurePort,
        arrivalPort: form.arrivalPort,
        departureDateTime: form.departureAt,
        arrivalDateTime: form.arrivalAt,
        status: form.status || "SCHEDULED",
        bookingOpeningDate: form.bookingOpen || null,
        bookingClosingDate: form.bookingClose || null,
        checkInOpeningDate: form.checkinOpen || null,
        checkInClosingDate: form.checkinClose || null,
        boardingClosingDate: form.boardingClose || null
      };

      console.log("[v0] Trip update payload:", payload);

      const response = await tripsApi.updateTrip(tripId, payload);
      
      console.log("[v0] Trip updated successfully:", response);

      // Save ticketing rules if any
      if (tripRules && tripRules.length > 0) {
        const rulesWithValidSelection = tripRules.filter(rule => rule.ruleName && rule.ruleType);
        
        if (rulesWithValidSelection.length > 0) {
          const ticketingRulesPayload = {
            ticketingRules: rulesWithValidSelection.map(rule => {
              const ruleTypeKey = rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE";
              const rulesForType = ticketingRulesByType[ruleTypeKey] || [];
              const selectedRule = rulesForType.find(tr => tr.ruleName === rule.ruleName);
              return {
                ruleType: ruleTypeKey,
                rule: selectedRule?._id || rule.ruleName
              };
            })
          };
          
          console.log("[v0] Ticketing rules payload:", ticketingRulesPayload);
          
          await tripsApi.updateTicketingRules(tripId, ticketingRulesPayload);
          console.log("[v0] Ticketing rules updated successfully");
        }
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Trip updated successfully!",
        confirmButtonText: "OK"
      }).then(() => {
        navigate('/company/ship-trip/trips');
      });
    } catch (error) {
      console.error("[v0] Error updating trip:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update trip. Please try again."
      });
    }
  };

  const onSaveAvailability = async () => {
    try {
      if (!selectedAvailabilityId) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "No availability found for this trip"
        });
        return;
      }

      Swal.fire({
        title: "Saving Availability",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const availabilityTypes = [];

      const passengerCabins = passengers
        .filter(p => p.cabin && p.seats)
        .map(p => {
          const cabinObj = selectedTripCapacity.passenger.find(pc => pc.cabinName === p.cabin);
          return {
            cabin: cabinObj?.cabinId || p.cabin,
            seats: parseInt(p.seats) || 0
          };
        });

      if (passengerCabins.length > 0) {
        availabilityTypes.push({
          type: "passenger",
          cabins: passengerCabins
        });
      }

      const cargoCabins = cargo
        .filter(c => c.type && c.spots)
        .map(c => {
          const cabinObj = selectedTripCapacity.cargo.find(cc => cc.cabinName === c.type);
          return {
            cabin: cabinObj?.cabinId || c.type,
            seats: parseInt(c.spots) || 0
          };
        });

      if (cargoCabins.length > 0) {
        availabilityTypes.push({
          type: "cargo",
          cabins: cargoCabins
        });
      }

      const vehicleCabins = vehicles
        .filter(v => v.type && v.spots)
        .map(v => {
          const cabinObj = selectedTripCapacity.vehicle.find(vc => vc.cabinName === v.type);
          return {
            cabin: cabinObj?.cabinId || v.type,
            seats: parseInt(v.spots) || 0
          };
        });

      if (vehicleCabins.length > 0) {
        availabilityTypes.push({
          type: "vehicle",
          cabins: vehicleCabins
        });
      }

      const payload = {
        availabilityTypes
      };

      console.log("[v0] Updating availability with payload:", payload);

      const response = await tripsApi.updateAvailability(tripId, selectedAvailabilityId, payload);

      console.log("[v0] Availability updated successfully:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Availability updated successfully!",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error("[v0] Error saving availability:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save availability. Please try again."
      });
    }
  };

  const onSaveAgentAllocations = async () => {
    try {
      // Validate that a trip is selected
      if (!tripId) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please select a trip before saving agent allocations"
        });
        return;
      }

      // Validate that availability ID exists
      if (!selectedAvailabilityId) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "No availability found for this trip. Please ensure availability data is loaded."
        });
        return;
      }

      // Validate that at least one agent has allocations
      if (agents.every(a => a.passengerLines.every(p => !p.select) && a.cargoLines.every(c => !c.select) && a.vehicleLines.every(v => !v.select))) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please allocate at least one item to an agent"
        });
        return;
      }

      // Show loading
      Swal.fire({
        title: "Saving Agent Allocations",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Build the payload matching the API format
      const payload = agents
        .filter(agent => {
          // Filter agents that have at least one allocation
          const hasPassenger = agent.passengerLines.some(p => p.select && p.qty);
          const hasCargo = agent.cargoLines.some(c => c.select && c.qty);
          const hasVehicle = agent.vehicleLines.some(v => v.select && v.qty);
          return hasPassenger || hasCargo || hasVehicle;
        })
        .map(agent => {
          const allocations = [];

          // Add passenger allocations
          const passengerAllocs = agent.passengerLines
            .filter(p => p.select && p.qty)
            .map(p => ({
              cabin: p.select,
              allocatedSeats: parseInt(p.qty) || 0
            }));

          if (passengerAllocs.length > 0) {
            allocations.push({
              type: "passenger",
              cabins: passengerAllocs
            });
          }

          // Add cargo allocations
          const cargoAllocs = agent.cargoLines
            .filter(c => c.select && c.qty)
            .map(c => ({
              cabin: c.select,
              allocatedSeats: parseInt(c.qty) || 0
            }));

          if (cargoAllocs.length > 0) {
            allocations.push({
              type: "cargo",
              cabins: cargoAllocs
            });
          }

          // Add vehicle allocations
          const vehicleAllocs = agent.vehicleLines
            .filter(v => v.select && v.qty)
            .map(v => ({
              cabin: v.select,
              allocatedSeats: parseInt(v.qty) || 0
            }));

          if (vehicleAllocs.length > 0) {
            allocations.push({
              type: "vehicle",
              cabins: vehicleAllocs
            });
          }

          return {
            agent: agent.agentId,
            allocations
          };
        });

      console.log("[v0] Saving agent allocations with payload:", payload);

      // Call the API
      const response = await tripsApi.createAgentAllocations(tripId, selectedAvailabilityId, payload);

      console.log("[v0] Agent allocations saved successfully:", response);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Agent allocations saved successfully!",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error("[v0] Error saving agent allocations:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save agent allocations. Please try again."
      });
    }
  };

  const onSaveTicketingRules = async () => {
    try {
      const rulesWithValidSelection = tripRules.filter(rule => rule.ruleName && rule.ruleType);
      
      if (rulesWithValidSelection.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please select at least one ticketing rule with both type and name"
        });
        return;
      }

      Swal.fire({
        title: "Saving Ticketing Rules",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const ticketingRulesPayload = {
        ticketingRules: rulesWithValidSelection.map(rule => {
          const ruleTypeKey = rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE";
          const rulesForType = ticketingRulesByType[ruleTypeKey] || [];
          const selectedRule = rulesForType.find(tr => tr.ruleName === rule.ruleName);
          return {
            ruleType: ruleTypeKey,
            rule: selectedRule?._id || ""
          };
        })
      };

      console.log("[v0] Saving ticketing rules with payload:", ticketingRulesPayload);

      const response = await tripsApi.updateTicketingRules(tripId, ticketingRulesPayload);

      console.log("[v0] Ticketing rules saved successfully:", response);

      setTripRules([
        { id: makeId("r_"), trip: "", ruleType: "Refund", ruleName: "" }
      ]);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ticketing rules saved successfully!",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error("[v0] Error saving ticketing rules:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save ticketing rules. Please try again."
      });
    }
  };

  return (
    <>
      <style>{`
        .hidden { display: none !important; }
        .capacity-grid { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 1rem; }
        @media (max-width: 767px) { .capacity-grid { grid-template-columns: 1fr; } }
        .allocation-section { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
        .agent-block { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
      `}</style>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <PageWrapper>
          <div className="container-fluid">
            <button className="btn btn-sm btn-teal mb-3" onClick={() => navigate('/company/ship-trip/trips')}>
              ← Back to List
            </button>

            <div className="card">
              <div className="card-header">
                <h2>Edit Ferry Trip</h2>
              </div>

              <div className="card-body">
                {/* Tabs */}
                <div className="nav nav-tabs mb-3" role="tablist">
                  <a
                    className={`nav-link ${mainTab === "details" ? "active" : ""}`}
                    onClick={() => setMainTab("details")}
                    role="tab"
                  >
                    Trip Details
                  </a>
                  <a
                    className={`nav-link ${mainTab === "availability" ? "active" : ""}`}
                    onClick={() => setMainTab("availability")}
                    role="tab"
                  >
                    Availability Management
                  </a>
                  <a
                    className={`nav-link ${mainTab === "ticketing" ? "active" : ""}`}
                    onClick={() => setMainTab("ticketing")}
                    role="tab"
                  >
                    Trip Ticketing Rules
                  </a>
                </div>

                {/* TAB: Trip Details */}
                {mainTab === "details" && (
                  <form onSubmit={onSaveTrip}>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Trip Code *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="code"
                          value={form.code}
                          onChange={onFormChange}
                          placeholder="e.g., DXB-MSC-001"
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Vessel *</label>
                        <select className="form-select" name="vessel" value={form.vessel} onChange={onFormChange} disabled>
                          <option value="">Select Vessel</option>
                          {ships.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>Departure Port *</label>
                        <select className="form-select" name="departurePort" value={form.departurePort} onChange={onFormChange} disabled>
                          <option value="">Select Port</option>
                          {ports.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label>Arrival Port *</label>
                        <select className="form-select" name="arrivalPort" value={form.arrivalPort} onChange={onFormChange} disabled>
                          <option value="">Select Port</option>
                          {ports.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>Departure Date/Time *</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="departureAt"
                          value={form.departureAt}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Arrival Date/Time *</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="arrivalAt"
                          value={form.arrivalAt}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>Booking Opening Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="bookingOpen"
                          value={form.bookingOpen}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Booking Closing Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="bookingClose"
                          value={form.bookingClose}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>Check-In Opening Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="checkinOpen"
                          value={form.checkinOpen}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Check-In Closing Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="checkinClose"
                          value={form.checkinClose}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-6">
                        <label>Boarding Closing Date/Time</label>
                        <input
                          type="datetime-local"
                          className="form-control"
                          name="boardingClose"
                          value={form.boardingClose}
                          onChange={onFormChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6">
                        <label>Status</label>
                        <select className="form-select" name="status" value={form.status} onChange={onFormChange}>
                          <option value="SCHEDULED">Scheduled</option>
                          <option value="ONGOING">Ongoing</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end mt-4">
                      <button type="submit" className="btn btn-success">
                        Update Trip
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB: Availability Management */}
                {mainTab === "availability" && (
                  <div>
                    <div className="nav nav-tabs mb-3" role="tablist">
                      <a
                        className={`nav-link ${availInnerTab === "add" ? "active" : ""}`}
                        onClick={() => setAvailInnerTab("add")}
                        role="tab"
                      >
                        Add Availability
                      </a>
                      <a
                        className={`nav-link ${availInnerTab === "allocate" ? "active" : ""}`}
                        onClick={() => setAvailInnerTab("allocate")}
                        role="tab"
                      >
                        Allocate to Agent
                      </a>
                    </div>

                    {/* Add Availability */}
                    {availInnerTab === "add" && (
                      <div>
                        <h5>Passenger Availability</h5>
                        {passengers.map((p) => (
                          <div key={p.id} className="row mb-3">
                            <div className="col-md-4">
                              <select
                                className="form-select"
                                value={p.cabin}
                                onChange={(e) => updatePassenger(p.id, "cabin", e.target.value)}
                                disabled={p.cabin !== ""}
                              >
                                <option value="">Select Cabin</option>
                                {selectedTripCapacity.passenger.map((cab) => (
                                  <option key={cab.cabinId} value={cab.cabinName}>
                                    {cab.cabinName} (Total: {cab.totalSeat}, Remaining: {cab.remainingSeat})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Seats"
                                value={p.seats}
                                onChange={(e) => updatePassenger(p.id, "seats", e.target.value)}
                                disabled={p.cabin !== ""}
                              />
                            </div>
                            <div className="col-md-4">
                              {!p.cabin && (
                                <button
                                  type="button"
                                  className="btn btn-danger w-100"
                                  onClick={() => removePassenger(p.id)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={addPassenger}>
                          Add Line
                        </button>

                        <h5 className="mt-4">Cargo Availability</h5>
                        {cargo.map((c) => (
                          <div key={c.id} className="row mb-3">
                            <div className="col-md-4">
                              <select
                                className="form-select"
                                value={c.type}
                                onChange={(e) => updateCargo(c.id, "type", e.target.value)}
                                disabled={c.type !== ""}
                              >
                                <option value="">Select Hold</option>
                                {selectedTripCapacity.cargo.map((cab) => (
                                  <option key={cab.cabinId} value={cab.cabinName}>
                                    {cab.cabinName} (Total: {cab.totalSeat}, Remaining: {cab.remainingSeat})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Spots"
                                value={c.spots}
                                onChange={(e) => updateCargo(c.id, "spots", e.target.value)}
                                disabled={c.type !== ""}
                              />
                            </div>
                            <div className="col-md-4">
                              {!c.type && (
                                <button
                                  type="button"
                                  className="btn btn-danger w-100"
                                  onClick={() => removeCargo(c.id)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={addCargo}>
                          Add Line
                        </button>

                        <h5 className="mt-4">Vehicle Availability</h5>
                        {vehicles.map((v) => (
                          <div key={v.id} className="row mb-3">
                            <div className="col-md-4">
                              <select
                                className="form-select"
                                value={v.type}
                                onChange={(e) => updateVehicle(v.id, "type", e.target.value)}
                                disabled={v.type !== ""}
                              >
                                <option value="">Select Vehicle Type</option>
                                {selectedTripCapacity.vehicle.map((cab) => (
                                  <option key={cab.cabinId} value={cab.cabinName}>
                                    {cab.cabinName} (Total: {cab.totalSeat}, Remaining: {cab.remainingSeat})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <input
                                type="number"
                                className="form-control"
                                placeholder="Spots"
                                value={v.spots}
                                onChange={(e) => updateVehicle(v.id, "spots", e.target.value)}
                                disabled={v.type !== ""}
                              />
                            </div>
                            <div className="col-md-4">
                              {!v.type && (
                                <button
                                  type="button"
                                  className="btn btn-danger w-100"
                                  onClick={() => removeVehicle(v.id)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={addVehicle}>
                          Add Line
                        </button>

                        <div className="text-end mt-4">
                          <button type="button" className="btn btn-success" onClick={onSaveAvailability}>
                            Update Availability
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Allocate to Agent */}
                    {availInnerTab === "allocate" && (
                    <div id="allocateAvailabilityContent">
                      <div id="agent-allocation-container">
                        {agents.map((agent) => (
                          <div className="agent-block" key={agent.id}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6>Agent Details</h6>
                              <button type="button" className="btn btn-sm btn-danger remove-agent" onClick={() => removeAgent(agent.id)}>Remove Agent</button>
                            </div>

                            <select className="form-select mb-3" value={agent.agentName} onChange={(e) => {
                              const selectedPartner = partners.find(p => p.name === e.target.value);
                              setAgents((a) => a.map((ag) => 
                                ag.id === agent.id 
                                  ? { ...ag, agentName: e.target.value, agentId: selectedPartner?._id || "" } 
                                  : ag
                              ));
                            }}>
                              <option value="">-- Select a Partner --</option>
                              {partners.map((partner) => (
                                <option key={partner._id} value={partner.name}>
                                  {partner.name}
                                </option>
                              ))}
                            </select>

                            <div className="allocation-section">
                              <h6>Passenger Allocation</h6>
                              <div className="passenger-lines">
                                {agent.passengerLines.map((line) => {
                                  const selectedPassenger = selectedTripAvailability.passenger.find(p => p.cabin._id === line.select);
                                  return (
                                    <div className="mb-3" key={line.id}>
                                      <div className="capacity-grid align-items-center">
                                        <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "select", e.target.value)}>
                                          <option value="">Select</option>
                                          {selectedTripAvailability.passenger.map((p) => (
                                            <option key={p.cabin._id} value={p.cabin._id}>
                                              {p.cabin.name} (Remaining: {p.remainingSeats})
                                            </option>
                                          ))}
                                        </select>
                                        <input className="form-control" placeholder="Qty" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "passenger", line.id, "qty", e.target.value)} />
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "passenger", line.id)}>Remove</button>
                                      </div>
                                      {selectedPassenger && (
                                        <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                                          Remaining: {selectedPassenger.remainingSeats}
                                        </small>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <button type="button" className="btn btn-sm btn-outline-secondary add-passenger-line" onClick={() => addAgentLine(agent.id, "passenger")}>Add Passenger Line</button>
                            </div>

                            <div className="allocation-section">
                              <h6>Cargo Allocation</h6>
                              <div className="cargo-lines">
                                {agent.cargoLines.map((line) => {
                                  const selectedCargo = selectedTripAvailability.cargo.find(c => c.cabin._id === line.select);
                                  return (
                                    <div className="mb-3" key={line.id}>
                                      <div className="capacity-grid align-items-center">
                                        <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "select", e.target.value)}>
                                          <option value="">Select</option>
                                          {selectedTripAvailability.cargo.map((c) => (
                                            <option key={c.cabin._id} value={c.cabin._id}>
                                              {c.cabin.name} (Remaining: {c.remainingSeats})
                                            </option>
                                          ))}
                                        </select>
                                        <input className="form-control" placeholder="Qty" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "cargo", line.id, "qty", e.target.value)} />
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "cargo", line.id)}>Remove</button>
                                      </div>
                                      {selectedCargo && (
                                        <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                                          Remaining: {selectedCargo.remainingSeats}
                                        </small>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <button type="button" className="btn btn-sm btn-outline-secondary add-cargo-line" onClick={() => addAgentLine(agent.id, "cargo")}>Add Cargo Line</button>
                            </div>

                            <div className="allocation-section">
                              <h6>Vehicle Allocation</h6>
                              <div className="vehicle-lines">
                                {agent.vehicleLines.map((line) => {
                                  const selectedVehicle = selectedTripAvailability.vehicle.find(v => v.cabin._id === line.select);
                                  return (
                                    <div className="mb-3" key={line.id}>
                                      <div className="capacity-grid align-items-center">
                                        <select className="form-select" value={line.select} onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "select", e.target.value)}>
                                          <option value="">Select</option>
                                          {selectedTripAvailability.vehicle.map((v) => (
                                            <option key={v.cabin._id} value={v.cabin._id}>
                                              {v.cabin.name} (Remaining: {v.remainingSeats})
                                            </option>
                                          ))}
                                        </select>
                                        <input className="form-control" placeholder="Qty" value={line.qty} onChange={(e) => updateAgentLine(agent.id, "vehicle", line.id, "qty", e.target.value)} />
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeAgentLine(agent.id, "vehicle", line.id)}>Remove</button>
                                      </div>
                                      {selectedVehicle && (
                                        <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                                          Remaining: {selectedVehicle.remainingSeats}
                                        </small>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              <button type="button" className="btn btn-sm btn-outline-secondary add-vehicle-line" onClick={() => addAgentLine(agent.id, "vehicle")}>Add Vehicle Line</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button type="button" id="addAgentLine" className="btn btn-sm btn-outline-secondary" onClick={addAgent}>Add Another Agent</button>

                      <div className="text-end mt-3">
                        <button type="button" className="btn btn-success" onClick={onSaveAgentAllocations}>Save Allocation</button>
                      </div>
                    </div>
                    )}
                  </div>
                )}

                {/* TAB: Ticketing Rules */}
                {mainTab === "ticketing" && (
                  <div>
                    <h5>Trip Ticketing Rules</h5>
                    {tripRules.map((rule) => (
                      <div key={rule.id} className="row mb-3">
                        <div className="col-md-4">
                          <select
                            className="form-select"
                            value={rule.ruleType}
                            onChange={(e) => {
                              updateTripRule(rule.id, "ruleType", e.target.value);
                              handleRuleTypeChange(rule.id, e.target.value);
                            }}
                          >
                            <option value="">Select Type</option>
                            <option value="Void">Void</option>
                            <option value="Refund">Refund</option>
                            <option value="Reissue">Reissue</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <select
                            className="form-select"
                            name="rulename"
                            value={rule.ruleName}
                            onChange={(e) => updateTripRule(rule.id, "ruleName", e.target.value)}
                          >
                            <option value="">Select Rule</option>
                            {rule.ruleType && ticketingRulesByType[rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE"]?.map((ticketRule) => (
                              <option key={ticketRule._id} value={ticketRule.ruleName}>
                                {ticketRule.ruleName} ({ticketRule.ruleType})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <button
                            type="button"
                            className="btn btn-danger w-100"
                            onClick={() => removeTripRule(rule.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={addTripRule}>
                      Add Line
                    </button>

                    <div className="text-end mt-4">
                      <button type="button" className="btn btn-success" onClick={onSaveTicketingRules}>
                        Save Rules
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>
    </>
  );
}
