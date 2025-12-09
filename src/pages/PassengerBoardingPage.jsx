"use client"

import { useState, useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"

export default function PassengerBoardingPage() {
  const [trips, setTrips] = useState([])
  const [currentTrip, setCurrentTrip] = useState(null)
  const [passengers, setPassengers] = useState([])
  const [currentPassenger, setCurrentPassenger] = useState(null)
  const [activeTab, setActiveTab] = useState("boarding")
  const [boardingPassInput, setBoardingPassInput] = useState("")
  const [seatNumberInput, setSeatNumberInput] = useState("")
  const [modalMessage, setModalMessage] = useState({ title: "", message: "", show: false })

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

    const mockPassengers = [
      {
        ticketNo: "TK-101",
        name: "John Doe",
        nationality: "USA",
        passportNo: "P-123456",
        expiryDate: "2025-12-31",
        age: 35,
        gender: "Male",
        allowedWeight: 20,
        actualWeight: 20,
        excessWeight: 0,
        seat: "",
        cabin: "Economy",
        ticketType: "Standard",
        serviceType: "Normal",
        visaType: "N/A",
        status: "pending",
        luggageLabel: "L-987",
        luggageWeight: 20,
        excessFee: 0,
      },
      {
        ticketNo: "TK-102",
        name: "Jane Smith",
        nationality: "IND",
        passportNo: "P-789012",
        expiryDate: "2024-06-15",
        age: 28,
        gender: "Female",
        allowedWeight: 20,
        actualWeight: 25,
        excessWeight: 5,
        seat: "",
        cabin: "Business",
        ticketType: "Flex",
        serviceType: "Priority",
        visaType: "Tourist",
        status: "pending",
        luggageLabel: "L-654",
        luggageWeight: 25,
        excessFee: 20,
      },
      {
        ticketNo: "TK-103",
        name: "Peter Jones",
        nationality: "UK",
        passportNo: "P-345678",
        expiryDate: "2026-03-20",
        age: 45,
        gender: "Male",
        allowedWeight: 20,
        actualWeight: 15,
        excessWeight: 0,
        seat: "",
        cabin: "Economy",
        ticketType: "Standard",
        serviceType: "Normal",
        visaType: "N/A",
        status: "pending",
        luggageLabel: "L-321",
        luggageWeight: 15,
        excessFee: 0,
      },
      {
        ticketNo: "TK-104",
        name: "Maria Garcia",
        nationality: "MEX",
        passportNo: "P-901234",
        expiryDate: "2025-01-10",
        age: 52,
        gender: "Female",
        allowedWeight: 20,
        actualWeight: 30,
        excessWeight: 10,
        seat: "",
        cabin: "First Class",
        ticketType: "Premium",
        serviceType: "VIP",
        visaType: "Business",
        status: "pending",
        luggageLabel: "L-112",
        luggageWeight: 30,
        excessFee: 40,
      },
      {
        ticketNo: "TK-105",
        name: "David Chen",
        nationality: "CHN",
        passportNo: "P-567890",
        expiryDate: "2027-08-01",
        age: 22,
        gender: "Male",
        allowedWeight: 20,
        actualWeight: 18,
        excessWeight: 0,
        seat: "",
        cabin: "Economy",
        ticketType: "Standard",
        serviceType: "Normal",
        visaType: "N/A",
        status: "pending",
        luggageLabel: "L-223",
        luggageWeight: 18,
        excessFee: 0,
      },
      {
        ticketNo: "TK-106",
        name: "Sarah Lee",
        nationality: "KOR",
        passportNo: "P-112233",
        expiryDate: "2024-11-25",
        age: 30,
        gender: "Female",
        allowedWeight: 20,
        actualWeight: 22,
        excessWeight: 2,
        seat: "",
        cabin: "Business",
        ticketType: "Flex",
        serviceType: "Priority",
        visaType: "Tourist",
        status: "pending",
        luggageLabel: "L-334",
        luggageWeight: 22,
        excessFee: 8,
      },
    ]

    setTrips(mockTrips)
    setPassengers(mockPassengers)
  }, [])

  const handleTripSelect = (trip) => {
    setCurrentTrip(trip)
    setActiveTab("boarding")
  }

  const handleBackToTrips = () => {
    setCurrentTrip(null)
    setCurrentPassenger(null)
    setBoardingPassInput("")
    setSeatNumberInput("")
  }

  const handleBoardingPassInput = (e) => {
    const value = e.target.value
    setBoardingPassInput(value)
    const passenger = passengers.find((p) => p.ticketNo.toUpperCase() === value.trim().toUpperCase())
    setCurrentPassenger(passenger || null)
  }

  const handleConfirmBoarding = () => {
    if (!currentPassenger) {
      setModalMessage({
        title: "Error",
        message: "No passenger selected. Please scan a boarding pass first.",
        show: true,
      })
      return
    }

    if (!seatNumberInput.trim()) {
      setModalMessage({ title: "Error", message: "Please enter a seat number.", show: true })
      return
    }

    if (currentPassenger.status === "boarded") {
      setModalMessage({ title: "Warning", message: "This passenger has already been boarded.", show: true })
      return
    }

    const updatedPassengers = passengers.map((item) => {
      if (item.ticketNo === currentPassenger.ticketNo) {
        return { ...item, status: "boarded", seat: seatNumberInput.toUpperCase() }
      }
      return item
    })

    setPassengers(updatedPassengers)
    setModalMessage({
      title: "Success",
      message: `${currentPassenger.name} has been successfully boarded.`,
      show: true,
    })

    setBoardingPassInput("")
    setSeatNumberInput("")
    setCurrentPassenger(null)
  }

  const closeModal = () => {
    setModalMessage({ ...modalMessage, show: false })
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="page-header">
          <div className="content-page-header">
            <h5>Passenger Boarding</h5>
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
                    <h4 className="fw-semibold mb-3">Select a Trip to Start Boarding</h4>
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
                      <button onClick={handleBackToTrips} className="btn btn-primary me-3">
                        &larr; Back to Trips
                      </button>
                      <h2 className="h4 fw-semibold text-gray-800 mb-0">Boarding for Trip: {currentTrip.voyageNo}</h2>
                    </div>

                    <ul className="nav nav-tabs mb-3">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === "boarding" ? "active" : ""}`}
                          onClick={() => setActiveTab("boarding")}
                        >
                          Boarding
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === "manifest" ? "active" : ""}`}
                          onClick={() => setActiveTab("manifest")}
                        >
                          Passenger Manifest
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${activeTab === "luggage" ? "active" : ""}`}
                          onClick={() => setActiveTab("luggage")}
                        >
                          Luggage Data
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
                                  <h3 className="fw-bold mb-3">Scan Boarding Pass</h3>
                                  <div className="d-flex flex-column gap-3">
                                    <div>
                                      <label className="form-label text-gray-700 fw-medium mb-1">Boarding Pass #</label>
                                      <input
                                        type="text"
                                        className="form-control p-3"
                                        placeholder="Enter ticket number"
                                        value={boardingPassInput}
                                        onChange={handleBoardingPassInput}
                                      />
                                    </div>
                                    <div>
                                      <label className="form-label text-gray-700 fw-medium mb-1">Seat Number</label>
                                      <input
                                        type="text"
                                        className="form-control p-3"
                                        placeholder="e.g., A12"
                                        value={seatNumberInput}
                                        onChange={(e) => setSeatNumberInput(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {!currentPassenger && (
                                  <div className="card p-4 border border-primary-light shadow-sm bg-light">
                                    <h3 className="h6 fw-semibold text-gray-700 mb-2">Instructions</h3>
                                    <p className="text-sm text-secondary mb-0">
                                      Enter a boarding pass number (e.g., `TK-101`) to view passenger information here.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {currentPassenger && (
                              <div className="col-md-6">
                                <div className="card p-4 border border-primary-light shadow-sm">
                                  <h3 className="h5 fw-bold text-primary mb-3">Boarding Pass</h3>
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
                                      <h4 className="mb-3 fw-bold text-dark">Ticket Details</h4>
                                      <div className="row g-3">
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Ticket No</div>
                                          <div className="fw-semibold">{currentPassenger.ticketNo}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Cabin</div>
                                          <div className="fw-semibold">{currentPassenger.cabin}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Ticket Type</div>
                                          <div className="fw-semibold">{currentPassenger.ticketType}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Service Type</div>
                                          <div className="fw-semibold">{currentPassenger.serviceType}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Visa Type</div>
                                          <div className="fw-semibold">{currentPassenger.visaType}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Allowed Weight</div>
                                          <div className="fw-semibold">{currentPassenger.allowedWeight} kg</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-3 mb-3 border rounded bg-white">
                                      <h4 className="mb-3 fw-bold text-dark">Passenger Details</h4>
                                      <div className="row g-3">
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Name</div>
                                          <div className="fw-semibold">{currentPassenger.name}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Passport</div>
                                          <div className="fw-semibold">{currentPassenger.passportNo}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Nationality</div>
                                          <div className="fw-semibold">{currentPassenger.nationality}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Expiry Date</div>
                                          <div className="fw-semibold">{currentPassenger.expiryDate}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Age</div>
                                          <div className="fw-semibold">{currentPassenger.age}</div>
                                        </div>
                                        <div className="col-6 col-md-4">
                                          <div className="text-muted small">Gender</div>
                                          <div className="fw-semibold">{currentPassenger.gender}</div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-3 mb-3 border rounded bg-white">
                                      <h4 className="mb-3 fw-bold text-dark">Luggage Details</h4>
                                      <div className="table-responsive">
                                        <table className="table mb-0">
                                          <thead>
                                            <tr>
                                              <th>Luggage Label No.</th>
                                              <th>Actual Weight (kg)</th>
                                              <th>Excess Weight (kg)</th>
                                              <th>Fee (IDR)</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>{currentPassenger.luggageLabel}</td>
                                              <td>{currentPassenger.actualWeight}</td>
                                              <td>{currentPassenger.excessWeight}</td>
                                              <td>
                                                {currentPassenger.excessFee
                                                  ? `IDR ${currentPassenger.excessFee.toFixed(2)}`
                                                  : "N/A"}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    <div className="d-flex gap-3 justify-content-end mt-4">
                                      <button
                                        onClick={handleConfirmBoarding}
                                        className="btn btn-primary px-4 py-2 fw-semibold"
                                      >
                                        Confirm Boarding
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
                          <h3 className="h5 fw-bold mb-3">Passenger Manifest</h3>
                          <div className="overflow-auto">
                            <div className="table-responsive">
                              <table className="table table-striped mb-0">
                                <thead>
                                  <tr className="text-secondary">
                                    <th className="py-3 px-4">Vessel Name</th>
                                    <th className="py-3 px-4">Voyage No</th>
                                    <th className="py-3 px-4">From</th>
                                    <th className="py-3 px-4">To</th>
                                    <th className="py-3 px-4">ETD</th>
                                    <th className="py-3 px-4">ETA</th>
                                    <th className="py-3 px-4">Ticket No</th>
                                    <th className="py-3 px-4">Cabin</th>
                                    <th className="py-3 px-4">Ticket Type</th>
                                    <th className="py-3 px-4">Service Type</th>
                                    <th className="py-3 px-4">Visa Type</th>
                                    <th className="py-3 px-4">Allowed Weight</th>
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Nationality</th>
                                    <th className="py-3 px-4">Passport No</th>
                                    <th className="py-3 px-4">Expiry Date</th>
                                    <th className="py-3 px-4">Age</th>
                                    <th className="py-3 px-4">Gender</th>
                                    <th className="py-3 px-4">Actual Weight (kg)</th>
                                    <th className="py-3 px-4">Excess Weight (kg)</th>
                                    <th className="py-3 px-4">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {passengers.length === 0 ? (
                                    <tr>
                                      <td colSpan="21" className="text-center py-4 text-secondary">
                                        No passenger data to display.
                                      </td>
                                    </tr>
                                  ) : (
                                    passengers.map((p) => (
                                      <tr key={p.ticketNo}>
                                        <td className="py-3 px-4">{currentTrip.vesselName}</td>
                                        <td className="py-3 px-4">{currentTrip.voyageNo}</td>
                                        <td className="py-3 px-4">{currentTrip.from}</td>
                                        <td className="py-3 px-4">{currentTrip.to}</td>
                                        <td className="py-3 px-4">{currentTrip.etd}</td>
                                        <td className="py-3 px-4">{currentTrip.eta}</td>
                                        <td className="py-3 px-4">{p.ticketNo}</td>
                                        <td className="py-3 px-4">{p.cabin}</td>
                                        <td className="py-3 px-4">{p.ticketType}</td>
                                        <td className="py-3 px-4">{p.serviceType}</td>
                                        <td className="py-3 px-4">{p.visaType}</td>
                                        <td className="py-3 px-4">{p.allowedWeight}</td>
                                        <td className="py-3 px-4">{p.name}</td>
                                        <td className="py-3 px-4">{p.nationality}</td>
                                        <td className="py-3 px-4">{p.passportNo}</td>
                                        <td className="py-3 px-4">{p.expiryDate}</td>
                                        <td className="py-3 px-4">{p.age}</td>
                                        <td className="py-3 px-4">{p.gender}</td>
                                        <td className="py-3 px-4">{p.actualWeight}</td>
                                        <td className="py-3 px-4">{p.excessWeight}</td>
                                        <td className="py-3 px-4">
                                          <span
                                            className={`badge ${p.status === "boarded" ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}
                                          >
                                            {p.status.toUpperCase()}
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "luggage" && (
                        <div className="tab-pane fade show active">
                          <h3 className="h5 fw-bold mb-3">Luggage Data</h3>
                          <div className="table-responsive">
                            <table className="table table-striped mb-0">
                              <thead>
                                <tr className="text-secondary">
                                  <th className="py-3 px-4">Passenger</th>
                                  <th className="py-3 px-4">Luggage Label</th>
                                  <th className="py-3 px-4">Weight</th>
                                  <th className="py-3 px-4">Excess Weight</th>
                                  <th className="py-3 px-4">Fee</th>
                                </tr>
                              </thead>
                              <tbody>
                                {passengers.length === 0 ? (
                                  <tr>
                                    <td colSpan="5" className="text-center py-4 text-secondary">
                                      No luggage data to display.
                                    </td>
                                  </tr>
                                ) : (
                                  passengers.map((p) => (
                                    <tr key={p.ticketNo}>
                                      <td className="py-3 px-4">{p.name}</td>
                                      <td className="py-3 px-4">{p.luggageLabel}</td>
                                      <td className="py-3 px-4">{p.actualWeight} kg</td>
                                      <td className="py-3 px-4">{p.excessWeight > 0 ? `${p.excessWeight} kg` : "-"}</td>
                                      <td className="py-3 px-4">
                                        {p.excessFee > 0 ? `IDR ${p.excessFee.toFixed(2)}` : "-"}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
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
      </PageWrapper>
    </div>
  )
}
