// src/pages/CompanyEditTrip.jsx
import React, { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { useNavigate, useParams, Link } from "react-router-dom";
import { shipsApi } from "../api/shipsApi";
import { portsApi } from "../api/portsApi";
import { tripsApi } from "../api/tripsApi";
import { partnerApi } from "../api/partnerApi";
import { ticketingRuleApi } from "../api/ticketingRuleApi";
import Swal from "sweetalert2";
import Can from "../components/Can";
import EditTripTabsContainer from "../components/trips/editTrip/EditTripTabsContainer";

const makeId = (prefix = "") => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

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
  const [assignedTripRules, setAssignedTripRules] = useState([]);
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
    { id: makeId("p_"), trip: "", cabin: "", seats: "", isNew: true }
  ]);
  const [cargo, setCargo] = useState([
    { id: makeId("c_"), trip: "", type: "", spots: "", isNew: true }
  ]);
  const [vehicles, setVehicles] = useState([
    { id: makeId("v_"), trip: "", type: "", spots: "", isNew: true }
  ]);

  // Agents allocation blocks
  const [agents, setAgents] = useState([
    {
      id: makeId("a_"),
      trip: "",
      agentId: "",
      agentName: "Agent Alpha",
      isNew: true,
      passengerLines: [{ id: makeId("ap_"), select: "", qty: "", isNew: true }],
      cargoLines: [{ id: makeId("ac_"), select: "", qty: "", isNew: true }],
      vehicleLines: [{ id: makeId("av_"), select: "", qty: "", isNew: true }]
    }
  ]);

  // Ticketing rules
  const [tripRules, setTripRules] = useState([
    { id: makeId("r_"), trip: "", ruleType: "", ruleId: "", ruleName: "", isFromBackend: false }
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
        partnerApi.getChildPartners(1, 100, "Active&data=sort").catch(err => {
          console.error("[v0] Error fetching partners:", err);
          return { data: [] };
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
      const partnersList = partnersRes?.data || [];

      console.log("[v0] Ships loaded:", shipsList);
      console.log("[v0] Ports loaded:", portsList);
      console.log("[v0] Partners loaded:", partnersList);

      setShips(shipsList);
      setPorts(portsList);
      setPartners(partnersList);

      // Fetch all ticketing rule types
      try {
        const [voidRulesRes, refundRulesRes, reissueRulesRes, tripRulesRes] = await Promise.all([
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
          }),
          tripsApi.getTicketingRules(tripId).catch(err => {
            console.error("[v0] Error fetching trip's ticketing rules:", err);
            return { data: { ticketingRules: [] } };
          })
        ]);

        setTicketingRulesByType({
          VOID: voidRulesRes?.data || [],
          REFUND: refundRulesRes?.data || [],
          REISSUE: reissueRulesRes?.data || []
        });

        // Set assigned trip rules
        const tripRulesData = tripRulesRes?.data || {};
        if (tripRulesData.ticketingRules && tripRulesData.ticketingRules.length > 0) {
          console.log("[v0] Trip ticketing rules loaded:", tripRulesData.ticketingRules);
          setAssignedTripRules(tripRulesData.ticketingRules);
        }
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

        // Prefill ticketing rules - store ruleId for reliable matching
        if (tripData.ticketingRules && Array.isArray(tripData.ticketingRules) && tripData.ticketingRules.length > 0) {
          const prefillRules = tripData.ticketingRules.map((tr) => ({
            id: makeId("r_"),
            trip: tripId,
            ruleType: tr.ruleType === "VOID" ? "Void" : tr.ruleType === "REFUND" ? "Refund" : "Reissue",
            ruleId: (tr.rule && typeof tr.rule === "object" && tr.rule._id) ? tr.rule._id : "",
            ruleName: (tr.rule && typeof tr.rule === "object" && tr.rule.ruleName) ? tr.rule.ruleName : "",
            isFromBackend: true
          }));
          console.log("[v0] Prefilled trip rules from tripData:", prefillRules);
          setTripRules(prefillRules);
        } else if (assignedTripRules && Array.isArray(assignedTripRules) && assignedTripRules.length > 0) {
          // Fallback: use assignedTripRules if tripData doesn't have ticketingRules
          const prefillRules = assignedTripRules.map((tr) => ({
            id: makeId("r_"),
            trip: tripId,
            ruleType: tr.ruleType === "VOID" ? "Void" : tr.ruleType === "REFUND" ? "Refund" : "Reissue",
            ruleId: (tr.rule && typeof tr.rule === "object" && tr.rule._id) ? tr.rule._id : "",
            ruleName: (tr.rule && typeof tr.rule === "object" && tr.rule.ruleName) ? tr.rule.ruleName : "",
            isFromBackend: true
          }));
          console.log("[v0] Prefilled trip rules from assignedTripRules:", prefillRules);
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
              seats: c.seats || "",
              isNew: false
            }));
            setPassengers(passengerLines);
          }

          if (cargoTypes?.cabins && cargoTypes.cabins.length > 0) {
            const cargoLines = cargoTypes.cabins.map(c => ({
              id: makeId("c_"),
              trip: tripId,
              type: c.cabin?.name || c.cabin || "",
              spots: c.seats || "",
              isNew: false
            }));
            setCargo(cargoLines);
          }

          if (vehicleTypes?.cabins && vehicleTypes.cabins.length > 0) {
            const vehicleLines = vehicleTypes.cabins.map(c => ({
              id: makeId("v_"),
              trip: tripId,
              type: c.cabin?.name || c.cabin || "",
              spots: c.seats || "",
              isNew: false
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
    // Only allow status changes
    if (name === "status") {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  // Handle status update
  const onStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      Swal.fire({
        title: "Updating Status",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await tripsApi.updateTripStatus(tripId, newStatus);
      console.log("[v0] Trip status updated:", response);

      setForm((s) => ({ ...s, status: newStatus }));

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Trip status updated successfully!",
        confirmButtonText: "OK"
      });
    } catch (error) {
      console.error("[v0] Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update trip status. Please try again."
      });
      // Revert status on error
      setForm((s) => ({ ...s, status: form.status }));
    }
  };

  // Passenger handlers
  const addPassenger = () => setPassengers((p) => [...p, { id: makeId("p_"), cabin: "", seats: "", isNew: true }]);
  const removePassenger = (id) => setPassengers((p) => p.filter((x) => x.id !== id));
  const updatePassenger = (id, key, value) => setPassengers((p) => p.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Cargo handlers
  const addCargo = () => setCargo((c) => [...c, { id: makeId("c_"), type: "", spots: "", isNew: true }]);
  const removeCargo = (id) => setCargo((c) => c.filter((x) => x.id !== id));
  const updateCargo = (id, key, value) => setCargo((c) => c.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  // Vehicle handlers
  const addVehicle = () => setVehicles((v) => [...v, { id: makeId("v_"), type: "", spots: "", isNew: true }]);
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
        isNew: true,
        passengerLines: [{ id: makeId("ap_"), select: "", qty: "", isNew: true }],
        cargoLines: [{ id: makeId("ac_"), select: "", qty: "", isNew: true }],
        vehicleLines: [{ id: makeId("av_"), select: "", qty: "", isNew: true }]
      }
    ]);
  const removeAgent = (id) => setAgents((a) => a.filter((ag) => ag.id !== id));

  const addAgentLine = (agentId, section) => {
    setAgents((a) =>
      a.map((ag) => {
        if (ag.id !== agentId) return ag;
        const newLine = { id: makeId(section + "_"), select: "", qty: "", isNew: true };
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
  const addTripRule = () => setTripRules((r) => [...r, { id: makeId("r_"), ruleType: "", ruleId: "", ruleName: "", isFromBackend: false }]);
  const removeTripRule = (id) => setTripRules((r) => r.filter((x) => x.id !== id));
  const updateTripRule = (id, key, value) => setTripRules((r) => r.map((x) => (x.id === id ? { ...x, [key]: value } : x)));

  const handleRuleTypeChange = (ruleId, ruleType) => {
    setTripRules((r) => r.map((rule) => (rule.id === ruleId ? { ...rule, ruleId: "", ruleName: "" } : rule)));
    console.log("[v0] Rule type changed to:", ruleType, "Rules available:", ticketingRulesByType);
  };

  // Prefill agents form from fetched allocations
  const prefillAgentsFromAllocations = (allocationsData) => {
    if (!allocationsData || allocationsData.length === 0) {
      return;
    }

    const prefilteredAgents = allocationsData.map((allocation) => {
      const passengerLines = [];
      const cargoLines = [];
      const vehicleLines = [];

      if (allocation.allocations && Array.isArray(allocation.allocations)) {
        allocation.allocations.forEach((alloc) => {
          if (alloc.type === "passenger" && alloc.cabins) {
            alloc.cabins.forEach((cabin) => {
              passengerLines.push({
                id: makeId("ap_"),
                select: cabin.cabin?._id || cabin.cabin,
                qty: cabin.allocatedSeats?.toString() || "",
                isNew: false
              });
            });
          }
          if (alloc.type === "cargo" && alloc.cabins) {
            alloc.cabins.forEach((cabin) => {
              cargoLines.push({
                id: makeId("ac_"),
                select: cabin.cabin?._id || cabin.cabin,
                qty: cabin.allocatedSeats?.toString() || "",
                isNew: false
              });
            });
          }
          if (alloc.type === "vehicle" && alloc.cabins) {
            alloc.cabins.forEach((cabin) => {
              vehicleLines.push({
                id: makeId("av_"),
                select: cabin.cabin?._id || cabin.cabin,
                qty: cabin.allocatedSeats?.toString() || "",
                isNew: false
              });
            });
          }
        });
      }

      return {
        id: makeId("a_"),
        trip: tripId,
        agentId: allocation.agent?._id || "",
        agentName: allocation.agent?.name || "",
        isNew: false,
        allocationId: allocation._id || "",
        passengerLines: passengerLines.length > 0 ? passengerLines : [{ id: makeId("ap_"), select: "", qty: "", isNew: true }],
        cargoLines: cargoLines.length > 0 ? cargoLines : [{ id: makeId("ac_"), select: "", qty: "", isNew: true }],
        vehicleLines: vehicleLines.length > 0 ? vehicleLines : [{ id: makeId("av_"), select: "", qty: "", isNew: true }]
      };
    });

    console.log("[v0] Prefilled agents from allocations:", prefilteredAgents);
    setAgents(prefilteredAgents);
  };

  // Refetch trip data and availability after updates
  const fetchTripData = async () => {
    try {
      console.log("[v0] Starting refetch of trip data for trip:", tripId);
      const [tripDataRes, availabilityRes, tripRulesRes] = await Promise.all([
        tripsApi.getTripById(tripId).catch(err => {
          console.error("[v0] Error refetching trip:", err.message);
          return null;
        }),
        tripsApi.getAvailabilities(tripId).catch(err => {
          console.error("[v0] Error refetching availabilities:", err.message);
          return null;
        }),
        tripsApi.getTicketingRules(tripId).catch(err => {
          console.error("[v0] Error refetching trip's ticketing rules:", err.message);
          return { data: { ticketingRules: [] } };
        })
      ]);

      // Update form with trip data
      if (tripDataRes) {
        const tripData = tripDataRes.data || tripDataRes;
        console.log("[v0] Trip data refetched:", tripData);

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
      }

      // Update availability data
      if (availabilityRes) {
        const availData = availabilityRes.data || availabilityRes;
        console.log("[v0] Availability data refetched:", availData);

        if (Array.isArray(availData)) {
          setAvailabilitiesList(availData);
          if (availData.length > 0) {
            const firstAvail = availData[0];
            setSelectedAvailabilityId(firstAvail._id || "");

            // Process passengers
            const passengerData = firstAvail.availabilityTypes?.find(a => a.type === "passenger");
            const processedPassengers = passengerData?.cabins?.map(cabin => ({
              id: makeId("p_"),
              trip: tripId,
              cabin: cabin.cabin?.name || cabin.cabin || "",
              seats: cabin.seats?.toString() || "",
              isNew: false
            })) || [{ id: makeId("p_"), trip: "", cabin: "", seats: "", isNew: true }];
            setPassengers(processedPassengers);

            // Process cargo
            const cargoData = firstAvail.availabilityTypes?.find(a => a.type === "cargo");
            const processedCargo = cargoData?.cabins?.map(cabin => ({
              id: makeId("c_"),
              trip: tripId,
              type: cabin.cabin?.name || cabin.cabin || "",
              spots: cabin.seats?.toString() || "",
              isNew: false
            })) || [{ id: makeId("c_"), trip: "", type: "", spots: "", isNew: true }];
            setCargo(processedCargo);

            // Process vehicles
            const vehicleData = firstAvail.availabilityTypes?.find(a => a.type === "vehicle");
            const processedVehicles = vehicleData?.cabins?.map(cabin => ({
              id: makeId("v_"),
              trip: tripId,
              type: cabin.cabin?.name || cabin.cabin || "",
              spots: cabin.seats?.toString() || "",
              isNew: false
            })) || [{ id: makeId("v_"), trip: "", type: "", spots: "", isNew: true }];
            setVehicles(processedVehicles);

            // Process trip availability for allocations
            setSelectedTripAvailability({
              passenger: firstAvail.availabilityTypes?.find(a => a.type === "passenger")?.cabins || [],
              cargo: firstAvail.availabilityTypes?.find(a => a.type === "cargo")?.cabins || [],
              vehicle: firstAvail.availabilityTypes?.find(a => a.type === "vehicle")?.cabins || []
            });
          }
        }
      }

      // Update ticketing rules
      const tripRulesData = tripRulesRes?.data || {};
      if (tripRulesData.ticketingRules && tripRulesData.ticketingRules.length > 0) {
        console.log("[v0] Trip ticketing rules refetched:", tripRulesData.ticketingRules);
        setAssignedTripRules(tripRulesData.ticketingRules);
      }
    } catch (error) {
      console.error("[v0] Error refetching trip data:", error.message);
    }
    console.log("[v0] Trip data refetch cycle completed");
  };

  // Fetch agent allocations for trip
  const fetchAgentAllocations = async () => {
    try {
      setLoadingAllocations(true);
      console.log("[v0] Fetching allocations for trip:", tripId);
      const response = await tripsApi.getAgentAllocationsByTrip(tripId);
      console.log("[v0] Agent allocations fetched:", response);
      const allocationsData = response.data || [];
      setAgentAllocations(allocationsData);

      // Prefill the form with fetched allocations
      if (allocationsData && allocationsData.length > 0) {
        console.log("[v0] Prefilling agents from fetched allocations");
        prefillAgentsFromAllocations(allocationsData);
      } else {
        console.log("[v0] No allocations found, keeping current agents");
      }
    } catch (error) {
      console.error("[v0] Error fetching allocations:", error);
      // Don't show error alert - allocations might not exist yet
      setAgentAllocations([]);
    } finally {
      setLoadingAllocations(false);
      console.log("[v0] Allocation fetch completed");
    }
  };

  // Auto-load allocations when trip is loaded
  useEffect(() => {
    if (tripId) {
      fetchAgentAllocations();
    }
  }, [tripId]);

  // Sync assignedTripRules to tripRules when assignedTripRules updates and tripRules is still empty
  useEffect(() => {
    if (assignedTripRules.length > 0 && tripRules.length === 1 && tripRules[0].ruleId === "") {
      const prefillRules = assignedTripRules.map((tr) => ({
        id: makeId("r_"),
        trip: tripId,
        ruleType: tr.ruleType === "VOID" ? "Void" : tr.ruleType === "REFUND" ? "Refund" : "Reissue",
        ruleId: (tr.rule && typeof tr.rule === "object" && tr.rule._id) ? tr.rule._id : "",
        ruleName: (tr.rule && typeof tr.rule === "object" && tr.rule.ruleName) ? tr.rule.ruleName : "",
        isFromBackend: true
      }));
      console.log("[v0] Syncing assignedTripRules to tripRules:", prefillRules);
      setTripRules(prefillRules);
    }
  }, [assignedTripRules]);

  // Sync ruleName with ticketingRulesByType when dropdown options load
  // This ensures prefilled rules display correctly even if they were set before options loaded
  useEffect(() => {
    if (!tripRules.length || !Object.keys(ticketingRulesByType).length) return;

    setTripRules((prev) =>
      prev.map((rule) => {
        if (!rule.ruleId || rule.ruleName) return rule;

        const ruleTypeKey =
          rule.ruleType === "Void"
            ? "VOID"
            : rule.ruleType === "Refund"
              ? "REFUND"
              : "REISSUE";

        const availableRules = ticketingRulesByType[ruleTypeKey] || [];
        const matchedRule = availableRules.find((r) => r._id === rule.ruleId);

        return matchedRule
          ? { ...rule, ruleName: matchedRule.ruleName }
          : rule;
      })
    );
  }, [ticketingRulesByType]);

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
        const rulesWithValidSelection = tripRules.filter(rule => rule.ruleId && rule.ruleType);

        if (rulesWithValidSelection.length > 0) {
          const ticketingRulesPayload = {
            ticketingRules: rulesWithValidSelection.map(rule => {
              const ruleTypeKey = rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE";
              return {
                ruleType: ruleTypeKey,
                rule: rule.ruleId
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

      // Refetch trip data and agent allocations to update UI
      setLoadingData(true);
      await Promise.all([
        fetchTripData(),
        fetchAgentAllocations()
      ]);
      setLoadingData(false);
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

      // Get new agents only (for batch create via Save Allocation button)
      const newAgents = agents.filter(a => a.isNew);

      // Process new agents using createAgentAllocations API (batch create)
      if (newAgents.length > 0) {
        const newAgentsPayload = newAgents
          .filter(agent => {
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

        if (newAgentsPayload.length > 0) {
          console.log("[v0] Creating allocations for new agents with payload:", newAgentsPayload);
          await tripsApi.createAgentAllocations(tripId, selectedAvailabilityId, newAgentsPayload);
        }
      }

      console.log("[v0] Agent allocations saved successfully");

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Agent allocations saved successfully!",
        confirmButtonText: "OK"
      });

      // Reload allocations to refresh the data
      fetchAgentAllocations();
    } catch (error) {
      console.error("[v0] Error saving agent allocations:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save agent allocations. Please try again."
      });
    }
  };

  // Update a single existing agent allocation
  const updateExistingAgentAllocation = async (agent) => {
    try {
      if (!tripId || !selectedAvailabilityId || !agent.allocationId) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Missing required data for update"
        });
        return;
      }

      const hasPassenger = agent.passengerLines.some(p => p.select && p.qty);
      const hasCargo = agent.cargoLines.some(c => c.select && c.qty);
      const hasVehicle = agent.vehicleLines.some(v => v.select && v.qty);

      if (!hasPassenger && !hasCargo && !hasVehicle) {
        Swal.fire({
          icon: "warning",
          title: "Validation Error",
          text: "Please allocate at least one item to this agent"
        });
        return;
      }

      Swal.fire({
        title: "Updating Agent Allocation",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

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

      const payload = {
        allocations: allocations
      };

      console.log("[v0] Updating existing agent allocation:", agent.agentId, "Payload:", payload);
      await tripsApi.updateAgentAllocationById(tripId, selectedAvailabilityId, agent.allocationId, payload);

      console.log("[v0] Agent allocation updated successfully");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Agent allocation updated successfully!",
        confirmButtonText: "OK"
      });

      // Reload allocations and trip data to refresh the data
      console.log("[v0] Refetching data after agent allocation update");
      setLoadingData(true);
      await fetchTripData();
      await fetchAgentAllocations();
      setLoadingData(false);
      console.log("[v0] Data refetch completed and form updated");
    } catch (error) {
      console.error("[v0] Error updating agent allocation:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to update agent allocation. Please try again."
      });
    }
  };

  const onSaveTicketingRules = async () => {
    try {
      // Filter rules that have both ruleType and ruleId selected
      const rulesWithValidSelection = tripRules.filter(rule => {
        const hasRuleType = rule.ruleType && rule.ruleType.trim() !== "";
        const hasRuleId = rule.ruleId && rule.ruleId.trim() !== "";
        return hasRuleType && hasRuleId;
      });

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

      // Build complete payload with all rule data from API
      const ticketingRulesPayload = {
        ticketingRules: rulesWithValidSelection.map(rule => {
          const ruleTypeKey = rule.ruleType === "Void" ? "VOID" : rule.ruleType === "Refund" ? "REFUND" : "REISSUE";

          // Get the full rule object from ticketingRulesByType to send complete payload
          const ruleTypeMapping = {
            "VOID": ticketingRulesByType.VOID,
            "REFUND": ticketingRulesByType.REFUND,
            "REISSUE": ticketingRulesByType.REISSUE
          };

          const availableRules = ruleTypeMapping[ruleTypeKey] || [];
          const fullRuleObject = availableRules.find(r => r._id === rule.ruleId);

          console.log("[v0] Processing rule:", rule);
          console.log("[v0] Rule type key:", ruleTypeKey);
          console.log("[v0] Full rule object found:", fullRuleObject);
          console.log("[v0] Sending rule object:", fullRuleObject || { _id: rule.ruleId, ruleName: rule.ruleName });

          return {
            ruleType: ruleTypeKey,
            rule: fullRuleObject ? fullRuleObject._id : rule.ruleId
          };
        })
      };

      console.log("[v0] Final ticketing rules payload:", ticketingRulesPayload);
      const response = await tripsApi.updateTicketingRules(tripId, ticketingRulesPayload);

      // Keep all valid rules and add empty rule for adding more
      const updatedRules = [
        ...rulesWithValidSelection,
        { id: makeId("r_"), trip: "", ruleType: "Refund", ruleId: "", ruleName: "", isFromBackend: false }
      ];
      setTripRules(updatedRules);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Ticketing rules saved successfully!",
        confirmButtonText: "OK"
      });

      // Refetch trip data to update UI with latest rules
      console.log("[v0] Refetching trip data after ticketing rules update");
      setLoadingData(true);
      await fetchTripData();
      setLoadingData(false);
      console.log("[v0] Trip data refetch completed and form updated");
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
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        {/* UPDATE action - uses LIST route path for permission check */}
        <Can action="update" path="/company/ship-trip/trips">
          <div className="content container-fluid">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/company/ship-trip/trips" className="btn btn-turquoise">
                <i className="bi bi-arrow-left"></i> Back to List
              </Link>
            </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Edit Ferry Trip</h5>
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
                    <EditTripTabsContainer
                      mainTab={mainTab}
                      setMainTab={setMainTab}
                      availInnerTab={availInnerTab}
                      setAvailInnerTab={setAvailInnerTab}
                      form={form}
                      onFormChange={onFormChange}
                      onStatusChange={onStatusChange}
                      ships={ships}
                      ports={ports}
                      loadingData={loadingData}
                      passengers={passengers}
                      cargo={cargo}
                      vehicles={vehicles}
                      selectedTripCapacity={selectedTripCapacity}
                      selectedTripAvailability={selectedTripAvailability}
                      updatePassenger={updatePassenger}
                      removePassenger={removePassenger}
                      addPassenger={addPassenger}
                      updateCargo={updateCargo}
                      removeCargo={removeCargo}
                      addCargo={addCargo}
                      updateVehicle={updateVehicle}
                      removeVehicle={removeVehicle}
                      addVehicle={addVehicle}
                      onSaveAvailability={onSaveAvailability}
                      agents={agents}
                      partners={partners}
                      setAgents={setAgents}
                      removeAgent={removeAgent}
                      removeAgentLine={removeAgentLine}
                      updateAgentLine={updateAgentLine}
                      addAgentLine={addAgentLine}
                      addAgent={addAgent}
                      updateExistingAgentAllocation={updateExistingAgentAllocation}
                      onSaveAgentAllocations={onSaveAgentAllocations}
                      tripRules={tripRules}
                      ticketingRulesByType={ticketingRulesByType}
                      assignedTripRules={assignedTripRules}
                      updateTripRule={updateTripRule}
                      handleRuleTypeChange={handleRuleTypeChange}
                      removeTripRule={removeTripRule}
                      addTripRule={addTripRule}
                      onSaveTicketingRules={onSaveTicketingRules}
                    />
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
