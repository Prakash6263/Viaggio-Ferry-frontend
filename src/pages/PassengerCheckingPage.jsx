// src/pages/PassengerCheckingPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper";

/**
 * Demo trips and traveler dataset (copied/adapted from your original HTML example)
 * Replace with real API calls when available.
 */
const demoTrips = [
  {
    id: "TRIP001",
    vesselName: "MV Ocean Queen",
    voyageNo: "VQ-101",
    from: "Port Said",
    to: "Jeddah",
    etd: "2025-09-12T09:00:00",
    eta: "2025-09-13T06:00:00",
  },
  {
    id: "TRIP002",
    vesselName: "MV Sea Voyager",
    voyageNo: "SV-202",
    from: "Jeddah",
    to: "Port Said",
    etd: "2025-09-15T14:00:00",
    eta: "2025-09-16T11:00:00",
  },
  {
    id: "TRIP003",
    vesselName: "MV Island Ferry",
    voyageNo: "IF-305",
    from: "Hurghada",
    to: "Sharm El Sheikh",
    etd: "2025-09-18T08:30:00",
    eta: "2025-09-18T13:45:00",
  },
];

const paymentAccounts = {
  cash: [{id:'cash-1', name:'Main Cash Register'}, {id:'cash-2', name:'Secondary Cash'}],
  bank: [{id:'bank-1', name:'ABC Bank - 001'}, {id:'bank-2', name:'XYZ Bank - 002'}]
};

const travelerData = {
  BARCODE123: {
    passengers: [
      {
        passengerDetails: {
          name: "John Doe",
          nationality: "Egyptian",
          passportNo: "A1234567",
          expiryDate: "2028-12-31",
          age: 35,
          gender: "Male",
          email: "john.doe@example.com",
          type: "Adult",
        },
        ticketDetails: {
          ticketNo: "TKN12345",
          cabin: "First Class",
          ticketType: "One-Way",
          serviceType: "Standard",
          visaType: "Tourist",
          allowedWeight: 20,
          status: "Booked",
        },
      },
      {
        passengerDetails: {
          name: "Jane Doe",
          nationality: "Egyptian",
          passportNo: "A7654321",
          expiryDate: "2027-05-20",
          age: 32,
          gender: "Female",
          email: "jane.doe@example.com",
          type: "Adult",
        },
        ticketDetails: {
          ticketNo: "TKN12346",
          cabin: "First Class",
          ticketType: "One-Way",
          serviceType: "Standard",
          visaType: "Tourist",
          allowedWeight: 20,
          status: "Booked",
        },
      },
    ],
    agentDetails: {
      company: "Sabihat Marine Services",
      marineAgent: "Blue Ocean Logistics",
      commercialAgent: "Global Freight Forwarders",
      subagent: "Local Travel Co.",
      salesman: "Alex Smith",
    },
    tripDetails: {
      vesselName: "MV Ocean Queen",
      voyageNo: "VQ-101",
      from: "Port Said",
      to: "Jeddah",
      etd: "2025-09-12 09:00",
      eta: "2025-09-13 06:00",
    },
  },

  BARCODE456: {
    passengers: [
      {
        passengerDetails: {
          name: "Jane Smith",
          nationality: "American",
          passportNo: "B9876543",
          expiryDate: "2027-05-20",
          age: 28,
          gender: "Female",
          email: "jane.smith@example.com",
          type: "Adult",
        },
        ticketDetails: {
          ticketNo: "TKN12346",
          cabin: "Economy",
          ticketType: "Round-Trip",
          serviceType: "Standard",
          visaType: "Work",
          allowedWeight: 15,
          status: "Confirmed",
        },
      },
    ],
    agentDetails: {
      company: "Sabihat Marine Services",
      marineAgent: "Red Sea Transport",
      commercialAgent: "International Agents Inc.',",
      subagent: "City Travel Co.",
      salesman: "Maria Rodriguez",
    },
    tripDetails: {
      vesselName: "MV Sea Voyager",
      voyageNo: "SV-202",
      from: "Jeddah",
      to: "Port Said",
      etd: "2025-09-15 14:00",
      eta: "2025-09-16 11:00",
    },
  },
};

export default function PassengerCheckingPage() {
  // trips and UI state
  const [trips] = useState(demoTrips);
  const [showTripSelection, setShowTripSelection] = useState(true);
  const [showCheckinPage, setShowCheckinPage] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // scan & traveler state
  const [barcode, setBarcode] = useState("");
  const [currentTraveler, setCurrentTraveler] = useState(null);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("passengers");

  // manifest rows
  const [manifestRows, setManifestRows] = useState([]);
  const [excessLuggageRows, setExcessLuggageRows] = useState([]);

  // luggage / other flags
  const [allowLuggageSection, setAllowLuggageSection] = useState(false);
  const [luggageItems, setLuggageItems] = useState([]);
  const [showExcessPayment, setShowExcessPayment] = useState(false);
  const [showLuggageLabel, setShowLuggageLabel] = useState(false);
  const [showBoardingPass, setShowBoardingPass] = useState(false);

  // Excess Payment State
  const [excessDetails, setExcessDetails] = useState({
    weight: 0,
    fee: 0,
    totalFee: 0,
    ticketNo: "",
    allowedWeight: 0,
    actualWeight: 0,
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [transactionNo, setTransactionNo] = useState("");

  // format date helper
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    // initialize page in trip-selection
    setShowTripSelection(true);
    setShowCheckinPage(false);
  }, []);

  function handleTripSelect(trip) {
    setShowTripSelection(false);
    setShowCheckinPage(true);
    setSelectedTrip(trip);

    // reset any session state
    resetSession();
  }

  function resetSession() {
    setCurrentTraveler(null);
    setCurrentPassengerIndex(0);
    setBarcode("");
    setAllowLuggageSection(false);
    setLuggageItems([]);
    setShowExcessPayment(false);
    setShowLuggageLabel(false);
    setShowBoardingPass(false);
    setPaymentMethod("");
    setPaymentAccount("");
    setTransactionNo("");
  }

  // Scan handler - loads traveler data if barcode exists in demo dataset
  function handleScan(e) {
    if (e) e.preventDefault?.();
    const code = barcode?.trim();
    if (!code) {
      alert("Enter barcode/document number.");
      return;
    }
    const trav = travelerData[code];
    if (!trav) {
      alert("Document not found.");
      return;
    }

    // initialize traveler and passenger flags
    const travCopy = JSON.parse(JSON.stringify(trav)); // shallow clone
    travCopy.passengers = travCopy.passengers.map((p) => ({ ...p, verified: false, checkedIn: false }));
    setCurrentTraveler(travCopy);
    setCurrentPassengerIndex(0);
    setAllowLuggageSection(false);
    
    // Reset luggage state for new scan
    setLuggageItems([]);
    setShowExcessPayment(false);
    setShowLuggageLabel(false);
    setShowBoardingPass(false);
    
    // Add initial luggage line
    addLuggageLine(travCopy.passengers[0].ticketDetails.ticketNo);
  }

  function changePassengerIndex(newIndex) {
    if (!currentTraveler) return;
    const max = currentTraveler.passengers.length - 1;
    const idx = Math.max(0, Math.min(newIndex, max));
    setCurrentPassengerIndex(idx);
    
    // reset luggage area visibility when changing passenger
    setAllowLuggageSection(false);
    setShowExcessPayment(false);
    setShowLuggageLabel(false);
    setShowBoardingPass(false);
    
    // Reset luggage items for new passenger
    const ticketNo = currentTraveler.passengers[idx].ticketDetails.ticketNo;
    setLuggageItems([]);
    addLuggageLine(ticketNo);
    
    // Check if already verified to show luggage section
    if (currentTraveler.passengers[idx].verified) {
        setAllowLuggageSection(true);
    }
  }

  function toggleVerifiedForCurrent(e) {
    if (!currentTraveler) return;
    const clone = { ...currentTraveler };
    clone.passengers = clone.passengers.map((p, i) => (i === currentPassengerIndex ? { ...p, verified: e.target.checked } : p));
    setCurrentTraveler(clone);

    // if verified, show luggage section
    setAllowLuggageSection(e.target.checked);
    
    if (!e.target.checked) {
        setShowExcessPayment(false);
        setShowLuggageLabel(false);
        setShowBoardingPass(false);
    }
  }

  // Luggage Functions
  function addLuggageLine(ticketNoOverride) {
    const ticketNo = ticketNoOverride || (currentTraveler?.passengers[currentPassengerIndex]?.ticketDetails?.ticketNo || "TKN-00");
    const nextIndex = luggageItems.length + 1;
    const labelNo = `${ticketNo}-${nextIndex.toString().padStart(2, '0')}`;
    
    setLuggageItems(prev => [...prev, {
        id: Date.now(),
        labelNo,
        trolleyNo: "",
        weight: ""
    }]);
  }

  function removeLuggageLine(id) {
    setLuggageItems(prev => {
        const filtered = prev.filter(item => item.id !== id);
        // Re-index labels
        const ticketNo = currentTraveler?.passengers[currentPassengerIndex]?.ticketDetails?.ticketNo || "TKN-00";
        return filtered.map((item, index) => ({
            ...item,
            labelNo: `${ticketNo}-${(index + 1).toString().padStart(2, '0')}`
        }));
    });
  }

  function updateLuggageItem(id, field, value) {
    setLuggageItems(prev => prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
    ));
  }

  function confirmLuggage() {
    if (!currentTraveler) return;
    
    const p = currentTraveler.passengers[currentPassengerIndex];
    const totalWeight = luggageItems.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);
    const allowedWeight = p.ticketDetails.allowedWeight || 0;
    const excess = Math.max(0, totalWeight - allowedWeight);
    
    if (excess > 0) {
        const feeRate = 5.00;
        const timestamp = Date.now().toString().slice(-6);
        
        setExcessDetails({
            weight: excess,
            fee: feeRate,
            totalFee: excess * feeRate,
            ticketNo: `EXC-${p.ticketDetails.ticketNo}-${timestamp}`,
            allowedWeight: allowedWeight,
            actualWeight: totalWeight
        });
        setShowExcessPayment(true);
        setShowLuggageLabel(false);
    } else {
        setShowExcessPayment(false);
        setShowLuggageLabel(true);
    }
  }

  function confirmPayment() {
    if (!paymentMethod || !paymentAccount || !transactionNo.trim()) {
        alert('Please enter payment method, account and transaction number before confirming payment.');
        return;
    }

    // Add to excess luggage table
    const p = currentTraveler.passengers[currentPassengerIndex];
    const accountName = paymentAccounts[paymentMethod]?.find(a => a.id === paymentAccount)?.name || "";
    
    const newExcessRow = {
        vesselName: currentTraveler.tripDetails.vesselName,
        voyageNo: currentTraveler.tripDetails.voyageNo,
        from: currentTraveler.tripDetails.from,
        to: currentTraveler.tripDetails.to,
        etd: currentTraveler.tripDetails.etd,
        eta: currentTraveler.tripDetails.eta,
        ticketNo: p.ticketDetails.ticketNo,
        cabin: p.ticketDetails.cabin,
        ticketType: p.ticketDetails.ticketType,
        serviceType: p.ticketDetails.serviceType,
        visaType: p.ticketDetails.visaType,
        allowedWeight: p.ticketDetails.allowedWeight,
        name: p.passengerDetails.name,
        nationality: p.passengerDetails.nationality,
        passportNo: p.passengerDetails.passportNo,
        expiryDate: p.passengerDetails.expiryDate,
        age: p.passengerDetails.age,
        gender: p.passengerDetails.gender,
        excessTicketNo: excessDetails.ticketNo,
        allowedWeightVal: excessDetails.allowedWeight,
        actualWeight: excessDetails.actualWeight,
        excessWeight: excessDetails.weight,
        feeRate: excessDetails.fee,
        totalFee: excessDetails.totalFee,
        paymentMethod,
        paymentAccount: accountName,
        transactionNo
    };

    setExcessLuggageRows(prev => [...prev, newExcessRow]);
    setShowExcessPayment(false);
    setShowLuggageLabel(true);
  }

  function printLabel() {
    alert('Label sent to printer.');
    setShowLuggageLabel(false);
    setShowBoardingPass(true);
  }

  function addManifestRowFromCurrent() {
    if (!selectedTrip || !currentTraveler) return;

    const p = currentTraveler.passengers[currentPassengerIndex];
    const totalWeight = luggageItems.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0);
    const allowedWeight = p.ticketDetails.allowedWeight || 0;
    const excessWeight = Math.max(0, totalWeight - allowedWeight);

    const row = {
      vesselName: selectedTrip.vesselName,
      voyageNo: selectedTrip.voyageNo,
      from: selectedTrip.from,
      to: selectedTrip.to,
      etd: selectedTrip.etd,
      eta: selectedTrip.eta,
      ticketNo: p.ticketDetails.ticketNo || "-",
      cabin: p.ticketDetails.cabin || "-",
      ticketType: p.ticketDetails.ticketType || "-",
      serviceType: p.ticketDetails.serviceType || "-",
      visaType: p.ticketDetails.visaType || "-",
      allowedWeight: p.ticketDetails.allowedWeight ?? "-",
      name: p.passengerDetails.name || "-",
      nationality: p.passengerDetails.nationality || "-",
      passportNo: p.passengerDetails.passportNo || "-",
      expiryDate: p.passengerDetails.expiryDate || "-",
      age: p.passengerDetails.age || "-",
      gender: p.passengerDetails.gender || "-",
      actualWeight: totalWeight,
      excessWeight: excessWeight,
      status: "Checked In",
    };

    setManifestRows((prev) => [...prev, row]);
  }

  function confirmCheckin() {
    if (!currentTraveler) return;

    // mark current passenger checked in
    const clone = { ...currentTraveler };
    clone.passengers = clone.passengers.map((p, i) => (i === currentPassengerIndex ? { ...p, checkedIn: true } : p));
    setCurrentTraveler(clone);

    // add manifest row
    addManifestRowFromCurrent();
    
    alert(`Check-in confirmed for ${currentTraveler.passengers[currentPassengerIndex].passengerDetails.name}`);

    // move to next passenger or finish trip
    if (currentPassengerIndex < clone.passengers.length - 1) {
      changePassengerIndex(currentPassengerIndex + 1);
    } else {
      alert("All passengers checked in successfully!");
      // return to trip selection (reset)
      setShowCheckinPage(false);
      setShowTripSelection(true);
      setSelectedTrip(null);
      resetSession();
    }
  }

  // Render helpers to read currently selected passenger/ticket safely
  const currentPassenger = currentTraveler ? currentTraveler.passengers[currentPassengerIndex] : null;
  const frozenTrip = currentTraveler ? currentTraveler.tripDetails : selectedTrip || null;
  const agentDetails = currentTraveler ? currentTraveler.agentDetails : null;

  return (
    <>
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <style
            dangerouslySetInnerHTML={{
              __html: `
    * { box-sizing: border-box; }
    h1,h2,h3,h4 { margin:0 0 10px 0; }
    .trip-list-item { padding:14px; border-bottom:1px solid #eee; cursor:pointer; }
    .hidden { display:none; }
    .tab-container {  margin-bottom:18px;     border-bottom: 1px solid #ddd;}
    .tab-button { flex:1;     padding: 8px 15px; border-radius:8px 8px 0 0;   background: #002b5c; border: none;cursor: pointer;color: #fff; font-weight:600; }
    .tab-button.active { background:linear-gradient(90deg, #00B5AD, #00D2CB) !important; border: 1px solid;color: #fff;border-color: #ddd !important; }
    .grid-container { display:grid; grid-template-columns: 1fr 1fr; gap:28px; }
    .left-panel { padding:12px;  border-radius:8px;     box-shadow: -5px -5px 9px rgb(255 255 255 / 14%), 5px 5px 9px rgb(94 104 121 / 17%); min-height:460px;}
    .right-panel { padding:12px;  border-radius:8px; }
    .checkin-section {  padding:10px; margin-bottom:12px; border-radius:8px;     box-shadow: -5px -5px 9px rgb(255 255 255 / 14%), 5px 5px 9px rgb(94 104 121 / 17%); }
    .form-label { font-size:0.8rem;  margin-bottom:6px; }
    .document-value, input.document-value, select.document-value { display:block; width:100%; padding:6px 8px; border:1px solid #ccd0d6; border-radius:6px;  }
    .button-container { display:flex; justify-content:flex-end; margin-top:8px; }
    button { cursor:pointer; }
    .actions { text-align:right; margin-top:10px; }
    .details-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:8px; }
    .document-card { padding:10px; border-radius:8px;     box-shadow: -5px -5px 9px rgb(255 255 255 / 14%), 5px 5px 9px rgb(94 104 121 / 17%); margin-bottom:12px; }
    .passenger-navigation { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px;  border-radius:8px; border:1px solid #e6e9ed; margin-bottom:10px; }
    .nav-button { width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; border:none; background:linear-gradient(90deg, #00B5AD, #00D2CB) !important; color:#fff; font-size:16px; }
    .nav-button:disabled { background:#bfcff8; color:#fff; cursor:not-allowed; }
    .luggage-header, .luggage-input-line { display:grid; grid-template-columns: 2fr 2fr 1fr auto; gap:8px; align-items:center; margin-bottom:6px; }
    .luggage-input-line input { padding:6px; border-radius:6px; border:1px solid #ccd0d6; }
    .remove-luggage-line { background:#dc3545; color:#fff; border:none; padding:6px 8px; border-radius:6px; }
    #luggage-label, #boarding-pass {  padding:12px; border-radius:8px; box-shadow: -5px -5px 9px rgb(255 255 255 / 14%), 5px 5px 9px rgb(94 104 121 / 17%); }
    .luggage-table { width:100%; border-collapse:collapse; margin-top:8px; }
    .luggage-table th, .luggage-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .excess-luggage-table { width:100%; border-collapse:collapse; margin-top:8px; overflow-x:auto; }
    .excess-luggage-table th, .excess-luggage-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .excess-luggage-table th { background-color:#f8f9fa; position: sticky; top:0; }
    .excess-luggage-table-container { max-width:100%; overflow-x:auto; }
    .passenger-manifest-table { width:100%; border-collapse:collapse; margin-top:8px; overflow-x:auto; }
    .passenger-manifest-table th, .passenger-manifest-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .passenger-manifest-table th { background-color:#f8f9fa; position: sticky; top:0; }
    .passenger-manifest-table-container { max-width:100%; overflow-x:auto; }
    .boarding-pass-actions { display:flex; justify-content:space-between; margin-top:15px; }
    .boarding-pass-actions button { padding:8px 16px; border-radius:6px; border:none; font-weight:600; }
    .print-btn { background:#0d6efd; color:#fff; }
    .confirm-btn { background:#198754; color:#fff; }
    .trip-selection-table { width: 100%; border-collapse: collapse; margin-top: 14px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .trip-selection-table th { background-color: #0b5ed7; color: white; padding: 12px 15px; text-align: left; font-weight: 600; position: sticky; top: 0; }
    .trip-selection-table td { padding: 12px 15px; border-bottom: 1px solid #eee; }
    .trip-selection-table tr:last-child td { border-bottom: none; }
    .trip-selection-table tr:hover { background-color: #eaf3ff; }
    .trip-selection-table .trip-time { color: #555; font-size: 0.9rem; }
    @media (max-width:800px) { 
      .grid-container{ grid-template-columns: 1fr; } 
      .details-grid{ grid-template-columns: 1fr; } 
      .boarding-pass-actions{ flex-direction:column; gap:8px; }
      .trip-selection-table th, .trip-selection-table td { padding: 8px 10px; font-size: 0.85rem; }
    }`,
            }}
          />
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <h5 className="mb-3">Passenger CheckIn</h5>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-2">
                  <div className="card-body">
                    {/* Trip selection */}
                    {showTripSelection && (
                      <div id="trip-selection-page" className="container">
                        <h5 className="mb-3">Select a Trip to Begin Check-in</h5>
                        <table className="table trip-selection-table table-striped">
                          <thead>
                            <tr>
                              <th>Vessel Name</th>
                              <th>Voyage No</th>
                              <th>From</th>
                              <th>To</th>
                              <th>ETD</th>
                              <th>ETA</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody id="trip-list">
                            {trips.map((t) => (
                              <tr key={t.id} className="trip-list-item" onClick={() => handleTripSelect(t)}>
                                <td>{t.vesselName}</td>
                                <td>{t.voyageNo}</td>
                                <td>{t.from}</td>
                                <td>{t.to}</td>
                                <td className="trip-time">{formatDate(t.etd)}</td>
                                <td className="trip-time">{formatDate(t.eta)}</td>
                                <td>--</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Checkin page */}
                    {showCheckinPage && (
                      <div id="checkin-page" className="container">
                        <h5 id="trip-header">
                          {selectedTrip ? `${selectedTrip.vesselName} ${selectedTrip.voyageNo} — Check-in` : ""}
                        </h5>

                        <div className="tab-container" style={{ marginTop: 12 }}>
                          <button className={`tab-button ${activeTab === "passengers" ? "active" : ""}`} onClick={() => setActiveTab("passengers")}>Passengers</button>
                          <button className={`tab-button ${activeTab === "excess-luggage" ? "active" : ""}`} onClick={() => setActiveTab("excess-luggage")}>Excess Luggage Tickets</button>
                          <button className={`tab-button ${activeTab === "passenger-manifest" ? "active" : ""}`} onClick={() => setActiveTab("passenger-manifest")}>Passenger Manifest</button>
                        </div>

                        {activeTab === "passengers" && (
                          <div id="passengers" className="tab-content active">
                            <h5 className="mb-3">Passengers Check-in</h5>
                            <div className="grid-container">
                              <div className="left-panel">
                                <div className="checkin-section">
                                  <h3 style={{ fontSize: "0.98rem" }}>1. Scan Document</h3>
                                  <div style={{ marginTop: 8 }}>
                                    <div className="form-label">Barcode or Document Number</div>
                                    <input
                                      className="document-value"
                                      placeholder="Scan barcode or enter number"
                                      value={barcode}
                                      onChange={(e) => setBarcode(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") handleScan(e);
                                      }}
                                    />
                                    <div className="button-container">
                                      <button id="scan-button" style={{ padding: "8px 12px", borderRadius: 6, background: "linear-gradient(90deg, #00B5AD, #00D2CB)", color: "#fff", border: "none", marginTop: 8 }} onClick={handleScan}>
                                        Go
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div id="traveler-info" className={`checkin-section ${currentTraveler ? "" : "hidden"}`} >
                                  <h3 style={{ fontSize: "0.98rem" }}>2. Traveler Details</h3>
                                  <div style={{ fontSize: "0.9rem", marginTop: 6 }} className="form-label">
                                    Passenger verification is done in the right panel (Passenger Details). Luggage opens only after all passengers are verified.
                                  </div>
                                  {currentTraveler && (
                                    <div style={{ marginTop: 8 }}>
                                      <div>Selected Trip: <strong>{currentTraveler.tripDetails.vesselName} ({currentTraveler.tripDetails.voyageNo})</strong></div>
                                      <div style={{ marginTop: 6 }}>Passengers: <strong>{currentTraveler.passengers.length}</strong></div>
                                    </div>
                                  )}
                                </div>

                                {/* Luggage section */}
                                <section id="luggage-checkin" className={`checkin-section ${allowLuggageSection && !showLuggageLabel && !showBoardingPass ? "" : "hidden"}`}>
                                  <h3 style={{ fontSize: "0.98rem" }}>3. Luggage Check-in</h3>
                                  <div className="form-label" style={{ marginTop: 6 }}>
                                    Total Allowed Weight (sum of passengers):{" "}
                                    <strong>
                                      <span id="allowed-weight">{currentPassenger?.ticketDetails?.allowedWeight || 0}</span> kg
                                    </strong>
                                  </div>
                                  <div className="luggage-header" style={{ marginTop: 10 }}>
                                    <div className="form-label">Luggage label No.</div>
                                    <div className="form-label">Trolley No.</div>
                                    <div className="form-label">Actual Weight (kg)</div>
                                    <div />
                                  </div>
                                  
                                  <div id="luggage-items">
                                    {luggageItems.map((item) => (
                                        <div key={item.id} className="luggage-input-line">
                                            <input type="text" className="luggage-label-no document-value" value={item.labelNo} readOnly />
                                            <input 
                                                type="text" 
                                                className="trolley-no document-value" 
                                                placeholder="Trolley/Tag No." 
                                                value={item.trolleyNo}
                                                onChange={(e) => updateLuggageItem(item.id, 'trolleyNo', e.target.value)}
                                            />
                                            <input 
                                                type="number" 
                                                className="actual-weight document-value" 
                                                step="0.1" 
                                                min="0" 
                                                placeholder="0.0" 
                                                value={item.weight}
                                                onChange={(e) => updateLuggageItem(item.id, 'weight', e.target.value)}
                                            />
                                            <button type="button" className="remove-luggage-line" onClick={() => removeLuggageLine(item.id)}>Remove</button>
                                        </div>
                                    ))}
                                  </div>
                                  
                                  <button id="add-luggage-line" className="btn btn-turquoise" onClick={() => addLuggageLine()}>
                                    Add Luggage Item
                                  </button>
                                  <button
                                    id="confirm-luggage-button"
                                    style={{
                                      marginTop: 8,
                                      padding: "8px 12px",
                                      borderRadius: 6,
                                      background: "#198754",
                                      color: "#fff",
                                      border: "none"
                                    }}
                                    onClick={confirmLuggage}
                                  >
                                    Confirm Luggage
                                  </button>

                                  {/* Excess Payment Section */}
                                  {showExcessPayment && (
                                      <div
                                        id="excess-luggage-payment-section"
                                        style={{
                                          marginTop: 10,
                                          background: "#fffbe6",
                                          border: "1px solid #ffe08a",
                                          padding: 10,
                                          borderRadius: 8
                                        }}
                                      >
                                        <h5 style={{ margin: "0 0 8px 0" }}>Excess Luggage Ticket</h5>
                                        <div
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 12,
                                            marginTop: 10
                                          }}
                                        >
                                          <div>
                                            <div className="form-label">Passenger Name</div>
                                            <input className="document-value" readOnly value={currentPassenger?.passengerDetails?.name || ""} />
                                            <div className="form-label" style={{ marginTop: 8 }}>Passport No</div>
                                            <input className="document-value" readOnly value={currentPassenger?.passengerDetails?.passportNo || ""} />
                                            <div className="form-label" style={{ marginTop: 8 }}>Nationality</div>
                                            <input className="document-value" readOnly value={currentPassenger?.passengerDetails?.nationality || ""} />
                                          </div>
                                          <div>
                                            <div className="form-label">Excess Ticket No</div>
                                            <input className="document-value" readOnly value={excessDetails.ticketNo} />
                                            <div className="form-label" style={{ marginTop: 8 }}>Payment Method</div>
                                            <select 
                                                className="document-value" 
                                                value={paymentMethod}
                                                onChange={(e) => {
                                                    setPaymentMethod(e.target.value);
                                                    setPaymentAccount("");
                                                }}
                                            >
                                              <option value="">Select Payment Method</option>
                                              <option value="cash">Cash</option>
                                              <option value="bank">Bank Transfer</option>
                                            </select>
                                            <div className="form-label" style={{ marginTop: 8 }}>Cash/Bank Account</div>
                                            <select 
                                                className="document-value" 
                                                disabled={!paymentMethod}
                                                value={paymentAccount}
                                                onChange={(e) => setPaymentAccount(e.target.value)}
                                            >
                                              <option value="">Select Account</option>
                                              {paymentMethod && paymentAccounts[paymentMethod]?.map(acc => (
                                                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                                              ))}
                                            </select>
                                            <div className="form-label" style={{ marginTop: 8 }}>Transaction No</div>
                                            <input
                                              className="document-value"
                                              placeholder="Enter transaction number"
                                              value={transactionNo}
                                              onChange={(e) => setTransactionNo(e.target.value)}
                                            />
                                          </div>
                                          <div style={{ gridColumn: "1/3", display: "flex", gap: 8, marginTop: 6 }}>
                                            <div style={{ flex: 1 }}>
                                              <div className="form-label">Allowed Weight (kg)</div>
                                              <input className="document-value" readOnly value={excessDetails.allowedWeight} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                              <div className="form-label">Actual Weight (kg)</div>
                                              <input className="document-value" readOnly value={excessDetails.actualWeight} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                              <div className="form-label">Excess Weight (kg)</div>
                                              <input className="document-value" readOnly value={excessDetails.weight} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                              <div className="form-label">Fee / kg</div>
                                              <input className="document-value" readOnly value={excessDetails.fee.toFixed(2)} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                              <div className="form-label">Total Fee</div>
                                              <input className="document-value" readOnly value={excessDetails.totalFee.toFixed(2)} />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="actions" style={{ marginTop: 8 }}>
                                          <button 
                                            id="confirm-payment-button" 
                                            style={{ background: "#0d6efd" }}
                                            onClick={confirmPayment}
                                          >
                                            Confirm Payment
                                          </button>
                                        </div>
                                      </div>
                                  )}
                                </section>

                                {/* Luggage Label Section */}
                                {showLuggageLabel && (
                                    <div id="luggage-label">
                                      <h5 className="mb-3">Luggage Label</h5>
                                      <div className="document-card">
                                        <h5 className="mb-3">Trip Details</h5>
                                        <div style={{display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8}}>
                                          <div><div className="form-label">Vessel</div><div className="document-value">{currentTraveler.tripDetails.vesselName}</div></div>
                                          <div><div className="form-label">Voyage No</div><div className="document-value">{currentTraveler.tripDetails.voyageNo}</div></div>
                                          <div><div className="form-label">From</div><div className="document-value">{currentTraveler.tripDetails.from}</div></div>
                                          <div><div className="form-label">To</div><div className="document-value">{currentTraveler.tripDetails.to}</div></div>
                                          <div><div className="form-label">ETD</div><div className="document-value">{currentTraveler.tripDetails.etd}</div></div>
                                          <div><div className="form-label">ETA</div><div className="document-value">{currentTraveler.tripDetails.eta}</div></div>
                                        </div>
                                      </div>

                                      <div className="document-card">
                                        <h5 className="mb-3">Passenger</h5>
                                        <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8}}>
                                          <div><div className="form-label">Name</div><div className="document-value">{currentPassenger.passengerDetails.name}</div></div>
                                          <div><div className="form-label">Passport</div><div className="document-value">{currentPassenger.passengerDetails.passportNo}</div></div>
                                          <div><div className="form-label">Nationality</div><div className="document-value">{currentPassenger.passengerDetails.nationality}</div></div>
                                        </div>
                                      </div>

                                      <div className="document-card">
                                        <h5 className="mb-3">Luggage Items</h5>
                                        <table className="table table-striped">
                                          <thead><tr><th>Luggage Label No.</th><th>Trolley No.</th><th>Actual Weight (kg)</th></tr></thead>
                                          <tbody>
                                            {luggageItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.labelNo}</td>
                                                    <td>{item.trolleyNo}</td>
                                                    <td>{item.weight}</td>
                                                </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                        <div style={{textAlign: "center", marginTop: 10}}>
                                          <button 
                                            id="print-label-button" 
                                            style={{padding: "8px 14px", borderRadius: 6, background: "#198754", color: "#fff", border: "none"}}
                                            onClick={printLabel}
                                          >
                                            Print Label
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                )}

                                {/* Boarding Pass Section */}
                                {showBoardingPass && (
                                    <div id="boarding-pass">
                                      <h5 className="mb-3">Boarding Pass</h5>
                                      <div className="document-card">
                                        <h5 className="mb-3">Trip Details</h5>
                                        <div style={{display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8}}>
                                          <div><div className="form-label">Vessel</div><div className="document-value">{currentTraveler.tripDetails.vesselName}</div></div>
                                          <div><div className="form-label">Voyage No</div><div className="document-value">{currentTraveler.tripDetails.voyageNo}</div></div>
                                          <div><div className="form-label">From</div><div className="document-value">{currentTraveler.tripDetails.from}</div></div>
                                          <div><div className="form-label">To</div><div className="document-value">{currentTraveler.tripDetails.to}</div></div>
                                          <div><div className="form-label">ETD</div><div className="document-value">{currentTraveler.tripDetails.etd}</div></div>
                                          <div><div className="form-label">ETA</div><div className="document-value">{currentTraveler.tripDetails.eta}</div></div>
                                        </div>
                                      </div>

                                      <div className="document-card">
                                        <h5 className="mb-3">Ticket Details</h5>
                                        <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8}}>
                                          <div><div className="form-label">Ticket No</div><div className="document-value">{currentPassenger.ticketDetails.ticketNo}</div></div>
                                          <div><div className="form-label">Cabin</div><div className="document-value">{currentPassenger.ticketDetails.cabin}</div></div>
                                          <div><div className="form-label">Ticket Type</div><div className="document-value">{currentPassenger.ticketDetails.ticketType}</div></div>
                                          <div><div className="form-label">Service Type</div><div className="document-value">{currentPassenger.ticketDetails.serviceType}</div></div>
                                          <div><div className="form-label">Visa Type</div><div className="document-value">{currentPassenger.ticketDetails.visaType}</div></div>
                                          <div><div className="form-label">Allowed Weight</div><div className="document-value">{currentPassenger.ticketDetails.allowedWeight}</div></div>
                                          <div><div className="form-label">Status</div><div className="document-value">{currentPassenger.ticketDetails.status}</div></div>
                                        </div>
                                      </div>

                                      <div className="document-card">
                                        <h5 className="mb-3">Passenger Details</h5>
                                        <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8}}>
                                          <div><div className="form-label">Name</div><div className="document-value">{currentPassenger.passengerDetails.name}</div></div>
                                          <div><div className="form-label">Nationality</div><div className="document-value">{currentPassenger.passengerDetails.nationality}</div></div>
                                          <div><div className="form-label">Passport No</div><div className="document-value">{currentPassenger.passengerDetails.passportNo}</div></div>
                                          <div><div className="form-label">Expiry Date</div><div className="document-value">{currentPassenger.passengerDetails.expiryDate}</div></div>
                                          <div><div className="form-label">Age</div><div className="document-value">{currentPassenger.passengerDetails.age}</div></div>
                                          <div><div className="form-label">Gender</div><div className="document-value">{currentPassenger.passengerDetails.gender}</div></div>
                                        </div>
                                      </div>

                                      <div className="document-card">
                                        <h5 className="mb-3">Luggage Details</h5>
                                        <table className="luggage-table">
                                          <thead><tr><th>Luggage Label No.</th><th>Trolley No.</th><th>Actual Weight (kg)</th></tr></thead>
                                          <tbody>
                                            {luggageItems.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.labelNo}</td>
                                                    <td>{item.trolleyNo}</td>
                                                    <td>{item.weight}</td>
                                                </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="boarding-pass-actions">
                                        <button id="print-boarding-pass-btn" className="print-btn" onClick={() => alert('Boarding pass sent to printer.')}>Print Boarding Pass</button>
                                        <button id="confirm-checkin-btn" className="confirm-btn" onClick={confirmCheckin}>Confirm Check-in</button>
                                      </div>
                                    </div>
                                )}
                              </div>

                              <div className="right-panel">
                                <h5 className="mb-3">Travel Document Preview</h5>

                                {/* Passenger navigation */}
                                <div id="passenger-navigation" className={`passenger-navigation ${currentTraveler ? "" : "hidden"}`}>
                                  <button id="prev-passenger-btn" className="nav-button" title="Previous passenger" aria-label="Previous passenger" onClick={() => changePassengerIndex(currentPassengerIndex - 1)} disabled={!currentTraveler || currentPassengerIndex === 0}>
                                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>

                                  <div style={{ fontWeight: 600 }}>
                                    Passenger <span id="current-passenger-num">{currentTraveler ? currentPassengerIndex + 1 : 0}</span> of <span id="total-passengers">{currentTraveler ? currentTraveler.passengers.length : 0}</span>
                                  </div>

                                  <button id="next-passenger-btn" className="nav-button" title="Next passenger" aria-label="Next passenger" onClick={() => changePassengerIndex(currentPassengerIndex + 1)} disabled={!currentTraveler || (currentTraveler && currentPassengerIndex >= currentTraveler.passengers.length - 1)}>
                                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Frozen trip details */}
                                {currentTraveler && (
                                  <>
                                    <div id="frozen-trip-details" className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div className="details-grid">
                                        <div><div className="form-label">Vessel Name</div><div className="document-value">{currentTraveler.tripDetails.vesselName}</div></div>
                                        <div><div className="form-label">Voyage No</div><div className="document-value">{currentTraveler.tripDetails.voyageNo}</div></div>
                                        <div><div className="form-label">From</div><div className="document-value">{currentTraveler.tripDetails.from}</div></div>
                                        <div><div className="form-label">To</div><div className="document-value">{currentTraveler.tripDetails.to}</div></div>
                                        <div><div className="form-label">ETD</div><div className="document-value">{currentTraveler.tripDetails.etd}</div></div>
                                        <div><div className="form-label">ETA</div><div className="document-value">{currentTraveler.tripDetails.eta}</div></div>
                                      </div>
                                    </div>

                                    <div id="frozen-agent-details" className="document-card">
                                      <h5 className="mb-3">Agent Details</h5>
                                      <div className="details-grid">
                                        <div><div className="form-label">Company</div><div className="document-value">{currentTraveler.agentDetails.company}</div></div>
                                        <div><div className="form-label">Marine Agent</div><div className="document-value">{currentTraveler.agentDetails.marineAgent}</div></div>
                                        <div><div className="form-label">Commercial Agent</div><div className="document-value">{currentTraveler.agentDetails.commercialAgent}</div></div>
                                        <div><div className="form-label">Subagent</div><div className="document-value">{currentTraveler.agentDetails.subagent}</div></div>
                                        <div><div className="form-label">Salesman</div><div className="document-value">{currentTraveler.agentDetails.salesman}</div></div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Ticket & Passenger details */}
                                <div id="document-preview" className="document-grid">
                                  <div className="document-card">
                                    <h5 className="mb-3">Ticket Details</h5>
                                    <div className="details-grid">
                                      <div><div className="form-label">Ticket No</div><div className="document-value">{currentPassenger ? currentPassenger.ticketDetails.ticketNo : ""}</div></div>
                                      <div><div className="form-label">Cabin</div><div className="document-value">{currentPassenger ? currentPassenger.ticketDetails.cabin : ""}</div></div>
                                      <div><div className="form-label">Ticket Type</div><div className="document-value">{currentPassenger ? currentPassenger.ticketDetails.ticketType : ""}</div></div>
                                      <div><div className="form-label">Service Type</div><div className="document-value">{currentPassenger ? currentPassenger.ticketDetails.serviceType : ""}</div></div>
                                      <div><div className="form-label">Visa Type</div><div className="document-value">{currentPassenger ? currentPassenger.ticketDetails.visaType : ""}</div></div>
                                      <div><div className="form-label">Allowed Weight</div><div className="document-value">{currentPassenger ? `${currentPassenger.ticketDetails.allowedWeight} kg` : ""}</div></div>
                                      <div><div className="form-label">Status</div><div className="document-value">{currentPassenger ? currentPassenger.ticketDetails.status : ""}</div></div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Passenger Details</h5>
                                    <div className="details-grid">
                                      <div><div className="form-label">Name</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.name : ""}</div></div>
                                      <div><div className="form-label">Nationality</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.nationality : ""}</div></div>
                                      <div><div className="form-label">Passport No</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.passportNo : ""}</div></div>
                                      <div><div className="form-label">Expiry Date</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.expiryDate : ""}</div></div>
                                      <div><div className="form-label">Age</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.age : ""}</div></div>
                                      <div><div className="form-label">Gender</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.gender : ""}</div></div>
                                      <div><div className="form-label">Email</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.email : ""}</div></div>
                                      <div><div className="form-label">Type</div><div className="document-value">{currentPassenger ? currentPassenger.passengerDetails.type : ""}</div></div>
                                    </div>

                                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                      <input id="id-verified" type="checkbox" checked={!!currentPassenger?.verified} onChange={toggleVerifiedForCurrent} />
                                      <label htmlFor="id-verified" style={{ fontWeight: 600 }}>
                                        ID &amp; Passport Verified
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Excess luggage tab */}
                        {activeTab === "excess-luggage" && (
                          <div id="excess-luggage" className="tab-content">
                            <h5 className="mb-3">Excess Luggage Tickets</h5>
                            <div className="document-card">
                              <div className="excess-luggage-table-container">
                                <table className="table table-striped " id="excess-luggage-table">
                                  <thead>
                                    <tr>
                                      <th>Vessel Name</th>
                                      <th>Voyage No</th>
                                      <th>From</th>
                                      <th>To</th>
                                      <th>ETD</th>
                                      <th>ETA</th>
                                      <th>Ticket No</th>
                                      <th>Cabin</th>
                                      <th>Ticket Type</th>
                                      <th>Service Type</th>
                                      <th>Visa Type</th>
                                      <th>Allowed Weight</th>
                                      <th>Name</th>
                                      <th>Nationality</th>
                                      <th>Passport No</th>
                                      <th>Expiry Date</th>
                                      <th>Age</th>
                                      <th>Gender</th>
                                      <th>Excess Ticket No</th>
                                      <th>Allowed Weight (kg)</th>
                                      <th>Actual Weight (kg)</th>
                                      <th>Excess Weight (kg)</th>
                                      <th>Fee / kg</th>
                                      <th>Total Fee</th>
                                      <th>Payment Method</th>
                                      <th>Payment Account</th>
                                      <th>Transaction No</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {excessLuggageRows.length > 0 ? (
                                        excessLuggageRows.map((row, i) => (
                                            <tr key={i}>
                                                <td>{row.vesselName}</td>
                                                <td>{row.voyageNo}</td>
                                                <td>{row.from}</td>
                                                <td>{row.to}</td>
                                                <td>{row.etd}</td>
                                                <td>{row.eta}</td>
                                                <td>{row.ticketNo}</td>
                                                <td>{row.cabin}</td>
                                                <td>{row.ticketType}</td>
                                                <td>{row.serviceType}</td>
                                                <td>{row.visaType}</td>
                                                <td>{row.allowedWeight}</td>
                                                <td>{row.name}</td>
                                                <td>{row.nationality}</td>
                                                <td>{row.passportNo}</td>
                                                <td>{row.expiryDate}</td>
                                                <td>{row.age}</td>
                                                <td>{row.gender}</td>
                                                <td>{row.excessTicketNo}</td>
                                                <td>{row.allowedWeightVal}</td>
                                                <td>{row.actualWeight}</td>
                                                <td>{row.excessWeight}</td>
                                                <td>{row.feeRate.toFixed(2)}</td>
                                                <td>{row.totalFee.toFixed(2)}</td>
                                                <td>{row.paymentMethod}</td>
                                                <td>{row.paymentAccount}</td>
                                                <td>{row.transactionNo}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr id="excess-luggage-row">
                                          <td colSpan="28" style={{ textAlign: "center" }}>No excess luggage tickets yet</td>
                                        </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Manifest tab */}
                        {activeTab === "passenger-manifest" && (
                          <div id="passenger-manifest" className="tab-content">
                            <h5 className="mb-3">Passenger Manifest</h5>
                            <div className="document-card">
                              <div className="passenger-manifest-table-container">
                                <table className="table table-striped" id="passenger-manifest-table">
                                  <thead>
                                    <tr>
                                      <th>Vessel Name</th>
                                      <th>Voyage No</th>
                                      <th>From</th>
                                      <th>To</th>
                                      <th>ETD</th>
                                      <th>ETA</th>
                                      <th>Ticket No</th>
                                      <th>Cabin</th>
                                      <th>Ticket Type</th>
                                      <th>Service Type</th>
                                      <th>Visa Type</th>
                                      <th>Allowed Weight</th>
                                      <th>Name</th>
                                      <th>Nationality</th>
                                      <th>Passport No</th>
                                      <th>Expiry Date</th>
                                      <th>Age</th>
                                      <th>Gender</th>
                                      <th>Allowed Weight (kg)</th>
                                      <th>Actual Weight (kg)</th>
                                      <th>Excess Weight (kg)</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody id="passenger-manifest-tbody">
                                    {manifestRows.length > 0 ? (
                                      manifestRows.map((r, i) => (
                                        <tr key={`${r.ticketNo}-${i}`}>
                                          <td>{r.vesselName}</td>
                                          <td>{r.voyageNo}</td>
                                          <td>{r.from}</td>
                                          <td>{r.to}</td>
                                          <td>{formatDate(r.etd)}</td>
                                          <td>{formatDate(r.eta)}</td>
                                          <td>{r.ticketNo}</td>
                                          <td>{r.cabin}</td>
                                          <td>{r.ticketType}</td>
                                          <td>{r.serviceType}</td>
                                          <td>{r.visaType}</td>
                                          <td>{r.allowedWeight}</td>
                                          <td>{r.name}</td>
                                          <td>{r.nationality}</td>
                                          <td>{r.passportNo}</td>
                                          <td>{r.expiryDate}</td>
                                          <td>{r.age}</td>
                                          <td>{r.gender}</td>
                                          <td>{r.allowedWeight}</td>
                                          <td>{r.actualWeight}</td>
                                          <td>{r.excessWeight}</td>
                                          <td>{r.status}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="22" style={{ textAlign: "center", padding: 12 }}>No manifest rows yet</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>
    </>
  );
}
