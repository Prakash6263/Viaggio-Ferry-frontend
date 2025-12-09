"use client"

import { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"

/**
 * Demo trips and vehicle dataset
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
]

const paymentAccounts = {
  cash: [
    { id: "cash-1", name: "Main Cash Register" },
    { id: "cash-2", name: "Secondary Cash" },
  ],
  bank: [
    { id: "bank-1", name: "ABC Bank - 001" },
    { id: "bank-2", name: "XYZ Bank - 002" },
  ],
}

const vehicleData = {
  BARCODE123: {
    vehicleItems: [
      {
        vehicleDetails: {
          vehicleType: "Sedan",
          makeModel: "Toyota Camry",
          quantity: 1,
          weight: 1500,
          dimensions: "4.9x1.8x1.4",
          engineChassis: "1HGBH41JXMN109186",
          plateNo: "ABC123",
          owner: { name: "Ahmed Hassan", phone: "+96612345678", passport: "P12345678", license: "DL123456" },
          driver: { name: "Mohamed Ali", phone: "+96687654321", license: "DL789012" },
        },
        ticketDetails: {
          ticketNo: "TKN12345",
          cabin: "Parking Deck 1",
          ticketType: "One-Way",
          serviceType: "Standard",
          visaType: "Commercial",
          allowedWeight: 2000,
          status: "Booked",
          travelDocumentNo: "TDN12345",
        },
      },
      {
        vehicleDetails: {
          vehicleType: "Truck",
          makeModel: "Isuzu NPR",
          quantity: 1,
          weight: 3500,
          dimensions: "6.7x2.0x2.5",
          engineChassis: "2HGBH41JXMN109187",
          plateNo: "XYZ789",
          owner: { name: "Transport Co", phone: "+96623456789", passport: "P23456789", license: "BL234567" },
          driver: { name: "Saeed Ahmed", phone: "+96676543210", license: "DL890123" },
        },
        ticketDetails: {
          ticketNo: "TKN12346",
          cabin: "Lower Hold",
          ticketType: "One-Way",
          serviceType: "Standard",
          visaType: "Commercial",
          allowedWeight: 4000,
          status: "Booked",
          travelDocumentNo: "TDN12346",
        },
      },
    ],
    agentDetails: {
      company: "Sabihat Marine Services",
      marineAgent: "Blue Ocean Logistics",
      commercialAgent: "Global Freight Forwarders",
      subagent: "Local Cargo Co.",
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
    vehicleItems: [
      {
        vehicleDetails: {
          vehicleType: "Bus",
          makeModel: "Mercedes-Benz Tourismo",
          quantity: 1,
          weight: 12000,
          dimensions: "12.0x2.5x3.5",
          engineChassis: "3HGBH41JXMN109188",
          plateNo: "BUS456",
          owner: { name: "Tourism Company", phone: "+96634567890", passport: "P34567890", license: "BL345678" },
          driver: { name: "Khalid Ibrahim", phone: "+96665432109", license: "DL901234" },
        },
        ticketDetails: {
          ticketNo: "TKN12346",
          cabin: "Parking Deck 2",
          ticketType: "Round-Trip",
          serviceType: "Standard",
          visaType: "Commercial",
          allowedWeight: 15000,
          status: "Confirmed",
          travelDocumentNo: "TDN12347",
        },
      },
    ],
    agentDetails: {
      company: "Sabihat Marine Services",
      marineAgent: "Red Sea Transport",
      commercialAgent: "International Agents Inc.",
      subagent: "City Cargo Co.",
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
}

export default function VehicleCheckingPage() {
  // trips and UI state
  const [trips] = useState(demoTrips)
  const [showTripSelection, setShowTripSelection] = useState(true)
  const [showCheckinPage, setShowCheckinPage] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)

  // scan & vehicle state
  const [barcode, setBarcode] = useState("")
  const [currentVehicleShipment, setCurrentVehicleShipment] = useState(null)
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("vehicle")

  // manifest rows
  const [manifestRows, setManifestRows] = useState([])
  const [excessVehicleRows, setExcessVehicleRows] = useState([])

  // vehicle handling / other flags
  const [allowVehicleHandling, setAllowVehicleHandling] = useState(false)
  const [vehicleHandlingItems, setVehicleHandlingItems] = useState([])
  const [showExcessPayment, setShowExcessPayment] = useState(false)
  const [showVehicleLabel, setShowVehicleLabel] = useState(false)
  const [showVehiclePass, setShowVehiclePass] = useState(false)

  // Excess Payment State
  const [excessDetails, setExcessDetails] = useState({
    weight: 0,
    fee: 0,
    totalFee: 0,
    ticketNo: "",
    allowedWeight: 0,
    actualWeight: 0,
  })
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentAccount, setPaymentAccount] = useState("")
  const [transactionNo, setTransactionNo] = useState("")

  // format date helper
  const formatDate = (iso) => {
    if (!iso) return ""
    const d = new Date(iso)
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    // initialize page in trip-selection
    setShowTripSelection(true)
    setShowCheckinPage(false)
  }, [])

  function handleTripSelect(trip) {
    setShowTripSelection(false)
    setShowCheckinPage(true)
    setSelectedTrip(trip)
    resetSession()
  }

  function resetSession() {
    setCurrentVehicleShipment(null)
    setCurrentVehicleIndex(0)
    setBarcode("")
    setAllowVehicleHandling(false)
    setVehicleHandlingItems([])
    setShowExcessPayment(false)
    setShowVehicleLabel(false)
    setShowVehiclePass(false)
    setPaymentMethod("")
    setPaymentAccount("")
    setTransactionNo("")
  }

  // Scan handler
  function handleScan(e) {
    if (e) e.preventDefault?.()
    const code = barcode?.trim()
    if (!code) {
      alert("Enter barcode/document number.")
      return
    }
    const shipment = vehicleData[code]
    if (!shipment) {
      alert("Document not found.")
      return
    }

    // initialize shipment and vehicle flags
    const shipmentCopy = JSON.parse(JSON.stringify(shipment)) // shallow clone
    shipmentCopy.vehicleItems = shipmentCopy.vehicleItems.map((v) => ({ ...v, verified: false, checkedIn: false }))
    setCurrentVehicleShipment(shipmentCopy)
    setCurrentVehicleIndex(0)
    setAllowVehicleHandling(false)

    // Reset handling state for new scan
    setVehicleHandlingItems([])
    setShowExcessPayment(false)
    setShowVehicleLabel(false)
    setShowVehiclePass(false)

    // Add initial vehicle line
    addVehicleLine()
  }

  function changeVehicleIndex(newIndex) {
    if (!currentVehicleShipment) return
    const max = currentVehicleShipment.vehicleItems.length - 1
    const idx = Math.max(0, Math.min(newIndex, max))
    setCurrentVehicleIndex(idx)

    // reset handling area visibility when changing vehicle
    setAllowVehicleHandling(false)
    setShowExcessPayment(false)
    setShowVehicleLabel(false)
    setShowVehiclePass(false)

    // Reset handling items for new vehicle
    setVehicleHandlingItems([])
    addVehicleLine()

    // Check if already verified to show handling section
    if (currentVehicleShipment.vehicleItems[idx].verified) {
      setAllowVehicleHandling(true)
    }
  }

  function toggleVerifiedForCurrent(e) {
    if (!currentVehicleShipment) return
    const clone = { ...currentVehicleShipment }
    clone.vehicleItems = clone.vehicleItems.map((v, i) =>
      i === currentVehicleIndex ? { ...v, verified: e.target.checked } : v,
    )
    setCurrentVehicleShipment(clone)

    // if verified, show handling section
    setAllowVehicleHandling(e.target.checked)

    if (!e.target.checked) {
      setShowExcessPayment(false)
      setShowVehicleLabel(false)
      setShowVehiclePass(false)
    }
  }

  // Vehicle Handling Functions
  function addVehicleLine() {
    setVehicleHandlingItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        labelNo: "",
        plateNo: "",
        weight: "",
      },
    ])
  }

  function removeVehicleLine(id) {
    setVehicleHandlingItems((prev) => prev.filter((item) => item.id !== id))
  }

  function updateVehicleLine(id, field, value) {
    setVehicleHandlingItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  function confirmVehicle() {
    if (!currentVehicleShipment) return

    // Validate inputs
    const isValid = vehicleHandlingItems.every((item) => item.labelNo && item.plateNo && item.weight)
    if (vehicleHandlingItems.length === 0 || !isValid) {
      alert("Please add at least one vehicle item and fill all fields.")
      return
    }

    const v = currentVehicleShipment.vehicleItems[currentVehicleIndex]
    const totalWeight = vehicleHandlingItems.reduce((sum, item) => sum + (Number.parseFloat(item.weight) || 0), 0)
    const allowedWeight = v.ticketDetails.allowedWeight || 0
    const excess = Math.max(0, totalWeight - allowedWeight)

    if (excess > 0) {
      const feeRate = 5.0
      const timestamp = Date.now().toString().slice(-6)

      setExcessDetails({
        weight: excess,
        fee: feeRate,
        totalFee: excess * feeRate,
        ticketNo: `EXC-${timestamp}`,
        allowedWeight: allowedWeight,
        actualWeight: totalWeight,
      })
      setShowExcessPayment(true)
      setShowVehicleLabel(false)
    } else {
      setShowExcessPayment(false)
      setShowVehicleLabel(true)
    }
  }

  function confirmPayment() {
    if (!paymentMethod || !paymentAccount || !transactionNo.trim()) {
      alert("Please enter payment method, account and transaction number before confirming payment.")
      return
    }

    // Add to excess vehicle table
    const v = currentVehicleShipment.vehicleItems[currentVehicleIndex]
    const accountName = paymentAccounts[paymentMethod]?.find((a) => a.id === paymentAccount)?.name || ""

    const newExcessRow = {
      vesselName: currentVehicleShipment.tripDetails.vesselName,
      voyageNo: currentVehicleShipment.tripDetails.voyageNo,
      from: currentVehicleShipment.tripDetails.from,
      to: currentVehicleShipment.tripDetails.to,
      etd: currentVehicleShipment.tripDetails.etd,
      eta: currentVehicleShipment.tripDetails.eta,
      ticketNo: v.ticketDetails.ticketNo,
      cabin: v.ticketDetails.cabin,
      ticketType: v.ticketDetails.ticketType,
      serviceType: v.ticketDetails.serviceType,
      visaType: v.ticketDetails.visaType,
      allowedWeight: v.ticketDetails.allowedWeight,
      vehicleType: v.vehicleDetails.vehicleType,
      makeModel: v.vehicleDetails.makeModel,
      quantity: v.vehicleDetails.quantity,
      weight: v.vehicleDetails.weight,
      dimensions: v.vehicleDetails.dimensions,
      engineChassis: v.vehicleDetails.engineChassis,
      ownerName: v.vehicleDetails.owner.name,
      ownerPhone: v.vehicleDetails.owner.phone,
      ownerLicense: v.vehicleDetails.owner.license,
      driverName: v.vehicleDetails.driver.name,
      driverPhone: v.vehicleDetails.driver.phone,
      driverLicense: v.vehicleDetails.driver.license,
      excessTicketNo: excessDetails.ticketNo,
      allowedWeightVal: excessDetails.allowedWeight,
      actualWeight: excessDetails.actualWeight,
      excessWeight: excessDetails.weight,
      feeRate: excessDetails.fee,
      totalFee: excessDetails.totalFee,
      paymentMethod,
      paymentAccount: accountName,
      transactionNo,
    }

    setExcessVehicleRows((prev) => [...prev, newExcessRow])
    setShowExcessPayment(false)
    setShowVehicleLabel(true)
  }

  function printLabel() {
    alert("Label sent to printer.")
    setShowVehicleLabel(false)
    setShowVehiclePass(true)
  }

  function addManifestRowFromCurrent() {
    if (!selectedTrip || !currentVehicleShipment) return

    const v = currentVehicleShipment.vehicleItems[currentVehicleIndex]
    const totalWeight = vehicleHandlingItems.reduce((sum, item) => sum + (Number.parseFloat(item.weight) || 0), 0)
    const allowedWeight = v.ticketDetails.allowedWeight || 0
    const excessWeight = Math.max(0, totalWeight - allowedWeight)

    const row = {
      vesselName: selectedTrip.vesselName,
      voyageNo: selectedTrip.voyageNo,
      from: selectedTrip.from,
      to: selectedTrip.to,
      etd: selectedTrip.etd,
      eta: selectedTrip.eta,
      ticketNo: v.ticketDetails.ticketNo || "-",
      cabin: v.ticketDetails.cabin || "-",
      ticketType: v.ticketDetails.ticketType || "-",
      serviceType: v.ticketDetails.serviceType || "-",
      visaType: v.ticketDetails.visaType || "-",
      allowedWeight: v.ticketDetails.allowedWeight ?? "-",
      vehicleType: v.vehicleDetails.vehicleType || "-",
      makeModel: v.vehicleDetails.makeModel || "-",
      quantity: v.vehicleDetails.quantity || "-",
      weight: v.vehicleDetails.weight || "-",
      dimensions: v.vehicleDetails.dimensions || "-",
      engineChassis: v.vehicleDetails.engineChassis || "-",
      ownerName: v.vehicleDetails.owner.name || "-",
      ownerPhone: v.vehicleDetails.owner.phone || "-",
      ownerLicense: v.vehicleDetails.owner.license || "-",
      driverName: v.vehicleDetails.driver.name || "-",
      driverPhone: v.vehicleDetails.driver.phone || "-",
      driverLicense: v.vehicleDetails.driver.license || "-",
      actualWeight: totalWeight,
      excessWeight: excessWeight,
      status: "Checked In",
    }

    setManifestRows((prev) => [...prev, row])
  }

  function confirmCheckin() {
    if (!currentVehicleShipment) return

    // mark current vehicle checked in
    const clone = { ...currentVehicleShipment }
    clone.vehicleItems = clone.vehicleItems.map((v, i) => (i === currentVehicleIndex ? { ...v, checkedIn: true } : v))
    setCurrentVehicleShipment(clone)

    // add manifest row
    addManifestRowFromCurrent()

    alert(
      `Check-in confirmed for vehicle ${currentVehicleShipment.vehicleItems[currentVehicleIndex].vehicleDetails.plateNo}`,
    )

    // move to next vehicle or finish trip
    if (currentVehicleIndex < clone.vehicleItems.length - 1) {
      changeVehicleIndex(currentVehicleIndex + 1)
    } else {
      alert("All vehicles checked in successfully!")
      // return to trip selection (reset)
      setShowCheckinPage(false)
      setShowTripSelection(true)
      setSelectedTrip(null)
      resetSession()
    }
  }

  // Render helpers
  const currentVehicle = currentVehicleShipment ? currentVehicleShipment.vehicleItems[currentVehicleIndex] : null

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
    .vehicle-navigation { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px;  border-radius:8px; border:1px solid #e6e9ed; margin-bottom:10px; }
    .nav-button { width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; border:none; background:linear-gradient(90deg, #00B5AD, #00D2CB) !important; color:#fff; font-size:16px; }
    .nav-button:disabled { background:#bfcff8; color:#fff; cursor:not-allowed; }
    .vehicle-header, .vehicle-input-line { display:grid; grid-template-columns: 2fr 2fr 1fr auto; gap:8px; align-items:center; margin-bottom:6px; }
    .vehicle-input-line input { padding:6px; border-radius:6px; border:1px solid #ccd0d6; }
    .remove-vehicle-line { background:#dc3545; color:#fff; border:none; padding:6px 8px; border-radius:6px; }
    #vehicle-label, #vehicle-pass {  padding:12px; border-radius:8px; box-shadow: -5px -5px 9px rgb(255 255 255 / 14%), 5px 5px 9px rgb(94 104 121 / 17%); }
    .vehicle-table { width:100%; border-collapse:collapse; margin-top:8px; }
    .vehicle-table th, .vehicle-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .excess-vehicle-table { width:100%; border-collapse:collapse; margin-top:8px; overflow-x:auto; }
    .excess-vehicle-table th, .excess-vehicle-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .excess-vehicle-table th { background-color:#f8f9fa; position: sticky; top:0; }
    .excess-vehicle-table-container { max-width:100%; overflow-x:auto; }
    .vehicle-manifest-table { width:100%; border-collapse:collapse; margin-top:8px; overflow-x:auto; }
    .vehicle-manifest-table th, .vehicle-manifest-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .vehicle-manifest-table th { background-color:#f8f9fa; position: sticky; top:0; }
    .vehicle-manifest-table-container { max-width:100%; overflow-x:auto; }
    .vehicle-pass-actions { display:flex; justify-content:space-between; margin-top:15px; }
    .vehicle-pass-actions button { padding:8px 16px; border-radius:6px; border:none; font-weight:600; }
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
      .vehicle-pass-actions{ flex-direction:column; gap:8px; }
      .trip-selection-table th, .trip-selection-table td { padding: 8px 10px; font-size: 0.85rem; }
    }`,
            }}
          />
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <h5 className="mb-3">Vehicle CheckIn</h5>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-2">
                  <div className="card-body">
                    {/* Trip selection */}
                    {showTripSelection && (
                      <div id="trip-selection-page" className="container">
                        <h5 className="mb-3">Select a Trip to Begin Vehicle Check-in</h5>
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
                          {selectedTrip ? `${selectedTrip.vesselName} ${selectedTrip.voyageNo} — Vehicle Check-in` : ""}
                        </h5>

                        <div className="tab-container" style={{ marginTop: 12 }}>
                          <button
                            className={`tab-button ${activeTab === "vehicle" ? "active" : ""}`}
                            onClick={() => setActiveTab("vehicle")}
                          >
                            Vehicle
                          </button>
                          <button
                            className={`tab-button ${activeTab === "excess-vehicle" ? "active" : ""}`}
                            onClick={() => setActiveTab("excess-vehicle")}
                          >
                            Excess Vehicle Tickets
                          </button>
                          <button
                            className={`tab-button ${activeTab === "vehicle-manifest" ? "active" : ""}`}
                            onClick={() => setActiveTab("vehicle-manifest")}
                          >
                            Vehicle Manifest
                          </button>
                        </div>

                        {activeTab === "vehicle" && (
                          <div id="vehicle" className="tab-content active">
                            <h5 className="mb-3">Vehicle Check-in</h5>
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
                                        if (e.key === "Enter") handleScan(e)
                                      }}
                                    />
                                    <div className="button-container">
                                      <button
                                        id="scan-button"
                                        style={{
                                          padding: "8px 12px",
                                          borderRadius: 6,
                                          background: "linear-gradient(90deg, #00B5AD, #00D2CB)",
                                          color: "#fff",
                                          border: "none",
                                          marginTop: 8,
                                        }}
                                        onClick={handleScan}
                                      >
                                        Go
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  id="vehicle-info"
                                  className={`checkin-section ${currentVehicleShipment ? "" : "hidden"}`}
                                >
                                  <h3 style={{ fontSize: "0.98rem" }}>2. Vehicle Details</h3>
                                  <div style={{ fontSize: "0.9rem", marginTop: 6 }} className="form-label">
                                    Vehicle verification is done in the right panel (Vehicle Document Preview). Vehicle
                                    handling opens only after all vehicle items are verified.
                                  </div>
                                  {currentVehicleShipment && (
                                    <div style={{ marginTop: 8 }}>
                                      <div>
                                        Selected Trip:{" "}
                                        <strong>
                                          {currentVehicleShipment.tripDetails.vesselName} (
                                          {currentVehicleShipment.tripDetails.voyageNo})
                                        </strong>
                                      </div>
                                      <div style={{ marginTop: 6 }}>
                                        Vehicles: <strong>{currentVehicleShipment.vehicleItems.length}</strong>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Vehicle Handling section */}
                                <section
                                  id="vehicle-handling"
                                  className={`checkin-section ${allowVehicleHandling && !showVehicleLabel && !showVehiclePass ? "" : "hidden"}`}
                                >
                                  <h3 style={{ fontSize: "0.98rem" }}>3. Vehicle Handling</h3>
                                  <div className="form-label" style={{ marginTop: 6 }}>
                                    Total Allowed Weight (sum of vehicle items):{" "}
                                    <strong>
                                      <span id="allowed-weight">
                                        {currentVehicle?.ticketDetails?.allowedWeight || 0}
                                      </span>{" "}
                                      kg
                                    </strong>
                                  </div>
                                  <div className="vehicle-header" style={{ marginTop: 10 }}>
                                    <div className="form-label">Vehicle Label No.</div>
                                    <div className="form-label">License Plate No.</div>
                                    <div className="form-label">Actual Weight (kg)</div>
                                    <div />
                                  </div>

                                  <div id="vehicle-items">
                                    {vehicleHandlingItems.map((item) => (
                                      <div key={item.id} className="vehicle-input-line">
                                        <input
                                          type="text"
                                          className="document-value"
                                          placeholder="Vehicle Label No."
                                          value={item.labelNo}
                                          onChange={(e) => updateVehicleLine(item.id, "labelNo", e.target.value)}
                                        />
                                        <input
                                          type="text"
                                          className="document-value"
                                          placeholder="License Plate No."
                                          value={item.plateNo}
                                          onChange={(e) => updateVehicleLine(item.id, "plateNo", e.target.value)}
                                        />
                                        <input
                                          type="number"
                                          className="document-value"
                                          step="0.1"
                                          min="0"
                                          placeholder="Actual Weight (kg)"
                                          value={item.weight}
                                          onChange={(e) => updateVehicleLine(item.id, "weight", e.target.value)}
                                        />
                                        <button
                                          type="button"
                                          className="remove-vehicle-line"
                                          onClick={() => removeVehicleLine(item.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <button
                                    id="add-vehicle-line"
                                    className="btn btn-turquoise"
                                    onClick={() => addVehicleLine()}
                                  >
                                    Add Vehicle Item
                                  </button>
                                  <button
                                    id="confirm-vehicle-button"
                                    style={{
                                      marginTop: 8,
                                      padding: "8px 12px",
                                      borderRadius: 6,
                                      background: "#198754",
                                      color: "#fff",
                                      border: "none",
                                    }}
                                    onClick={confirmVehicle}
                                  >
                                    Confirm Vehicle
                                  </button>

                                  {/* Excess Payment Section */}
                                  {showExcessPayment && (
                                    <div
                                      id="excess-vehicle-payment-section"
                                      style={{
                                        marginTop: 10,
                                        background: "#fffbe6",
                                        border: "1px solid #ffe08a",
                                        padding: 10,
                                        borderRadius: 8,
                                      }}
                                    >
                                      <h5 style={{ margin: "0 0 8px 0" }}>Excess Vehicle Ticket</h5>
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr",
                                          gap: 12,
                                          marginTop: 10,
                                        }}
                                      >
                                        <div>
                                          <div className="form-label">Owner Name</div>
                                          <input
                                            className="document-value"
                                            readOnly
                                            value={currentVehicle?.vehicleDetails?.owner?.name || ""}
                                          />
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Owner ID
                                          </div>
                                          <input
                                            className="document-value"
                                            readOnly
                                            value={currentVehicle?.vehicleDetails?.owner?.passport || ""}
                                          />
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Driver Name
                                          </div>
                                          <input
                                            className="document-value"
                                            readOnly
                                            value={currentVehicle?.vehicleDetails?.driver?.name || ""}
                                          />
                                        </div>
                                        <div>
                                          <div className="form-label">Excess Ticket No</div>
                                          <input className="document-value" readOnly value={excessDetails.ticketNo} />
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Payment Method
                                          </div>
                                          <select
                                            className="document-value"
                                            value={paymentMethod}
                                            onChange={(e) => {
                                              setPaymentMethod(e.target.value)
                                              setPaymentAccount("")
                                            }}
                                          >
                                            <option value="">Select Payment Method</option>
                                            <option value="cash">Cash</option>
                                            <option value="bank">Bank Transfer</option>
                                          </select>
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Cash/Bank Account
                                          </div>
                                          <select
                                            className="document-value"
                                            disabled={!paymentMethod}
                                            value={paymentAccount}
                                            onChange={(e) => setPaymentAccount(e.target.value)}
                                          >
                                            <option value="">Select Account</option>
                                            {paymentMethod &&
                                              paymentAccounts[paymentMethod]?.map((acc) => (
                                                <option key={acc.id} value={acc.id}>
                                                  {acc.name}
                                                </option>
                                              ))}
                                          </select>
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Transaction No
                                          </div>
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
                                            <input
                                              className="document-value"
                                              readOnly
                                              value={excessDetails.allowedWeight}
                                            />
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div className="form-label">Actual Weight (kg)</div>
                                            <input
                                              className="document-value"
                                              readOnly
                                              value={excessDetails.actualWeight}
                                            />
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div className="form-label">Excess Weight (kg)</div>
                                            <input className="document-value" readOnly value={excessDetails.weight} />
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div className="form-label">Fee / kg</div>
                                            <input
                                              className="document-value"
                                              readOnly
                                              value={excessDetails.fee.toFixed(2)}
                                            />
                                          </div>
                                          <div style={{ flex: 1 }}>
                                            <div className="form-label">Total Fee</div>
                                            <input
                                              className="document-value"
                                              readOnly
                                              value={excessDetails.totalFee.toFixed(2)}
                                            />
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

                                {/* Vehicle Label Section */}
                                {showVehicleLabel && (
                                  <div id="vehicle-label">
                                    <h5 className="mb-3">Vehicle Label</h5>
                                    <div className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Vessel</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.vesselName}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Voyage No</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.voyageNo}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">From</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.from}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">To</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.to}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETD</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.etd}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETA</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.eta}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Vehicle Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Vehicle Type</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.vehicleType}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Make/Model</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.makeModel}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Quantity</div>
                                          <div className="document-value">{currentVehicle.vehicleDetails.quantity}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Weight</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.weight} kg
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Owner</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.owner.name}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Driver</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.driver.name}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Vehicle Items</h5>
                                      <table className="table table-striped">
                                        <thead>
                                          <tr>
                                            <th>Vehicle Label No.</th>
                                            <th>License Plate No.</th>
                                            <th>Actual Weight (kg)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {vehicleHandlingItems.map((item) => (
                                            <tr key={item.id}>
                                              <td>{item.labelNo}</td>
                                              <td>{item.plateNo}</td>
                                              <td>{item.weight}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                      <div style={{ textAlign: "center", marginTop: 10 }}>
                                        <button
                                          id="print-label-button"
                                          style={{
                                            padding: "8px 14px",
                                            borderRadius: 6,
                                            background: "#198754",
                                            color: "#fff",
                                            border: "none",
                                          }}
                                          onClick={printLabel}
                                        >
                                          Print Label
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Vehicle Pass Section */}
                                {showVehiclePass && (
                                  <div id="vehicle-pass">
                                    <h5 className="mb-3">Vehicle Pass</h5>
                                    <div className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Vessel</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.vesselName}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Voyage No</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.voyageNo}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">From</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.from}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">To</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.to}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETD</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.etd}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETA</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.eta}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Ticket Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Ticket No</div>
                                          <div className="document-value">{currentVehicle.ticketDetails.ticketNo}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Cabin</div>
                                          <div className="document-value">{currentVehicle.ticketDetails.cabin}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Ticket Type</div>
                                          <div className="document-value">
                                            {currentVehicle.ticketDetails.ticketType}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Service Type</div>
                                          <div className="document-value">
                                            {currentVehicle.ticketDetails.serviceType}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Visa Type</div>
                                          <div className="document-value">{currentVehicle.ticketDetails.visaType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Allowed Weight</div>
                                          <div className="document-value">
                                            {currentVehicle.ticketDetails.allowedWeight} kg
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Vehicle Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Vehicle Type</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.vehicleType}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Make/Model</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.makeModel}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Quantity</div>
                                          <div className="document-value">{currentVehicle.vehicleDetails.quantity}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Weight</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.weight} kg
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Dimensions</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.dimensions}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Engine/Chassis No</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.engineChassis}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Owner Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Name</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.owner.name}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Phone</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.owner.phone}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">License No</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.owner.license}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Driver Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Name</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.driver.name}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Phone</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.driver.phone}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">License No</div>
                                          <div className="document-value">
                                            {currentVehicle.vehicleDetails.driver.license}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Vehicle Items</h5>
                                      <table className="vehicle-table">
                                        <thead>
                                          <tr>
                                            <th>Vehicle Label No.</th>
                                            <th>License Plate No.</th>
                                            <th>Actual Weight (kg)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {vehicleHandlingItems.map((item) => (
                                            <tr key={item.id}>
                                              <td>{item.labelNo}</td>
                                              <td>{item.plateNo}</td>
                                              <td>{item.weight}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="vehicle-pass-actions">
                                      <button
                                        id="print-vehicle-pass-btn"
                                        className="print-btn"
                                        onClick={() => alert("Vehicle pass sent to printer.")}
                                      >
                                        Print Vehicle Pass
                                      </button>
                                      <button id="confirm-checkin-btn" className="confirm-btn" onClick={confirmCheckin}>
                                        Confirm Check-in
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="right-panel">
                                <h5 className="mb-3">Vehicle Document Preview</h5>

                                {/* Vehicle navigation */}
                                <div
                                  id="vehicle-navigation"
                                  className={`vehicle-navigation ${currentVehicleShipment ? "" : "hidden"}`}
                                >
                                  <button
                                    id="prev-vehicle-btn"
                                    className="nav-button"
                                    title="Previous vehicle"
                                    aria-label="Previous vehicle"
                                    onClick={() => changeVehicleIndex(currentVehicleIndex - 1)}
                                    disabled={!currentVehicleShipment || currentVehicleIndex === 0}
                                  >
                                    <svg
                                      width={18}
                                      height={18}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>

                                  <div style={{ fontWeight: 600 }}>
                                    Vehicle Item{" "}
                                    <span id="current-vehicle-num">
                                      {currentVehicleShipment ? currentVehicleIndex + 1 : 0}
                                    </span>{" "}
                                    of{" "}
                                    <span id="total-vehicle">
                                      {currentVehicleShipment ? currentVehicleShipment.vehicleItems.length : 0}
                                    </span>
                                  </div>

                                  <button
                                    id="next-vehicle-btn"
                                    className="nav-button"
                                    title="Next vehicle"
                                    aria-label="Next vehicle"
                                    onClick={() => changeVehicleIndex(currentVehicleIndex + 1)}
                                    disabled={
                                      !currentVehicleShipment ||
                                      (currentVehicleShipment &&
                                        currentVehicleIndex >= currentVehicleShipment.vehicleItems.length - 1)
                                    }
                                  >
                                    <svg
                                      width={18}
                                      height={18}
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </button>
                                </div>

                                {/* Frozen trip details */}
                                {currentVehicleShipment && (
                                  <>
                                    <div id="frozen-trip-details" className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div className="details-grid">
                                        <div>
                                          <div className="form-label">Voyage No</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.voyageNo}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">From</div>
                                          <div className="document-value">
                                            {currentVehicleShipment.tripDetails.from}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">To</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.to}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETD</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.etd}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETA</div>
                                          <div className="document-value">{currentVehicleShipment.tripDetails.eta}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Document Preview */}
                                <div id="document-preview" className="document-grid">
                                  <div className="document-card">
                                    <h5 className="mb-3">Ticket Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Ticket No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.ticketNo : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Cabin</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.cabin : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Ticket Type</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.ticketType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Service Type</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.serviceType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Visa Type</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.visaType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Allowed Weight</div>
                                        <div className="document-value">
                                          {currentVehicle ? `${currentVehicle.ticketDetails.allowedWeight} kg` : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Status</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.status : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Travel Document No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.ticketDetails.travelDocumentNo : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Vehicle Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Type</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.vehicleType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Make/Model</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.makeModel : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Engine/Chassis No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.engineChassis : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Plate No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.plateNo : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Owner Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Name</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.name : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Phone</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.phone : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Passport/Residency</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.passport : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">License No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.license : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Consignee Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Name</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.name : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Phone</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.phone : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">ID No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.owner.passport : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Consignor Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Name</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.driver.name : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Phone</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.driver.phone : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">ID No</div>
                                        <div className="document-value">
                                          {currentVehicle ? currentVehicle.vehicleDetails.driver.license : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Agent Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Company</div>
                                        <div className="document-value">
                                          {currentVehicleShipment ? currentVehicleShipment.agentDetails.company : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Marine Agent</div>
                                        <div className="document-value">
                                          {currentVehicleShipment
                                            ? currentVehicleShipment.agentDetails.marineAgent
                                            : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Commercial Agent</div>
                                        <div className="document-value">
                                          {currentVehicleShipment
                                            ? currentVehicleShipment.agentDetails.commercialAgent
                                            : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Subagent</div>
                                        <div className="document-value">
                                          {currentVehicleShipment ? currentVehicleShipment.agentDetails.subagent : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">User Name</div>
                                        <div className="document-value">
                                          {currentVehicleShipment ? currentVehicleShipment.agentDetails.salesman : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Vessel Name</div>
                                        <div className="document-value">
                                          {currentVehicleShipment ? currentVehicleShipment.tripDetails.vesselName : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                    <input
                                      id="vehicle-verified"
                                      type="checkbox"
                                      checked={!!currentVehicle?.verified}
                                      onChange={toggleVerifiedForCurrent}
                                    />
                                    <label htmlFor="vehicle-verified" style={{ fontWeight: 600 }}>
                                      Vehicle Documentation Verified
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Excess vehicle tab */}
                        {activeTab === "excess-vehicle" && (
                          <div id="excess-vehicle" className="tab-content">
                            <h5 className="mb-3">Excess Vehicle Tickets</h5>
                            <div className="document-card">
                              <div className="excess-vehicle-table-container">
                                <table className="table table-striped " id="excess-vehicle-table">
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
                                      <th>Vehicle Type</th>
                                      <th>Make/Model</th>
                                      <th>Quantity</th>
                                      <th>Weight</th>
                                      <th>Dimensions</th>
                                      <th>Engine/Chassis No</th>
                                      <th>Owner Name</th>
                                      <th>Owner Phone</th>
                                      <th>Owner License</th>
                                      <th>Driver Name</th>
                                      <th>Driver Phone</th>
                                      <th>Driver License</th>
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
                                    {excessVehicleRows.length > 0 ? (
                                      excessVehicleRows.map((row, i) => (
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
                                          <td>{row.vehicleType}</td>
                                          <td>{row.makeModel}</td>
                                          <td>{row.quantity}</td>
                                          <td>{row.weight}</td>
                                          <td>{row.dimensions}</td>
                                          <td>{row.engineChassis}</td>
                                          <td>{row.ownerName}</td>
                                          <td>{row.ownerPhone}</td>
                                          <td>{row.ownerLicense}</td>
                                          <td>{row.driverName}</td>
                                          <td>{row.driverPhone}</td>
                                          <td>{row.driverLicense}</td>
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
                                      <tr id="excess-vehicle-row">
                                        <td colSpan="33" style={{ textAlign: "center" }}>
                                          No excess vehicle tickets yet
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Manifest tab */}
                        {activeTab === "vehicle-manifest" && (
                          <div id="vehicle-manifest" className="tab-content">
                            <h5 className="mb-3">Vehicle Manifest</h5>
                            <div className="document-card">
                              <div className="vehicle-manifest-table-container">
                                <table className="table table-striped" id="vehicle-manifest-table">
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
                                      <th>Vehicle Type</th>
                                      <th>Make/Model</th>
                                      <th>Quantity</th>
                                      <th>Weight</th>
                                      <th>Dimensions</th>
                                      <th>Engine/Chassis No</th>
                                      <th>Owner Name</th>
                                      <th>Owner Phone</th>
                                      <th>Owner License</th>
                                      <th>Driver Name</th>
                                      <th>Driver Phone</th>
                                      <th>Driver License</th>
                                      <th>Allowed Weight (kg)</th>
                                      <th>Actual Weight (kg)</th>
                                      <th>Excess Weight (kg)</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody id="vehicle-manifest-tbody">
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
                                          <td>{r.vehicleType}</td>
                                          <td>{r.makeModel}</td>
                                          <td>{r.quantity}</td>
                                          <td>{r.weight}</td>
                                          <td>{r.dimensions}</td>
                                          <td>{r.engineChassis}</td>
                                          <td>{r.ownerName}</td>
                                          <td>{r.ownerPhone}</td>
                                          <td>{r.ownerLicense}</td>
                                          <td>{r.driverName}</td>
                                          <td>{r.driverPhone}</td>
                                          <td>{r.driverLicense}</td>
                                          <td>{r.allowedWeight}</td>
                                          <td>{r.actualWeight}</td>
                                          <td>{r.excessWeight}</td>
                                          <td>{r.status}</td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr>
                                        <td colSpan="28" style={{ textAlign: "center", padding: 12 }}>
                                          No manifest rows yet
                                        </td>
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
  )
}
