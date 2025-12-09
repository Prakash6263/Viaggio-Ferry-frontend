"use client"

import { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"

/**
 * Demo trips and cargo dataset
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

const cargoData = {
  BARCODE123: {
    cargoItems: [
      {
        cargoDetails: {
          cargoType: "Pallet A",
          goodsType: "Electronics",
          quantity: 5,
          weight: 250,
          dimensions: "120x100x150",
          goodsDescription: "Computer equipment",
          consignee: { name: "ABC Imports", phone: "+96612345678", id: "CR123456" },
          consignor: { name: "XYZ Exports", phone: "+97187654321", id: "EX789012" },
        },
        ticketDetails: {
          ticketNo: "TKN12345",
          cabin: "Compartment 1",
          ticketType: "One-Way",
          serviceType: "Standard",
          visaType: "Commercial",
          allowedWeight: 200,
          status: "Booked",
        },
      },
      {
        cargoDetails: {
          cargoType: "Container",
          goodsType: "Textiles",
          quantity: 1,
          weight: 1500,
          dimensions: "600x240x260",
          goodsDescription: "Cotton fabrics",
          consignee: { name: "Fashion Retail", phone: "+96623456789", id: "CR234567" },
          consignor: { name: "Textile Mills", phone: "+97176543210", id: "EX890123" },
        },
        ticketDetails: {
          ticketNo: "TKN12346",
          cabin: "Compartment 2",
          ticketType: "One-Way",
          serviceType: "Refrigerated",
          visaType: "Commercial",
          allowedWeight: 1500,
          status: "Booked",
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
    cargoItems: [
      {
        cargoDetails: {
          cargoType: "Heavy Equipment",
          goodsType: "Machinery",
          quantity: 2,
          weight: 3500,
          dimensions: "800x300x400",
          goodsDescription: "Construction equipment",
          consignee: { name: "BuildRight Inc", phone: "+96634567890", id: "CR345678" },
          consignor: { name: "Machinery Corp", phone: "+97165432109", id: "EX901234" },
        },
        ticketDetails: {
          ticketNo: "TKN12346",
          cabin: "Lower Hold",
          ticketType: "Round-Trip",
          serviceType: "Standard",
          visaType: "Commercial",
          allowedWeight: 3000,
          status: "Confirmed",
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

export default function CargoCheckingPage() {
  // trips and UI state
  const [trips] = useState(demoTrips)
  const [showTripSelection, setShowTripSelection] = useState(true)
  const [showCheckinPage, setShowCheckinPage] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)

  // scan & cargo state
  const [barcode, setBarcode] = useState("")
  const [currentCargoShipment, setCurrentCargoShipment] = useState(null)
  const [currentCargoIndex, setCurrentCargoIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("cargo")

  // manifest rows
  const [manifestRows, setManifestRows] = useState([])
  const [excessCargoRows, setExcessCargoRows] = useState([])

  // cargo handling / other flags
  const [allowCargoHandling, setAllowCargoHandling] = useState(false)
  const [cargoInputLines, setCargoInputLines] = useState([])
  const [showExcessPayment, setShowExcessPayment] = useState(false)
  const [showCargoLabel, setShowCargoLabel] = useState(false)
  const [showCargoPass, setShowCargoPass] = useState(false)

  // Excess Payment State
  const [excessDetails, setExcessDetails] = useState({
    weight: 0,
    fee: 5.0,
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
    setCurrentCargoShipment(null)
    setCurrentCargoIndex(0)
    setBarcode("")
    setAllowCargoHandling(false)
    setCargoInputLines([])
    setShowExcessPayment(false)
    setShowCargoLabel(false)
    setShowCargoPass(false)
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
    const shipment = cargoData[code]
    if (!shipment) {
      alert("Document not found.")
      return
    }

    // initialize cargo shipment
    const shipmentCopy = JSON.parse(JSON.stringify(shipment)) // shallow clone
    shipmentCopy.cargoItems = shipmentCopy.cargoItems.map((c) => ({ ...c, verified: false, checkedIn: false }))
    setCurrentCargoShipment(shipmentCopy)
    setCurrentCargoIndex(0)
    setAllowCargoHandling(false)

    // Reset handling state for new scan
    setCargoInputLines([])
    setShowExcessPayment(false)
    setShowCargoLabel(false)
    setShowCargoPass(false)

    // Add initial cargo line
    addCargoLine(shipmentCopy.cargoItems[0].ticketDetails.ticketNo)
  }

  function changeCargoIndex(newIndex) {
    if (!currentCargoShipment) return
    const max = currentCargoShipment.cargoItems.length - 1
    const idx = Math.max(0, Math.min(newIndex, max))
    setCurrentCargoIndex(idx)

    // reset handling area visibility when changing cargo item
    setAllowCargoHandling(false)
    setShowExcessPayment(false)
    setShowCargoLabel(false)
    setShowCargoPass(false)

    // Reset cargo lines for new item
    const ticketNo = currentCargoShipment.cargoItems[idx].ticketDetails.ticketNo
    setCargoInputLines([])
    addCargoLine(ticketNo)

    // Check if already verified to show handling section
    if (currentCargoShipment.cargoItems[idx].verified) {
      setAllowCargoHandling(true)
    }
  }

  function toggleVerifiedForCurrent(e) {
    if (!currentCargoShipment) return
    const clone = { ...currentCargoShipment }
    clone.cargoItems = clone.cargoItems.map((c, i) =>
      i === currentCargoIndex ? { ...c, verified: e.target.checked } : c,
    )
    setCurrentCargoShipment(clone)

    // if verified, show handling section
    setAllowCargoHandling(e.target.checked)

    if (!e.target.checked) {
      setShowExcessPayment(false)
      setShowCargoLabel(false)
      setShowCargoPass(false)
    }
  }

  // Cargo Handling Functions
  function addCargoLine(ticketNoOverride) {
    const ticketNo =
      ticketNoOverride || currentCargoShipment?.cargoItems[currentCargoIndex]?.ticketDetails?.ticketNo || "TKN-00"
    const nextIndex = cargoInputLines.length + 1
    const labelNo = `${ticketNo}-${nextIndex.toString().padStart(2, "0")}`

    setCargoInputLines((prev) => [
      ...prev,
      {
        id: Date.now(),
        labelNo,
        unitNo: "",
        weight: "",
      },
    ])
  }

  function removeCargoLine(id) {
    setCargoInputLines((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      // Re-index labels
      const ticketNo = currentCargoShipment?.cargoItems[currentCargoIndex]?.ticketDetails?.ticketNo || "TKN-00"
      return filtered.map((item, index) => ({
        ...item,
        labelNo: `${ticketNo}-${(index + 1).toString().padStart(2, "0")}`,
      }))
    })
  }

  function updateCargoLine(id, field, value) {
    setCargoInputLines((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  function confirmCargo() {
    if (!currentCargoShipment) return

    const c = currentCargoShipment.cargoItems[currentCargoIndex]
    const totalWeight = cargoInputLines.reduce((sum, item) => sum + (Number.parseFloat(item.weight) || 0), 0)
    const allowedWeight = c.ticketDetails.allowedWeight || 0
    const excess = Math.max(0, totalWeight - allowedWeight)

    if (excess > 0) {
      const feeRate = 5.0
      const timestamp = Date.now().toString().slice(-6)

      setExcessDetails({
        weight: excess,
        fee: feeRate,
        totalFee: excess * feeRate,
        ticketNo: `EX-${c.ticketDetails.ticketNo}-${timestamp}`,
        allowedWeight: allowedWeight,
        actualWeight: totalWeight,
      })
      setShowExcessPayment(true)
      setShowCargoLabel(false)
    } else {
      setShowExcessPayment(false)
      setShowCargoLabel(true)
    }
  }

  function confirmPayment() {
    if (!paymentMethod || !paymentAccount || !transactionNo.trim()) {
      alert("Please enter payment method, account and transaction number before confirming payment.")
      return
    }

    // Add to excess cargo table
    const c = currentCargoShipment.cargoItems[currentCargoIndex]
    const accountName = paymentAccounts[paymentMethod]?.find((a) => a.id === paymentAccount)?.name || ""

    const newExcessRow = {
      vesselName: currentCargoShipment.tripDetails.vesselName,
      voyageNo: currentCargoShipment.tripDetails.voyageNo,
      from: currentCargoShipment.tripDetails.from,
      to: currentCargoShipment.tripDetails.to,
      etd: currentCargoShipment.tripDetails.etd,
      eta: currentCargoShipment.tripDetails.eta,
      ticketNo: c.ticketDetails.ticketNo,
      cabin: c.ticketDetails.cabin,
      ticketType: c.ticketDetails.ticketType,
      serviceType: c.ticketDetails.serviceType,
      visaType: c.ticketDetails.visaType,
      allowedWeight: c.ticketDetails.allowedWeight,
      cargoType: c.cargoDetails.cargoType,
      goodsType: c.cargoDetails.goodsType,
      quantity: c.cargoDetails.quantity,
      weight: c.cargoDetails.weight,
      dimensions: c.cargoDetails.dimensions,
      goodsDescription: c.cargoDetails.goodsDescription,
      consigneeName: c.cargoDetails.consignee.name,
      consigneePhone: c.cargoDetails.consignee.phone,
      consigneeId: c.cargoDetails.consignee.id,
      consignorName: c.cargoDetails.consignor.name,
      consignorPhone: c.cargoDetails.consignor.phone,
      consignorId: c.cargoDetails.consignor.id,
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

    setExcessCargoRows((prev) => [...prev, newExcessRow])
    setShowExcessPayment(false)
    setShowCargoLabel(true)
  }

  function printLabel() {
    alert("Label sent to printer.")
    setShowCargoLabel(false)
    setShowCargoPass(true)
  }

  function addManifestRowFromCurrent() {
    if (!selectedTrip || !currentCargoShipment) return

    const c = currentCargoShipment.cargoItems[currentCargoIndex]
    const totalWeight = cargoInputLines.reduce((sum, item) => sum + (Number.parseFloat(item.weight) || 0), 0)
    const allowedWeight = c.ticketDetails.allowedWeight || 0
    const excessWeight = Math.max(0, totalWeight - allowedWeight)

    const row = {
      vesselName: selectedTrip.vesselName,
      voyageNo: selectedTrip.voyageNo,
      from: selectedTrip.from,
      to: selectedTrip.to,
      etd: selectedTrip.etd,
      eta: selectedTrip.eta,
      ticketNo: c.ticketDetails.ticketNo || "-",
      cabin: c.ticketDetails.cabin || "-",
      ticketType: c.ticketDetails.ticketType || "-",
      serviceType: c.ticketDetails.serviceType || "-",
      visaType: c.ticketDetails.visaType || "-",
      allowedWeight: c.ticketDetails.allowedWeight ?? "-",
      cargoType: c.cargoDetails.cargoType,
      goodsType: c.cargoDetails.goodsType,
      quantity: c.cargoDetails.quantity,
      weight: c.cargoDetails.weight,
      dimensions: c.cargoDetails.dimensions,
      goodsDescription: c.cargoDetails.goodsDescription,
      consigneeName: c.cargoDetails.consignee.name,
      consigneePhone: c.cargoDetails.consignee.phone,
      consigneeId: c.cargoDetails.consignee.id,
      consignorName: c.cargoDetails.consignor.name,
      consignorPhone: c.cargoDetails.consignor.phone,
      consignorId: c.cargoDetails.consignor.id,
      allowedWeightVal: allowedWeight,
      actualWeight: totalWeight,
      excessWeight: excessWeight,
      status: "Checked In",
    }

    setManifestRows((prev) => [...prev, row])
  }

  function confirmCheckin() {
    if (!currentCargoShipment) return

    // mark current cargo checked in
    const clone = { ...currentCargoShipment }
    clone.cargoItems = clone.cargoItems.map((c, i) => (i === currentCargoIndex ? { ...c, checkedIn: true } : c))
    setCurrentCargoShipment(clone)

    // add manifest row
    addManifestRowFromCurrent()

    alert(
      `Check-in confirmed for cargo ticket ${currentCargoShipment.cargoItems[currentCargoIndex].ticketDetails.ticketNo}`,
    )

    // move to next cargo or finish trip
    if (currentCargoIndex < clone.cargoItems.length - 1) {
      changeCargoIndex(currentCargoIndex + 1)
    } else {
      alert("All cargo items checked in successfully!")
      // return to trip selection (reset)
      setShowCheckinPage(false)
      setShowTripSelection(true)
      setSelectedTrip(null)
      resetSession()
    }
  }

  // Render helpers
  const currentCargo = currentCargoShipment ? currentCargoShipment.cargoItems[currentCargoIndex] : null
  const frozenTrip = currentCargoShipment ? currentCargoShipment.tripDetails : selectedTrip || null

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
    h1,h2,h3,h4,h5 { margin:0 0 10px 0; }
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
    .cargo-navigation { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px;  border-radius:8px; border:1px solid #e6e9ed; margin-bottom:10px; }
    .nav-button { width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; border:none; background:linear-gradient(90deg, #00B5AD, #00D2CB) !important; color:#fff; font-size:16px; }
    .nav-button:disabled { background:#bfcff8; color:#fff; cursor:not-allowed; }
    .cargo-header, .cargo-input-line { display:grid; grid-template-columns: 2fr 1fr 1fr auto; gap:8px; align-items:center; margin-bottom:6px; }
    .cargo-input-line input { padding:6px; border-radius:6px; border:1px solid #ccd0d6; }
    .remove-cargo-line { background:#dc3545; color:#fff; border:none; padding:6px 8px; border-radius:6px; }
    #cargo-label, #cargo-pass {  padding:12px; border-radius:8px; box-shadow: -5px -5px 9px rgb(255 255 255 / 14%), 5px 5px 9px rgb(94 104 121 / 17%); }
    .cargo-table { width:100%; border-collapse:collapse; margin-top:8px; }
    .cargo-table th, .cargo-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .excess-cargo-table { width:100%; border-collapse:collapse; margin-top:8px; overflow-x:auto; }
    .excess-cargo-table th, .excess-cargo-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .excess-cargo-table th { background-color:#f8f9fa; position: sticky; top:0; }
    .excess-cargo-table-container { max-width:100%; overflow-x:auto; }
    .cargo-manifest-table { width:100%; border-collapse:collapse; margin-top:8px; overflow-x:auto; }
    .cargo-manifest-table th, .cargo-manifest-table td { border:1px solid #e6e9ed; padding:6px; text-align:left; }
    .cargo-manifest-table th { background-color:#f8f9fa; position: sticky; top:0; }
    .cargo-manifest-table-container { max-width:100%; overflow-x:auto; }
    .cargo-pass-actions { display:flex; justify-content:space-between; margin-top:15px; }
    .cargo-pass-actions button { padding:8px 16px; border-radius:6px; border:none; font-weight:600; }
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
      .cargo-pass-actions{ flex-direction:column; gap:8px; }
      .trip-selection-table th, .trip-selection-table td { padding: 8px 10px; font-size: 0.85rem; }
    }`,
            }}
          />
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <h5 className="mb-3">Cargo CheckIn</h5>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-2">
                  <div className="card-body">
                    {/* Trip selection */}
                    {showTripSelection && (
                      <div id="trip-selection-page" className="container">
                        <h5 className="mb-3">Select a Trip to Begin Cargo Check-in</h5>
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
                          {selectedTrip ? `${selectedTrip.vesselName} ${selectedTrip.voyageNo} — Cargo Check-in` : ""}
                        </h5>

                        <div className="tab-container" style={{ marginTop: 12 }}>
                          <button
                            className={`tab-button ${activeTab === "cargo" ? "active" : ""}`}
                            onClick={() => setActiveTab("cargo")}
                          >
                            Cargo
                          </button>
                          <button
                            className={`tab-button ${activeTab === "excess-cargo" ? "active" : ""}`}
                            onClick={() => setActiveTab("excess-cargo")}
                          >
                            Excess Cargo Tickets
                          </button>
                          <button
                            className={`tab-button ${activeTab === "cargo-manifest" ? "active" : ""}`}
                            onClick={() => setActiveTab("cargo-manifest")}
                          >
                            Cargo Manifest
                          </button>
                        </div>

                        {activeTab === "cargo" && (
                          <div id="cargo" className="tab-content active">
                            <h5 className="mb-3">Cargo Check-in</h5>
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
                                  id="cargo-info"
                                  className={`checkin-section ${currentCargoShipment ? "" : "hidden"}`}
                                >
                                  <h3 style={{ fontSize: "0.98rem" }}>2. Cargo Details</h3>
                                  <div style={{ fontSize: "0.9rem", marginTop: 6 }} className="form-label">
                                    Cargo verification is done in the right panel (Cargo Document Preview). Cargo
                                    handling opens only after all cargo items are verified.
                                  </div>
                                </div>

                                {/* Cargo Handling section */}
                                <section
                                  id="cargo-handling"
                                  className={`checkin-section ${allowCargoHandling && !showCargoLabel && !showCargoPass ? "" : "hidden"}`}
                                >
                                  <h3 style={{ fontSize: "0.98rem" }}>3. Cargo Handling</h3>
                                  <div className="form-label" style={{ marginTop: 6 }}>
                                    Total Allowed Weight (sum of cargo items):{" "}
                                    <strong>
                                      <span id="allowed-weight">{currentCargo?.ticketDetails?.allowedWeight || 0}</span>{" "}
                                      kg
                                    </strong>
                                  </div>
                                  <div className="cargo-header" style={{ marginTop: 10 }}>
                                    <div className="form-label">Cargo Label No.</div>
                                    <div className="form-label">Handling Unit No.</div>
                                    <div className="form-label">Actual Weight (kg)</div>
                                    <div />
                                  </div>

                                  <div id="cargo-items">
                                    {cargoInputLines.map((item) => (
                                      <div key={item.id} className="cargo-input-line">
                                        <input
                                          type="text"
                                          className="cargo-label-no document-value"
                                          value={item.labelNo}
                                          readOnly
                                        />
                                        <input
                                          type="text"
                                          className="handling-unit-no document-value"
                                          placeholder="Handling Unit No."
                                          value={item.unitNo}
                                          onChange={(e) => updateCargoLine(item.id, "unitNo", e.target.value)}
                                        />
                                        <input
                                          type="number"
                                          className="actual-weight document-value"
                                          step="0.1"
                                          min="0"
                                          placeholder="0.0"
                                          value={item.weight}
                                          onChange={(e) => updateCargoLine(item.id, "weight", e.target.value)}
                                        />
                                        <button
                                          type="button"
                                          className="remove-cargo-line"
                                          onClick={() => removeCargoLine(item.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  <button
                                    id="add-cargo-line"
                                    className="btn btn-turquoise"
                                    onClick={() => addCargoLine()}
                                  >
                                    Add Cargo Item
                                  </button>
                                  <button
                                    id="confirm-cargo-button"
                                    style={{
                                      marginTop: 8,
                                      padding: "8px 12px",
                                      borderRadius: 6,
                                      background: "#198754",
                                      color: "#fff",
                                      border: "none",
                                    }}
                                    onClick={confirmCargo}
                                  >
                                    Confirm Cargo
                                  </button>

                                  {/* Excess Payment Section */}
                                  {showExcessPayment && (
                                    <div
                                      id="excess-cargo-payment-section"
                                      style={{
                                        marginTop: 10,
                                        background: "#fffbe6",
                                        border: "1px solid #ffe08a",
                                        padding: 10,
                                        borderRadius: 8,
                                      }}
                                    >
                                      <h5 style={{ margin: "0 0 8px 0" }}>Excess Cargo Ticket</h5>
                                      <div
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr 1fr",
                                          gap: 12,
                                          marginTop: 10,
                                        }}
                                      >
                                        <div>
                                          <div className="form-label">Consignee Name</div>
                                          <input
                                            className="document-value"
                                            readOnly
                                            value={currentCargo?.cargoDetails?.consignee?.name || ""}
                                          />
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Consignee ID
                                          </div>
                                          <input
                                            className="document-value"
                                            readOnly
                                            value={currentCargo?.cargoDetails?.consignee?.id || ""}
                                          />
                                          <div className="form-label" style={{ marginTop: 8 }}>
                                            Consignor Name
                                          </div>
                                          <input
                                            className="document-value"
                                            readOnly
                                            value={currentCargo?.cargoDetails?.consignor?.name || ""}
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

                                {/* Cargo Label Section */}
                                {showCargoLabel && (
                                  <div id="cargo-label">
                                    <h5 className="mb-3">Cargo Label</h5>
                                    <div className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Vessel</div>
                                          <div className="document-value">
                                            {currentCargoShipment.tripDetails.vesselName}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Voyage No</div>
                                          <div className="document-value">
                                            {currentCargoShipment.tripDetails.voyageNo}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">From</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.from}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">To</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.to}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETD</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.etd}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETA</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.eta}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Cargo Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Cargo Type</div>
                                          <div className="document-value">{currentCargo.cargoDetails.cargoType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Goods Type</div>
                                          <div className="document-value">{currentCargo.cargoDetails.goodsType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Quantity</div>
                                          <div className="document-value">{currentCargo.cargoDetails.quantity}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Weight</div>
                                          <div className="document-value">{currentCargo.cargoDetails.weight} kg</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Consignee</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.consignee.name}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Consignor</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.consignor.name}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Cargo Items</h5>
                                      <table className="table table-striped">
                                        <thead>
                                          <tr>
                                            <th>Cargo Label No.</th>
                                            <th>Handling Unit No.</th>
                                            <th>Actual Weight (kg)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {cargoInputLines.map((item) => (
                                            <tr key={item.id}>
                                              <td>{item.labelNo}</td>
                                              <td>{item.unitNo}</td>
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

                                {/* Cargo Pass Section */}
                                {showCargoPass && (
                                  <div id="cargo-pass">
                                    <h5 className="mb-3">Cargo Pass</h5>
                                    <div className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Vessel</div>
                                          <div className="document-value">
                                            {currentCargoShipment.tripDetails.vesselName}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Voyage No</div>
                                          <div className="document-value">
                                            {currentCargoShipment.tripDetails.voyageNo}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">From</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.from}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">To</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.to}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETD</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.etd}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETA</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.eta}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Ticket Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Ticket No</div>
                                          <div className="document-value">{currentCargo.ticketDetails.ticketNo}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Cabin</div>
                                          <div className="document-value">{currentCargo.ticketDetails.cabin}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Ticket Type</div>
                                          <div className="document-value">{currentCargo.ticketDetails.ticketType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Service Type</div>
                                          <div className="document-value">{currentCargo.ticketDetails.serviceType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Visa Type</div>
                                          <div className="document-value">{currentCargo.ticketDetails.visaType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Allowed Weight</div>
                                          <div className="document-value">
                                            {currentCargo.ticketDetails.allowedWeight} kg
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Cargo Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Cargo Type</div>
                                          <div className="document-value">{currentCargo.cargoDetails.cargoType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Goods Type</div>
                                          <div className="document-value">{currentCargo.cargoDetails.goodsType}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Quantity</div>
                                          <div className="document-value">{currentCargo.cargoDetails.quantity}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Weight</div>
                                          <div className="document-value">{currentCargo.cargoDetails.weight} kg</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Dimensions</div>
                                          <div className="document-value">{currentCargo.cargoDetails.dimensions}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">Goods Description</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.goodsDescription}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Consignee Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Name</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.consignee.name}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Phone</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.consignee.phone}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">ID No</div>
                                          <div className="document-value">{currentCargo.cargoDetails.consignee.id}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Consignor Details</h5>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                                        <div>
                                          <div className="form-label">Name</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.consignor.name}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Phone</div>
                                          <div className="document-value">
                                            {currentCargo.cargoDetails.consignor.phone}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">ID No</div>
                                          <div className="document-value">{currentCargo.cargoDetails.consignor.id}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="document-card">
                                      <h5 className="mb-3">Cargo Items</h5>
                                      <table className="cargo-table">
                                        <thead>
                                          <tr>
                                            <th>Cargo Label No.</th>
                                            <th>Handling Unit No.</th>
                                            <th>Actual Weight (kg)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {cargoInputLines.map((item) => (
                                            <tr key={item.id}>
                                              <td>{item.labelNo}</td>
                                              <td>{item.unitNo}</td>
                                              <td>{item.weight}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="cargo-pass-actions">
                                      <button
                                        id="print-cargo-pass-btn"
                                        className="print-btn"
                                        onClick={() => alert("Cargo pass sent to printer.")}
                                      >
                                        Print Cargo Pass
                                      </button>
                                      <button id="confirm-checkin-btn" className="confirm-btn" onClick={confirmCheckin}>
                                        Confirm Check-in
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="right-panel">
                                <h5 className="mb-3">Cargo Document Preview</h5>

                                {/* Cargo navigation */}
                                <div
                                  id="cargo-navigation"
                                  className={`cargo-navigation ${currentCargoShipment ? "" : "hidden"}`}
                                >
                                  <button
                                    id="prev-cargo-btn"
                                    className="nav-button"
                                    title="Previous cargo"
                                    aria-label="Previous cargo"
                                    onClick={() => changeCargoIndex(currentCargoIndex - 1)}
                                    disabled={!currentCargoShipment || currentCargoIndex === 0}
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
                                    Cargo Item{" "}
                                    <span id="current-cargo-num">
                                      {currentCargoShipment ? currentCargoIndex + 1 : 0}
                                    </span>{" "}
                                    of{" "}
                                    <span id="total-cargo">
                                      {currentCargoShipment ? currentCargoShipment.cargoItems.length : 0}
                                    </span>
                                  </div>

                                  <button
                                    id="next-cargo-btn"
                                    className="nav-button"
                                    title="Next cargo"
                                    aria-label="Next cargo"
                                    onClick={() => changeCargoIndex(currentCargoIndex + 1)}
                                    disabled={
                                      !currentCargoShipment ||
                                      (currentCargoShipment &&
                                        currentCargoIndex >= currentCargoShipment.cargoItems.length - 1)
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
                                {currentCargoShipment && (
                                  <>
                                    <div id="frozen-trip-details" className="document-card">
                                      <h5 className="mb-3">Trip Details</h5>
                                      <div className="details-grid">
                                        <div>
                                          <div className="form-label">Vessel Name</div>
                                          <div className="document-value">
                                            {currentCargoShipment.tripDetails.vesselName}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Voyage No</div>
                                          <div className="document-value">
                                            {currentCargoShipment.tripDetails.voyageNo}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">From</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.from}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">To</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.to}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETD</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.etd}</div>
                                        </div>
                                        <div>
                                          <div className="form-label">ETA</div>
                                          <div className="document-value">{currentCargoShipment.tripDetails.eta}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div id="frozen-agent-details" className="document-card">
                                      <h5 className="mb-3">Agent Details</h5>
                                      <div className="details-grid">
                                        <div>
                                          <div className="form-label">Company</div>
                                          <div className="document-value">
                                            {currentCargoShipment.agentDetails.company}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Marine Agent</div>
                                          <div className="document-value">
                                            {currentCargoShipment.agentDetails.marineAgent}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Commercial Agent</div>
                                          <div className="document-value">
                                            {currentCargoShipment.agentDetails.commercialAgent}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Subagent</div>
                                          <div className="document-value">
                                            {currentCargoShipment.agentDetails.subagent}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="form-label">Salesman</div>
                                          <div className="document-value">
                                            {currentCargoShipment.agentDetails.salesman}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Ticket & Cargo details */}
                                <div id="document-preview" className="document-grid">
                                  <div className="document-card">
                                    <h5 className="mb-3">Ticket Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Ticket No</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.ticketDetails.ticketNo : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Cabin</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.ticketDetails.cabin : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Ticket Type</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.ticketDetails.ticketType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Service Type</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.ticketDetails.serviceType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Visa Type</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.ticketDetails.visaType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Allowed Weight</div>
                                        <div className="document-value">
                                          {currentCargo ? `${currentCargo.ticketDetails.allowedWeight} kg` : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Status</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.ticketDetails.status : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="document-card">
                                    <h5 className="mb-3">Cargo Details</h5>
                                    <div className="details-grid">
                                      <div>
                                        <div className="form-label">Cargo Type</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.cargoType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Goods Type</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.goodsType : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Quantity</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.quantity : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Weight</div>
                                        <div className="document-value">
                                          {currentCargo ? `${currentCargo.cargoDetails.weight} kg` : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Dimensions</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.dimensions : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Goods Description</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.goodsDescription : ""}
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
                                          {currentCargo ? currentCargo.cargoDetails.consignee.name : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Phone</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.consignee.phone : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">ID No</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.consignee.id : ""}
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
                                          {currentCargo ? currentCargo.cargoDetails.consignor.name : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">Phone</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.consignor.phone : ""}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="form-label">ID No</div>
                                        <div className="document-value">
                                          {currentCargo ? currentCargo.cargoDetails.consignor.id : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                    <input
                                      id="cargo-verified"
                                      type="checkbox"
                                      checked={!!currentCargo?.verified}
                                      onChange={toggleVerifiedForCurrent}
                                    />
                                    <label htmlFor="cargo-verified" style={{ fontWeight: 600 }}>
                                      Cargo Documentation Verified
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Excess cargo tab */}
                        {activeTab === "excess-cargo" && (
                          <div id="excess-cargo" className="tab-content">
                            <h5 className="mb-3">Excess Cargo Tickets</h5>
                            <div className="document-card">
                              <div className="excess-cargo-table-container">
                                <table className="table table-striped" id="excess-cargo-table">
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
                                      <th>Cargo Type</th>
                                      <th>Goods Type</th>
                                      <th>Quantity</th>
                                      <th>Weight</th>
                                      <th>Dimensions</th>
                                      <th>Goods Description</th>
                                      <th>Consignee Name</th>
                                      <th>Consignee Phone</th>
                                      <th>Consignee ID</th>
                                      <th>Consignor Name</th>
                                      <th>Consignor Phone</th>
                                      <th>Consignor ID</th>
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
                                    {excessCargoRows.length > 0 ? (
                                      excessCargoRows.map((row, i) => (
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
                                          <td>{row.cargoType}</td>
                                          <td>{row.goodsType}</td>
                                          <td>{row.quantity}</td>
                                          <td>{row.weight}</td>
                                          <td>{row.dimensions}</td>
                                          <td>{row.goodsDescription}</td>
                                          <td>{row.consigneeName}</td>
                                          <td>{row.consigneePhone}</td>
                                          <td>{row.consigneeId}</td>
                                          <td>{row.consignorName}</td>
                                          <td>{row.consignorPhone}</td>
                                          <td>{row.consignorId}</td>
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
                                      <tr id="excess-cargo-row">
                                        <td colSpan="33" style={{ textAlign: "center" }}>
                                          No excess cargo tickets yet
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
                        {activeTab === "cargo-manifest" && (
                          <div id="cargo-manifest" className="tab-content">
                            <h5 className="mb-3">Cargo Manifest</h5>
                            <div className="document-card">
                              <div className="cargo-manifest-table-container">
                                <table className="table table-striped" id="cargo-manifest-table">
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
                                      <th>Cargo Type</th>
                                      <th>Goods Type</th>
                                      <th>Quantity</th>
                                      <th>Weight</th>
                                      <th>Dimensions</th>
                                      <th>Goods Description</th>
                                      <th>Consignee Name</th>
                                      <th>Consignee Phone</th>
                                      <th>Consignee ID</th>
                                      <th>Consignor Name</th>
                                      <th>Consignor Phone</th>
                                      <th>Consignor ID</th>
                                      <th>Allowed Weight (kg)</th>
                                      <th>Actual Weight (kg)</th>
                                      <th>Excess Weight (kg)</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody id="cargo-manifest-tbody">
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
                                          <td>{r.cargoType}</td>
                                          <td>{r.goodsType}</td>
                                          <td>{r.quantity}</td>
                                          <td>{r.weight}</td>
                                          <td>{r.dimensions}</td>
                                          <td>{r.goodsDescription}</td>
                                          <td>{r.consigneeName}</td>
                                          <td>{r.consigneePhone}</td>
                                          <td>{r.consigneeId}</td>
                                          <td>{r.consignorName}</td>
                                          <td>{r.consignorPhone}</td>
                                          <td>{r.consignorId}</td>
                                          <td>{r.allowedWeightVal}</td>
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
