// src/pages/CompanyAddTrip.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useNavigate } from "react-router-dom";
import { shipsApi } from "../api/shipsApi";
import { portsApi } from "../api/portsApi";
import { tripsApi } from "../api/tripsApi";
import { partnerApi } from "../api/partnerApi";
import { ticketingRuleApi } from "../api/ticketingRuleApi";
import Swal from "sweetalert2";

const makeId = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;

export default function CompanyAddTrip() {
  const navigate = useNavigate();

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

  // Tab states (main tabs and inner availability tabs)
  const [mainTab, setMainTab] = useState("details"); // details | availability | ticketing
  const [availInnerTab, setAvailInnerTab] = useState("add"); // add | allocate

  // Trip details form (uncontrolled fields can be converted later)
  const [form, setForm] = useState({
    code: "",
    vessel: "",
    departurePort: "",
    arrivalPort: "",
    departureAt: "",
    arrivalAt: "",
    status: "Scheduled",
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
    { id: makeId("p_"), trip: "", cabin: "First class", seats: "" }
  ]);
  const [cargo, setCargo] = useState([
    { id: makeId("c_"), trip: "", type: "Pallet", spots: "" }
  ]);
  const [vehicles, setVehicles] = useState([
    { id: makeId("v_"), trip: "", type: "Car", spots: "" }
  ]);

  // Agents allocation blocks (each has passengerLines, cargoLines, vehicleLines)
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

  // Fetch ships and ports on mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch ships, ports, trips, partners in parallel
      const [shipsRes, portsRes, tripsRes, partnersRes] = await Promise.all([
        shipsApi.getShips(1, 100, "").catch(err => {
          console.error("[v0] Error fetching ships:", err);
          return { data: { ships: [] } };
        }),
        portsApi.getPorts(1, 100, "").catch(err => {
          console.error("[v0] Error fetching ports:", err);
          return { data: { ports: [] } };
        }),
        tripsApi.getTrips(1, 100, "").catch(err => {
          console.error("[v0] Error fetching trips:", err);
          return { data: { trips: [] } };
        }),
        partnerApi.getPartnersList().catch(err => {
          console.error("[v0] Error fetching partners:", err);
          return [];
        })
      ]);

      // Extract data from responses
      const shipsList = shipsRes?.data?.ships || [];
      const portsList = portsRes?.data?.ports || [];
      const tripsList = tripsRes?.data?.trips || [];
      const partnersList = Array.isArray(partnersRes) ? partnersRes : (partnersRes?.data || []);

      console.log("[v0] Ships loaded:", shipsList);
      console.log("[v0] Ports loaded:", portsList);
      console.log("[v0] Trips loaded:", tripsList);
      console.log("[v0] Partners loaded:", partnersList);

      setShips(shipsList);
      setPorts(portsList);
      setTrips(tripsList);
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

        console.log("[v0] Ticketing rules loaded - VOID:", voidRulesRes?.data, "REFUND:", refundRulesRes?.data, "REISSUE:", reissueRulesRes?.data);

        setTicketingRulesByType({
          VOID: voidRulesRes?.data || [],
          REFUND: refundRulesRes?.data || [],
          REISSUE: reissueRulesRes?.data || []
        });
      } catch (err) {
        console.error("[v0] Error fetching ticketing rules:", err);
      }
    } catch (err) {
      console.error("[v0] Error fetching dropdown data:", err);
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Could not load all dropdown data. Using empty lists."
      });
    } finally {
      setLoadingData(false);
    }
  };

  // Handler for trip selection to load capacity details and availabilities
  const handleTripSelection = async (tripId) => {
    setForm({ ...form, trip: tripId });
    
    if (tripId) {
      // Find the selected trip from the trips array
      const selectedTrip = trips.find(t => t._id === tripId);
      
      if (selectedTrip && selectedTrip.tripCapacityDetails) {
        console.log("[v0] Selected trip capacity:", selectedTrip.tripCapacityDetails);
        setSelectedTripCapacity({
          passenger: selectedTrip.tripCapacityDetails.passenger || [],
          cargo: selectedTrip.tripCapacityDetails.cargo || [],
          vehicle: selectedTrip.tripCapacityDetails.vehicle || []
        });
      } else {
        console.log("[v0] No capacity details found for trip");
        setSelectedTripCapacity({ passenger: [], cargo: [], vehicle: [] });
      }

      // Fetch availabilities for the selected trip
      try {
        const availabilityResponse = await tripsApi.getAvailabilities(tripId);
        console.log("[v0] Availabilities fetched:", availabilityResponse);
        
        // Store the availability ID (assuming it's returned in the response)
        if (availabilityResponse?._id) {
          setSelectedAvailabilityId(availabilityResponse._id);
        } else if (availabilityResponse?.data?._id) {
          setSelectedAvailabilityId(availabilityResponse.data._id);
        }
        
        // Check if availabilityTypes is directly in response or nested under data
        const availTypes = availabilityResponse?.availabilityTypes || availabilityResponse?.data?.availabilityTypes || [];
        
        if (availTypes && availTypes.length > 0) {
          const passengerAvail = availTypes.find(a => a.type === "passenger")?.cabins || [];
          const cargoAvail = availTypes.find(a => a.type === "cargo")?.cabins || [];
          const vehicleAvail = availTypes.find(a => a.type === "vehicle")?.cabins || [];
          
          console.log("[v0] Parsed availabilities - Passenger:", passengerAvail, "Cargo:", cargoAvail, "Vehicle:", vehicleAvail);
          
          setSelectedTripAvailability({
            passenger: passengerAvail,
            cargo: cargoAvail,
            vehicle: vehicleAvail
          });
        } else {
          console.log("[v0] No availabilities found for trip");
          setSelectedTripAvailability({ passenger: [], cargo: [], vehicle: [] });
        }
      } catch (error) {
        console.error("[v0] Error fetching availabilities:", error);
        setSelectedTripAvailability({ passenger: [], cargo: [], vehicle: [] });
        setSelectedAvailabilityId("");
      }
    } else {
      setSelectedTripCapacity({ passenger: [], cargo: [], vehicle: [] });
      setSelectedTripAvailability({ passenger: [], cargo: [], vehicle: [] });
    }
  };

  // Handlers for form changes
  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // Passenger handlers
  const addPassenger = () => setPassengers((p) => [...p, { id: makeId("p_"), cabin: "First class", seats: "" }]);
  const removePassenger = (id) => setPassengers((p) => p.filter((x) => x.id !== id));
  const updatePassenger = (id, key, value) => setPassengers((p) => p.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Cargo handlers
  const addCargo = () => setCargo((c) => [...c, { id: makeId("c_"), type: "Pallet", spots: "" }]);
  const removeCargo = (id) => setCargo((c) => c.filter((x) => x.id !== id));
  const updateCargo = (id, key, value) => setCargo((c) => c.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Vehicle handlers
  const addVehicle = () => setVehicles((v) => [...v, { id: makeId("v_"), type: "Car", spots: "" }]);
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
    // Clear the ruleName for this line when type changes
    setTripRules((r) => r.map((rule) => (rule.id === ruleId ? { ...rule, ruleName: "" } : rule)));
    
    console.log("[v0] Rule type changed to:", ruleType, "Rules available:", ticketingRulesByType);
  };

  // Save handlers (currently mock)
  const onSaveTrip = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.code || !form.vessel || !form.departurePort || !form.arrivalPort || !form.departureAt || !form.arrivalAt) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill in all required fields (Trip Code, Vessel, Departure Port, Arrival Port, Departure Date/Time, Arrival Date/Time)"
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Creating Trip",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare API payload matching the backend requirements
      const payload = {
        tripName: form.code, // Use trip code as name if tripName not in form
        tripCode: form.code,
        ship: form.vessel, // Ship ID
        departurePort: form.departurePort, // Port ID
        arrivalPort: form.arrivalPort, // Port ID
        departureDateTime: form.departureAt,
        arrivalDateTime: form.arrivalAt,
        status: form.status || "SCHEDULED",
        bookingOpeningDate: form.bookingOpen || null,
        bookingClosingDate: form.bookingClose || null,
        checkInOpeningDate: form.checkinOpen || null,
        checkInClosingDate: form.checkinClose || null,
        boardingClosingDate: form.boardingClose || null
      };

      console.log("[v0] Trip API payload:", payload);

      // Call the API
      const response = await tripsApi.createTrip(payload);
      
      console.log("[v0] Trip created successfully:", response);

      // Save ticketing rules if any are present
      if (tripRules && tripRules.length > 0) {
        const rulesWithValidSelection = tripRules.filter(rule => rule.ruleName && rule.ruleType);
        
        if (rulesWithValidSelection.length > 0) {
          console.log("[v0] Saving ticketing rules for trip:", response._id);
          
          // Find the rule ID for each selected rule name
          const ticketingRulesPayload = {
            ticketingRules: rulesWithValidSelection.map(rule => {
              // Get the rules for this rule type
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
          
          await tripsApi.updateTicketingRules(response._id, ticketingRulesPayload);
          console.log("[v0] Ticketing rules saved successfully");
        }
      }

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Trip created successfully!",
        confirmButtonText: "OK"
      }).then(() => {
        // Optionally navigate back to trips list
        navigate('/company/ship-trip/trips');
      });
    } catch (error) {
      console.error("[v0] Error creating trip:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create trip. Please try again."
      });
    }
  };

  const onSaveAvailability = async () => {
    try {
      // Validate that a trip is selected
      if (!form.trip) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please select a trip before saving availability"
        });
        return;
      }

      // Validate that at least one availability item is added
      if (passengers.every(p => !p.cabin) && cargo.every(c => !c.type) && vehicles.every(v => !v.type)) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please add at least one passenger, cargo, or vehicle availability"
        });
        return;
      }

      // Show loading
      Swal.fire({
        title: "Saving Availability",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Build the payload matching the API format
      const availabilityTypes = [];

      // Add passenger availability
      const passengerCabins = passengers
        .filter(p => p.cabin && p.seats)
        .map(p => {
          // Find the cabin ID from selectedTripCapacity
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

      // Add cargo availability
      const cargoCabins = cargo
        .filter(c => c.type && c.spots)
        .map(c => {
          // Find the cabin ID from selectedTripCapacity
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

      // Add vehicle availability
      const vehicleCabins = vehicles
        .filter(v => v.type && v.spots)
        .map(v => {
          // Find the cabin ID from selectedTripCapacity
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

      console.log("[v0] Saving availability with payload:", payload);

      // Call the API
      const response = await tripsApi.createAvailability(form.trip, payload);

      console.log("[v0] Availability saved successfully:", response);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Availability saved successfully!",
        confirmButtonText: "OK"
      }).then(() => {
        // Reset availability arrays after successful save
        setPassengers([{ id: makeId("p_"), trip: form.trip, cabin: "", seats: "" }]);
        setCargo([{ id: makeId("c_"), trip: form.trip, type: "", spots: "" }]);
        setVehicles([{ id: makeId("v_"), trip: form.trip, type: "", spots: "" }]);
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
      if (!form.trip) {
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
      const response = await tripsApi.createAgentAllocations(form.trip, selectedAvailabilityId, payload);

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
      // Validate that a trip is selected
      if (!form.trip) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please select a trip before saving ticketing rules"
        });
        return;
      }

      // Validate that at least one rule has both type and name selected
      const rulesWithValidSelection = tripRules.filter(rule => rule.ruleName && rule.ruleType);
      
      if (rulesWithValidSelection.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please select at least one ticketing rule with both type and name"
        });
        return;
      }

      // Show loading
      Swal.fire({
        title: "Saving Ticketing Rules",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Build the payload matching the API format
      const ticketingRulesPayload = {
        ticketingRules: rulesWithValidSelection.map(rule => {
          // Get the rules for this rule type
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

      // Call the API
      const response = await tripsApi.updateTicketingRules(form.trip, ticketingRulesPayload);

      console.log("[v0] Ticketing rules saved successfully:", response);

      // Reset form after successful save
      setTripRules([
        { id: makeId("r_"), trip: "", ruleType: "Refund", ruleName: "" }
      ]);

      // Show success message
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

  // JSX: keep the same classes as HTML (converted to className)
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Back Button */}
          <div className="mb-3">
            <button className="btn btn-turquoise" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left"></i> Back to List
            </button>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Create Ferry Trip</h5>
                  </div>
                </div>
                <div className="card-body">
                  {/* preserve small style block from original for capacity-grid etc. */}
                  <style>{`
                    .hidden { display: none !important; }
                    .capacity-grid { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 1rem; }
                    @media (max-width: 767px) { .capacity-grid { grid-template-columns: 1fr; } }
                    .allocation-section { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
                    .agent-block { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
                  `}</style>

                  <div>
                    {/* Main Tabs */}
                    <ul className="nav nav-tabs mb-3">
                      <li className="nav-item">
                        <button
                          id="tripDetailsBtn"
                          className={`nav-link tab-button ${mainTab === "details" ? "active" : ""}`}
                          onClick={() => setMainTab("details")}
                        >
                          Trip Details
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          id="availabilityBtn"
                          className={`nav-link tab-button ${mainTab === "availability" ? "active" : ""}`}
                          onClick={() => setMainTab("availability")}
                        >
                          Availability Management
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          id="tripTicketingRulesBtn"
                          className={`nav-link tab-button ${mainTab === "ticketing" ? "active" : ""}`}
                          onClick={() => setMainTab("ticketing")}
                        >
                          Trip Ticketing Rules
                        </button>
                      </li>
                    </ul>

                    {/* Trip Details */}
                    <div id="tripDetailsTab" className={mainTab === "details" ? "" : "hidden"}>
                      <form className="row g-3" onSubmit={onSaveTrip}>
                        <div className="col-md-6">
                          <label className="form-label">Trip Name/Code</label>
                          <input type="text" className="form-control" name="code" value={form.code} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Assign Vessel</label>
                          <select className="form-select" name="vessel" value={form.vessel} onChange={onFormChange} disabled={loadingData}>
                            <option value="">-- Select a Ship --</option>
                            {ships.map((ship) => (
                              <option key={ship._id} value={ship._id}>
                                {ship.name}
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading ships...</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Departure Port</label>
                          <select className="form-select" name="departurePort" value={form.departurePort} onChange={onFormChange} disabled={loadingData}>
                            <option value="">-- Select a Port --</option>
                            {ports.map((port) => (
                              <option key={port._id} value={port._id}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading ports...</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Arrival Port</label>
                          <select className="form-select" name="arrivalPort" value={form.arrivalPort} onChange={onFormChange} disabled={loadingData}>
                            <option value="">-- Select a Port --</option>
                            {ports.map((port) => (
                              <option key={port._id} value={port._id}>
                                {port.name}
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading ports...</small>}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Departure Date & Time</label>
                          <input type="datetime-local" className="form-control" name="departureAt" value={form.departureAt} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Arrival Date & Time</label>
                          <input type="datetime-local" className="form-control" name="arrivalAt" value={form.arrivalAt} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Status</label>
                          <select className="form-select" name="status" value={form.status} onChange={onFormChange}>
                            <option>Scheduled</option>
                            <option>Ongoing</option>
                            <option>Completed</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Booking Opening Date</label>
                          <input type="datetime-local" className="form-control" name="bookingOpen" value={form.bookingOpen} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Booking Closing Date</label>
                          <input type="datetime-local" className="form-control" name="bookingClose" value={form.bookingClose} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Check-in Opening Date</label>
                          <input type="datetime-local" className="form-control" name="checkinOpen" value={form.checkinOpen} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Check-in Closing Date</label>
                          <input type="datetime-local" className="form-control" name="checkinClose" value={form.checkinClose} onChange={onFormChange} />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Boarding Closing Date</label>
                          <input type="datetime-local" className="form-control" name="boardingClose" value={form.boardingClose} onChange={onFormChange} />
                        </div>

                        <div className="col-md-12">
                          <label className="form-label">Promotion</label>
                          <select className="form-select" name="promotion" value={form.promotion} onChange={onFormChange}>
                            <option value="">None</option>
                            <option value="discount10">Discount 10%</option>
                            <option value="earlybird">Early Bird</option>
                          </select>
                        </div>

                        <div className="col-12">
                          <label className="form-label">Remarks/Notes</label>
                          <textarea className="form-control" rows="3" name="remarks" value={form.remarks} onChange={onFormChange}></textarea>
                        </div>

                        <div className="d-flex justify-content-end mt-3">
                          <button type="submit" className="btn btn-turquoise">Save Trip</button>
                        </div>
                      </form>
                    </div>

                    {/* Availability Management */}
                    <div id="availabilityTab" className={mainTab === "availability" ? "" : "hidden"}>
                      {/* inner tabs */}
                      <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                          <button
                            id="addAvailabilityBtn"
                            className={`nav-link tab-button ${availInnerTab === "add" ? "active" : ""}`}
                            onClick={() => setAvailInnerTab("add")}
                          >
                            Add Availability
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            id="allocateAvailabilityBtn"
                            className={`nav-link tab-button ${availInnerTab === "allocate" ? "active" : ""}`}
                            onClick={() => setAvailInnerTab("allocate")}
                          >
                            Allocate to Agent
                          </button>
                        </li>
                      </ul>

                      {/* Add Availability Content */}
                      <div id="addAvailabilityContent" className={availInnerTab === "add" ? "" : "hidden"}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Select Trip</label>
                            <select className="form-select" value={form.trip || ""} onChange={(e) => handleTripSelection(e.target.value)}>
                              <option value="">-- Select a Trip --</option>
                              {trips.map((trip) => (
                                <option key={trip._id} value={trip._id}>
                                  {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
                                </option>
                              ))}
                            </select>
                            {loadingData && <small className="text-muted">Loading trips...</small>}
                          </div>
                        </div>

                        <h5 className="mb-3">Passenger Availability</h5>
                        <div id="passenger-availability-container">
                          {passengers.map((p) => {
                            const selectedCabin = selectedTripCapacity.passenger.find(pc => pc.cabinName === p.cabin);
                            return (
                              <div className="mb-3" key={p.id}>
                                <div className="capacity-grid align-items-center">
                                  <select className="form-select" value={p.cabin} onChange={(e) => updatePassenger(p.id, "cabin", e.target.value)}>
                                    <option value="">-- Select Cabin --</option>
                                    {selectedTripCapacity.passenger.map((pc) => (
                                      <option key={pc.cabinId} value={pc.cabinName}>
                                        {pc.cabinName} (Total: {pc.totalSeat}, Remaining: {pc.remainingSeat})
                                      </option>
                                    ))}
                                  </select>
                                  <input type="number" className="form-control" placeholder="Seats" value={p.seats} onChange={(e) => updatePassenger(p.id, "seats", e.target.value)} />
                                  <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removePassenger(p.id)}>Remove</button>
                                </div>
                                {selectedCabin && (
                                  <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                                    Remaining Seats: {selectedCabin.remainingSeat}
                                  </small>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <button type="button" id="addPassengerLine" className="btn btn-sm btn-outline-secondary" onClick={addPassenger}>Add Line</button>

                        <h5 className="mt-4">Cargo Availability</h5>
                        <div id="cargo-availability-container">
                          {cargo.map((c) => {
                            const selectedHold = selectedTripCapacity.cargo.find(cc => cc.cabinName === c.type);
                            return (
                              <div className="mb-3" key={c.id}>
                                <div className="capacity-grid align-items-center">
                                  <select className="form-select" value={c.type} onChange={(e) => updateCargo(c.id, "type", e.target.value)}>
                                    <option value="">-- Select Hold --</option>
                                    {selectedTripCapacity.cargo.map((cc) => (
                                      <option key={cc.cabinId} value={cc.cabinName}>
                                        {cc.cabinName} (Total: {cc.totalSeat}, Remaining: {cc.remainingSeat})
                                      </option>
                                    ))}
                                  </select>
                                  <input type="number" className="form-control" placeholder="Spots" value={c.spots} onChange={(e) => updateCargo(c.id, "spots", e.target.value)} />
                                  <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removeCargo(c.id)}>Remove</button>
                                </div>
                                {selectedHold && (
                                  <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                                    Remaining Spots: {selectedHold.remainingSeat}
                                  </small>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <button type="button" id="addCargoLine" className="btn btn-sm btn-outline-secondary" onClick={addCargo}>Add Line</button>

                        <h5 className="mt-4">Vehicle Availability</h5>
                        <div id="vehicle-availability-container">
                          {vehicles.map((v) => {
                            const selectedVehicle = selectedTripCapacity.vehicle.find(vc => vc.cabinName === v.type);
                            return (
                              <div className="mb-3" key={v.id}>
                                <div className="capacity-grid align-items-center">
                                  <select className="form-select" value={v.type} onChange={(e) => updateVehicle(v.id, "type", e.target.value)}>
                                    <option value="">-- Select Vehicle Type --</option>
                                    {selectedTripCapacity.vehicle.map((vc) => (
                                      <option key={vc.cabinId} value={vc.cabinName}>
                                        {vc.cabinName} (Total: {vc.totalSeat}, Remaining: {vc.remainingSeat})
                                      </option>
                                    ))}
                                  </select>
                                  <input type="number" className="form-control" placeholder="Spots" value={v.spots} onChange={(e) => updateVehicle(v.id, "spots", e.target.value)} />
                                  <button type="button" className="btn btn-sm btn-danger remove-btn" onClick={() => removeVehicle(v.id)}>Remove</button>
                                </div>
                                {selectedVehicle && (
                                  <small className="text-danger" style={{ display: 'block', marginTop: '5px' }}>
                                    Remaining Spots: {selectedVehicle.remainingSeat}
                                  </small>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <button type="button" id="addVehicleLine" className="btn btn-sm btn-outline-secondary" onClick={addVehicle}>Add Line</button>

                        <div className="text-end mt-3">
                          <button type="button" className="btn btn-success" onClick={onSaveAvailability}>Save Availability</button>
                        </div>
                      </div>

                      {/* Allocate to Agent */}
                      <div id="allocateAvailabilityContent" className={availInnerTab === "allocate" ? "" : "hidden"}>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Select Trip for Allocation</label>
                            <select className="form-select" value={form.trip || ""} onChange={(e) => handleTripSelection(e.target.value)}>
                              <option value="">-- Select a Trip --</option>
                              {trips.map((trip) => (
                                <option key={trip._id} value={trip._id}>
                                  {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
                                </option>
                              ))}
                            </select>
                            {loadingData && <small className="text-muted">Loading trips...</small>}
                          </div>
                        </div>

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
                    </div>

                    {/* Trip Ticketing Rules */}
                    <div id="tripTicketingRulesTab" className={mainTab === "ticketing" ? "" : "hidden"}>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label">Select Trip for Rules</label>
                          <select className="form-select" value={form.trip || ""} onChange={(e) => handleTripSelection(e.target.value)}>
                            <option value="">-- Select a Trip --</option>
                            {trips.map((trip) => (
                              <option key={trip._id} value={trip._id}>
                                {trip.tripCode} ({trip.departurePort?.name} → {trip.arrivalPort?.name})
                              </option>
                            ))}
                          </select>
                          {loadingData && <small className="text-muted">Loading trips...</small>}
                        </div>
                      </div>

                      <h5 className="mb-3">Trip Ticketing Rules</h5>

                      <div id="trip-rules-container">
                        {tripRules.map((rule) => (
                          <div className="capacity-grid align-items-center mb-2" key={rule.id}>
                            <select className="form-select" value={rule.ruleType} onChange={(e) => {
                              updateTripRule(rule.id, "ruleType", e.target.value);
                              handleRuleTypeChange(rule.id, e.target.value);
                            }}>
                              <option value="">Select Type</option>
                              <option value="Void">Void</option>
                              <option value="Refund">Refund</option>
                              <option value="Reissue">Reissue</option>
                            </select>

                            <select className="form-select" name="rulename" value={rule.ruleName} onChange={(e) => updateTripRule(rule.id, "ruleName", e.target.value)}>
                              <option value="">Select Rule</option>
                              {rule.ruleType && ticketingRulesByType[rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE"]?.map((ticketRule) => (
                                <option key={ticketRule._id} value={ticketRule.ruleName}>
                                  {ticketRule.ruleName} ({ticketRule.ruleType})
                                </option>
                              ))}
                            </select>

                            <button type="button" className="btn btn-sm btn-danger remove-trip-rule" onClick={() => removeTripRule(rule.id)}>Remove</button>
                          </div>
                        ))}
                      </div>

                      <button type="button" id="addTripRuleLine" className="btn btn-outline-secondary btn-sm mt-2" onClick={addTripRule}>Add Line</button>

                      <div className="d-flex justify-content-end mt-3">
                        <button type="button" className="btn btn-success" onClick={onSaveTicketingRules}>Save Rules</button>
                      </div>
                    </div>
                  </div>

                  {/* (end content) */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
