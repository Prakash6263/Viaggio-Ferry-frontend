import React, { useState, useEffect } from 'react'

const Tabs = ({ activeTab = 'passenger' }) => {
  const [dropdownOpen, setDropdownOpen] = useState({
    passenger: false,
    vehicles: false,
    cargo: false,
  })

  const [visibleColumns, setVisibleColumns] = useState({
    passenger: new Array(38).fill(true),
    vehicles: new Array(45).fill(true),
    cargo: new Array(43).fill(true),
  })

  const handleColumnToggle = (tab) => {
    setDropdownOpen(prev => ({
      ...prev,
      [tab]: !prev[tab]
    }))
  }

  const handleColumnCheckChange = (tab, index) => {
    setVisibleColumns(prev => {
      const newVisible = [...prev[tab]]
      newVisible[index] = !newVisible[index]
      return {
        ...prev,
        [tab]: newVisible
      }
    })
  }

  const handleApplyColumns = (tab) => {
    setDropdownOpen(prev => ({
      ...prev,
      [tab]: false
    }))
  }

  const handleResetColumns = (tab) => {
    setVisibleColumns(prev => ({
      ...prev,
      [tab]: new Array(prev[tab].length).fill(true)
    }))
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      const passengerMenu = document.getElementById('passengerColumnMenu')
      const passengerBtn = document.getElementById('passengerColumnToggle')
      const vehiclesMenu = document.getElementById('vehiclesColumnMenu')
      const vehiclesBtn = document.getElementById('vehiclesColumnToggle')
      const cargoMenu = document.getElementById('cargoColumnMenu')
      const cargoBtn = document.getElementById('cargoColumnToggle')

      if (passengerMenu && !passengerMenu.contains(e.target) && passengerBtn && !passengerBtn.contains(e.target)) {
        setDropdownOpen(prev => ({ ...prev, passenger: false }))
      }
      if (vehiclesMenu && !vehiclesMenu.contains(e.target) && vehiclesBtn && !vehiclesBtn.contains(e.target)) {
        setDropdownOpen(prev => ({ ...prev, vehicles: false }))
      }
      if (cargoMenu && !cargoMenu.contains(e.target) && cargoBtn && !cargoBtn.contains(e.target)) {
        setDropdownOpen(prev => ({ ...prev, cargo: false }))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Passenger Tab */}
      <div id="passenger" className={`tab-content ${activeTab === 'passenger' ? 'active' : ''}`}>
        <div className="column-visibility-container">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by ticket number, name, or passport..."
            />
            <button className="search-btn">
              <i className="fas fa-search" /> Search
            </button>
          </div>
          <div className="column-visibility-dropdown">
            <button
              className="column-visibility-btn"
              id="passengerColumnToggle"
              onClick={() => handleColumnToggle('passenger')}
            >
              <i className="fas fa-columns" /> Columns
            </button>
            <div
              className="column-visibility-content"
              id="passengerColumnMenu"
              style={{ display: dropdownOpen.passenger ? 'block' : 'none' }}
            >
              <div className="column-visibility-title">
                Ticket Details
              </div>
              {[
                'Ticket No',
                'Cabin',
                'Ticket Type',
                'Service Type',
                'Visa Type',
                'Allowed Weight',
                'Status',
                'Travel Document No'
              ].map((label, idx) => (
                <div key={`col-pass-${idx}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-pass-${idx}`}
                    checked={visibleColumns.passenger[idx]}
                    onChange={() => handleColumnCheckChange('passenger', idx)}
                  />
                  <label htmlFor={`col-pass-${idx}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Passenger Details
              </div>
              {[
                'Name',
                'Nationality',
                'Passport No',
                'Expiry Date',
                'Age',
                'Gender',
                'Email'
              ].map((label, idx) => (
                <div key={`col-pass-${idx + 8}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-pass-${idx + 8}`}
                    checked={visibleColumns.passenger[idx + 8]}
                    onChange={() => handleColumnCheckChange('passenger', idx + 8)}
                  />
                  <label htmlFor={`col-pass-${idx + 8}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Agent Details
              </div>
              {[
                'Company',
                'Marine Agent',
                'Commercial Agent',
                'Subagent',
                'User Name'
              ].map((label, idx) => (
                <div key={`col-pass-${idx + 15}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-pass-${idx + 15}`}
                    checked={visibleColumns.passenger[idx + 15]}
                    onChange={() => handleColumnCheckChange('passenger', idx + 15)}
                  />
                  <label htmlFor={`col-pass-${idx + 15}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Trip Details
              </div>
              {[
                'Vessel Name',
                'Voyage No',
                'From',
                'To',
                'ETD',
                'ETA'
              ].map((label, idx) => (
                <div key={`col-pass-${idx + 20}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-pass-${idx + 20}`}
                    checked={visibleColumns.passenger[idx + 20]}
                    onChange={() => handleColumnCheckChange('passenger', idx + 20)}
                  />
                  <label htmlFor={`col-pass-${idx + 20}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Fare Details
              </div>
              {[
                'Basic Price',
                'Tax A',
                'Tax B',
                'Commission Expense',
                'Commission Income',
                'Mark up',
                'Discount',
                'Promotion',
                'Refund Charges',
                'Receivable Amount',
                'Net Income',
                'Payable Amount'
              ].map((label, idx) => (
                <div key={`col-pass-${idx + 26}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-pass-${idx + 26}`}
                    checked={visibleColumns.passenger[idx + 26]}
                    onChange={() => handleColumnCheckChange('passenger', idx + 26)}
                  />
                  <label htmlFor={`col-pass-${idx + 26}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-actions">
                <button
                  className="column-visibility-action-btn"
                  onClick={() => handleResetColumns('passenger')}
                  id="resetPassengerColumns"
                >
                  Reset
                </button>
                <button
                  className="column-visibility-action-btn"
                  onClick={() => handleApplyColumns('passenger')}
                  id="applyPassengerColumns"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table id="passengerTable">
            <thead>
              <tr>
                {visibleColumns.passenger[0] && <th colSpan={8}>Ticket Details</th>}
                {visibleColumns.passenger[8] && <th colSpan={7}>Passenger Details</th>}
                {visibleColumns.passenger[15] && <th colSpan={6}>Agent Details</th>}
                {visibleColumns.passenger[20] && <th colSpan={7}>Trip Details</th>}
                {visibleColumns.passenger[26] && <th colSpan={11}>Fare Details</th>}
                <th rowSpan={2}>Action</th>
              </tr>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.passenger[0] && <th>Ticket No</th>}
                {visibleColumns.passenger[1] && <th>Cabin</th>}
                {visibleColumns.passenger[2] && <th>Ticket Type</th>}
                {visibleColumns.passenger[3] && <th>Service Type</th>}
                {visibleColumns.passenger[4] && <th>Visa Type</th>}
                {visibleColumns.passenger[5] && <th>Allowed Weight</th>}
                {visibleColumns.passenger[6] && <th>Status</th>}
                {visibleColumns.passenger[7] && <th>Travel Document No</th>}
                {/* Passenger Details */}
                {visibleColumns.passenger[8] && <th>Name</th>}
                {visibleColumns.passenger[9] && <th>Nationality</th>}
                {visibleColumns.passenger[10] && <th>Passport No</th>}
                {visibleColumns.passenger[11] && <th>Expiry Date</th>}
                {visibleColumns.passenger[12] && <th>Age</th>}
                {visibleColumns.passenger[13] && <th>Gender</th>}
                {visibleColumns.passenger[14] && <th>Email</th>}
                {/* Agent Details */}
                {visibleColumns.passenger[15] && <th>Company</th>}
                {visibleColumns.passenger[16] && <th>Marine Agent</th>}
                {visibleColumns.passenger[17] && <th>Commercial Agent</th>}
                {visibleColumns.passenger[18] && <th>Subagent</th>}
                {visibleColumns.passenger[19] && <th>User Name</th>}
                {/* Trip Details */}
                {visibleColumns.passenger[20] && <th>Vessel Name</th>}
                {visibleColumns.passenger[21] && <th>Voyage No</th>}
                {visibleColumns.passenger[22] && <th>From</th>}
                {visibleColumns.passenger[23] && <th>To</th>}
                {visibleColumns.passenger[24] && <th>ETD</th>}
                {visibleColumns.passenger[25] && <th>ETA</th>}
                {/* Fare Details */}
                {visibleColumns.passenger[26] && <th>Basic Price</th>}
                {visibleColumns.passenger[27] && <th>Tax A</th>}
                {visibleColumns.passenger[28] && <th>Tax B</th>}
                {visibleColumns.passenger[29] && <th>Commission Expense</th>}
                {visibleColumns.passenger[30] && <th>Commission Income</th>}
                {visibleColumns.passenger[31] && <th>Mark up</th>}
                {visibleColumns.passenger[32] && <th>Discount</th>}
                {visibleColumns.passenger[33] && <th>Promotion</th>}
                {visibleColumns.passenger[34] && <th>Refund Charges</th>}
                {visibleColumns.passenger[35] && <th>Receivable Amount</th>}
                {visibleColumns.passenger[36] && <th>Net Income</th>}
                {visibleColumns.passenger[37] && <th>Payable Amount</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.passenger[0] && <td>TKT12345</td>}
                {visibleColumns.passenger[1] && <td>Deluxe</td>}
                {visibleColumns.passenger[2] && <td>One Way</td>}
                {visibleColumns.passenger[3] && <td>Premium</td>}
                {visibleColumns.passenger[4] && <td>Tourist</td>}
                {visibleColumns.passenger[5] && <td>30kg</td>}
                {visibleColumns.passenger[6] && <td><span className="status-badge status-confirmed">Confirmed</span></td>}
                {visibleColumns.passenger[7] && <td>TD123456789</td>}
                {/* Passenger Details */}
                {visibleColumns.passenger[8] && <td>John Smith</td>}
                {visibleColumns.passenger[9] && <td>British</td>}
                {visibleColumns.passenger[10] && <td>AB1234567</td>}
                {visibleColumns.passenger[11] && <td>2025-06-15</td>}
                {visibleColumns.passenger[12] && <td>35</td>}
                {visibleColumns.passenger[13] && <td>Male</td>}
                {visibleColumns.passenger[14] && <td>john@example.com</td>}
                {/* Agent Details */}
                {visibleColumns.passenger[15] && <td>Travel Agency Ltd</td>}
                {visibleColumns.passenger[16] && <td>Marine Agent 1</td>}
                {visibleColumns.passenger[17] && <td>Commercial Agent 2</td>}
                {visibleColumns.passenger[18] && <td>Subagent 3</td>}
                {visibleColumns.passenger[19] && <td>agent_user</td>}
                {/* Trip Details */}
                {visibleColumns.passenger[20] && <td>Ocean Voyager</td>}
                {visibleColumns.passenger[21] && <td>VY789</td>}
                {visibleColumns.passenger[22] && <td>Dubai</td>}
                {visibleColumns.passenger[23] && <td>Mumbai</td>}
                {visibleColumns.passenger[24] && <td>2023-10-15 14:30</td>}
                {visibleColumns.passenger[25] && <td>2023-10-16 10:00</td>}
                {/* Fare Details */}
                {visibleColumns.passenger[26] && <td>$500</td>}
                {visibleColumns.passenger[27] && <td>$50</td>}
                {visibleColumns.passenger[28] && <td>$30</td>}
                {visibleColumns.passenger[29] && <td>$20</td>}
                {visibleColumns.passenger[30] && <td>$40</td>}
                {visibleColumns.passenger[31] && <td>$30</td>}
                {visibleColumns.passenger[32] && <td>$25</td>}
                {visibleColumns.passenger[33] && <td>$15</td>}
                {visibleColumns.passenger[34] && <td>$550</td>}
                {visibleColumns.passenger[35] && <td>$550</td>}
                {visibleColumns.passenger[36] && <td>$510</td>}
                {visibleColumns.passenger[37] && <td>525</td>}
                <td><button className="action-btn">Action</button></td>
              </tr>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.passenger[0] && <td>TKT12346</td>}
                {visibleColumns.passenger[1] && <td>Standard</td>}
                {visibleColumns.passenger[2] && <td>Round Trip</td>}
                {visibleColumns.passenger[3] && <td>Regular</td>}
                {visibleColumns.passenger[4] && <td>Business</td>}
                {visibleColumns.passenger[5] && <td>25kg</td>}
                {visibleColumns.passenger[6] && <td><span className="status-badge status-pending">Pending</span></td>}
                {visibleColumns.passenger[7] && <td>TD987654321</td>}
                {/* Passenger Details */}
                {visibleColumns.passenger[8] && <td>Emma Johnson</td>}
                {visibleColumns.passenger[9] && <td>American</td>}
                {visibleColumns.passenger[10] && <td>CD7654321</td>}
                {visibleColumns.passenger[11] && <td>2026-03-22</td>}
                {visibleColumns.passenger[12] && <td>28</td>}
                {visibleColumns.passenger[13] && <td>Female</td>}
                {visibleColumns.passenger[14] && <td>emma@example.com</td>}
                {/* Agent Details */}
                {visibleColumns.passenger[15] && <td>Global Travel</td>}
                {visibleColumns.passenger[16] && <td>Marine Agent 2</td>}
                {visibleColumns.passenger[17] && <td>Commercial Agent 1</td>}
                {visibleColumns.passenger[18] && <td>Subagent 1</td>}
                {visibleColumns.passenger[19] && <td>global_user</td>}
                {/* Trip Details */}
                {visibleColumns.passenger[20] && <td>Sea Explorer</td>}
                {visibleColumns.passenger[21] && <td>VY456</td>}
                {visibleColumns.passenger[22] && <td>Abu Dhabi</td>}
                {visibleColumns.passenger[23] && <td>Karachi</td>}
                {visibleColumns.passenger[24] && <td>2023-11-05 09:15</td>}
                {visibleColumns.passenger[25] && <td>2023-11-06 16:45</td>}
                {/* Fare Details */}
                {visibleColumns.passenger[26] && <td>$650</td>}
                {visibleColumns.passenger[27] && <td>$65</td>}
                {visibleColumns.passenger[28] && <td>$40</td>}
                {visibleColumns.passenger[29] && <td>$25</td>}
                {visibleColumns.passenger[30] && <td>$50</td>}
                {visibleColumns.passenger[31] && <td>$40</td>}
                {visibleColumns.passenger[32] && <td>$30</td>}
                {visibleColumns.passenger[33] && <td>$20</td>}
                {visibleColumns.passenger[34] && <td>$15</td>}
                {visibleColumns.passenger[35] && <td>$700</td>}
                {visibleColumns.passenger[36] && <td>$660</td>}
                {visibleColumns.passenger[37] && <td>690</td>}
                <td><button className="action-btn">Action</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicles Tab */}
      <div id="vehicles" className={`tab-content ${activeTab === 'vehicles' ? 'active' : ''}`}>
        <div className="column-visibility-container">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by ticket number, plate, or model..."
            />
            <button className="search-btn">
              <i className="fas fa-search" /> Search
            </button>
          </div>
          <div className="column-visibility-dropdown">
            <button
              className="column-visibility-btn"
              id="vehiclesColumnToggle"
              onClick={() => handleColumnToggle('vehicles')}
            >
              <i className="fas fa-columns" /> Columns
            </button>
            <div
              className="column-visibility-content"
              id="vehiclesColumnMenu"
              style={{ display: dropdownOpen.vehicles ? 'block' : 'none' }}
            >
              <div className="column-visibility-title">
                Ticket Details
              </div>
              {[
                'Ticket No',
                'Cabin',
                'Ticket Type',
                'Service Type',
                'Visa Type',
                'Allowed Weight',
                'Status',
                'Travel Document No'
              ].map((label, idx) => (
                <div key={`col-veh-${idx}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx}`}
                    checked={visibleColumns.vehicles[idx]}
                    onChange={() => handleColumnCheckChange('vehicles', idx)}
                  />
                  <label htmlFor={`col-veh-${idx}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Vehicle Details
              </div>
              {[
                'Type',
                'Make/Model',
                'Engine/Chassis No',
                'Plate No'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 8}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 8}`}
                    checked={visibleColumns.vehicles[idx + 8]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 8)}
                  />
                  <label htmlFor={`col-veh-${idx + 8}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Owner Details
              </div>
              {[
                'Name',
                'Phone',
                'Passport/Residency',
                'License No'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 12}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 12}`}
                    checked={visibleColumns.vehicles[idx + 12]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 12)}
                  />
                  <label htmlFor={`col-veh-${idx + 12}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Consignee Details
              </div>
              {[
                'Name',
                'Phone',
                'ID No'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 16}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 16}`}
                    checked={visibleColumns.vehicles[idx + 16]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 16)}
                  />
                  <label htmlFor={`col-veh-${idx + 16}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Consignor Details
              </div>
              {[
                'Name',
                'Phone',
                'ID No'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 19}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 19}`}
                    checked={visibleColumns.vehicles[idx + 19]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 19)}
                  />
                  <label htmlFor={`col-veh-${idx + 19}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Agent Details
              </div>
              {[
                'Company',
                'Marine Agent',
                'Commercial Agent',
                'Subagent',
                'User Name'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 22}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 22}`}
                    checked={visibleColumns.vehicles[idx + 22]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 22)}
                  />
                  <label htmlFor={`col-veh-${idx + 22}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Trip Details
              </div>
              {[
                'Vessel Name',
                'Voyage No',
                'From',
                'To',
                'ETD',
                'ETA'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 27}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 27}`}
                    checked={visibleColumns.vehicles[idx + 27]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 27)}
                  />
                  <label htmlFor={`col-veh-${idx + 27}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Fare Details
              </div>
              {[
                'Basic Price',
                'Tax A',
                'Tax B',
                'Commission Expense',
                'Commission Earned',
                'Mark up',
                'Discount',
                'Promotion',
                'Refund Charges',
                'Receivable Amount',
                'Net Income',
                'Payable Amount'
              ].map((label, idx) => (
                <div key={`col-veh-${idx + 33}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-veh-${idx + 33}`}
                    checked={visibleColumns.vehicles[idx + 33]}
                    onChange={() => handleColumnCheckChange('vehicles', idx + 33)}
                  />
                  <label htmlFor={`col-veh-${idx + 33}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-actions">
                <button
                  className="column-visibility-action-btn"
                  onClick={() => handleResetColumns('vehicles')}
                  id="resetVehiclesColumns"
                >
                  Reset
                </button>
                <button
                  className="column-visibility-action-btn"
                  onClick={() => handleApplyColumns('vehicles')}
                  id="applyVehiclesColumns"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table id="vehiclesTable">
            <thead>
              <tr>
                {visibleColumns.vehicles[0] && <th colSpan={8}>Ticket Details</th>}
                {visibleColumns.vehicles[8] && <th colSpan={4}>Vehicle Details</th>}
                {visibleColumns.vehicles[12] && <th colSpan={4}>Owner Details</th>}
                {visibleColumns.vehicles[16] && <th colSpan={3}>Consignee Details</th>}
                {visibleColumns.vehicles[19] && <th colSpan={3}>Consignor Details</th>}
                {visibleColumns.vehicles[22] && <th colSpan={6}>Agent Details</th>}
                {visibleColumns.vehicles[27] && <th colSpan={7}>Trip Details</th>}
                {visibleColumns.vehicles[33] && <th colSpan={11}>Fare Details</th>}
                <th rowSpan={2}>Action</th>
              </tr>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.vehicles[0] && <th>Ticket No</th>}
                {visibleColumns.vehicles[1] && <th>Cabin</th>}
                {visibleColumns.vehicles[2] && <th>Ticket Type</th>}
                {visibleColumns.vehicles[3] && <th>Service Type</th>}
                {visibleColumns.vehicles[4] && <th>Visa Type</th>}
                {visibleColumns.vehicles[5] && <th>Allowed Weight</th>}
                {visibleColumns.vehicles[6] && <th>Status</th>}
                {visibleColumns.vehicles[7] && <th>Travel Document No</th>}
                {/* Vehicle Details */}
                {visibleColumns.vehicles[8] && <th>Type</th>}
                {visibleColumns.vehicles[9] && <th>Make/Model</th>}
                {visibleColumns.vehicles[10] && <th>Engine/Chassis No</th>}
                {visibleColumns.vehicles[11] && <th>Plate No</th>}
                {/* Owner Details */}
                {visibleColumns.vehicles[12] && <th>Name</th>}
                {visibleColumns.vehicles[13] && <th>Phone</th>}
                {visibleColumns.vehicles[14] && <th>Passport/Residency</th>}
                {visibleColumns.vehicles[15] && <th>License No</th>}
                {/* Consignee Details */}
                {visibleColumns.vehicles[16] && <th>Name</th>}
                {visibleColumns.vehicles[17] && <th>Phone</th>}
                {visibleColumns.vehicles[18] && <th>ID No</th>}
                {/* Consignor Details */}
                {visibleColumns.vehicles[19] && <th>Name</th>}
                {visibleColumns.vehicles[20] && <th>Phone</th>}
                {visibleColumns.vehicles[21] && <th>ID No</th>}
                {/* Agent Details */}
                {visibleColumns.vehicles[22] && <th>Company</th>}
                {visibleColumns.vehicles[23] && <th>Marine Agent</th>}
                {visibleColumns.vehicles[24] && <th>Commercial Agent</th>}
                {visibleColumns.vehicles[25] && <th>Subagent</th>}
                {visibleColumns.vehicles[26] && <th>User Name</th>}
                {/* Trip Details */}
                {visibleColumns.vehicles[27] && <th>Vessel Name</th>}
                {visibleColumns.vehicles[28] && <th>Voyage No</th>}
                {visibleColumns.vehicles[29] && <th>From</th>}
                {visibleColumns.vehicles[30] && <th>To</th>}
                {visibleColumns.vehicles[31] && <th>ETD</th>}
                {visibleColumns.vehicles[32] && <th>ETA</th>}
                {/* Fare Details */}
                {visibleColumns.vehicles[33] && <th>Basic Price</th>}
                {visibleColumns.vehicles[34] && <th>Tax A</th>}
                {visibleColumns.vehicles[35] && <th>Tax B</th>}
                {visibleColumns.vehicles[36] && <th>Commission Expense</th>}
                {visibleColumns.vehicles[37] && <th>Commission Earned</th>}
                {visibleColumns.vehicles[38] && <th>Mark up</th>}
                {visibleColumns.vehicles[39] && <th>Discount</th>}
                {visibleColumns.vehicles[40] && <th>Promotion</th>}
                {visibleColumns.vehicles[41] && <th>Refund Charges</th>}
                {visibleColumns.vehicles[42] && <th>Receivable Amount</th>}
                {visibleColumns.vehicles[43] && <th>Net Income</th>}
                {visibleColumns.vehicles[44] && <th>Payable Amount</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.vehicles[0] && <td>VEH78901</td>}
                {visibleColumns.vehicles[1] && <td>Vehicle Deck</td>}
                {visibleColumns.vehicles[2] && <td>One Way</td>}
                {visibleColumns.vehicles[3] && <td>Standard</td>}
                {visibleColumns.vehicles[4] && <td>Vehicle</td>}
                {visibleColumns.vehicles[5] && <td>2000kg</td>}
                {visibleColumns.vehicles[6] && <td><span className="status-badge status-confirmed">Confirmed</span></td>}
                {visibleColumns.vehicles[7] && <td>TD456789123</td>}
                {/* Vehicle Details */}
                {visibleColumns.vehicles[8] && <td>SUV</td>}
                {visibleColumns.vehicles[9] && <td>Toyota Land Cruiser</td>}
                {visibleColumns.vehicles[10] && <td>ENG123456789</td>}
                {visibleColumns.vehicles[11] && <td>ABC1234</td>}
                {/* Owner Details */}
                {visibleColumns.vehicles[12] && <td>Ahmed Ali</td>}
                {visibleColumns.vehicles[13] && <td>+971551234567</td>}
                {visibleColumns.vehicles[14] && <td>784-2023-1234567-1</td>}
                {visibleColumns.vehicles[15] && <td>DL123456</td>}
                {/* Consignee Details */}
                {visibleColumns.vehicles[16] && <td>Mohammed Hassan</td>}
                {visibleColumns.vehicles[17] && <td>+971557654321</td>}
                {visibleColumns.vehicles[18] && <td>ID789456</td>}
                {/* Consignor Details */}
                {visibleColumns.vehicles[19] && <td>Auto Export Ltd</td>}
                {visibleColumns.vehicles[20] && <td>+971521234567</td>}
                {visibleColumns.vehicles[21] && <td>ID123789</td>}
                {/* Agent Details */}
                {visibleColumns.vehicles[22] && <td>Vehicle Shipping Co</td>}
                {visibleColumns.vehicles[23] && <td>Marine Agent 3</td>}
                {visibleColumns.vehicles[24] && <td>Commercial Agent 4</td>}
                {visibleColumns.vehicles[25] && <td>Subagent 5</td>}
                {visibleColumns.vehicles[26] && <td>vehicle_user</td>}
                {/* Trip Details */}
                {visibleColumns.vehicles[27] && <td>Car Carrier</td>}
                {visibleColumns.vehicles[28] && <td>VY123</td>}
                {visibleColumns.vehicles[29] && <td>Dubai</td>}
                {visibleColumns.vehicles[30] && <td>Mumbai</td>}
                {visibleColumns.vehicles[31] && <td>2023-10-20 11:00</td>}
                {visibleColumns.vehicles[32] && <td>2023-10-22 14:30</td>}
                {/* Fare Details */}
                {visibleColumns.vehicles[33] && <td>$800</td>}
                {visibleColumns.vehicles[34] && <td>$80</td>}
                {visibleColumns.vehicles[35] && <td>$50</td>}
                {visibleColumns.vehicles[36] && <td>$30</td>}
                {visibleColumns.vehicles[37] && <td>$60</td>}
                {visibleColumns.vehicles[38] && <td>$50</td>}
                {visibleColumns.vehicles[39] && <td>$40</td>}
                {visibleColumns.vehicles[40] && <td>$25</td>}
                {visibleColumns.vehicles[41] && <td>$850</td>}
                {visibleColumns.vehicles[42] && <td>$810</td>}
                {visibleColumns.vehicles[43] && <td>$840</td>}
                {visibleColumns.vehicles[44] && <td>Seasonal Offer</td>}
                <td><button className="action-btn">Action</button></td>
              </tr>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.vehicles[0] && <td>VEH78902</td>}
                {visibleColumns.vehicles[1] && <td>Vehicle Deck</td>}
                {visibleColumns.vehicles[2] && <td>Round Trip</td>}
                {visibleColumns.vehicles[3] && <td>Premium</td>}
                {visibleColumns.vehicles[4] && <td>Vehicle</td>}
                {visibleColumns.vehicles[5] && <td>1500kg</td>}
                {visibleColumns.vehicles[6] && <td><span className="status-badge status-cancelled">Cancelled</span></td>}
                {visibleColumns.vehicles[7] && <td>TD789123456</td>}
                {/* Vehicle Details */}
                {visibleColumns.vehicles[8] && <td>Sedan</td>}
                {visibleColumns.vehicles[9] && <td>BMW 5 Series</td>}
                {visibleColumns.vehicles[10] && <td>ENG987654321</td>}
                {visibleColumns.vehicles[11] && <td>XYZ5678</td>}
                {/* Owner Details */}
                {visibleColumns.vehicles[12] && <td>Sarah Williams</td>}
                {visibleColumns.vehicles[13] && <td>+971501234567</td>}
                {visibleColumns.vehicles[14] && <td>784-2022-9876543-2</td>}
                {visibleColumns.vehicles[15] && <td>DL987654</td>}
                {/* Consignee Details */}
                {visibleColumns.vehicles[16] && <td>James Wilson</td>}
                {visibleColumns.vehicles[17] && <td>+971559876543</td>}
                {visibleColumns.vehicles[18] && <td>ID654321</td>}
                {/* Consignor Details */}
                {visibleColumns.vehicles[19] && <td>Premium Auto</td>}
                {visibleColumns.vehicles[20] && <td>+971529876543</td>}
                {visibleColumns.vehicles[21] && <td>ID321654</td>}
                {/* Agent Details */}
                {visibleColumns.vehicles[22] && <td>Luxury Transport</td>}
                {visibleColumns.vehicles[23] && <td>Marine Agent 4</td>}
                {visibleColumns.vehicles[24] && <td>Commercial Agent 3</td>}
                {visibleColumns.vehicles[25] && <td>Subagent 2</td>}
                {visibleColumns.vehicles[26] && <td>luxury_user</td>}
                {/* Trip Details */}
                {visibleColumns.vehicles[27] && <td>Luxury Liner</td>}
                {visibleColumns.vehicles[28] && <td>VY789</td>}
                {visibleColumns.vehicles[29] && <td>Abu Dhabi</td>}
                {visibleColumns.vehicles[30] && <td>Doha</td>}
                {visibleColumns.vehicles[31] && <td>2023-11-10 08:45</td>}
                {visibleColumns.vehicles[32] && <td>2023-11-11 12:15</td>}
                {/* Fare Details */}
                {visibleColumns.vehicles[33] && <td>$1200</td>}
                {visibleColumns.vehicles[34] && <td>$120</td>}
                {visibleColumns.vehicles[35] && <td>$80</td>}
                {visibleColumns.vehicles[36] && <td>$50</td>}
                {visibleColumns.vehicles[37] && <td>$100</td>}
                {visibleColumns.vehicles[38] && <td>$80</td>}
                {visibleColumns.vehicles[39] && <td>$60</td>}
                {visibleColumns.vehicles[40] && <td>$40</td>}
                {visibleColumns.vehicles[41] && <td>$1300</td>}
                {visibleColumns.vehicles[42] && <td>$1250</td>}
                {visibleColumns.vehicles[43] && <td>$1280</td>}
                {visibleColumns.vehicles[44] && <td>Loyalty Discount</td>}
                <td><button className="action-btn">Action</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cargo Tab */}
      <div id="cargo" className={`tab-content ${activeTab === 'cargo' ? 'active' : ''}`}>
        <div className="column-visibility-container">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by ticket number, cargo type, or description..."
            />
            <button className="search-btn">
              <i className="fas fa-search" /> Search
            </button>
          </div>
          <div className="column-visibility-dropdown">
            <button
              className="column-visibility-btn"
              id="cargoColumnToggle"
              onClick={() => handleColumnToggle('cargo')}
            >
              <i className="fas fa-columns" /> Columns
            </button>
            <div
              className="column-visibility-content"
              id="cargoColumnMenu"
              style={{ display: dropdownOpen.cargo ? 'block' : 'none' }}
            >
              <div className="column-visibility-title">
                Ticket Details
              </div>
              {[
                'Ticket No',
                'Cabin',
                'Ticket Type',
                'Service Type',
                'Visa Type',
                'Allowed Weight',
                'Status',
                'Travel Document No'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx}`}
                    checked={visibleColumns.cargo[idx]}
                    onChange={() => handleColumnCheckChange('cargo', idx)}
                  />
                  <label htmlFor={`col-cargo-${idx}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Cargo Details
              </div>
              {[
                'Cargo Type',
                'Goods Type',
                'Qty',
                'Weight',
                'Dimension',
                'Goods Description'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx + 8}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx + 8}`}
                    checked={visibleColumns.cargo[idx + 8]}
                    onChange={() => handleColumnCheckChange('cargo', idx + 8)}
                  />
                  <label htmlFor={`col-cargo-${idx + 8}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Consignee Details
              </div>
              {[
                'Name',
                'Phone',
                'ID No'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx + 14}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx + 14}`}
                    checked={visibleColumns.cargo[idx + 14]}
                    onChange={() => handleColumnCheckChange('cargo', idx + 14)}
                  />
                  <label htmlFor={`col-cargo-${idx + 14}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Consignor Details
              </div>
              {[
                'Name',
                'Phone',
                'ID No'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx + 17}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx + 17}`}
                    checked={visibleColumns.cargo[idx + 17]}
                    onChange={() => handleColumnCheckChange('cargo', idx + 17)}
                  />
                  <label htmlFor={`col-cargo-${idx + 17}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Agent Details
              </div>
              {[
                'Company',
                'Marine Agent',
                'Commercial Agent',
                'Subagent',
                'User Name'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx + 20}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx + 20}`}
                    checked={visibleColumns.cargo[idx + 20]}
                    onChange={() => handleColumnCheckChange('cargo', idx + 20)}
                  />
                  <label htmlFor={`col-cargo-${idx + 20}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Trip Details
              </div>
              {[
                'Vessel Name',
                'Voyage No',
                'From',
                'To',
                'ETD',
                'ETA'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx + 25}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx + 25}`}
                    checked={visibleColumns.cargo[idx + 25]}
                    onChange={() => handleColumnCheckChange('cargo', idx + 25)}
                  />
                  <label htmlFor={`col-cargo-${idx + 25}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-title">
                Fare Details
              </div>
              {[
                'Basic Price',
                'Tax A',
                'Tax B',
                'Commission Expense',
                'Commission Earned',
                'Mark up',
                'Discount',
                'Promotion',
                'Refund Charges',
                'Receivable Amount',
                'Net Income',
                'Payable Amount'
              ].map((label, idx) => (
                <div key={`col-cargo-${idx + 31}`} className="column-visibility-item">
                  <input
                    type="checkbox"
                    id={`col-cargo-${idx + 31}`}
                    checked={visibleColumns.cargo[idx + 31]}
                    onChange={() => handleColumnCheckChange('cargo', idx + 31)}
                  />
                  <label htmlFor={`col-cargo-${idx + 31}`}>{label}</label>
                </div>
              ))}
              <div className="column-visibility-actions">
                <button
                  className="column-visibility-action-btn"
                  onClick={() => handleResetColumns('cargo')}
                  id="resetCargoColumns"
                >
                  Reset
                </button>
                <button
                  className="column-visibility-action-btn"
                  onClick={() => handleApplyColumns('cargo')}
                  id="applyCargoColumns"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table id="cargoTable">
            <thead>
              <tr>
                {visibleColumns.cargo[0] && <th colSpan={8}>Ticket Details</th>}
                {visibleColumns.cargo[8] && <th colSpan={6}>Cargo Details</th>}
                {visibleColumns.cargo[14] && <th colSpan={3}>Consignee Details</th>}
                {visibleColumns.cargo[17] && <th colSpan={3}>Consignor Details</th>}
                {visibleColumns.cargo[20] && <th colSpan={6}>Agent Details</th>}
                {visibleColumns.cargo[25] && <th colSpan={7}>Trip Details</th>}
                {visibleColumns.cargo[31] && <th colSpan={11}>Fare Details</th>}
                <th rowSpan={2}>Action</th>
              </tr>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.cargo[0] && <th>Ticket No</th>}
                {visibleColumns.cargo[1] && <th>Cabin</th>}
                {visibleColumns.cargo[2] && <th>Ticket Type</th>}
                {visibleColumns.cargo[3] && <th>Service Type</th>}
                {visibleColumns.cargo[4] && <th>Visa Type</th>}
                {visibleColumns.cargo[5] && <th>Allowed Weight</th>}
                {visibleColumns.cargo[6] && <th>Status</th>}
                {visibleColumns.cargo[7] && <th>Travel Document No</th>}
                {/* Cargo Details */}
                {visibleColumns.cargo[8] && <th>Cargo Type</th>}
                {visibleColumns.cargo[9] && <th>Goods Type</th>}
                {visibleColumns.cargo[10] && <th>Qty</th>}
                {visibleColumns.cargo[11] && <th>Weight</th>}
                {visibleColumns.cargo[12] && <th>Dimension</th>}
                {visibleColumns.cargo[13] && <th>Goods Description</th>}
                {/* Consignee Details */}
                {visibleColumns.cargo[14] && <th>Name</th>}
                {visibleColumns.cargo[15] && <th>Phone</th>}
                {visibleColumns.cargo[16] && <th>ID No</th>}
                {/* Consignor Details */}
                {visibleColumns.cargo[17] && <th>Name</th>}
                {visibleColumns.cargo[18] && <th>Phone</th>}
                {visibleColumns.cargo[19] && <th>ID No</th>}
                {/* Agent Details */}
                {visibleColumns.cargo[20] && <th>Company</th>}
                {visibleColumns.cargo[21] && <th>Marine Agent</th>}
                {visibleColumns.cargo[22] && <th>Commercial Agent</th>}
                {visibleColumns.cargo[23] && <th>Subagent</th>}
                {visibleColumns.cargo[24] && <th>User Name</th>}
                {/* Trip Details */}
                {visibleColumns.cargo[25] && <th>Vessel Name</th>}
                {visibleColumns.cargo[26] && <th>Voyage No</th>}
                {visibleColumns.cargo[27] && <th>From</th>}
                {visibleColumns.cargo[28] && <th>To</th>}
                {visibleColumns.cargo[29] && <th>ETD</th>}
                {visibleColumns.cargo[30] && <th>ETA</th>}
                {/* Fare Details */}
                {visibleColumns.cargo[31] && <th>Basic Price</th>}
                {visibleColumns.cargo[32] && <th>Tax A</th>}
                {visibleColumns.cargo[33] && <th>Tax B</th>}
                {visibleColumns.cargo[34] && <th>Commission Expense</th>}
                {visibleColumns.cargo[35] && <th>Commission Earned</th>}
                {visibleColumns.cargo[36] && <th>Mark up</th>}
                {visibleColumns.cargo[37] && <th>Discount</th>}
                {visibleColumns.cargo[38] && <th>Promotion</th>}
                {visibleColumns.cargo[39] && <th>Refund Charges</th>}
                {visibleColumns.cargo[40] && <th>Receivable Amount</th>}
                {visibleColumns.cargo[41] && <th>Net Income</th>}
                {visibleColumns.cargo[42] && <th>Payable Amount</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.cargo[0] && <td>CAR45678</td>}
                {visibleColumns.cargo[1] && <td>Cargo Hold</td>}
                {visibleColumns.cargo[2] && <td>One Way</td>}
                {visibleColumns.cargo[3] && <td>Standard</td>}
                {visibleColumns.cargo[4] && <td>Goods</td>}
                {visibleColumns.cargo[5] && <td>5000kg</td>}
                {visibleColumns.cargo[6] && <td><span className="status-badge status-confirmed">Confirmed</span></td>}
                {visibleColumns.cargo[7] && <td>TD987123456</td>}
                {/* Cargo Details */}
                {visibleColumns.cargo[8] && <td>Container</td>}
                {visibleColumns.cargo[9] && <td>Electronics</td>}
                {visibleColumns.cargo[10] && <td>100</td>}
                {visibleColumns.cargo[11] && <td>4500kg</td>}
                {visibleColumns.cargo[12] && <td>20x10x8 ft</td>}
                {visibleColumns.cargo[13] && <td>TV sets and home appliances</td>}
                {/* Consignee Details */}
                {visibleColumns.cargo[14] && <td>Electro World</td>}
                {visibleColumns.cargo[15] && <td>+971561234567</td>}
                {visibleColumns.cargo[16] && <td>ID123456</td>}
                {/* Consignor Details */}
                {visibleColumns.cargo[17] && <td>Tech Export Inc</td>}
                {visibleColumns.cargo[18] && <td>+971539876543</td>}
                {visibleColumns.cargo[19] && <td>ID654321</td>}
                {/* Agent Details */}
                {visibleColumns.cargo[20] && <td>Global Cargo</td>}
                {visibleColumns.cargo[21] && <td>Marine Agent 5</td>}
                {visibleColumns.cargo[22] && <td>Commercial Agent 6</td>}
                {visibleColumns.cargo[23] && <td>Subagent 7</td>}
                {visibleColumns.cargo[24] && <td>cargo_user</td>}
                {/* Trip Details */}
                {visibleColumns.cargo[25] && <td>Cargo Master</td>}
                {visibleColumns.cargo[26] && <td>VY456</td>}
                {visibleColumns.cargo[27] && <td>Jebel Ali</td>}
                {visibleColumns.cargo[28] && <td>Mundra</td>}
                {visibleColumns.cargo[29] && <td>2023-10-25 10:00</td>}
                {visibleColumns.cargo[30] && <td>2023-10-28 15:30</td>}
                {/* Fare Details */}
                {visibleColumns.cargo[31] && <td>$3000</td>}
                {visibleColumns.cargo[32] && <td>$300</td>}
                {visibleColumns.cargo[33] && <td>$200</td>}
                {visibleColumns.cargo[34] && <td>$150</td>}
                {visibleColumns.cargo[35] && <td>$250</td>}
                {visibleColumns.cargo[36] && <td>$200</td>}
                {visibleColumns.cargo[37] && <td>$150</td>}
                {visibleColumns.cargo[38] && <td>$100</td>}
                {visibleColumns.cargo[39] && <td>$3200</td>}
                {visibleColumns.cargo[40] && <td>$3100</td>}
                {visibleColumns.cargo[41] && <td>$3150</td>}
                {visibleColumns.cargo[42] && <td>Bulk Discount</td>}
                <td><button className="action-btn">Action</button></td>
              </tr>
              <tr>
                {/* Ticket Details */}
                {visibleColumns.cargo[0] && <td>CAR45679</td>}
                {visibleColumns.cargo[1] && <td>Cargo Hold</td>}
                {visibleColumns.cargo[2] && <td>One Way</td>}
                {visibleColumns.cargo[3] && <td>Premium</td>}
                {visibleColumns.cargo[4] && <td>Goods</td>}
                {visibleColumns.cargo[5] && <td>3000kg</td>}
                {visibleColumns.cargo[6] && <td><span className="status-badge status-pending">Pending</span></td>}
                {visibleColumns.cargo[7] && <td>TD456789123</td>}
                {/* Cargo Details */}
                {visibleColumns.cargo[8] && <td>Pallets</td>}
                {visibleColumns.cargo[9] && <td>Textiles</td>}
                {visibleColumns.cargo[10] && <td>50</td>}
                {visibleColumns.cargo[11] && <td>2800kg</td>}
                {visibleColumns.cargo[12] && <td>15x10x6 ft</td>}
                {visibleColumns.cargo[13] && <td>Cotton fabrics and clothing</td>}
                {/* Consignee Details */}
                {visibleColumns.cargo[14] && <td>Fashion House</td>}
                {visibleColumns.cargo[15] && <td>+971565432109</td>}
                {visibleColumns.cargo[16] && <td>ID789012</td>}
                {/* Consignor Details */}
                {visibleColumns.cargo[17] && <td>Textile Mills</td>}
                {visibleColumns.cargo[18] && <td>+971541234567</td>}
                {visibleColumns.cargo[19] && <td>ID345678</td>}
                {/* Agent Details */}
                {visibleColumns.cargo[20] && <td>Fashion Logistics</td>}
                {visibleColumns.cargo[21] && <td>Marine Agent 6</td>}
                {visibleColumns.cargo[22] && <td>Commercial Agent 5</td>}
                {visibleColumns.cargo[23] && <td>Subagent 8</td>}
                {visibleColumns.cargo[24] && <td>fashion_user</td>}
                {/* Trip Details */}
                {visibleColumns.cargo[25] && <td>Textile Carrier</td>}
                {visibleColumns.cargo[26] && <td>VY789</td>}
                {visibleColumns.cargo[27] && <td>Dubai</td>}
                {visibleColumns.cargo[28] && <td>Chennai</td>}
                {visibleColumns.cargo[29] && <td>2023-11-15 09:30</td>}
                {visibleColumns.cargo[30] && <td>2023-11-18 11:45</td>}
                {/* Fare Details */}
                {visibleColumns.cargo[31] && <td>$2200</td>}
                {visibleColumns.cargo[32] && <td>$220</td>}
                {visibleColumns.cargo[33] && <td>$150</td>}
                {visibleColumns.cargo[34] && <td>$120</td>}
                {visibleColumns.cargo[35] && <td>$200</td>}
                {visibleColumns.cargo[36] && <td>$180</td>}
                {visibleColumns.cargo[37] && <td>$130</td>}
                {visibleColumns.cargo[38] && <td>$90</td>}
                {visibleColumns.cargo[39] && <td>$2400</td>}
                {visibleColumns.cargo[40] && <td>$2300</td>}
                {visibleColumns.cargo[41] && <td>$2350</td>}
                {visibleColumns.cargo[42] && <td>New Customer</td>}
                <td><button className="action-btn">Action</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Tabs
