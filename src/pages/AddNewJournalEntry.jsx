import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

/**
 * AddNewJournalEntry.jsx
 * - Form implemented in React
 * - Add/remove journal rows, totals & balance calculation
 * - Preserves original classes/IDs for CSS compatibility
 */

const initialRow = {
  ledger: "Select L",
  ledgerDesc: "",
  debit: 0,
  credit: 0,
  note: "",
  currency: "USD",
  amountCurrency: 0,
  rate: 1,
};

export default function AddNewJournalEntry() {
  const [date, setDate] = useState("2025-09-18");
  const [journalNo, setJournalNo] = useState("");
  const [layer, setLayer] = useState("");
  const [partner, setPartner] = useState("");
  const [docRef, setDocRef] = useState("");
  const [voyageNo, setVoyageNo] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [rows, setRows] = useState([{ ...initialRow }]);

  // Theme toggle parity with original
  useEffect(() => {
    const themeToggle = document.getElementById("themeToggle");
    const html = document.documentElement;
    const handler = () => {
      if (!themeToggle) return;
      if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    };
    if (themeToggle) {
      if (localStorage.getItem("theme") === "dark") {
        html.setAttribute("data-theme", "dark");
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
      themeToggle.addEventListener("click", handler);
    }
    return () => {
      if (themeToggle) themeToggle.removeEventListener("click", handler);
    };
  }, []);

  // Derive totals
  const totals = rows.reduce(
    (acc, r) => {
      acc.debit += Number(r.debit || 0);
      acc.credit += Number(r.credit || 0);
      return acc;
    },
    { debit: 0, credit: 0 }
  );

  const isBalanced = Number(totals.debit.toFixed(2)) === Number(totals.credit.toFixed(2));

  const addRow = () => setRows((prev) => [...prev, { ...initialRow }]);

  const removeRow = (index) => setRows((prev) => prev.filter((_, i) => i !== index));

  const updateRow = (index, key, value) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="mb-3">
            <Link to="/company/finance/journal-entries" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Journal Entry</h5>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Journal No</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., JV-001"
                        value={journalNo}
                        onChange={(e) => setJournalNo(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Layer</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Layer"
                        value={layer}
                        onChange={(e) => setLayer(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Partner</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Partner"
                        value={partner}
                        onChange={(e) => setPartner(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Doc-Reference</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Document Reference"
                        value={docRef}
                        onChange={(e) => setDocRef(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Voyage No</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Voyage No"
                        value={voyageNo}
                        onChange={(e) => setVoyageNo(e.target.value)}
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Service Type</label>
                      <select
                        className="form-select"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                      >
                        <option value="">Select Service Type</option>
                        <option>Freight</option>
                        <option>Logistics</option>
                        <option>Services</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="fw-bold">Journal Lines</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle" id="journalTable">
                        <thead>
                          <tr>
                            <th>Ledger Code</th>
                            <th>Ledger Desc</th>
                            <th>Debit</th>
                            <th>Credit</th>
                            <th>Note</th>
                            <th>Currency</th>
                            <th>Amount Currency</th>
                            <th>Rate</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r, idx) => (
                            <tr key={idx}>
                              <td>
                                <select
                                  className="form-select"
                                  value={r.ledger}
                                  onChange={(e) => updateRow(idx, "ledger", e.target.value)}
                                >
                                  <option>Select L</option>
                                  <option>1001 - Sales</option>
                                  <option>2002 - Expenses</option>
                                  <option>3003 - Bank</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Ledger Desc"
                                  value={r.ledgerDesc}
                                  onChange={(e) => updateRow(idx, "ledgerDesc", e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control debit"
                                  value={r.debit}
                                  onChange={(e) => updateRow(idx, "debit", Number(e.target.value || 0))}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control credit"
                                  value={r.credit}
                                  onChange={(e) => updateRow(idx, "credit", Number(e.target.value || 0))}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Note"
                                  value={r.note}
                                  onChange={(e) => updateRow(idx, "note", e.target.value)}
                                />
                              </td>
                              <td>
                                <select
                                  className="form-select"
                                  value={r.currency}
                                  onChange={(e) => updateRow(idx, "currency", e.target.value)}
                                >
                                  <option>USD</option>
                                  <option>EUR</option>
                                  <option>INR</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={r.amountCurrency}
                                  onChange={(e) => updateRow(idx, "amountCurrency", Number(e.target.value || 0))}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={r.rate}
                                  onChange={(e) => updateRow(idx, "rate", Number(e.target.value || 0))}
                                />
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-danger btn-sm remove-row"
                                  type="button"
                                  onClick={() => removeRow(idx)}
                                >
                                  🗑
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <button className="btn btn-primary btn-sm" id="addRow" type="button" onClick={addRow}>
                      Add Row
                    </button>

                    <div className="mt-3 text-end">
                      <span className="me-3 text-success">
                        Total Debit: <span id="totalDebit">{totals.debit.toFixed(2)}</span>
                      </span>
                      <span className="text-danger">
                        Total Credit: <span id="totalCredit">{totals.credit.toFixed(2)}</span>
                      </span>
                      <div
                        className={`balance-msg mt-2 text-center ${isBalanced ? "text-success" : "text-danger"}`}
                        id="balanceMsg"
                      >
                        {isBalanced ? "Journal is balanced." : "Journal is not balanced!"}
                      </div>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button className="btn btn-turquoise" type="button">
                      Confirm Journal Entry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
