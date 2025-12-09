import React, { useState } from 'react'
import Header from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { PageWrapper } from '../components/layout/PageWrapper'
import ActionPanel from '../components/booking/ActionPanel'
import Tabs from '../components/booking/Tabs'

const BookingAndTicketsPage = () => {
  // <-- ADDED: activeTab state
  const [activeTab, setActiveTab] = useState('passenger')

  return (
    <>
      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Header */}
        <Header />
        {/* /Header */}
        {/* Sidebar */}
        <Sidebar />
        {/* /Sidebar */}
        {/* Page Wrapper */}
        <PageWrapper>
          <div className="content container-fluid">
            <style
              dangerouslySetInnerHTML={{
                __html:
                  '\n                    .theme-toggle-container {\n            position: absolute;\n            top: 20px;\n            right: 20px;\n            z-index: 100;\n        }\n        \n        #themeToggle {\n            background: none;\n            border: none;\n            color: white;\n            font-size: 1.5rem;\n            cursor: pointer;\n            transition: color 0.3s;\n        }\n\n        #themeToggle:hover {\n            color: #f0f0f0;\n        }\n\n        .tabs-container {\n            margin-top: 30px;\n           \n            border-radius: 8px;\n          \n            overflow: hidden;\n        }\n\n        .tabs-header {\n            display: flex;\n            background-color: #f8f9fa;\n            border-bottom: 1px solid #dee2e6;\n        }\n\n        \n\n        .tab-button.active::after {\n            content: \'\';\n            position: absolute;\n            bottom: 0;\n            left: 0;\n            width: 100%;\n            height: 3px;\n            background-color: #00cdc6;\n        }\n\n        .tab-content {\n            padding: 20px;\n            display: none;\n        }\n\n        .tab-content.active {\n            display: block;\n        }\n\n        .table-container {\n            overflow-x: auto;\n            margin-top: 20px;\n        }\n\n        table {\n            width: 100%;\n            border-collapse: collapse;\n            background-color: white;\n        }\n\n        th, td {\n            padding: 12px 15px;\n            text-align: left;\n            border-bottom: 1px solid #dee2e6;\n        }\n\n        th {\n            background-color: #f8f9fa;\n            font-weight: 600;\n            color: #495057;\n            position: sticky;\n            top: 0;\n        }\n\n        tr:hover {\n            background-color: #f8f9fa;\n        }\n\n        .action-btn {\n            background-color: #00cdc6;\n            color: white;\n            border: none;\n            padding: 8px 12px;\n            border-radius: 4px;\n            cursor: pointer;\n            font-size: 0.9rem;\n            transition: background-color 0.3s;\n        }\n\n        .action-btn:hover {\n            background-color: #0b5ed7;\n        }\n\n        .search-container {\n            margin-bottom: 20px;\n            display: flex;\n            gap: 10px;\n        }\n\n        .search-input {\n            flex: 1;\n            padding: 10px 15px;\n            border: 1px solid #435d7c;\n            border-radius: 4px;\n            font-size: 1rem;\n        }\n\n        .search-btn {\n            background: linear-gradient(90deg, #00B5AD, #00D2CB) !important;\n            color: white;\n            border: none;\n            padding: 10px 15px;\n            border-radius: 4px;\n            cursor: pointer;\n            font-size: 1rem;\n        }\n\n        .search-btn:hover {\n            background-color: #0b5ed7;\n        }\n\n        .status-badge {\n            display: inline-block;\n            padding: 4px 8px;\n            border-radius: 12px;\n            font-size: 0.8rem;\n            font-weight: 600;\n        }\n\n        .status-confirmed {\n            background-color: #d1e7dd;\n            color: #0f5132;\n        }\n\n        .status-pending {\n            background-color: #fff3cd;\n            color: #664d03;\n        }\n\n        .status-cancelled {\n            background-color: #f8d7da;\n            color: #842029;\n        }\n\n        /* Action Page Styles */\n        .action-page {\n            display: none;\n          \n            border-radius: 8px;\n            \n            padding: 20px;\n            margin-top: 20px;\n        }\n\n        .action-page.active {\n            display: block;\n        }\n\n        .action-page-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 20px;\n            padding-bottom: 15px;\n            border-bottom: 1px solid #dee2e6;\n        }\n\n        .action-page-header h2 {\n            font-size: 1.8rem;\n            color: #2c3e50;\n        }\n\n        .back-btn {\n                background: linear-gradient(90deg, #00B5AD, #00D2CB) !important;\n            color: white;\n            border: none;\n            padding: 10px 15px;\n            border-radius: 4px;\n            cursor: pointer;\n            font-size: 1rem;\n            display: flex;\n            align-items: center;\n            gap: 8px;\n        }\n\n        .back-btn:hover {\n            background-color: #5a6268;\n        }\n\n        .action-grid {\n            display: grid;\n            grid-template-columns: 1fr 2fr;\n            gap: 30px;\n        }\n\n        .action-left-column {\n            background-color: #f8f9fa;\n            padding: 20px;\n            border-radius: 8px;\n            height: fit-content;\n        }\n\n        .action-right-column {\n            display: grid;\n            grid-template-columns: repeat(2, 1fr);\n            gap: 20px;\n        }\n\n        .detail-box {\n            background-color: #f8f9fa;\n            border-radius: 8px;\n            padding: 20px;\n            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);\n        }\n\n        .detail-box h3 {\n            font-size: 1.2rem;\n            margin-bottom: 15px;\n            color: #2c3e50;\n            border-bottom: 1px solid #dee2e6;\n            padding-bottom: 8px;\n        }\n\n        .detail-row {\n            display: flex;\n            margin-bottom: 10px;\n        }\n\n        .detail-label {\n            font-weight: 600;\n            width: 150px;\n            color: #495057;\n        }\n\n        .detail-value {\n            flex: 1;\n            color: #212529;\n        }\n\n        .rules-box {\n            background-color: white;\n            border: 1px solid #dee2e6;\n            border-radius: 8px;\n            padding: 20px;\n            margin-bottom: 25px;\n        }\n\n        .rules-box h3 {\n            font-size: 1.2rem;\n            margin-bottom: 15px;\n            color: #2c3e50;\n            border-bottom: 1px solid #dee2e6;\n            padding-bottom: 8px;\n        }\n\n        .rule-item {\n            margin-bottom: 12px;\n            padding-bottom: 12px;\n            border-bottom: 1px dashed #dee2e6;\n        }\n\n        .rule-item:last-child {\n            border-bottom: none;\n            margin-bottom: 0;\n            padding-bottom: 0;\n        }\n\n        .rule-label {\n            font-weight: 600;\n            color: #495057;\n            display: block;\n            margin-bottom: 5px;\n        }\n\n        .rule-value {\n            color: #212529;\n        }\n\n        .action-selection {\n            margin-bottom: 25px;\n        }\n\n        .action-selection h3 {\n            font-size: 1.2rem;\n            margin-bottom: 15px;\n            color: #2c3e50;\n        }\n\n        .action-options {\n            display: grid;\n            grid-template-columns: repeat(2, 1fr);\n            gap: 15px;\n        }\n\n        .action-option {\n            display: flex;\n            align-items: center;\n            padding: 12px;\n            border: 1px solid #dee2e6;\n            border-radius: 6px;\n            cursor: pointer;\n            transition: all 0.3s;\n        }\n\n        .action-option:hover {\n            background-color: #f8f9fa;\n            border-color: #00cdc6;\n        }\n\n        .action-option input[type="radio"] {\n            margin-right: 10px;\n        }\n\n        .action-option.selected {\n            background-color: #e7f1ff;\n            border-color: #00cdc6;\n        }\n\n        .cost-display {\n            background-color: #e7f1ff;\n            border: 1px solid #b8daff;\n            border-radius: 8px;\n            padding: 20px;\n            margin-top: 20px;\n        }\n\n        .cost-display h3 {\n            font-size: 1.2rem;\n            margin-bottom: 15px;\n            color: #0c63e4;\n        }\n\n        .cost-item {\n            display: flex;\n            justify-content: space-between;\n            margin-bottom: 10px;\n            padding-bottom: 10px;\n            border-bottom: 1px dashed #b8daff;\n        }\n\n        .cost-item:last-child {\n            border-bottom: none;\n            margin-bottom: 0;\n            padding-bottom: 0;\n            font-weight: 700;\n            font-size: 1.1rem;\n        }\n\n        .cost-label {\n            color: #495057;\n        }\n\n        .cost-value {\n            color: #0c63e4;\n            font-weight: 600;\n        }\n\n        .section-title {\n            font-size: 1.2rem;\n            font-weight: 600;\n            margin: 20px 0 10px;\n            color: #495057;\n            border-bottom: 1px solid #dee2e6;\n            padding-bottom: 8px;\n        }\n\n        .confirm-btn-container {\n            margin-top: 30px;\n            text-align: center;\n        }\n\n        .confirm-btn {\n            background-color: #198754;\n            color: white;\n            border: none;\n            padding: 12px 30px;\n            border-radius: 6px;\n            cursor: pointer;\n            font-size: 1.1rem;\n            font-weight: 600;\n            transition: background-color 0.3s;\n        }\n\n        .confirm-btn:hover {\n            background-color: #157347;\n        }\n\n        .confirm-btn:disabled {\n            background-color: #6c757d;\n            cursor: not-allowed;\n        }\n\n        .notification {\n            position: fixed;\n            top: 20px;\n            right: 20px;\n            padding: 15px 25px;\n            background-color: #198754;\n            color: white;\n            border-radius: 6px;\n            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n            display: none;\n            z-index: 1000;\n            animation: slideIn 0.3s ease;\n        }\n\n        @keyframes slideIn {\n            from {\n                transform: translateX(100%);\n                opacity: 0;\n            }\n\n            to {\n                transform: translateX(0);\n                opacity: 1;\n            }\n        }\n\n        .deductible {\n            color: #dc3545;\n        }\n\n        /* Column Visibility Toggle Styles */\n        .column-visibility-container {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 15px;\n        }\n\n        .column-visibility-btn {\n               background: linear-gradient(90deg, #00B5AD, #00D2CB) !important;\n            color: white;\n            border: none;\n            padding: 8px 12px;\n            border-radius: 4px;\n            cursor: pointer;\n            font-size: 0.9rem;\n            display: flex;\n            align-items: center;\n            gap: 6px;\n            transition: background-color 0.3s;\n        }\n\n        .column-visibility-btn:hover {\n            background-color: #5a6268;\n        }\n\n        .column-visibility-dropdown {\n            position: relative;\n            display: inline-block;\n        }\n\n        .column-visibility-content {\n            display: none;\n            position: absolute;\n            background-color: white;\n            min-width: 250px;\n            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);\n            z-index: 100;\n            border-radius: 6px;\n            padding: 10px 0;\n            right: 0;\n            top: 100%;\n            margin-top: 5px;\n            max-height: 400px;\n            overflow-y: auto;\n        }\n\n        .column-visibility-content.show {\n            display: block;\n        }\n\n        .column-visibility-item {\n            padding: 8px 15px;\n            cursor: pointer;\n            display: flex;\n            align-items: center;\n            gap: 10px;\n        }\n\n        .column-visibility-item:hover {\n            background-color: #f8f9fa;\n        }\n\n        .column-visibility-item input[type="checkbox"] {\n            margin: 0;\n        }\n\n        .column-visibility-divider {\n            height: 1px;\n            background-color: #dee2e6;\n            margin: 8px 0;\n        }\n\n        .column-visibility-title {\n            padding: 8px 15px;\n            font-weight: 600;\n            color: #495057;\n            font-size: 0.9rem;\n        }\n\n        .column-visibility-actions {\n            display: flex;\n            justify-content: space-between;\n            padding: 8px 15px;\n            border-top: 1px solid #dee2e6;\n            margin-top: 8px;\n        }\n\n        .column-visibility-action-btn {\n            background: none;\n            border: none;\n            color: #00cdc6;\n            cursor: pointer;\n            font-size: 0.85rem;\n            padding: 4px 8px;\n            border-radius: 4px;\n        }\n\n        .column-visibility-action-btn:hover {\n            background-color: #e7f1ff;\n        }\n\n        .hidden-column {\n            display: none;\n        }\n\n        /* Dark Theme Styles */\n        html[data-theme="dark"] body {\n            background-color: #002b5c;\n            color: #fff;\n        }\n\n        html[data-theme="dark"] header {\n            background-color: #002b5c;\n            box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);\n        }\n\n        html[data-theme="dark"] .tabs-container {\n            background-color: #002b5c;\n           \n        }\n\n        html[data-theme="dark"] .tabs-header {\n            background-color: #002b5c;\n            border-bottom: 1px solid #444444;\n        }\n\n        html[data-theme="dark"] table {\n            background-color: #002b5c;\n        }\n\n        html[data-theme="dark"] th,\n        html[data-theme="dark"] td {\n            border-bottom: 1px solid #444444;\n        }\n\n        html[data-theme="dark"] th {\n            background-color: #002b5c;\n            color: #e0e0e0;\n        }\n\n        html[data-theme="dark"] tr:hover {\n            background-color: #002b5c;\n        }\n\n        html[data-theme="dark"] .search-input {\n            background-color: #002b5c;\n                border-color: var(--text-border);\n            color: #fff;\n        }\n        \n        html[data-theme="dark"] .column-visibility-content {\n            background-color: #002b5c;\n            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);\n        }\n\n        html[data-theme="dark"] .column-visibility-content label,\n        html[data-theme="dark"] .column-visibility-content .column-visibility-title {\n            color: #fff;\n        }\n\n        html[data-theme="dark"] .column-visibility-item:hover {\n            background-color: #002b5c;\n        }\n\n        html[data-theme="dark"] .column-visibility-divider {\n            background-color: #444444;\n        }\n\n        html[data-theme="dark"] .column-visibility-actions {\n            border-top: 1px solid #444444;\n        }\n\n        html[data-theme="dark"] .column-visibility-action-btn:hover {\n            background-color: #002b5c;\n        }\n        \n        html[data-theme="dark"] .action-left-column,\n        html[data-theme="dark"] .detail-box {\n            background-color: #002b5c;\n            box-shadow: 0 2px 5px rgba(255, 255, 255, 0.05);\n        }\n\n        html[data-theme="dark"] .action-page,\n        html[data-theme="dark"] .rules-box,\n        html[data-theme="dark"] .column-visibility-content {\n            background-color: #002b5c;\n                border-color: var(--text-border);\n            box-shadow: 0 2px 15px rgba(255, 255, 255, 0.05);\n        }\n        \n        html[data-theme="dark"] .action-page-header h2,\n        html[data-theme="dark"] .detail-box h3,\n        html[data-theme="dark"] .rules-box h3,\n        html[data-theme="dark"] .action-selection h3,\n        html[data-theme="dark"] .section-title {\n            color: #fff;\n            border-bottom-color: #444444;\n        }\n\n        html[data-theme="dark"] .detail-label,\n        html[data-theme="dark"] .rule-label,\n        html[data-theme="dark"] .cost-label {\n            color: #fff;\n        }\n\n        html[data-theme="dark"] .detail-value,\n        html[data-theme="dark"] .rule-value {\n            color: #fff;\n        }\n\n        html[data-theme="dark"] .rule-item {\n            border-bottom: 1px dashed #444444;\n        }\n\n        html[data-theme="dark"] .action-option {\n               border-color: var(--text-border);\n        }\n\n        html[data-theme="dark"] .action-option:hover {\n            background-color: #002b5c;\n            border-color: #90caf9;\n        }\n\n        html[data-theme="dark"] .action-option.selected {\n            background-color: #334e68;\n            border-color: #90caf9;\n        }\n\n        html[data-theme="dark"] .cost-display {\n            background-color: #334e68;\n            border-color: #4a6681;\n        }\n        \n        html[data-theme="dark"] .cost-display h3 {\n            color: #90caf9;\n        }\n\n        html[data-theme="dark"] .cost-item {\n            border-bottom-color: #4a6681;\n        }\n\n        html[data-theme="dark"] .cost-value {\n            color: #90caf9;\n        }\n               ',
              }}
            />
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Bookings &amp; Ticket</h5>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-3">
                  <div className="card-body">
                    <div className="tabs-container">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <button
                            // <-- ADDED: active class controlled by state & onClick
                            className={`nav-link tab-button ${activeTab === 'passenger' ? 'active' : ''}`}
                            onClick={() => setActiveTab('passenger')}
                            type="button"
                          >
                            <i className="fas fa-user" /> Passenger
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link tab-button ${activeTab === 'vehicles' ? 'active' : ''}`}
                            onClick={() => setActiveTab('vehicles')}
                            type="button"
                          >
                            <i className="fas fa-car" /> Vehicles
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link tab-button ${activeTab === 'cargo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cargo')}
                            type="button"
                          >
                            <i className="fas fa-box" /> Cargo
                          </button>
                        </li>
                      </ul>

                      {/* PASS activeTab down to Tabs component */}
                      <Tabs activeTab={activeTab} />
                    </div>

                    {/* Action Page */}
                    <ActionPanel />
                    {/* Action Page */}
                    <div id="actionPage" className="action-page">
                      <div className="action-page-header">
                        <h2>Ticket Action Processing</h2>
                        <button className="back-btn" id="backBtn">
                          <i className="fas fa-arrow-left" /> Back to List
                        </button>
                      </div>
                      <div className="action-grid">
                        <div className="action-left-column">
                          <div className="rules-box">
                            <h3>
                              <i className="fas fa-clipboard-list" /> Ticket Rules
                            </h3>
                            <div className="rule-item">
                              <span className="rule-label">Allowed Weight:</span>
                              <span className="rule-value" id="ruleAllowedWeight">
                                -
                              </span>
                            </div>
                            <div className="rule-item">
                              <span className="rule-label">Allowed Pieces:</span>
                              <span className="rule-value" id="ruleAllowedPieces">
                                -
                              </span>
                            </div>
                            <div className="rule-item">
                              <span className="rule-label">Void Rules:</span>
                              <span className="rule-value" id="ruleVoid">
                                Allowed up to 24 hours before departure. 25%
                                cancellation fee applies.
                              </span>
                            </div>
                            <div className="rule-item">
                              <span className="rule-label">Refund Rules:</span>
                              <span className="rule-value" id="ruleRefund">
                                Full refund if cancelled 48+ hours before departure.
                                50% refund if 24-48 hours. No refund within 24
                                hours.
                              </span>
                            </div>
                            <div className="rule-item">
                              <span className="rule-label">Reissue Rules:</span>
                              <span className="rule-value" id="ruleReissue">
                                Allowed up to 6 hours before departure. $50 reissue
                                fee plus any fare difference.
                              </span>
                            </div>
                            <div className="rule-item">
                              <span className="rule-label">No Show Rules:</span>
                              <span className="rule-value" id="ruleNoShow">
                                No refund allowed. 100% fare forfeiture. Special
                                consideration for medical emergencies with
                                documentation.
                              </span>
                            </div>
                          </div>
                          <div className="action-selection">
                            <h3>
                              <i className="fas fa-tasks" /> Select Action
                            </h3>
                            <div className="action-options">
                              <div className="action-option" data-action="void">
                                <input
                                  type="radio"
                                  name="action"
                                  id="void"
                                  defaultValue="void"
                                />
                                <label htmlFor="void">
                                  <i className="fas fa-ban" /> Void
                                </label>
                              </div>
                              <div className="action-option" data-action="refund">
                                <input
                                  type="radio"
                                  name="action"
                                  id="refund"
                                  defaultValue="refund"
                                />
                                <label htmlFor="refund">
                                  <i className="fas fa-money-bill-wave" /> Refund
                                </label>
                              </div>
                              <div className="action-option" data-action="reissue">
                                <input
                                  type="radio"
                                  name="action"
                                  id="reissue"
                                  defaultValue="reissue"
                                />
                                <label htmlFor="reissue">
                                  <i className="fas fa-redo" /> Reissue
                                </label>
                              </div>
                              <div className="action-option" data-action="noshow">
                                <input
                                  type="radio"
                                  name="action"
                                  id="noshow"
                                  defaultValue="noshow"
                                />
                                <label htmlFor="noshow">
                                  <i className="fas fa-user-slash" /> No Show
                                </label>
                              </div>
                            </div>
                          </div>
                          <div
                            className="cost-display"
                            id="costDisplay"
                            style={{ display: 'none' }}
                          >
                            <h3>
                              <i className="fas fa-calculator" /> Expected Cost
                            </h3>
                            <div className="cost-item">
                              <span className="cost-label">Basic Fare:</span>
                              <span className="cost-value" id="costBasic">
                                -
                              </span>
                            </div>
                            <div className="cost-item">
                              <span className="cost-label">Taxes:</span>
                              <span className="cost-value" id="costTaxes">
                                -
                              </span>
                            </div>
                            <div className="cost-item">
                              <span className="cost-label">Less: Commission:</span>
                              <span
                                className="cost-value deductible"
                                id="costCommission"
                              >
                                -
                              </span>
                            </div>
                            <div className="cost-item">
                              <span className="cost-label">Less: Promotion:</span>
                              <span
                                className="cost-value deductible"
                                id="costPromotion"
                              >
                                -
                              </span>
                            </div>
                            <div className="cost-item">
                              <span className="cost-label">
                                Total Ticket Value:
                              </span>
                              <span className="cost-value" id="costTotalValue">
                                -
                              </span>
                            </div>
                            <div className="cost-item">
                              <span className="cost-label" id="feeLabel">
                                Fees:
                              </span>
                              <span className="cost-value" id="costFees">
                                -
                              </span>
                            </div>
                            <div className="cost-item">
                              <span className="cost-label" id="totalLabel">
                                Total Refund/Payable:
                              </span>
                              <span className="cost-value" id="costTotal">
                                -
                              </span>
                            </div>
                          </div>
                          <div className="confirm-btn-container">
                            <button
                              className="confirm-btn"
                              id="confirmBtn"
                              disabled=""
                            >
                              <i className="fas fa-check" /> Confirm
                            </button>
                          </div>
                        </div>
                        <div className="action-right-column">
                          <div className="detail-box">
                            <h3>
                              <i className="fas fa-ticket-alt" /> Ticket Details
                            </h3>
                            <div className="detail-row">
                              <span className="detail-label">Ticket No:</span>
                              <span className="detail-value" id="detailTicketNo">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Cabin:</span>
                              <span className="detail-value" id="detailCabin">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Ticket Type:</span>
                              <span className="detail-value" id="detailTicketType">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Service Type:</span>
                              <span className="detail-value" id="detailServiceType">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Visa Type:</span>
                              <span className="detail-value" id="detailVisaType">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Allowed Weight:</span>
                              <span
                                className="detail-value"
                                id="detailAllowedWeight"
                              >
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Status:</span>
                              <span className="detail-value" id="detailStatus">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Payable Amount:</span>
                              <span className="detail-value" id="detailPayable">
                                -
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Promotion:</span>
                              <span className="detail-value" id="detailPromotion">
                                -
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </PageWrapper>
      </div>
      {/* /Page Wrapper */}
      <div className="notification" id="notification" />
      {/* Bootstrap Core JS */}
      {/* Datatable JS */}
      {/* select CSS */}
      {/* Slimscroll JS */}
      {/* Datepicker Core JS */}
      {/* multiselect JS */}
      {/* Theme Settings JS */}
      {/* Custom JS */}
    </>
  )
}

export default BookingAndTicketsPage
