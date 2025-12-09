import React from 'react'

const ActionPanel = () => {
  return (
    <>
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
                        style={{ display: "none" }}
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
                          <span className="detail-label">
                            Travel Document No:
                          </span>
                          <span className="detail-value" id="detailTravelDoc">
                            -
                          </span>
                        </div>
                      </div>
                      <div className="detail-box" id="personDetailsBox">
                        <h3 id="personDetailsTitle">
                          <i className="fas fa-user" /> Passenger Details
                        </h3>
                        <div className="detail-row">
                          <span className="detail-label">Name:</span>
                          <span className="detail-value" id="detailName">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Nationality:</span>
                          <span className="detail-value" id="detailNationality">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Passport No:</span>
                          <span className="detail-value" id="detailPassport">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Expiry Date:</span>
                          <span className="detail-value" id="detailExpiry">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Age:</span>
                          <span className="detail-value" id="detailAge">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Gender:</span>
                          <span className="detail-value" id="detailGender">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Email:</span>
                          <span className="detail-value" id="detailEmail">
                            -
                          </span>
                        </div>
                      </div>
                      <div className="detail-box">
                        <h3>
                          <i className="fas fa-building" /> Agent Details
                        </h3>
                        <div className="detail-row">
                          <span className="detail-label">Company:</span>
                          <span className="detail-value" id="detailCompany">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Marine Agent:</span>
                          <span className="detail-value" id="detailMarineAgent">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">
                            Commercial Agent:
                          </span>
                          <span
                            className="detail-value"
                            id="detailCommercialAgent"
                          >
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Subagent:</span>
                          <span className="detail-value" id="detailSubagent">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">User Name:</span>
                          <span className="detail-value" id="detailUserName">
                            -
                          </span>
                        </div>
                      </div>
                      <div className="detail-box">
                        <h3>
                          <i className="fas fa-ship" /> Trip Details
                        </h3>
                        <div className="detail-row">
                          <span className="detail-label">Vessel Name:</span>
                          <span className="detail-value" id="detailVessel">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Voyage No:</span>
                          <span className="detail-value" id="detailVoyage">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">From:</span>
                          <span className="detail-value" id="detailFrom">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">To:</span>
                          <span className="detail-value" id="detailTo">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">ETD:</span>
                          <span className="detail-value" id="detailETD">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">ETA:</span>
                          <span className="detail-value" id="detailETA">
                            -
                          </span>
                        </div>
                      </div>
                      <div className="detail-box">
                        <h3>
                          <i className="fas fa-dollar-sign" /> Fare Details
                        </h3>
                        <div className="detail-row">
                          <span className="detail-label">Basic Price:</span>
                          <span className="detail-value" id="detailBasicPrice">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Tax A:</span>
                          <span className="detail-value" id="detailTaxA">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Tax B:</span>
                          <span className="detail-value" id="detailTaxB">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">
                            Commission Expense:
                          </span>
                          <span className="detail-value" id="detailCommExpense">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">
                            Commission Income:
                          </span>
                          <span className="detail-value" id="detailCommIncome">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Mark up:</span>
                          <span className="detail-value" id="detailMarkup">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Discount:</span>
                          <span className="detail-value" id="detailDiscount">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Refund Charges:</span>
                          <span
                            className="detail-value"
                            id="detailRefundCharges"
                          >
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">
                            Receivable Amount:
                          </span>
                          <span className="detail-value" id="detailReceivable">
                            -
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Net Income:</span>
                          <span className="detail-value" id="detailNetIncome">
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
    </>
  )
}

export default ActionPanel
