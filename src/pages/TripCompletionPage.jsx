"use client"

import { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"

export default function TripCompletionPage() {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [activeTab, setActiveTab] = useState("passenger")
  const [searchQuery, setSearchQuery] = useState("")
  const [modalMessage, setModalMessage] = useState({ title: "", message: "", show: false })

  // Mock Data
  useEffect(() => {
    const mockTrips = [
      {
        id: "T-001",
        route: "Jakarta - Surabaya",
        vessel: "KM Sabuk Nusantara",
        voyageNo: "V-2024-001",
        fromPort: "Jakarta",
        toPort: "Surabaya",
        etd: "2024-03-20 08:00",
        eta: "2024-03-21 16:00",
        status: "completed",
        passenger: [
          {
            id: "P1001",
            name: "Alice Smith",
            ticket: "JKSB-1001",
            seat: "A12",
            boardingStatus: "BOARDED",
            passengerWeight: 70,
            luggageAllowed: 20,
            luggageActual: 20,
          },
          {
            id: "P1002",
            name: "Bob Johnson",
            ticket: "JKSB-1002",
            seat: "A13",
            boardingStatus: "BOARDED",
            passengerWeight: 80,
            luggageAllowed: 20,
            luggageActual: 35,
            excessFee: 45.0,
          },
          {
            id: "P1003",
            name: "Charlie Brown",
            ticket: "JKSB-1003",
            seat: "B01",
            boardingStatus: "BOARDED",
            passengerWeight: 65,
            luggageAllowed: 20,
            luggageActual: 10,
          },
          {
            id: "P1004",
            name: "Diana Prince",
            ticket: "JKSB-1004",
            seat: "B02",
            boardingStatus: "BOARDED",
            passengerWeight: 75,
            luggageAllowed: 20,
            luggageActual: 32,
            excessFee: 36.0,
          },
        ],
        cargo: [
          {
            id: "C2001",
            bill: "JKT-2024-001",
            consignor: "PT Logistik",
            weight: 500,
            allowedWeight: 450,
            hold: "HOLD A",
            serviceType: "LCL",
            status: "LOADED",
            qty: 10,
          },
          {
            id: "C2002",
            bill: "JKT-2024-002",
            consignor: "CV Niaga",
            weight: 1200,
            allowedWeight: 1200,
            hold: "HOLD B",
            serviceType: "FCL",
            status: "LOADED",
            qty: 1,
          },
          {
            id: "C2003",
            bill: "JKT-2024-003",
            consignor: "PT Fast",
            weight: 850,
            allowedWeight: 900,
            hold: "HOLD A",
            serviceType: "LCL",
            status: "LOADED",
            qty: 5,
          },
          {
            id: "C2004",
            bill: "JKT-2024-004",
            consignor: "CV Pending",
            weight: 150,
            allowedWeight: 200,
            hold: "-",
            serviceType: "LCL",
            status: "PENDING",
            qty: 2,
          },
        ],
        vehicles: [
          {
            id: "V3001",
            plate: "B 1234 XY",
            type: "Truck",
            owner: "PT Transport",
            actualWeight: 4500,
            allowedWeight: 4000,
            excessWeightFee: 50.0,
            hold: "DECK 1",
            loadingPosition: "1A",
            status: "LOADED",
          },
          {
            id: "V3002",
            plate: "D 5678 ZA",
            type: "Car",
            owner: "Ahmad Budi",
            actualWeight: 1800,
            allowedWeight: 2000,
            excessWeightFee: 0,
            hold: "DECK 2",
            loadingPosition: "2C",
            status: "LOADED",
          },
          {
            id: "V3003",
            plate: "L 9012 BC",
            type: "Bus",
            owner: "PO Travel",
            actualWeight: 8200,
            allowedWeight: 8000,
            excessWeightFee: 20.0,
            hold: "DECK 1",
            loadingPosition: "1B",
            status: "LOADED",
          },
          {
            id: "V3004",
            plate: "A 1111 DD",
            type: "Motorbike",
            owner: "Joko",
            actualWeight: 200,
            allowedWeight: 500,
            excessWeightFee: 0,
            hold: "-",
            loadingPosition: "-",
            status: "PENDING",
          },
        ],
      },
      {
        id: "T-002",
        route: "Surabaya - Bali",
        vessel: "KM Nyi Roro Kidul",
        voyageNo: "V-2024-002",
        fromPort: "Surabaya",
        toPort: "Bali",
        etd: "2024-03-15 10:30",
        eta: "2024-03-16 18:00",
        status: "completed",
        passenger: [],
        cargo: [],
        vehicles: [],
      },
    ]

    setTrips(mockTrips)
  }, [])

  const calculatePayloadReport = (trip) => {
    const boardedPassengers = trip.passenger.filter((p) => p.boardingStatus === "BOARDED")
    const totalPassengerLoad = boardedPassengers.reduce((sum, p) => sum + (p.passengerWeight + p.luggageActual), 0)

    const loadedCargo = trip.cargo.filter((c) => c.status === "LOADED")
    const totalCargoWeight = loadedCargo.reduce((sum, c) => sum + c.weight, 0)

    const loadedVehicles = trip.vehicles.filter((v) => v.status === "LOADED")
    const totalVehiclesWeight = loadedVehicles.reduce((sum, v) => sum + v.actualWeight, 0)

    const grandTotalPayload = totalPassengerLoad + totalCargoWeight + totalVehiclesWeight

    return {
      totalPassengerLoad,
      totalCargoWeight,
      totalVehiclesWeight,
      grandTotalPayload,
    }
  }

  const handleTripSelect = (trip) => {
    setCurrentTrip(trip)
    setActiveTab("passenger")
  }

  const handleBackToTrips = () => {
    setCurrentTrip(null)
    setSearchQuery("")
  }

  const handleCompleteTrip = () => {
    if (currentTrip && currentTrip.status === "ongoing") {
      setModalMessage({
        title: "Success",
        message: `Trip ${currentTrip.id} finalized and marked as Completed!`,
        show: true,
      })

      const updatedTrips = trips.map((trip) => {
        if (trip.id === currentTrip.id) {
          return { ...trip, status: "completed" }
        }
        return trip
      })

      setTrips(updatedTrips)
      setCurrentTrip({ ...currentTrip, status: "completed" })
    }
  }

  const closeModal = () => {
    setModalMessage({ ...modalMessage, show: false })
  }

  const filteredTrips = trips.filter(
    (trip) =>
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.vessel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.voyageNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.fromPort.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.toPort.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderTripListItem = (trip) => {
    const statusClass = trip.status === "completed" ? "trip-status-completed" : "trip-status-ongoing"

    return (
      <div key={trip.id} className="trip-card-item" onClick={() => handleTripSelect(trip)}>
        <div className="trip-card-header">
          <h6 className="trip-id">{trip.id}</h6>
          <span className={`trip-status ${statusClass}`}>{trip.status.toUpperCase()}</span>
        </div>

        <div className="trip-card-grid">
          <div className="trip-card-column">
            <div className="trip-detail-row">
              <span className="trip-label">Vessel Name:</span>
              <span className="trip-value">{trip.vessel}</span>
            </div>
            <div className="trip-detail-row">
              <span className="trip-label">From Port:</span>
              <span className="trip-value">{trip.fromPort}</span>
            </div>
            <div className="trip-detail-row">
              <span className="trip-label">ETD:</span>
              <span className="trip-value">{trip.etd}</span>
            </div>
          </div>

          <div className="trip-card-column">
            <div className="trip-detail-row">
              <span className="trip-label">Voyage No:</span>
              <span className="trip-value">{trip.voyageNo}</span>
            </div>
            <div className="trip-detail-row">
              <span className="trip-label">To Port:</span>
              <span className="trip-value">{trip.toPort}</span>
            </div>
            <div className="trip-detail-row">
              <span className="trip-label">ETA:</span>
              <span className="trip-value">{trip.eta}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderManifestTable = () => {
    if (!currentTrip) return null

    const data = currentTrip[activeTab]
    const payload = calculatePayloadReport(currentTrip)

    let headers = []
    let rows = []
    let footerRow = null
    let totalActualWeight = 0
    let totalAllowedWeight = 0
    let totalExcessWeight = 0

    if (activeTab === "passenger") {
      const boardedPassengers = data.filter((p) => p.boardingStatus === "BOARDED")
      totalActualWeight = boardedPassengers.reduce((sum, p) => sum + (p.passengerWeight + p.luggageActual), 0)
      totalAllowedWeight = boardedPassengers.reduce((sum, p) => sum + (p.passengerWeight + p.luggageAllowed), 0)
      totalExcessWeight = boardedPassengers.reduce((sum, p) => sum + Math.max(0, p.luggageActual - p.luggageAllowed), 0)

      headers = [
        "Passenger / Ticket",
        "Seat / Status",
        "Pax Weight (KG)",
        "Allowed Luggage (KG)",
        "Actual Luggage (KG)",
        "Excess Luggage (KG)",
        "TOTAL Actual Load (KG)",
      ]

      rows = boardedPassengers.map((p) => {
        const excessLuggage = Math.max(0, p.luggageActual - p.luggageAllowed)
        const totalActualLoad = p.passengerWeight + p.luggageActual

        return (
          <tr key={p.id}>
            <td className="py-3 px-4 fw-medium">
              {p.name} / {p.ticket}
            </td>
            <td className="py-3 px-4 text-secondary">
              {p.seat} / <span className="loaded">{p.boardingStatus}</span>
            </td>
            <td className="py-3 px-4 text-end">{p.passengerWeight}</td>
            <td className="py-3 px-4 text-end">{p.luggageAllowed}</td>
            <td className="py-3 px-4 text-end fw-bold">{p.luggageActual}</td>
            <td className={`py-3 px-4 text-end ${excessLuggage > 0 ? "excess" : "text-secondary"}`}>
              {excessLuggage > 0 ? excessLuggage : "-"}
            </td>
            <td className="py-3 px-4 text-end fw-bolder text-primary">{totalActualLoad}</td>
          </tr>
        )
      })

      footerRow = (
        <tr className="total-row">
          <td className="py-3 px-4 fw-bolder" colSpan="3">
            TOTAL MANIFEST SUMMARIES
          </td>
          <td className="py-3 px-4 text-end fw-bolder">{totalAllowedWeight}</td>
          <td className="py-3 px-4 text-end fw-bolder">
            {boardedPassengers.reduce((sum, p) => sum + p.luggageActual, 0)}
          </td>
          <td className={`py-3 px-4 text-end fw-bolder ${totalExcessWeight > 0 ? "excess" : ""}`}>
            {totalExcessWeight > 0 ? totalExcessWeight : "-"}
          </td>
          <td className="py-3 px-4 text-end fw-bolder text-primary">{totalActualWeight}</td>
        </tr>
      )
    } else if (activeTab === "cargo") {
      const loadedCargo = data.filter((c) => c.status === "LOADED")
      totalActualWeight = loadedCargo.reduce((sum, c) => sum + c.weight, 0)
      totalAllowedWeight = loadedCargo.reduce((sum, c) => sum + c.allowedWeight, 0)
      totalExcessWeight = loadedCargo.reduce((sum, c) => sum + Math.max(0, c.weight - c.allowedWeight), 0)

      headers = [
        "Bill No.",
        "Consignor / Qty",
        "Hold / Service",
        "Allowed Weight (KG)",
        "Actual Weight (KG)",
        "Excess Weight (KG)",
        "Status",
      ]

      rows = loadedCargo.map((c) => {
        const excessWeight = Math.max(0, c.weight - c.allowedWeight)

        return (
          <tr key={c.id}>
            <td className="py-3 px-4 fw-medium">{c.bill}</td>
            <td className="py-3 px-4 text-secondary">
              {c.consignor} / {c.qty}
            </td>
            <td className="py-3 px-4 text-secondary">
              {c.hold} / {c.serviceType}
            </td>
            <td className="py-3 px-4 text-end">{c.allowedWeight}</td>
            <td className="py-3 px-4 text-end fw-bold text-primary">{c.weight}</td>
            <td className={`py-3 px-4 text-end ${excessWeight > 0 ? "excess" : "text-secondary"}`}>
              {excessWeight > 0 ? excessWeight : "-"}
            </td>
            <td className="py-3 px-4 text-end">
              <span className="loaded">{c.status}</span>
            </td>
          </tr>
        )
      })

      footerRow = (
        <tr className="total-row">
          <td className="py-3 px-4 fw-bolder" colSpan="3">
            TOTAL CARGO SUMMARIES
          </td>
          <td className="py-3 px-4 text-end fw-bolder">{totalAllowedWeight}</td>
          <td className="py-3 px-4 text-end fw-bolder text-primary">{totalActualWeight}</td>
          <td className={`py-3 px-4 text-end fw-bolder ${totalExcessWeight > 0 ? "excess" : ""}`}>
            {totalExcessWeight > 0 ? totalExcessWeight : "-"}
          </td>
          <td className="py-3 px-4 text-end fw-bolder"></td>
        </tr>
      )
    } else if (activeTab === "vehicles") {
      const loadedVehicles = data.filter((v) => v.status === "LOADED")
      totalActualWeight = loadedVehicles.reduce((sum, v) => sum + v.actualWeight, 0)
      totalAllowedWeight = loadedVehicles.reduce((sum, v) => sum + v.allowedWeight, 0)
      totalExcessWeight = loadedVehicles.reduce((sum, v) => sum + Math.max(0, v.actualWeight - v.allowedWeight), 0)

      headers = [
        "Plate No. / Type",
        "Owner / Position",
        "Allowed Weight (KG)",
        "Actual Weight (KG)",
        "Excess Weight (KG)",
        "Status",
      ]

      rows = loadedVehicles.map((v) => {
        const excessWeight = Math.max(0, v.actualWeight - v.allowedWeight)

        return (
          <tr key={v.id}>
            <td className="py-3 px-4 fw-medium">
              {v.plate} / {v.type}
            </td>
            <td className="py-3 px-4 text-secondary">
              {v.owner} / {v.hold}-{v.loadingPosition}
            </td>
            <td className="py-3 px-4 text-end">{v.allowedWeight}</td>
            <td className="py-3 px-4 text-end fw-bold">{v.actualWeight}</td>
            <td className={`py-3 px-4 text-end ${excessWeight > 0 ? "excess" : "text-secondary"}`}>
              {excessWeight > 0 ? excessWeight : "-"}
            </td>
            <td className="py-3 px-4 text-end">
              <span className="loaded">{v.status}</span>
            </td>
          </tr>
        )
      })

      footerRow = (
        <tr className="total-row">
          <td className="py-3 px-4 fw-bolder" colSpan="2">
            TOTAL VEHICLES SUMMARIES
          </td>
          <td className="py-3 px-4 text-end fw-bolder">{totalAllowedWeight}</td>
          <td className="py-3 px-4 text-end fw-bolder">{totalActualWeight}</td>
          <td className={`py-3 px-4 text-end fw-bolder ${totalExcessWeight > 0 ? "excess" : ""}`}>
            {totalExcessWeight > 0 ? totalExcessWeight : "-"}
          </td>
          <td className="py-3 px-4 text-end fw-bolder"></td>
        </tr>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead id="manifest-table-header"></thead>
            <tbody>
              <tr>
                <td colSpan="10" className="text-center py-5 fs-5 text-secondary">
                  No {activeTab.toUpperCase()} records found for this trip.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="py-3 px-4 text-start text-xs text-uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>{footerRow}</tfoot>
        </table>
      </div>
    )
  }

  const payload = currentTrip ? calculatePayloadReport(currentTrip) : null

  const styles = `
    .trip-card-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }

    .trip-card-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #d1d5db;
    }

    .trip-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .trip-id {
      font-size: 1rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .trip-status {
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .trip-status-completed {
      background-color: #d1fae5;
      color: #065f46;
    }

    .trip-status-ongoing {
      background-color: #fef9c3;
      color: #854d0e;
    }

    .trip-card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .trip-card-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    .trip-card-column {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .trip-detail-row {
      display: flex;
      align-items: baseline;
    }

    .trip-label {
      font-weight: 600;
      color: #374151;
      min-width: 120px;
      font-size: 0.9rem;
    }

    .trip-value {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .report-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
    }

    .status-completed {
      background-color: #d1fae5;
      color: #065f46;
      padding: 0.25rem 0.75rem;
      border-radius: 50rem;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .status-ongoing {
      background-color: #fef9c3;
      color: #854d0e;
      padding: 0.25rem 0.75rem;
      border-radius: 50rem;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .excess {
      color: #dc3545;
      font-weight: 600;
    }

    .loaded {
      color: #198754;
      font-weight: 600;
    }

    .total-row {
      font-weight: 700;
    }

    @media print {
      body {
        background-color: #fff;
        padding: 0;
        margin: 0;
      }

      .no-print {
        display: none !important;
      }

      .print-header {
        display: block;
        text-align: center;
        margin-bottom: 1rem;
        border-bottom: 2px solid #333;
        padding-bottom: 0.5rem;
      }

      .print-header h1 {
        font-size: 1.5rem;
        margin: 0;
      }

      .print-header .company-info {
        font-size: 0.9rem;
        margin-top: 0.25rem;
      }

      .print-title {
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        margin: 1rem 0 0.5rem;
      }

      .print-date {
        text-align: right;
        font-size: 0.8rem;
        margin-bottom: 1rem;
      }

      table, th, td {
        border-color: #ddd !important;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }

      .table th, .table td {
        border: 1px solid #ddd;
        padding: 0.25rem;
      }

      .table-light th {
        background-color: #f2f2f2;
        font-weight: bold;
      }

      .total-row {
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }

      .excess, .loaded {
        color: #000 !important;
        font-weight: 600;
      }

      .report-card {
        border: 1px solid #ddd;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        page-break-inside: avoid;
      }

      @page {
        margin: 0.5cm;
      }
    }
  `

  return (
    <div className="main-wrapper">
      <style>{styles}</style>
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="page-header">
          <div className="content-page-header">
            <h5>Trip Reporting & Completion</h5>
          </div>
        </div>

        {modalMessage.show && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0 justify-content-center">
                  <h5 className="modal-title fw-bold">{modalMessage.title}</h5>
                </div>
                <div className="modal-body pt-0 text-center">
                  <p className="text-secondary mb-4">{modalMessage.message}</p>
                </div>
                <div className="modal-footer border-0 pt-0 justify-content-center">
                  <button type="button" className="btn btn-primary px-4" onClick={closeModal}>
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-2">
              <div className="card-body">
                {!currentTrip ? (
                  <div>
                    <h5 className="mb-3">Select Trip for Reporting</h5>
                    <div className="mb-4">
                      <input
                        type="text"
                        id="trip-search-input"
                        placeholder="Search by Trip ID, Vessel, Voyage No, or Route"
                        className="form-control p-3"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div id="trip-list" className="border border-secondary-subtle rounded-3 divide-y divide-gray-200">
                      {filteredTrips.length === 0 ? (
                        <p className="p-4 text-center text-secondary">No trips found matching "{searchQuery}".</p>
                      ) : (
                        filteredTrips.map((trip) => renderTripListItem(trip))
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <button id="back-to-trips" className="btn btn-turquoise" onClick={handleBackToTrips}>
                        <svg
                          className="me-1"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          ></path>
                        </svg>
                        Back to Trip List
                      </button>

                      <button
                        id="print-manifest-btn"
                        className="btn btn-success fw-medium py-2 px-4 d-flex align-items-center no-print"
                        onClick={() => window.print()}
                      >
                        <svg
                          className="me-1"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          ></path>
                        </svg>
                        Print Manifest
                      </button>
                    </div>

                    <div id="trip-summary" className="card p-4 rounded-3 mb-4 border-start border-5 border-primary">
                      <h2 className="text-2xl fw-bold mb-3">
                        Trip: <span id="summary-trip-id">{currentTrip.id}</span>
                      </h2>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="space-y-2">
                            <div className="d-flex form-label">
                              <span className="fw-medium" style={{ width: "170px" }}>
                                Vessel Name:
                              </span>
                              <span id="summary-vessel">{currentTrip.vessel}</span>
                            </div>
                            <div className="d-flex form-label">
                              <span className="fw-medium" style={{ width: "170px" }}>
                                Voyage No:
                              </span>
                              <span id="summary-voyage-no">{currentTrip.voyageNo}</span>
                            </div>
                            <div className="d-flex form-label">
                              <span className="fw-medium" style={{ width: "170px" }}>
                                From Port:
                              </span>
                              <span id="summary-from-port">{currentTrip.fromPort}</span>
                            </div>
                            <div className="d-flex form-label">
                              <span className="fw-medium" style={{ width: "170px" }}>
                                To Port:
                              </span>
                              <span id="summary-to-port">{currentTrip.toPort}</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="space-y-2">
                            <div className="d-flex form-label">
                              <span className="fw-medium" style={{ width: "190px" }}>
                                Estimated Time Departure:
                              </span>
                              <span id="summary-etd">{currentTrip.etd}</span>
                            </div>
                            <div className="d-flex form-label">
                              <span className="fw-medium" style={{ width: "190px" }}>
                                Estimated Time Arrival:
                              </span>
                              <span id="summary-eta">{currentTrip.eta}</span>
                            </div>
                            <div className="d-flex align-items-center form-label">
                              <span className="fw-medium" style={{ width: "190px" }}>
                                Trip Status:
                              </span>
                              <span
                                id="summary-status"
                                className={`badge ${
                                  currentTrip.status === "completed" ? "status-completed" : "status-ongoing"
                                }`}
                              >
                                {currentTrip.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row g-4 mb-4 no-print">
                      <div className="col-md-8">
                        <div className="report-card card h-100">
                          <h4 className="text-lg fw-bold mb-4">Payload Summary Report (Total Weight in KG)</h4>
                          <div className="space-y-3">
                            <p className="d-flex justify-content-between">
                              <span className="fw-medium">Total Passenger Load (Passenger + Luggage):</span>
                              <span className="text-lg fw-bold text-success" id="total-passenger-load">
                                {payload.totalPassengerLoad.toLocaleString()} KG
                              </span>
                            </p>
                            <p className="d-flex justify-content-between">
                              <span className="fw-medium">Total Cargo Weight:</span>
                              <span className="text-lg fw-bold text-success" id="total-cargo-weight">
                                {payload.totalCargoWeight.toLocaleString()} KG
                              </span>
                            </p>
                            <p className="d-flex justify-content-between">
                              <span className="fw-medium">Total Vehicles Weight:</span>
                              <span className="text-lg fw-bold text-success" id="total-vehicles-weight">
                                {payload.totalVehiclesWeight.toLocaleString()} KG
                              </span>
                            </p>
                            <hr className="my-2 border-secondary-subtle" />
                            <p className="d-flex justify-content-between text-xl">
                              <span className="fw-bolder">GRAND TOTAL PAYLOAD:</span>
                              <span className="fw-bolder text-primary" id="grand-total-payload">
                                {payload.grandTotalPayload.toLocaleString()} KG
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="report-card card h-100 d-flex flex-column justify-content-between">
                          <div>
                            <h4 className="text-lg fw-bold mb-2">Trip Finalization</h4>
                            <p className="mb-3">
                              Verify reports, then finalize the trip to mark it as <strong>Completed</strong>.
                            </p>
                          </div>
                          <div>
                            <button
                              id="complete-trip-btn"
                              className={`btn w-100 fw-bold py-3 ${
                                currentTrip.status === "completed" ? "btn-secondary" : "btn-danger"
                              }`}
                              onClick={handleCompleteTrip}
                              disabled={currentTrip.status === "completed"}
                            >
                              {currentTrip.status === "completed" ? "Trip Already Completed" : "Complete Trip"}
                            </button>
                            {currentTrip.status === "completed" && (
                              <p id="completion-message" className="text-center text-sm mt-2 text-success">
                                Trip successfully marked as Completed!
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h5 className="mb-3">Trip Manifest Details</h5>

                    <ul className="nav nav-tabs mb-4 no-print" id="manifestTabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "passenger" ? "active" : ""}`}
                          onClick={() => setActiveTab("passenger")}
                          type="button"
                          role="tab"
                        >
                          Passenger Manifest
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "cargo" ? "active" : ""}`}
                          onClick={() => setActiveTab("cargo")}
                          type="button"
                          role="tab"
                        >
                          Cargo Manifest
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${activeTab === "vehicles" ? "active" : ""}`}
                          onClick={() => setActiveTab("vehicles")}
                          type="button"
                          role="tab"
                        >
                          Vehicles Manifest
                        </button>
                      </li>
                    </ul>

                    <div id="manifest-content" className="mt-3">
                      {renderManifestTable()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
