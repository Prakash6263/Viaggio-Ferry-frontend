"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../components/layout/Sidebar"
import Header from "../components/layout/Header"

export default function VehicleBoardingPage() {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [vehicleItems, setVehicleItems] = useState([])
  const [currentVehicle, setCurrentVehicle] = useState(null)
  const [activeTab, setActiveTab] = useState("boarding")
  const [vehicleTicketInput, setVehicleTicketInput] = useState("")
  const [loadingPositionInput, setLoadingPositionInput] = useState("")
  const [modalMessage, setModalMessage] = useState({ title: "", message: "", show: false })

  // Mock Data
  useEffect(() => {
    const mockTrips = [
      {
        id: "trip-1",
        vesselName: "Starferry",
        voyageNo: "V-201",
        from: "Jakarta",
        to: "Surabaya",
        etd: "10:00",
        eta: "16:00",
        date: "2023-10-27",
      },
      {
        id: "trip-2",
        vesselName: "Seawind",
        voyageNo: "V-202",
        from: "Surabaya",
        to: "Jakarta",
        etd: "08:00",
        eta: "14:00",
        date: "2023-10-28",
      },
    ]

    const mockVehicleItems = [
      {
        ticketNo: "VT-101",
        vehicleType: "Sedan",
        type: "Toyota Camry",
        weight: 1500,
        dimension: "4.5m x 1.8m x 1.5m",
        plateNo: "B1234CD",
        makeModel: "Toyota Camry",
        engineChassis: "1HGCM82633A123456",
        allowedWeight: 2000,
        qty: 1,
        hold: "Hold B",
        serviceType: "Standard",
        status: "pending",
        loadingPosition: "",
        ownerName: "Ahmad Hassan",
        ownerPhone: "+62-21-5555-1234",
        ownerLicense: "SIM-123456",
        ownerPassport: "A12345678",
        consigneeName: "PT. Transportasi Utama",
        consigneePhone: "+62-21-5555-1111",
        consigneeId: "ID-001",
        consignorName: "Auto Export Ltd",
        consignorPhone: "+62-21-5555-2222",
        consignorId: "ID-002",
      },
      {
        ticketNo: "VT-102",
        vehicleType: "Pickup",
        type: "Ford Ranger",
        weight: 2100,
        dimension: "5.3m x 1.9m x 1.8m",
        plateNo: "B5678EF",
        makeModel: "Ford Ranger",
        engineChassis: "1FTFW1ET5DFC12345",
        allowedWeight: 2500,
        qty: 1,
        hold: "Hold A",
        serviceType: "Priority",
        status: "pending",
        loadingPosition: "",
        ownerName: "Budi Santoso",
        ownerPhone: "+62-21-5555-2345",
        ownerLicense: "SIM-234567",
        ownerPassport: "B23456789",
        consigneeName: "CV. Logistik Jaya",
        consigneePhone: "+62-21-5555-3333",
        consigneeId: "ID-003",
        consignorName: "Vehicle Dealers Inc",
        consignorPhone: "+62-21-5555-4444",
        consignorId: "ID-004",
      },
      {
        ticketNo: "VT-103",
        vehicleType: "Bus",
        type: "Mercedes-Benz Tourismo",
        weight: 12500,
        dimension: "12m x 2.5m x 3.2m",
        plateNo: "B9012GH",
        makeModel: "Mercedes-Benz Tourismo",
        engineChassis: "WDBKX6C61FA123456",
        allowedWeight: 15000,
        qty: 1,
        hold: "Hold C",
        serviceType: "Standard",
        status: "pending",
        loadingPosition: "",
        ownerName: "PT. Transportasi Mandiri",
        ownerPhone: "+62-21-5555-3456",
        ownerLicense: "SIM-345678",
        ownerPassport: "C34567890",
        consigneeName: "Travel & Tours Co",
        consigneePhone: "+62-21-5555-5555",
        consigneeId: "ID-005",
        consignorName: "Bus Manufacturers Ltd",
        consignorPhone: "+62-21-5555-6666",
        consignorId: "ID-006",
      },
      {
        ticketNo: "VT-104",
        vehicleType: "Truck",
        type: "Hino Ranger",
        weight: 8500,
        dimension: "9.5m x 2.4m x 3.0m",
        plateNo: "B3456IJ",
        makeModel: "Hino Ranger",
        engineChassis: "JH4KA7660LC123456",
        allowedWeight: 10000,
        qty: 1,
        hold: "Hold C",
        serviceType: "Special",
        status: "pending",
        loadingPosition: "",
        ownerName: "CV. Logistik Jaya",
        ownerPhone: "+62-21-5555-4567",
        ownerLicense: "SIM-456789",
        ownerPassport: "D45678901",
        consigneeName: "Construction Corp",
        consigneePhone: "+62-21-5555-7777",
        consigneeId: "ID-007",
        consignorName: "Heavy Equipment Export",
        consignorPhone: "+62-21-5555-8888",
        consignorId: "ID-008",
      },
      {
        ticketNo: "VT-105",
        vehicleType: "Trailer",
        type: "Flatbed Trailer",
        weight: 3200,
        dimension: "13m x 2.5m x 1.5m",
        plateNo: "B7890KL",
        makeModel: "Flatbed Trailer",
        engineChassis: "1FUJGBDV2BLSP12345",
        allowedWeight: 5000,
        qty: 1,
        hold: "Hold A",
        serviceType: "Standard",
        status: "pending",
        loadingPosition: "",
        ownerName: "Darma Persada",
        ownerPhone: "+62-21-5555-5678",
        ownerLicense: "SIM-567890",
        ownerPassport: "E56789012",
        consigneeName: "Freight Forwarders Ltd",
        consigneePhone: "+62-21-5555-9999",
        consigneeId: "ID-009",
        consignorName: "Trailer Manufacturers",
        consignorPhone: "+62-21-5555-0000",
        consignorId: "ID-010",
      },
      {
        ticketNo: "VT-106",
        vehicleType: "Sedan",
        type: "Honda Civic",
        weight: 1300,
        dimension: "4.6m x 1.8m x 1.4m",
        plateNo: "B1357MN",
        makeModel: "Honda Civic",
        engineChassis: "1HGBH41JXMN109186",
        allowedWeight: 1800,
        qty: 1,
        hold: "Hold B",
        serviceType: "Standard",
        status: "pending",
        loadingPosition: "",
        ownerName: "Siti Rahayu",
        ownerPhone: "+62-21-5555-6789",
        ownerLicense: "SIM-678901",
        ownerPassport: "F67890123",
        consigneeName: "Car Rental Services",
        consigneePhone: "+62-21-5555-1112",
        consigneeId: "ID-011",
        consignorName: "Auto Importers Inc",
        consignorPhone: "+62-21-5555-2223",
        consignorId: "ID-012",
      },
    ]

    setTrips(mockTrips)
    setVehicleItems(mockVehicleItems)
  }, [])

  const handleTripSelect = (trip) => {
    setCurrentTrip(trip)
    setActiveTab("boarding")
  }

  const handleBackToTrips = () => {
    setCurrentTrip(null)
    setCurrentVehicle(null)
    setVehicleTicketInput("")
    setLoadingPositionInput("")
  }

  const handleVehicleTicketInput = (e) => {
    const value = e.target.value
    setVehicleTicketInput(value)
    const vehicle = vehicleItems.find((v) => v.ticketNo.toUpperCase() === value.trim().toUpperCase())
    setCurrentVehicle(vehicle || null)
  }

  const handleConfirmLoading = () => {
    if (!currentVehicle) {
      setModalMessage({
        title: "Error",
        message: "No vehicle selected. Please scan a vehicle ticket first.",
        show: true,
      })
      return
    }

    if (!loadingPositionInput.trim()) {
      setModalMessage({ title: "Error", message: "Please enter a loading position.", show: true })
      return
    }

    if (currentVehicle.status === "loaded") {
      setModalMessage({ title: "Warning", message: "This vehicle has already been loaded.", show: true })
      return
    }

    // Update vehicle status
    const updatedVehicleItems = vehicleItems.map((item) => {
      if (item.ticketNo === currentVehicle.ticketNo) {
        return { ...item, status: "loaded", loadingPosition: loadingPositionInput.toUpperCase() }
      }
      return item
    })

    setVehicleItems(updatedVehicleItems)
    setModalMessage({
      title: "Success",
      message: `Vehicle ${currentVehicle.ticketNo} has been successfully loaded at ${loadingPositionInput.toUpperCase()}.`,
      show: true,
    })

    // Reset form
    setVehicleTicketInput("")
    setLoadingPositionInput("")
    setCurrentVehicle(null)
  }

  const closeModal = () => {
    setModalMessage({ ...modalMessage, show: false })
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Vehicle Boarding</h5>
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
              <div className="card card-table p-2">
                <div className="card-body">
                  {!currentTrip ? (
                    <div>
                      <h4 className="fw-semibold mb-3">Select a Trip to Start Vehicle Loading</h4>
                      <div className="table-responsive">
                        <table className="table table-striped">
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
                          <tbody>
                            {trips.map((trip) => (
                              <tr key={trip.id} onClick={() => handleTripSelect(trip)} style={{ cursor: "pointer" }}>
                                <td>{trip.vesselName}</td>
                                <td>{trip.voyageNo}</td>
                                <td>{trip.from}</td>
                                <td>{trip.to}</td>
                                <td>{trip.etd}</td>
                                <td>{trip.eta}</td>
                                <td>
                                  <span className="badge bg-success-light text-success">Available</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex align-items-center mb-4">
                        <button onClick={handleBackToTrips} className="btn btn-primary me-3">
                          &larr; Back to Trips
                        </button>
                        <h2 className="h4 fw-semibold text-gray-800 mb-0">
                          Vehicle Loading for Trip: {currentTrip.voyageNo}
                        </h2>
                      </div>

                      <ul className="nav nav-tabs mb-3">
                        <li className="nav-item">
                          <button
                            className={`nav-link ${activeTab === "boarding" ? "active" : ""}`}
                            onClick={() => setActiveTab("boarding")}
                          >
                            Loading
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${activeTab === "manifest" ? "active" : ""}`}
                            onClick={() => setActiveTab("manifest")}
                          >
                            Vehicle Manifest & Details
                          </button>
                        </li>
                      </ul>

                      <div className="tab-content">
                        {activeTab === "boarding" && (
                          <div className="tab-pane fade show active">
                            <div className="row g-4">
                              <div className="col-md-6">
                                <div className="d-flex flex-column gap-4">
                                  <div className="card p-4 border shadow-sm">
                                    <h3 className="fw-bold mb-3">Scan Vehicle Ticket</h3>
                                    <div className="d-flex flex-column gap-3">
                                      <div>
                                        <label className="form-label text-gray-700 fw-medium mb-1">
                                          Vehicle Ticket #
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control p-3"
                                          placeholder="Enter vehicle ticket number"
                                          value={vehicleTicketInput}
                                          onChange={handleVehicleTicketInput}
                                        />
                                      </div>
                                      <div>
                                        <label className="form-label text-gray-700 fw-medium mb-1">
                                          Loading Position
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control p-3"
                                          placeholder="e.g., Deck B-05"
                                          value={loadingPositionInput}
                                          onChange={(e) => setLoadingPositionInput(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {!currentVehicle && (
                                    <div className="card p-4 border border-primary-light shadow-sm bg-light">
                                      <h3 className="h6 fw-semibold text-gray-700 mb-2">Instructions</h3>
                                      <p className="text-sm text-secondary mb-0">
                                        Enter a vehicle ticket number (e.g., `VT-101`) to view vehicle information here.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {currentVehicle && (
                                <div className="col-md-6">
                                  <div className="card p-4 border border-primary-light shadow-sm">
                                    <h3 className="h5 fw-bold text-primary mb-3">Vehicle Ticket</h3>
                                    <div>
                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Trip Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Vessel</div>
                                            <div className="fw-semibold">{currentTrip.vesselName}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Voyage No</div>
                                            <div className="fw-semibold">{currentTrip.voyageNo}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">From</div>
                                            <div className="fw-semibold">{currentTrip.from}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">To</div>
                                            <div className="fw-semibold">{currentTrip.to}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">ETD</div>
                                            <div className="fw-semibold">{currentTrip.etd}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">ETA</div>
                                            <div className="fw-semibold">{currentTrip.eta}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Vehicle Ticket Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Ticket No</div>
                                            <div className="fw-semibold">{currentVehicle.ticketNo}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Hold</div>
                                            <div className="fw-semibold">{currentVehicle.hold}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Vehicle Type</div>
                                            <div className="fw-semibold">{currentVehicle.vehicleType}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Service Type</div>
                                            <div className="fw-semibold">{currentVehicle.serviceType}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Quantity</div>
                                            <div className="fw-semibold">{currentVehicle.qty}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Allowed Weight</div>
                                            <div className="fw-semibold">{currentVehicle.allowedWeight} kg</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Vehicle Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Make/Model</div>
                                            <div className="fw-semibold">{currentVehicle.makeModel}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Engine/Chassis No</div>
                                            <div className="fw-semibold">{currentVehicle.engineChassis}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Plate No</div>
                                            <div className="fw-semibold">{currentVehicle.plateNo}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Weight</div>
                                            <div className="fw-semibold">{currentVehicle.weight} kg</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Dimension</div>
                                            <div className="fw-semibold">{currentVehicle.dimension}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Vehicle Type</div>
                                            <div className="fw-semibold">{currentVehicle.type}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Owner Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Owner Name</div>
                                            <div className="fw-semibold">{currentVehicle.ownerName}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Owner Phone</div>
                                            <div className="fw-semibold">{currentVehicle.ownerPhone}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Passport/Residency</div>
                                            <div className="fw-semibold">{currentVehicle.ownerPassport}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">License No</div>
                                            <div className="fw-semibold">{currentVehicle.ownerLicense}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Consignee Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignee Name</div>
                                            <div className="fw-semibold">{currentVehicle.consigneeName}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignee Phone</div>
                                            <div className="fw-semibold">{currentVehicle.consigneePhone}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignee ID No</div>
                                            <div className="fw-semibold">{currentVehicle.consigneeId}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Consignor Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignor Name</div>
                                            <div className="fw-semibold">{currentVehicle.consignorName}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignor Phone</div>
                                            <div className="fw-semibold">{currentVehicle.consignorPhone}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignor ID No</div>
                                            <div className="fw-semibold">{currentVehicle.consignorId}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="d-flex gap-3 justify-content-end mt-4">
                                        <button
                                          onClick={handleConfirmLoading}
                                          className="btn btn-primary px-4 py-2 fw-semibold"
                                        >
                                          Confirm Loading
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {activeTab === "manifest" && (
                          <div className="tab-pane fade show active">
                            <h3 className="h5 fw-bold mb-3">Vehicle Manifest & Details</h3>
                            <div className="overflow-auto">
                              <div className="table-responsive">
                                <table className="table table-striped mb-0">
                                  <thead>
                                    <tr className="text-secondary">
                                      <th className="py-3 px-4">Ticket No</th>
                                      <th className="py-3 px-4">Vehicle Type</th>
                                      <th className="py-3 px-4">Make/Model</th>
                                      <th className="py-3 px-4">Engine/Chassis No</th>
                                      <th className="py-3 px-4">Plate No</th>
                                      <th className="py-3 px-4">Owner Name</th>
                                      <th className="py-3 px-4">Owner Phone</th>
                                      <th className="py-3 px-4">Actual Weight</th>
                                      <th className="py-3 px-4">Allowed Weight</th>
                                      <th className="py-3 px-4">Excess Weight</th>
                                      <th className="py-3 px-4">Dimension</th>
                                      <th className="py-3 px-4">Loading Position</th>
                                      <th className="py-3 px-4">Hold</th>
                                      <th className="py-3 px-4">Service Type</th>
                                      <th className="py-3 px-4">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {vehicleItems.length === 0 ? (
                                      <tr>
                                        <td colSpan="15" className="text-center py-4 text-secondary">
                                          No vehicle data to display.
                                        </td>
                                      </tr>
                                    ) : (
                                      vehicleItems.map((v) => {
                                        const excessWeight = v.weight > v.allowedWeight ? v.weight - v.allowedWeight : 0
                                        return (
                                          <tr key={v.ticketNo}>
                                            <td className="py-3 px-4">{v.ticketNo}</td>
                                            <td className="py-3 px-4">{v.vehicleType}</td>
                                            <td className="py-3 px-4">{v.makeModel}</td>
                                            <td className="py-3 px-4">{v.engineChassis}</td>
                                            <td className="py-3 px-4">{v.plateNo}</td>
                                            <td className="py-3 px-4">{v.ownerName}</td>
                                            <td className="py-3 px-4">{v.ownerPhone}</td>
                                            <td className="py-3 px-4">{v.weight} kg</td>
                                            <td className="py-3 px-4">{v.allowedWeight} kg</td>
                                            <td className="py-3 px-4">
                                              {excessWeight > 0 ? excessWeight + " kg" : "-"}
                                            </td>
                                            <td className="py-3 px-4">{v.dimension}</td>
                                            <td className="py-3 px-4">{v.loadingPosition || "-"}</td>
                                            <td className="py-3 px-4">{v.hold}</td>
                                            <td className="py-3 px-4">{v.serviceType}</td>
                                            <td className="py-3 px-4">
                                              <span
                                                className={`badge ${
                                                  v.status === "loaded"
                                                    ? "bg-success-light text-success"
                                                    : "bg-warning-light text-warning"
                                                }`}
                                              >
                                                {v.status.toUpperCase()}
                                              </span>
                                            </td>
                                          </tr>
                                        )
                                      })
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
