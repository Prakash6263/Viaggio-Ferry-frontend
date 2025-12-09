import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

/**
 * GeneralLedger.jsx
 * - React implementation of general-ledger.html
 * - Preserves original classes / ids (searchInput, dateFilterType, monthFilter, yearFilter, startDateFilter, endDateFilter, generalLedgerTableBody, totalDebit, totalCredit, endBalance, noDataMessage)
 * - No themeToggle listeners here (Header must manage theme)
 * - Refresh and export buttons implemented
 * - Replace sampleData/journalEntries with API fetch when ready
 */

const ledgerAccounts = {
  "11-00001": { description: "Ships & Associated Eqipments" },
  "11-00002": { description: "Loading & Offloading Equipments" },
  "12-00001": { description: "IT Equipments" },
  "12-00002": { description: "Furniture" },
  "12-00003": { description: "Office Equpments" },
  "13-00001": { description: "Heavy Vehicles" },
  "13-00002": { description: "Light Vehicles" },
  "21-00001": { description: "BOK Bank 12345" },
  "21-00002": { description: "BOK Bank56541" },
  "21-00003": { description: "Cash safe HQ" },
  "22-00001": { description: "Sabihat" },
  "22-00002": { description: "Nour" },
  "23-00001": { description: "Salesman A" },
  "23-00002": { description: "Salesman B" },
  "24-00001": { description: "Customer A" },
  "24-00002": { description: "Customer B" },
  "31-00001": { description: "Supplier A" },
  "31-00002": { description: "Supplier B" },
  "36-00001": { description: "Tax A" },
  "36-00002": { description: "Tax B" },
  "36-00003": { description: "Tax C" },
  "37-00001": { description: "Government Liabilities" },
  "41-00001": { description: "Share Capital" },
  "42-00001": { description: "Return Earnings" },
  "51-00001": { description: "Ticket Basic Price Income" },
  "51-00002": { description: "Markup Income" },
  "51-00003": { description: "Commission Income" },
  "51-00004": { description: "Void & Refund Surcharge" },
  "61-00001": { description: "Ship Licenses & Registrations" },
  "61-00002": { description: "Ship Repair & Maintenance" },
  "61-00002": { description: "Trips Fuel & Charges" },
  "71-00001": { description: "Commission Expense" },
  "71-00002": { description: "Discount Expense" },
  "81-00001": { description: "Employment Expenses" },
  "81-00002": { description: "Training & Capacity Building" },
  "81-00003": { description: "Transportation Expenditure" }
};

const journalEntries = [
  {
    date: "2025-01-15",
    journalNo: "JV-001",
    layer: "Main",
    partner: "Nour",
    docReference: "INV-12345",
    voyageNo: "V-001",
    serviceType: "Passenger",
    lines: [
      {
        ledgerCode: "21-00003",
        ledgerDescription: ledgerAccounts["21-00003"]?.description || "",
        debit: 5000,
        credit: 0,
        note: "Initial deposit",
        currency: "USD",
        amountCurrency: 5000,
        rate: 1
      },
      {
        ledgerCode: "51-00001",
        ledgerDescription: ledgerAccounts["51-00001"]?.description || "",
        debit: 0,
        credit: 5000,
        note: "Initial deposit",
        currency: "USD",
        amountCurrency: 5000,
        rate: 1
      }
    ]
  },
  {
    date: "2025-02-20",
    journalNo: "JV-002",
    layer: "Sub",
    partner: "Sabihat",
    docReference: "INV-67890",
    voyageNo: "V-002",
    serviceType: "Cargo",
    lines: [
      {
        ledgerCode: "21-00001",
        ledgerDescription: ledgerAccounts["21-00001"]?.description || "",
        debit: 7500,
        credit: 0,
        note: "Sale of goods",
        currency: "USD",
        amountCurrency: 7500,
        rate: 1
      },
      {
        ledgerCode: "51-00002",
        ledgerDescription: ledgerAccounts["51-00002"]?.description || "",
        debit: 0,
        credit: 7500,
        note: "Sale of goods",
        currency: "USD",
        amountCurrency: 7500,
        rate: 1
      }
    ]
  },
  {
    date: "2025-03-05",
    journalNo: "JV-003",
    layer: "Main",
    partner: "Nour",
    docReference: "REC-11223",
    voyageNo: "V-003",
    serviceType: "Vehicle",
    lines: [
      {
        ledgerCode: "81-00001",
        ledgerDescription: ledgerAccounts["81-00001"]?.description || "",
        debit: 2500,
        credit: 0,
        note: "Office rent",
        currency: "USD",
        amountCurrency: 2500,
        rate: 1
      },
      {
        ledgerCode: "21-00002",
        ledgerDescription: ledgerAccounts["21-00002"]?.description || "",
        debit: 0,
        credit: 2500,
        note: "Payment for office rent",
        currency: "USD",
        amountCurrency: 2500,
        rate: 1
      }
    ]
  }
];

export default function GeneralLedger() {
  // filters and inputs (keep same IDs as HTML for CSS/other code compatibility)
  const [search, setSearch] = useState("");
  const [dateFilterType, setDateFilterType] = useState("all");
  const [monthFilter, setMonthFilter] = useState(String(new Date().getMonth() + 1));
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [years, setYears] = useState([]);
  const [rows, setRows] = useState([]); // flattened ledger lines

  useEffect(() => {
    // populate years (current -5 .. current +5)
    const current = new Date().getFullYear();
    const arr = [];
    for (let i = current - 5; i <= current + 5; i++) arr.push(String(i));
    setYears(arr);
    setYearFilter(String(current));

    // flatten journalEntries into rows
    const all = [];
    journalEntries.forEach((entry) => {
      entry.lines.forEach((line) => {
        all.push({
          ...line,
          date: entry.date,
          journalNo: entry.journalNo,
          layer: entry.layer,
          partner: entry.partner,
          docReference: entry.docReference,
          voyageNo: entry.voyageNo,
          serviceType: entry.serviceType
        });
      });
    });

    // sort chronologically
    all.sort((a, b) => new Date(a.date) - new Date(b.date));
    setRows(all);
  }, []);

  // helpers to compute filtered lines and balances
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filter = dateFilterType;
    const sDate = startDateFilter ? new Date(startDateFilter) : null;
    const eDate = endDateFilter ? new Date(endDateFilter) : null;
    const selectedMonth = parseInt(monthFilter || "1", 10);
    const selectedYear = parseInt(yearFilter || String(new Date().getFullYear()), 10);

    return rows.filter((r) => {
      const lineDate = new Date(r.date);
      const lineYear = lineDate.getFullYear();
      const lineMonth = lineDate.getMonth() + 1;

      const matchesSearch =
        q === "" ||
        (r.ledgerCode && r.ledgerCode.toLowerCase().includes(q)) ||
        (r.ledgerDescription && r.ledgerDescription.toLowerCase().includes(q));

      const matchesDate = (() => {
        if (filter === "all") return true;
        if (filter === "month") return lineYear === selectedYear && lineMonth === selectedMonth;
        if (filter === "year") return lineYear === selectedYear;
        if (filter === "custom") {
          if (!sDate || !eDate) return false;
          // include boundary
          return lineDate >= sDate && lineDate <= eDate;
        }
        return false;
      })();

      return matchesSearch && matchesDate;
    });
  }, [rows, search, dateFilterType, monthFilter, yearFilter, startDateFilter, endDateFilter]);

  // compute opening balance (entries before cutoff)
  const openingBalance = useMemo(() => {
    let cutoff = null;
    if (dateFilterType === "month") {
      cutoff = new Date(`${yearFilter}-${monthFilter.padStart(2, "0")}-01`);
    } else if (dateFilterType === "year") {
      cutoff = new Date(`${yearFilter}-01-01`);
    } else if (dateFilterType === "custom") {
      cutoff = startDateFilter ? new Date(startDateFilter) : null;
    }
    let ob = 0;
    rows.forEach((line) => {
      const ld = new Date(line.date);
      const matchesSearch =
        search.trim() === "" ||
        (line.ledgerCode && line.ledgerCode.toLowerCase().includes(search.toLowerCase())) ||
        (line.ledgerDescription && line.ledgerDescription.toLowerCase().includes(search.toLowerCase()));
      if (matchesSearch && cutoff && ld < cutoff) {
        ob += (line.debit || 0) - (line.credit || 0);
      }
    });
    return ob;
  }, [rows, dateFilterType, monthFilter, yearFilter, startDateFilter, search]);

  // totals and running balance for filtered list
  const { totalDebit, totalCredit, endBalance, withOpening } = useMemo(() => {
    let td = 0;
    let tc = 0;
    let currentBalance = openingBalance;
    const withOpeningRow = []; // not used directly but keep structure
    filtered.forEach((line) => {
      td += line.debit || 0;
      tc += line.credit || 0;
      currentBalance += (line.debit || 0) - (line.credit || 0);
    });
    return { totalDebit: td, totalCredit: tc, endBalance: currentBalance, withOpening: withOpeningRow };
  }, [filtered, openingBalance]);

  // Export CSV of filtered lines (simple)
  const exportCsv = () => {
    const header = [
      "Date",
      "Journal No",
      "Layer",
      "Partner",
      "Ledger Code",
      "Ledger Desc",
      "Note",
      "Debit",
      "Credit",
      "Balance",
      "Currency",
      "Amount Currency",
      "Rate",
      "Doc Ref",
      "Voyage No",
      "Service Type"
    ];
    let rowsCsv = [];
    let curBal = openingBalance;
    filtered.forEach((line) => {
      curBal += (line.debit || 0) - (line.credit || 0);
      rowsCsv.push([
        line.date,
        line.journalNo,
        line.layer,
        line.partner,
        line.ledgerCode,
        `"${(line.ledgerDescription || "").replace(/"/g, '""')}"`,
        `"${(line.note || "").replace(/"/g, '""')}"`,
        (line.debit || 0).toFixed(2),
        (line.credit || 0).toFixed(2),
        curBal.toFixed(2),
        line.currency,
        (line.amountCurrency || 0).toFixed(2),
        line.rate,
        line.docReference,
        line.voyageNo,
        line.serviceType
      ]);
    });

    const csvContent =
      [header.join(",")].concat(rowsCsv.map((r) => r.join(","))).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `general-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Refresh: reset filters and data (here we reset filters; in real app fetch fresh data)
  const handleRefresh = () => {
    setSearch("");
    setDateFilterType("all");
    setMonthFilter(String(new Date().getMonth() + 1));
    setYearFilter(String(new Date().getFullYear()));
    setStartDateFilter("");
    setEndDateFilter("");
    // If using API, re-fetch here
  };

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
                <h5>General Ledger</h5>
                <div className="d-flex gap-3">
                  <button id="refreshBtn" onClick={handleRefresh} className="btn btn-primary fw-medium btn-hover-transform">
                    Refresh
                  </button>
                  <button id="exportBtn" onClick={exportCsv} className="btn btn-success fw-medium btn-hover-transform">
                    Export to CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Filters / Search */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-3">
                <div className="card-body">
                  <div className="w-100 transform-hover" style={{ maxWidth: "100%" }}>
                    <div className="mb-4 p-4 rounded-3 border">
                      <div className="mb-3">
                        <label htmlFor="searchInput" className="form-label">Search (Ledger Code or Description)</label>
                        <input
                          id="searchInput"
                          type="text"
                          placeholder="Search by ledger code or description..."
                          className="form-control shadow-sm focus-ring"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>

                      <div className="border-top pt-4 mt-4">
                        <h3 className="fs-6 fw-medium text-secondary mb-3">Date Filter</h3>
                        <div className="row g-4">
                          <div className="col-md">
                            <label htmlFor="dateFilterType" className="form-label">Filter Type</label>
                            <select
                              id="dateFilterType"
                              className="form-select shadow-sm focus-ring"
                              value={dateFilterType}
                              onChange={(e) => setDateFilterType(e.target.value)}
                            >
                              <option value="all">All Dates</option>
                              <option value="month">Month</option>
                              <option value="year">Year</option>
                              <option value="custom">Custom Range</option>
                            </select>
                          </div>

                          <div id="monthFilterContainer" className={`col-md ${dateFilterType === "month" ? "" : "d-none"}`}>
                            <label htmlFor="monthFilter" className="form-label">Month</label>
                            <select id="monthFilter" className="form-select shadow-sm focus-ring" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i+1} value={String(i+1)}>{new Date(0, i).toLocaleString(undefined, { month: "long" })}</option>
                              ))}
                            </select>
                          </div>

                          <div id="yearFilterContainer" className={`col-md ${dateFilterType === "month" || dateFilterType === "year" ? "" : "d-none"}`}>
                            <label htmlFor="yearFilter" className="form-label">Year</label>
                            <select id="yearFilter" className="form-select shadow-sm focus-ring" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                              {years.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                          </div>

                          <div id="customDateFilterContainer" className={`col-md-6 ${dateFilterType === "custom" ? "" : "d-none"}`}>
                            <div className="row g-4">
                              <div className="col-md-6">
                                <label htmlFor="startDateFilter" className="form-label">Start Date</label>
                                <input id="startDateFilter" type="date" className="form-control shadow-sm focus-ring" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="endDateFilter" className="form-label">End Date</label>
                                <input id="endDateFilter" type="date" className="form-control shadow-sm focus-ring" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                      <table className="table table-hover table-striped mb-0">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-start fw-semibold">Date</th>
                            <th className="px-4 py-3 text-start fw-semibold">Journal No</th>
                            <th className="px-4 py-3 text-start fw-semibold">Layer</th>
                            <th className="px-4 py-3 text-start fw-semibold">Partner</th>
                            <th className="px-4 py-3 text-start fw-semibold">Ledger Code</th>
                            <th className="px-4 py-3 text-start fw-semibold">Ledger Desc</th>
                            <th className="px-4 py-3 text-start fw-semibold">Note</th>
                            <th className="px-4 py-3 text-end fw-semibold">Debit</th>
                            <th className="px-4 py-3 text-end fw-semibold">Credit</th>
                            <th className="px-4 py-3 text-end fw-semibold">Balance</th>
                            <th className="px-4 py-3 text-start fw-semibold">Currency</th>
                            <th className="px-4 py-3 text-end fw-semibold">Amount Currency</th>
                            <th className="px-4 py-3 text-end fw-semibold">Rate</th>
                            <th className="px-4 py-3 text-start fw-semibold">Doc Ref</th>
                            <th className="px-4 py-3 text-start fw-semibold">Voyage No</th>
                            <th className="px-4 py-3 text-start fw-semibold">Service Type</th>
                          </tr>
                        </thead>
                        <tbody id="generalLedgerTableBody" className="text-sm text-secondary">
                          {/* Opening balance row */}
                          {filtered.length === 0 ? (
                            <tr>
                              <td colSpan={16} className="text-center">No general ledger entries found for the selected filters.</td>
                            </tr>
                          ) : (
                            (() => {
                              let cur = openingBalance;
                              return (
                                <>
                                  <tr key="opening">
                                    <td className="px-4 py-3" colSpan={9}>Opening Balance</td>
                                    <td className="px-4 py-3 text-end">{cur.toFixed(2)}</td>
                                    <td className="px-4 py-3" colSpan={6}></td>
                                  </tr>
                                  {filtered.map((line, idx) => {
                                    cur += (line.debit || 0) - (line.credit || 0);
                                    return (
                                      <tr key={idx}>
                                        <td className="px-4 py-3 text-nowrap">{line.date}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.journalNo}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.layer}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.partner}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.ledgerCode}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.ledgerDescription}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.note}</td>
                                        <td className="px-4 py-3 text-end text-nowrap">{(line.debit || 0).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-end text-nowrap">{(line.credit || 0).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-end text-nowrap">{cur.toFixed(2)}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.currency}</td>
                                        <td className="px-4 py-3 text-end text-nowrap">{(line.amountCurrency || 0).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-end text-nowrap">{line.rate}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.docReference}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.voyageNo}</td>
                                        <td className="px-4 py-3 text-nowrap">{line.serviceType}</td>
                                      </tr>
                                    );
                                  })}
                                </>
                              );
                            })()
                          )}
                        </tbody>
                        <tfoot className="bg-light fw-semibold">
                          <tr>
                            <td className="px-4 py-3 text-start" colSpan={7}>TOTALS</td>
                            <td className="px-4 py-3 text-end">${totalDebit.toFixed(2)}</td>
                            <td className="px-4 py-3 text-end">${totalCredit.toFixed(2)}</td>
                            <td className="px-4 py-3 text-end" colSpan={7}>${endBalance.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* no-data message (kept for compatibility, but we render message in tbody) */}
                    <div id="noDataMessage" className={`text-center text-secondary mt-4 ${filtered.length === 0 ? "" : "d-none"}`}>
                      <p>No general ledger entries found for the selected filters.</p>
                    </div>
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
