// src/pages/CompanyAddTrip.jsx
import React, { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useNavigate, Link } from "react-router-dom";
import { shipsApi } from "../api/shipsApi";
import { portsApi } from "../api/portsApi";
import { tripsApi } from "../api/tripsApi";
import { partnerApi } from "../api/partnerApi";
import { ticketingRuleApi } from "../api/ticketingRuleApi";
import Swal from "sweetalert2";
import Can from "../components/Can";
import TripTabsContainer from "../components/trips/TripTabsContainer";

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

  // Refresh trip data when switching tabs
  useEffect(() => {
    if (form.trip && (mainTab === "availability" || mainTab === "ticketing")) {
      handleTripSelection(form.trip);
    }
  }, [mainTab]);

  // Refresh availability data when switching to allocate tab
  useEffect(() => {
    if (form.trip && availInnerTab === "allocate") {
      handleTripSelection(form.trip);
    }
  }, [availInnerTab]);

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

      // Set the newly created trip as the selected trip
      setForm(prev => ({ ...prev, trip: response._id }));

      // Refresh trips list to include the newly created trip
      await fetchDropdownData();

      // Show success message and move to availability tab
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Trip created successfully! Now add availability.",
        confirmButtonText: "OK"
      }).then(() => {
        // Auto-move to availability tab for the next step
        setMainTab("availability");
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

      // Show success message and move to agent allocation tab
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Availability saved successfully! Now allocate to agents.",
        confirmButtonText: "OK"
      }).then(() => {
        // Reset availability arrays after successful save
        setPassengers([{ id: makeId("p_"), trip: form.trip, cabin: "", seats: "" }]);
        setCargo([{ id: makeId("c_"), trip: form.trip, type: "", spots: "" }]);
        setVehicles([{ id: makeId("v_"), trip: form.trip, type: "", spots: "" }]);
        
        // Move to agent allocation tab
        setAvailInnerTab("allocate");
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

      // Show success message and move to ticketing rules tab
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Agent allocations saved successfully! Now add ticketing rules.",
        confirmButtonText: "OK"
      }).then(() => {
        // Move to ticketing rules tab
        setMainTab("ticketing");
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
        text: "Trip completed successfully! All configurations have been saved.",
        confirmButtonText: "Back to Trips"
      }).then(() => {
        // Navigate back to trips list after completion
        navigate('/company/ship-trip/trips');
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
        {/* CREATE action - uses LIST route path for permission check */}
        <Can action="create" path="/company/ship-trips/trips">
          <div className="content container-fluid">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/company/ship-trips/trips" className="btn btn-turquoise">
                <i className="bi bi-arrow-left"></i> Back to List
              </Link>
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
                  {loadingData && (
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
                  )}

                  {!loadingData && (
                    <>
                      {/* preserve small style block from original for capacity-grid etc. */}
                      <style>{`
                        .hidden { display: none !important; }
                        .capacity-grid { display: grid; grid-template-columns: 1.5fr 1fr auto; gap: 1rem; }
                        @media (max-width: 767px) { .capacity-grid { grid-template-columns: 1fr; } }
                        .allocation-section { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
                        .agent-block { border: 1px solid var(--text-border); border-radius: .5rem; padding: 1rem; margin-bottom: 1rem; }
                      `}</style>

                      <TripTabsContainer
                    mainTab={mainTab}
                    setMainTab={setMainTab}
                    availInnerTab={availInnerTab}
                    setAvailInnerTab={setAvailInnerTab}
                    form={form}
                    onFormChange={onFormChange}
                    ships={ships}
                    ports={ports}
                    trips={trips}
                    partners={partners}
                    loadingData={loadingData}
                    passengers={passengers}
                    cargo={cargo}
                    vehicles={vehicles}
                    selectedTripCapacity={selectedTripCapacity}
                    selectedTripAvailability={selectedTripAvailability}
                    agents={agents}
                    setAgents={setAgents}
                    tripRules={tripRules}
                    ticketingRulesByType={ticketingRulesByType}
                    handleTripSelection={handleTripSelection}
                    onSaveTrip={onSaveTrip}
                    addPassenger={addPassenger}
                    removePassenger={removePassenger}
                    updatePassenger={updatePassenger}
                    addCargo={addCargo}
                    removeCargo={removeCargo}
                    updateCargo={updateCargo}
                    addVehicle={addVehicle}
                    removeVehicle={removeVehicle}
                    updateVehicle={updateVehicle}
                    onSaveAvailability={onSaveAvailability}
                    addAgent={addAgent}
                    removeAgent={removeAgent}
                    addAgentLine={addAgentLine}
                    removeAgentLine={removeAgentLine}
                    updateAgentLine={updateAgentLine}
                    onSaveAgentAllocations={onSaveAgentAllocations}
                    addTripRule={addTripRule}
                    removeTripRule={removeTripRule}
                    updateTripRule={updateTripRule}
                    handleRuleTypeChange={handleRuleTypeChange}
                    onSaveTicketingRules={onSaveTicketingRules}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
