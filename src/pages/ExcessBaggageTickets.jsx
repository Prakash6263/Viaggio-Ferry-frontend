// src/pages/ExcessBaggageTickets.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
/**
 * ExcessBaggageTickets.jsx
 *
 * React conversion of excess-baggage-tickets.html
 * - Keep your existing CSS (bootstrap + custom) in the app for styling.
 * - If you want DataTables features (export, pagination), tell me and I'll add integration.
 */

const EmptyRow = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i}>-</td>
    ))}
  </tr>
);

const ExcessBaggageTickets = () => {
  // activeTab: 'passenger' | 'vehicle' | 'cargo'
  const [activeTab, setActiveTab] = useState("passenger");

  // Example data arrays (empty for now). Replace with real data / API calls.
  const [passengerData, setPassengerData] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [cargoData, setCargoData] = useState([]);

  // Optional: show/hide the list vs details for each tab
  const [passengerDetailsVisible, setPassengerDetailsVisible] = useState(false);
  const [vehicleDetailsVisible, setVehicleDetailsVisible] = useState(false);
  const [cargoDetailsVisible, setCargoDetailsVisible] = useState(false);

  useEffect(() => {
    // mimic your original behavior: activate passenger tab on load
    setActiveTab("passenger");

    // If you want to load data from an API, do it here and populate the three arrays.
    // Example:
    // fetch("/api/excess/passenger").then(res => res.json()).then(setPassengerData)
  }, []);

  // Handlers to show detail view (placeholder)
  function showDetails(detailsViewId) {
    if (detailsViewId === "passenger-list-view") {
      setPassengerDetailsVisible(true);
    } else if (detailsViewId === "vehicle-list-view") {
      setVehicleDetailsVisible(true);
    } else if (detailsViewId === "cargo-list-view") {
      setCargoDetailsVisible(true);
    }
  }

  function showList(listViewId) {
    if (listViewId === "passenger-list-view") {
      setPassengerDetailsVisible(false);
    } else if (listViewId === "vehicle-list-view") {
      setVehicleDetailsVisible(false);
    } else if (listViewId === "cargo-list-view") {
      setCargoDetailsVisible(false);
    }
  }

  // Column counts for empty placeholder row generation:
  const passengerCols = 27; // same number of <th> in passenger table of original HTML
  const vehicleCols = 34; // approximate columns as in HTML
  const cargoCols = 34;

  return (
    <>
<Header />
<Sidebar />
<PageWrapper>
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header">
            <h5>Excess Luggage Tickets </h5>
          </div>
        </div>
        {/* /Page Header */}

        <div className="row">
          <div className="col-sm-12">
            <div className="card-table card p-3">
              <div className="card-body">
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      id="passenger-tab-btn"
                      className={`nav-link tab-btn ${activeTab === "passenger" ? "active" : ""}`}
                      type="button"
                      role="tab"
                      aria-controls="passenger-tab"
                      aria-selected={activeTab === "passenger"}
                      onClick={() => setActiveTab("passenger")}
                    >
                      Passenger
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      id="vehicle-tab-btn"
                      className={`nav-link tab-btn ${activeTab === "vehicle" ? "active" : ""}`}
                      type="button"
                      role="tab"
                      aria-controls="vehicle-tab"
                      aria-selected={activeTab === "vehicle"}
                      onClick={() => setActiveTab("vehicle")}
                    >
                      Vehicle
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      id="cargo-tab-btn"
                      className={`nav-link tab-btn ${activeTab === "cargo" ? "active" : ""}`}
                      type="button"
                      role="tab"
                      aria-controls="cargo-tab"
                      aria-selected={activeTab === "cargo"}
                      onClick={() => setActiveTab("cargo")}
                    >
                      Cargo
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {/* Passenger Tab Pane */}
                  {activeTab === "passenger" && (
                    <div id="passenger-tab" className="tab-pane fade show active" role="tabpanel">
                      <h2 className="mb-4">Passenger Excess Luggage Tickets</h2>

                      {/* list view vs details view */}
                      <div id="passenger-list-view" className={`list-view ${passengerDetailsVisible ? "d-none" : ""}`}>
                        <div className="table-responsive">
                          <table className="table table-striped mb-0">
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
                              {passengerData.length ? (
                                passengerData.map((row, idx) => (
                                  <tr key={idx}>
                                    {/* map your row fields to <td> here */}
                                    <td>{row.vessel || "-"}</td>
                                    <td>{row.voyage || "-"}</td>
                                    <td>{row.from || "-"}</td>
                                    <td>{row.to || "-"}</td>
                                    <td>{row.etd || "-"}</td>
                                    <td>{row.eta || "-"}</td>
                                    <td>{row.ticketNo || "-"}</td>
                                    <td>{row.cabin || "-"}</td>
                                    <td>{row.ticketType || "-"}</td>
                                    <td>{row.serviceType || "-"}</td>
                                    <td>{row.visaType || "-"}</td>
                                    <td>{row.allowedWeight || "-"}</td>
                                    <td>{row.name || "-"}</td>
                                    <td>{row.nationality || "-"}</td>
                                    <td>{row.passportNo || "-"}</td>
                                    <td>{row.expiryDate || "-"}</td>
                                    <td>{row.age || "-"}</td>
                                    <td>{row.gender || "-"}</td>
                                    <td>{row.excessTicketNo || "-"}</td>
                                    <td>{row.allowedKg || "-"}</td>
                                    <td>{row.actualKg || "-"}</td>
                                    <td>{row.excessKg || "-"}</td>
                                    <td>{row.feePerKg || "-"}</td>
                                    <td>{row.totalFee || "-"}</td>
                                    <td>{row.paymentMethod || "-"}</td>
                                    <td>{row.paymentAccount || "-"}</td>
                                    <td>{row.transactionNo || "-"}</td>
                                  </tr>
                                ))
                              ) : (
                                <EmptyRow cols={passengerCols} />
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* details view placeholder */}
                      <div id="passenger-details-view" className={`details-view ${passengerDetailsVisible ? "" : "d-none"}`}>
                        {/* put detailed UI for a selected passenger excess baggage here */}
                        <button className="btn btn-sm btn-secondary mb-3" onClick={() => showList("passenger-list-view")}>
                          Back to list
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Vehicle Tab Pane */}
                  {activeTab === "vehicle" && (
                    <div id="vehicle-tab" className="tab-pane fade show active" role="tabpanel">
                      <h2 className="mb-4">Vehicle Excess Luggage Tickets</h2>

                      <div id="vehicle-list-view" className={`list-view ${vehicleDetailsVisible ? "d-none" : ""}`}>
                        <div className="table-responsive">
                          <table className="table table-striped" id="excess-vehicle-table">
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
                              {vehicleData.length ? (
                                vehicleData.map((row, idx) => (
                                  <tr key={idx}>
                                    {/* map vehicle row fields */}
                                    <td>{row.vessel || "-"}</td>
                                    <td>{row.voyage || "-"}</td>
                                    <td>{row.from || "-"}</td>
                                    <td>{row.to || "-"}</td>
                                    <td>{row.etd || "-"}</td>
                                    <td>{row.eta || "-"}</td>
                                    <td>{row.ticketNo || "-"}</td>
                                    <td>{row.cabin || "-"}</td>
                                    <td>{row.ticketType || "-"}</td>
                                    <td>{row.serviceType || "-"}</td>
                                    <td>{row.visaType || "-"}</td>
                                    <td>{row.allowedWeight || "-"}</td>
                                    <td>{row.vehicleType || "-"}</td>
                                    <td>{row.makeModel || "-"}</td>
                                    <td>{row.quantity || "-"}</td>
                                    <td>{row.weight || "-"}</td>
                                    <td>{row.dimensions || "-"}</td>
                                    <td>{row.engineNo || "-"}</td>
                                    <td>{row.ownerName || "-"}</td>
                                    <td>{row.ownerPhone || "-"}</td>
                                    <td>{row.ownerLicense || "-"}</td>
                                    <td>{row.driverName || "-"}</td>
                                    <td>{row.driverPhone || "-"}</td>
                                    <td>{row.driverLicense || "-"}</td>
                                    <td>{row.excessTicketNo || "-"}</td>
                                    <td>{row.allowedKg || "-"}</td>
                                    <td>{row.actualKg || "-"}</td>
                                    <td>{row.excessKg || "-"}</td>
                                    <td>{row.feePerKg || "-"}</td>
                                    <td>{row.totalFee || "-"}</td>
                                    <td>{row.paymentMethod || "-"}</td>
                                    <td>{row.paymentAccount || "-"}</td>
                                    <td>{row.transactionNo || "-"}</td>
                                  </tr>
                                ))
                              ) : (
                                <EmptyRow cols={vehicleCols} />
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div id="vehicle-details-view" className={`details-view ${vehicleDetailsVisible ? "" : "d-none"}`}>
                        <button className="btn btn-sm btn-secondary mb-3" onClick={() => showList("vehicle-list-view")}>
                          Back to list
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Cargo Tab Pane */}
                  {activeTab === "cargo" && (
                    <div id="cargo-tab" className="tab-pane fade show active" role="tabpanel">
                      <h2 className="mb-4">Cargo Excess Luggage Tickets</h2>

                      <div id="cargo-list-view" className={`list-view ${cargoDetailsVisible ? "d-none" : ""}`}>
                        <div className="table-responsive">
                          <table className="excess-cargo-table table table-striped" id="excess-cargo-table">
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
                              {cargoData.length ? (
                                cargoData.map((row, idx) => (
                                  <tr key={idx}>
                                    {/* map cargo fields */}
                                    <td>{row.vessel || "-"}</td>
                                    <td>{row.voyage || "-"}</td>
                                    <td>{row.from || "-"}</td>
                                    <td>{row.to || "-"}</td>
                                    <td>{row.etd || "-"}</td>
                                    <td>{row.eta || "-"}</td>
                                    <td>{row.ticketNo || "-"}</td>
                                    <td>{row.cabin || "-"}</td>
                                    <td>{row.ticketType || "-"}</td>
                                    <td>{row.serviceType || "-"}</td>
                                    <td>{row.visaType || "-"}</td>
                                    <td>{row.allowedWeight || "-"}</td>
                                    <td>{row.cargoType || "-"}</td>
                                    <td>{row.goodsType || "-"}</td>
                                    <td>{row.quantity || "-"}</td>
                                    <td>{row.weight || "-"}</td>
                                    <td>{row.dimensions || "-"}</td>
                                    <td>{row.goodsDescription || "-"}</td>
                                    <td>{row.consigneeName || "-"}</td>
                                    <td>{row.consigneePhone || "-"}</td>
                                    <td>{row.consigneeId || "-"}</td>
                                    <td>{row.consignorName || "-"}</td>
                                    <td>{row.consignorPhone || "-"}</td>
                                    <td>{row.consignorId || "-"}</td>
                                    <td>{row.excessTicketNo || "-"}</td>
                                    <td>{row.allowedKg || "-"}</td>
                                    <td>{row.actualKg || "-"}</td>
                                    <td>{row.excessKg || "-"}</td>
                                    <td>{row.feePerKg || "-"}</td>
                                    <td>{row.totalFee || "-"}</td>
                                    <td>{row.paymentMethod || "-"}</td>
                                    <td>{row.paymentAccount || "-"}</td>
                                    <td>{row.transactionNo || "-"}</td>
                                  </tr>
                                ))
                              ) : (
                                <EmptyRow cols={cargoCols} />
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div id="cargo-details-view" className={`details-view ${cargoDetailsVisible ? "" : "d-none"}`}>
                        <button className="btn btn-sm btn-secondary mb-3" onClick={() => showList("cargo-list-view")}>
                          Back to list
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* end tab-content */}
              </div>
              {/* end card-body */}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
    </>
  );
};

export default ExcessBaggageTickets;
