// src/pages/AccountingPeriods.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

/**
 * AccountingPeriods.jsx
 * Single-file React conversion of accounting-periods.html (preserves classes/IDs/UI)
 *
 * - Uses Header/Sidebar/PageWrapper (same as your other finance pages)
 * - Keeps all IDs so CSS and any other scripts will still find elements if needed
 * - Theme toggle: NOT handled here (Header should manage it)
 * - Data is kept local (mirrors original demo). Replace with API calls if you want live data.
 *
 * Updated: supports both Create and Manage modes with correct heading text:
 * - Create mode shows "Create New Fiscal Year"
 * - Manage mode shows "Manage Fiscal Year {YEAR}"
 */

const initialChartOfAccounts = [
  { code: "42-00001", description: "Return Earnings" },
  { code: "41-00001", description: "Share Capital" },
  { code: "51-00001", description: "Ticket Basic Price Income" },
  { code: "81-00001", description: "Employment Expenses" },
];

// initial demo fiscal years (copied from the HTML)
const initialFiscalYears = [
  {
    year: 2024,
    reAccount: "42-00001",
    periods: [
      { periodNo: 1, startDate: "2024-01-01", endDate: "2024-01-31", periodType: "Normal", status: "Closed" },
      { periodNo: 2, startDate: "2024-02-01", endDate: "2024-02-29", periodType: "Normal", status: "Closed" },
    ],
  },
  {
    year: 2025,
    reAccount: "42-00001",
    periods: [
      { periodNo: 1, startDate: "2025-01-01", endDate: "2025-01-31", periodType: "Normal", status: "Open" },
    ],
  },
];

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function AccountingPeriods() {
  // app state
  const [chartOfAccounts] = useState(copy(initialChartOfAccounts));
  const [fiscalYears, setFiscalYears] = useState(copy(initialFiscalYears));

  // form / view toggles (keep the same behaviour as original)
  const [showForm, setShowForm] = useState(false);
  // NEW: isCreating flag to decide heading text & initial behaviour
  const [isCreating, setIsCreating] = useState(false);

  // form fields
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedReAccount, setSelectedReAccount] = useState(chartOfAccounts[0]?.code || "");
  const [periodLines, setPeriodLines] = useState([]); // each: { periodNo, startDate, endDate, periodType, status }
  const [yearsList, setYearsList] = useState([]);

  // refs for DOM-like IDs used by other code (keeps parity)
  const periodTableBodyRef = useRef(null);
  const periodDetailsTableBodyRef = useRef(null);
  const noDataMessageRef = useRef(null);

  // when component mounts, populate years and default values
  useEffect(() => {
    const current = new Date().getFullYear();
    const arr = [];
    for (let i = current - 5; i <= current + 5; i++) arr.push(String(i));
    setYearsList(arr);
    setSelectedYear(String(current));
    setSelectedReAccount(chartOfAccounts[0]?.code || "");
  }, [chartOfAccounts]);

  // Derived: whether there is any fiscal year data
  const hasFiscalYears = fiscalYears && fiscalYears.length > 0;

  // Open create form
  const handleOpenCreate = () => {
    setIsCreating(true);
    setShowForm(true);
    // reset form with one empty period line (same behavior as original)
    const cur = String(new Date().getFullYear());
    setSelectedYear(cur);
    setSelectedReAccount(chartOfAccounts[0]?.code || "");
    setPeriodLines([{ periodNo: "", startDate: "", endDate: "", periodType: "Normal", status: "Open" }]);
  };

  // Cancel / close form
  const handleCancel = () => {
    setShowForm(false);
    setIsCreating(false);
    // reset lines if desired:
    setPeriodLines([]);
  };

  // add one period line
  const addPeriodLine = (period = null) => {
    setPeriodLines((prev) => [
      ...prev,
      period || { periodNo: "", startDate: "", endDate: "", periodType: "Normal", status: "Open" },
    ]);
  };

  // remove period line by index
  const removePeriodLine = (idx) => {
    setPeriodLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePeriodLine = (idx, key, value) => {
    setPeriodLines((prev) => prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p)));
  };

  // Save periods (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    // basic validation: all period dates required and start <= end
    for (let i = 0; i < periodLines.length; i++) {
      const p = periodLines[i];
      if (!p.periodNo || !p.startDate || !p.endDate || !p.periodType || !p.status) {
        alert("Please fill all period fields.");
        return;
      }
      if (new Date(p.startDate) > new Date(p.endDate)) {
        alert("End Date cannot be before Start Date for one or more periods.");
        return;
      }
    }

    const yearNum = parseInt(selectedYear, 10);
    const index = fiscalYears.findIndex((y) => y.year === yearNum);
    const newFiscal = {
      year: yearNum,
      reAccount: selectedReAccount,
      periods: periodLines.map((p) => ({
        periodNo: Number(p.periodNo),
        startDate: p.startDate,
        endDate: p.endDate,
        periodType: p.periodType,
        status: p.status,
      })),
    };

    setFiscalYears((prev) => {
      const copyPrev = copy(prev);
      if (index > -1) {
        // update existing
        copyPrev[index].periods = newFiscal.periods;
        copyPrev[index].reAccount = newFiscal.reAccount;
      } else {
        // create new (push at end same as original pushing behavior)
        copyPrev.push(newFiscal);
        // keep sorted by year descending for nicer UX
        copyPrev.sort((a, b) => b.year - a.year);
      }
      return copyPrev;
    });

    // after save, close form and reset create flag
    setShowForm(false);
    setIsCreating(false);
    setPeriodLines([]);
  };

  // View details for a fiscal year (populate form with existing periods and show form)
  const handleViewDetails = (year) => {
    setIsCreating(false); // view/edit mode
    const y = fiscalYears.find((f) => f.year === year);
    if (!y) return;
    setSelectedYear(String(y.year));
    setSelectedReAccount(y.reAccount || (chartOfAccounts[0] && chartOfAccounts[0].code));
    setPeriodLines((y.periods || []).map((p) => ({ ...p })));
    setShowForm(true);
  };

  // Close year (set each period status to Closed)
  const handleCloseYear = () => {
    const yearNum = parseInt(selectedYear, 10);
    if (!window.confirm(`Are you sure you want to close fiscal year ${yearNum}? This action cannot be undone.`)) return;
    setFiscalYears((prev) =>
      prev.map((y) => (y.year === yearNum ? { ...y, periods: y.periods.map((p) => ({ ...p, status: "Closed" })) } : y))
    );
    alert(`Fiscal year ${yearNum} has been closed.`);
    setShowForm(false);
    setIsCreating(false);
    setPeriodLines([]);
  };

  // Small helper to render status badge classes like original
  const statusBadgeClass = (status) => (status === "Open" ? "badge text-bg-success" : "badge text-bg-danger");

  // UI: render
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <div className="d-flex justify-content-between align-items-center mb-4 w-100">
                <h5>Accounting Periods</h5>
                {!showForm ? (
                  <div className="d-flex gap-3">
                    <button id="addNewBtn" className="btn btn-turquoise fw-medium btn-hover-transform" onClick={handleOpenCreate}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-1" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create New Year
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* List View */}
          {!showForm && (
            <div id="listViewContainer">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card-table card p-3">
                    <div className="card-body">
                      <div id="periodTableContainer" className="table-container rounded-3 shadow">
                        <div className="table-responsive">
                          <table className="table table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="px-4 py-3 text-start fw-semibold">Fiscal Year</th>
                                <th className="px-4 py-3 text-start fw-semibold">Status</th>
                                <th className="px-4 py-3 text-center fw-semibold">Actions</th>
                              </tr>
                            </thead>
                            <tbody id="periodTableBody" ref={periodTableBodyRef}>
                              {!hasFiscalYears ? (
                                <tr>
                                  <td colSpan="3" className="text-center">
                                    No fiscal years have been created yet.
                                  </td>
                                </tr>
                              ) : (
                                fiscalYears.map((y) => {
                                  const hasOpen = (y.periods || []).some((p) => p.status === "Open");
                                  const yrStatus = hasOpen ? "Open" : "Closed";
                                  return (
                                    <tr className="hover:bg-gray-50 transition-colors duration-150" key={y.year}>
                                      <td className="px-4 py-3 text-nowrap">{y.year}</td>
                                      <td className="px-4 py-3 text-nowrap">
                                        <span className={yrStatus === "Open" ? "badge text-bg-success" : "badge text-bg-danger"}>{yrStatus}</span>
                                      </td>
                                      <td className="px-4 py-3 text-nowrap text-center">
                                        <button className="view-details-btn btn btn-primary btn-sm" onClick={() => handleViewDetails(y.year)}>
                                          View Details
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!hasFiscalYears && (
                <div id="noDataMessage" ref={noDataMessageRef} className="text-center text-secondary mt-4">
                  <p>No fiscal years have been created yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Form View */}
          {showForm && (
            <div id="formViewContainer">
              <div className="d-flex justify-content-between align-items-center mb-4">
                {/* Heading: show Create or Manage based on isCreating flag */}
                <h5 className="card-title mb-3">{isCreating ? "Create New Fiscal Year" : `Manage Fiscal Year ${selectedYear}`}</h5>
                {/* keep only this single Cancel button inside the form */}
                <button id="cancelBtnTop" className="btn btn-secondary fw-medium btn-hover-transform" onClick={handleCancel}>
                  Cancel
                </button>
              </div>

              <form id="periodForm" onSubmit={handleSubmit}>
                <div className="form-section mb-4">
                  <label className="form-label">Fiscal Year Header</label>
                  <div className="row g-4">
                    <div className="col-md">
                      <label htmlFor="fiscalYear" className="form-label mb-1">
                        Fiscal Year
                      </label>
                      <select id="fiscalYear" required className="form-select shadow-sm focus-ring" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {yearsList.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md">
                      <label htmlFor="retainedEarningsAccount" className="form-label mb-1">
                        Return Earning Account
                      </label>
                      <select id="retainedEarningsAccount" required className="form-select shadow-sm focus-ring" value={selectedReAccount} onChange={(e) => setSelectedReAccount(e.target.value)}>
                        {chartOfAccounts.map((a) => (
                          <option key={a.code} value={a.code}>
                            {a.code} - {a.description}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button id="closeYearBtn" type="button" className="btn btn-danger fw-medium btn-hover-transform" onClick={handleCloseYear}>
                      Close Fiscal Year &amp; Transfer Balances
                    </button>
                  </div>
                </div>

                <div className="form-section mb-4">
                  <h2 className="fs-5 mb-4">Period Details</h2>

                  <div className="table-container rounded-3 border border-light-subtle">
                    <table className="table table-striped mb-0">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-start fw-semibold">Period No</th>
                          <th className="px-4 py-3 text-start fw-semibold">Start Date</th>
                          <th className="px-4 py-3 text-start fw-semibold">End Date</th>
                          <th className="px-4 py-3 text-start fw-semibold">Type</th>
                          <th className="px-4 py-3 text-start fw-semibold">Status</th>
                          <th className="px-4 py-3 text-center fw-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody id="periodDetailsTableBody" ref={periodDetailsTableBodyRef} className="text-sm text-secondary">
                        {periodLines.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center">
                              No periods added yet.
                            </td>
                          </tr>
                        ) : (
                          periodLines.map((p, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-3 text-nowrap">
                                <input
                                  type="number"
                                  name="periodNo"
                                  value={p.periodNo}
                                  required
                                  min="1"
                                  className="form-control form-control-sm"
                                  onChange={(e) => updatePeriodLine(idx, "periodNo", e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3 text-nowrap">
                                <input
                                  type="date"
                                  name="startDate"
                                  value={p.startDate}
                                  required
                                  className="form-control form-control-sm"
                                  onChange={(e) => updatePeriodLine(idx, "startDate", e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3 text-nowrap">
                                <input
                                  type="date"
                                  name="endDate"
                                  value={p.endDate}
                                  required
                                  className="form-control form-control-sm"
                                  onChange={(e) => updatePeriodLine(idx, "endDate", e.target.value)}
                                />
                              </td>
                              <td className="px-4 py-3 text-nowrap">
                                <select name="periodType" required className="form-select form-select-sm" value={p.periodType} onChange={(e) => updatePeriodLine(idx, "periodType", e.target.value)}>
                                  <option value="Normal">Normal</option>
                                  <option value="Closing">Closing</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-nowrap">
                                <select name="status" required className="form-select form-select-sm" value={p.status} onChange={(e) => updatePeriodLine(idx, "status", e.target.value)}>
                                  <option value="Open">Open</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-nowrap text-center">
                                <button type="button" className="remove-btn btn btn-link text-danger p-0" onClick={() => removePeriodLine(idx)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 d-flex justify-content-end">
                    <button id="addPeriodLineBtn" type="button" className="btn btn-link fw-medium text-decoration-none p-0" onClick={() => addPeriodLine(null)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-1" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Period Line
                    </button>
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button type="submit" className="btn btn-turquoise fw-medium btn-hover-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-1" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                      <path d="M7.707 10.293a1 1 0 010-1.414L9.586 7.5a1 1 0 011.414 0l2.828 2.828a1 1 0 01-1.414 1.414L10 9.414l-1.879 1.879a1 1 0 01-1.414 0z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" clipRule="evenodd" />
                    </svg>
                    Save Periods
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}
