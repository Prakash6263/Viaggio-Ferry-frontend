"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "../components/layout/Sidebar"
import Header from "../components/layout/Header"

export default function CargoBoardingPage() {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [cargoItems, setCargoItems] = useState([])
  const [currentCargo, setCurrentCargo] = useState(null)
  const [activeTab, setActiveTab] = useState("boarding")
  const [cargoBillInput, setCargoBillInput] = useState("")
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

    const mockCargoItems = [
      {
        billNo: "CB-101",
        goodsType: "Electronics",
        weight: 250,
        dimension: "2m x 1.5m x 1m",
        goodsDescription: "Computer equipment",
        allowedWeight: 300,
        qty: 10,
        hold: "Hold A",
        cargoType: "Pallet A",
        serviceType: "Standard",
        status: "pending",
        loadingPosition: "",
        consigneeName: "Tech Solutions Ltd",
        consigneePhone: "+62-21-5555-1234",
        consigneeId: "ID-001",
        consignorName: "Global Electronics",
        consignorPhone: "+65-6555-5678",
        consignorId: "SG-001",
      },
      {
        billNo: "CB-102",
        goodsType: "Automotive Parts",
        weight: 450,
        dimension: "3m x 2m x 1.5m",
        goodsDescription: "Car engine parts",
        allowedWeight: 500,
        qty: 5,
        hold: "Hold B",
        cargoType: "Pallet B",
        serviceType: "Priority",
        status: "pending",
        loadingPosition: "",
        consigneeName: "Auto Parts Co",
        consigneePhone: "+62-21-5555-2345",
        consigneeId: "ID-002",
        consignorName: "Auto Suppliers Inc",
        consignorPhone: "+1-212-555-6789",
        consignorId: "US-001",
      },
      {
        billNo: "CB-103",
        goodsType: "Textiles",
        weight: 180,
        dimension: "2.5m x 1.8m x 1.2m",
        goodsDescription: "Cotton fabrics",
        allowedWeight: 200,
        qty: 15,
        hold: "Hold A",
        cargoType: "Container",
        serviceType: "Standard",
        status: "pending",
        loadingPosition: "",
        consigneeName: "Fashion Garments",
        consigneePhone: "+62-21-5555-3456",
        consigneeId: "ID-003",
        consignorName: "Textile Mills",
        consignorPhone: "+91-22-5555-7890",
        consignorId: "IN-001",
      },
      {
        billNo: "CB-104",
        goodsType: "Heavy Equipment",
        weight: 1200,
        dimension: "4m x 3m x 2.5m",
        goodsDescription: "Construction machinery",
        allowedWeight: 1500,
        qty: 2,
        hold: "Hold C",
        cargoType: "Heavy Equipment",
        serviceType: "Special",
        status: "pending",
        loadingPosition: "",
        consigneeName: "Construction Corp",
        consigneePhone: "+62-21-5555-4567",
        consigneeId: "ID-004",
        consignorName: "Machinery Exporters",
        consignorPhone: "+86-21-5555-8901",
        consignorId: "CN-001",
      },
      {
        billNo: "CB-105",
        goodsType: "Food Products",
        weight: 320,
        dimension: "2.2m x 1.6m x 1.4m",
        goodsDescription: "Canned goods",
        allowedWeight: 350,
        qty: 20,
        hold: "Hold B",
        cargoType: "Container",
        serviceType: "Refrigerated",
        status: "pending",
        loadingPosition: "",
        consigneeName: "Food Distributors",
        consigneePhone: "+62-21-5555-5678",
        consigneeId: "ID-005",
        consignorName: "Food Export Ltd",
        consignorPhone: "+61-2-5555-0123",
        consignorId: "AU-001",
      },
      {
        billNo: "CB-106",
        goodsType: "Chemicals",
        weight: 380,
        dimension: "2.8m x 1.7m x 1.3m",
        goodsDescription: "Industrial chemicals",
        allowedWeight: 400,
        qty: 8,
        hold: "Hold A",
        cargoType: "Container",
        serviceType: "Hazardous",
        status: "pending",
        loadingPosition: "",
        consigneeName: "Chemical Industries",
        consigneePhone: "+62-21-5555-6789",
        consigneeId: "ID-006",
        consignorName: "Chemical Suppliers",
        consignorPhone: "+49-30-5555-2345",
        consignorId: "DE-001",
      },
    ]

    setTrips(mockTrips)
    setCargoItems(mockCargoItems)
  }, [])

  const handleTripSelect = (trip) => {
    setCurrentTrip(trip)
    setActiveTab("boarding")
  }

  const handleBackToTrips = () => {
    setCurrentTrip(null)
    setCurrentCargo(null)
    setCargoBillInput("")
    setLoadingPositionInput("")
  }

  const handleCargoBillInput = (e) => {
    const value = e.target.value
    setCargoBillInput(value)
    const cargo = cargoItems.find((c) => c.billNo.toUpperCase() === value.trim().toUpperCase())
    setCurrentCargo(cargo || null)
  }

  const handleConfirmLoading = () => {
    if (!currentCargo) {
      setModalMessage({ title: "Error", message: "No cargo selected. Please scan a cargo bill first.", show: true })
      return
    }

    if (!loadingPositionInput.trim()) {
      setModalMessage({ title: "Error", message: "Please enter a loading position.", show: true })
      return
    }

    if (currentCargo.status === "loaded") {
      setModalMessage({ title: "Warning", message: "This cargo has already been loaded.", show: true })
      return
    }

    // Update cargo status
    const updatedCargoItems = cargoItems.map((item) => {
      if (item.billNo === currentCargo.billNo) {
        return { ...item, status: "loaded", loadingPosition: loadingPositionInput.toUpperCase() }
      }
      return item
    })

    setCargoItems(updatedCargoItems)
    setModalMessage({
      title: "Success",
      message: `Cargo ${currentCargo.billNo} has been successfully loaded at ${loadingPositionInput.toUpperCase()}.`,
      show: true,
    })

    // Reset form
    setCargoBillInput("")
    setLoadingPositionInput("")
    setCurrentCargo(null)
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
              <h5>Cargo Boarding</h5>
            </div>
          </div>

          {/* Modal */}
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
                    <div id="trip-list-view">
                      <h4 className="fw-semibold mb-3">Select a Trip to Start Cargo Loading</h4>
                      <div className="bg-white rounded shadow-sm overflow-hidden">
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
                    </div>
                  ) : (
                    <div id="boarding-view">
                      <div className="d-flex align-items-center mb-4">
                        <button onClick={handleBackToTrips} className="btn btn-turquoise me-3">
                          &larr; Back to Trips
                        </button>
                        <h2 className="h4 fw-semibold text-gray-800 mb-0">
                          Cargo Loading for Trip: {currentTrip.voyageNo}
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
                            Cargo Manifest & Details
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
                                    <h3 className="fw-bold mb-3">Scan Cargo Bill</h3>
                                    <div className="d-flex flex-column gap-3">
                                      <div>
                                        <label className="form-label text-gray-700 fw-medium mb-1">Cargo Bill #</label>
                                        <input
                                          type="text"
                                          className="form-control p-3"
                                          placeholder="Enter cargo bill number"
                                          value={cargoBillInput}
                                          onChange={handleCargoBillInput}
                                        />
                                      </div>
                                      <div>
                                        <label className="form-label text-gray-700 fw-medium mb-1">
                                          Loading Position
                                        </label>
                                        <input
                                          type="text"
                                          className="form-control p-3"
                                          placeholder="e.g., Hold A-12"
                                          value={loadingPositionInput}
                                          onChange={(e) => setLoadingPositionInput(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {!currentCargo && (
                                    <div className="card p-4 border border-primary-light shadow-sm bg-light">
                                      <h3 className="h6 fw-semibold text-gray-700 mb-2">Instructions</h3>
                                      <p className="text-sm text-secondary mb-0">
                                        Enter a cargo bill number (e.g., `CB-101`) to view cargo information here.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {currentCargo && (
                                <div className="col-md-6">
                                  <div className="card p-4 border border-primary-light shadow-sm">
                                    <h3 className="h5 fw-bold text-primary mb-3">Cargo Bill</h3>
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
                                        <h4 className="mb-3 fw-bold text-dark">Cargo Bill Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Bill No</div>
                                            <div className="fw-semibold">{currentCargo.billNo}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Hold</div>
                                            <div className="fw-semibold">{currentCargo.hold}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Cargo Type</div>
                                            <div className="fw-semibold">{currentCargo.cargoType}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Service Type</div>
                                            <div className="fw-semibold">{currentCargo.serviceType}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Quantity</div>
                                            <div className="fw-semibold">{currentCargo.qty}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Allowed Weight</div>
                                            <div className="fw-semibold">{currentCargo.allowedWeight} kg</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Cargo Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Goods Type</div>
                                            <div className="fw-semibold">{currentCargo.goodsType}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Weight</div>
                                            <div className="fw-semibold">{currentCargo.weight} kg</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Dimension</div>
                                            <div className="fw-semibold">{currentCargo.dimension}</div>
                                          </div>
                                          <div className="col-12">
                                            <div className="text-muted small">Goods Description</div>
                                            <div className="fw-semibold">{currentCargo.goodsDescription}</div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="p-3 mb-3 border rounded bg-white">
                                        <h4 className="mb-3 fw-bold text-dark">Consignee & Consignor Details</h4>
                                        <div className="row g-3">
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignee Name</div>
                                            <div className="fw-semibold">{currentCargo.consigneeName}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignee Phone</div>
                                            <div className="fw-semibold">{currentCargo.consigneePhone}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignee ID</div>
                                            <div className="fw-semibold">{currentCargo.consigneeId}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignor Name</div>
                                            <div className="fw-semibold">{currentCargo.consignorName}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignor Phone</div>
                                            <div className="fw-semibold">{currentCargo.consignorPhone}</div>
                                          </div>
                                          <div className="col-6 col-md-4">
                                            <div className="text-muted small">Consignor ID</div>
                                            <div className="fw-semibold">{currentCargo.consignorId}</div>
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
                            <h3 className="h5 fw-bold mb-3">Cargo Manifest & Details</h3>
                            <div className="overflow-auto">
                              <div className="table-responsive">
                                <table className="table table-striped mb-0">
                                  <thead>
                                    <tr className="text-secondary">
                                      <th className="py-3 px-4">Bill No</th>
                                      <th className="py-3 px-4">Cargo Type</th>
                                      <th className="py-3 px-4">Goods Type</th>
                                      <th className="py-3 px-4">Actual Weight</th>
                                      <th className="py-3 px-4">Allowed Weight</th>
                                      <th className="py-3 px-4">Excess Weight</th>
                                      <th className="py-3 px-4">Dimension</th>
                                      <th className="py-3 px-4">Loading Position</th>
                                      <th className="py-3 px-4">Hold</th>
                                      <th className="py-3 px-4">Service Type</th>
                                      <th className="py-3 px-4">Quantity</th>
                                      <th className="py-3 px-4">Goods Description</th>
                                      <th className="py-3 px-4">Consignee Name</th>
                                      <th className="py-3 px-4">Consignee Phone</th>
                                      <th className="py-3 px-4">Consignor Name</th>
                                      <th className="py-3 px-4">Consignor Phone</th>
                                      <th className="py-3 px-4">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cargoItems.length === 0 ? (
                                      <tr>
                                        <td colspan="17" className="text-center py-4 text-secondary">
                                          No cargo data to display.
                                        </td>
                                      </tr>
                                    ) : (
                                      cargoItems.map((c) => {
                                        const excessWeight = c.weight > c.allowedWeight ? c.weight - c.allowedWeight : 0
                                        return (
                                          <tr key={c.billNo}>
                                            <td className="py-3 px-4">{c.billNo}</td>
                                            <td className="py-3 px-4">{c.cargoType}</td>
                                            <td className="py-3 px-4">{c.goodsType}</td>
                                            <td className="py-3 px-4">{c.weight} kg</td>
                                            <td className="py-3 px-4">{c.allowedWeight} kg</td>
                                            <td className="py-3 px-4">
                                              {excessWeight > 0 ? excessWeight + " kg" : "-"}
                                            </td>
                                            <td className="py-3 px-4">{c.dimension}</td>
                                            <td className="py-3 px-4">{c.loadingPosition || "-"}</td>
                                            <td className="py-3 px-4">{c.hold}</td>
                                            <td className="py-3 px-4">{c.serviceType}</td>
                                            <td className="py-3 px-4">{c.qty}</td>
                                            <td className="py-3 px-4">{c.goodsDescription}</td>
                                            <td className="py-3 px-4">{c.consigneeName}</td>
                                            <td className="py-3 px-4">{c.consigneePhone}</td>
                                            <td className="py-3 px-4">{c.consignorName}</td>
                                            <td className="py-3 px-4">{c.consignorPhone}</td>
                                            <td className="py-3 px-4">
                                              <span
                                                className={`badge ${c.status === "loaded" ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}
                                              >
                                                {c.status.toUpperCase()}
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
