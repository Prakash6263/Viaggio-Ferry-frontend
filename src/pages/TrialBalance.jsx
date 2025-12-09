import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

/**
 * TrialBalance.jsx
 * - Converted from /mnt/data/trial-balance.html. Source: :contentReference[oaicite:1]{index=1}
 * - Uses Header, Sidebar, PageWrapper (same as your other finance pages)
 * - Route used: /company/finance/trial-balance
 * - Preserves original classes and element IDs (searchInput, accountTypeFilter, dateFilterType, monthFilter, yearFilter, startDateFilter, endDateFilter, trialBalanceTableBody, initialClosingTotal, currentActivitiesTotal, endClosingTotal, noDataMessage)
 * - No themeToggle logic here (Header must manage theme)
 */

const chartOfAccounts = [
  { ledgerCode: "11-00001", ledgerDescription: "Ships & Associated Equipments", ledgerType: "Property Plant & Equipments" },
  { ledgerCode: "11-00002", ledgerDescription: "Loading & Offloading Equipments", ledgerType: "Property Plant & Equipments" },
  { ledgerCode: "12-00001", ledgerDescription: "IT Equipments", ledgerType: "Furniture & Office Equipments" },
  { ledgerCode: "12-00002", ledgerDescription: "Furniture", ledgerType: "Furniture & Office Equipments" },
  { ledgerCode: "12-00003", ledgerDescription: "Office Equpments", ledgerType: "Furniture & Office Equipments" },
  { ledgerCode: "13-00001", ledgerDescription: "Heavy Vehicles", ledgerType: "Motor Vehicles" },
  { ledgerCode: "13-00002", ledgerDescription: "Light Vehicles", ledgerType: "Motor Vehicles" },
  { ledgerCode: "21-00001", ledgerDescription: "BOK Bank 12345", ledgerType: "Cash & Banks" },
  { ledgerCode: "21-00002", ledgerDescription: "BOK Bank56541", ledgerType: "Cash & Banks" },
  { ledgerCode: "21-00003", ledgerDescription: "Cash safe HQ", ledgerType: "Cash & Banks" },
  { ledgerCode: "22-00001", ledgerDescription: "Sabihat", ledgerType: "Business Partners" },
  { ledgerCode: "22-00002", ledgerDescription: "Nour", ledgerType: "Business Partners" },
  { ledgerCode: "23-00001", ledgerDescription: "Salesman A", ledgerType: "Salesmen Receivables" },
  { ledgerCode: "23-00002", ledgerDescription: "Salesman B", ledgerType: "Salesmen Receivables" },
  { ledgerCode: "24-00001", ledgerDescription: "Customer A", ledgerType: "Account Receivables" },
  { ledgerCode: "24-00002", ledgerDescription: "Customer B", ledgerType: "Account Receivables" },
  { ledgerCode: "31-00001", ledgerDescription: "Supplier A", ledgerType: "Account Payables" },
  { ledgerCode: "31-00002", ledgerDescription: "Supplier B", ledgerType: "Account Payables" },
  { ledgerCode: "36-00001", ledgerDescription: "Tax A", ledgerType: "Taxes" },
  { ledgerCode: "36-00002", ledgerDescription: "Tax B", ledgerType: "Taxes" },
  { ledgerCode: "36-00003", ledgerDescription: "Tax C", ledgerType: "Taxes" },
  { ledgerCode: "37-00001", ledgerDescription: "Government Liabilities", ledgerType: "Government Liabilities" },
  { ledgerCode: "41-00001", ledgerDescription: "Share Capital", ledgerType: "Share Capital" },
  { ledgerCode: "42-00001", ledgerDescription: "Return Earnings", ledgerType: "Return Earnings" },
  { ledgerCode: "51-00001", ledgerDescription: "Ticket Basic Price Income", ledgerType: "Income" },
  { ledgerCode: "51-00002", ledgerDescription: "Markup Income", ledgerType: "Income" },
  { ledgerCode: "51-00003", ledgerDescription: "Commission Income", ledgerType: "Income" },
  { ledgerCode: "51-00004", ledgerDescription: "Void & Refund Surcharge", ledgerType: "Income" },
  { ledgerCode: "61-00001", ledgerDescription: "Ship Licenses & Registrations", ledgerType: "Cost of Income" },
  { ledgerCode: "61-00002", ledgerDescription: "Ship Repair & Maintenance", ledgerType: "Cost of Income" },
  { ledgerCode: "61-00003", ledgerDescription: "Trips Fuel & Charges", ledgerType: "Cost of Income" },
  { ledgerCode: "71-00001", ledgerDescription: "Commission Expense", ledgerType: "Selling Expenses" },
  { ledgerCode: "71-00002", ledgerDescription: "Discount Expense", ledgerType: "Selling Expenses" },
  { ledgerCode: "81-00001", ledgerDescription: "Employment Expenses", ledgerType: "General & Admin Expenses" },
  { ledgerCode: "81-00002", ledgerDescription: "Training & Capacity Building", ledgerType: "General & Admin Expenses" },
  { ledgerCode: "81-00003", ledgerDescription: "Transportation Expenditure", ledgerType: "General & Admin Expenses" }
];

// generate demo balanced data for trial balance as original script did
function generateTrialBalanceData(seedAccounts = chartOfAccounts) {
  // deep copy
  const accounts = seedAccounts.map((a) => ({ ...a }));
  let totals = { initialClosing: 0, currentActivities: 0, endClosing: 0 };

  for (let i = 0; i < accounts.length - 1; i++) {
    const a = accounts[i];
    // generate pseudorandom deterministic-ish values based on code (keeps UI stable)
    const codeNum = Number(a.ledgerCode.replace(/\D/g, "")) || i * 100;
    const initial = ((codeNum % 10000) / 100) - 50; // can be negative or positive
    const activity = (((codeNum * 7) % 8000) / 100) - 40;
    a.initialClosing = initial;
    a.currentActivities = activity;
    a.endClosing = +(initial + activity).toFixed(2);

    totals.initialClosing += a.initialClosing;
    totals.currentActivities += a.currentActivities;
    totals.endClosing += a.endClosing;
  }

  // balance the last account to make totals zero (approx)
  const last = accounts[accounts.length - 1];
  last.initialClosing = -totals.initialClosing;
  last.currentActivities = -totals.currentActivities;
  last.endClosing = -totals.endClosing;

  return accounts;
}

function formatCurrency(v) {
  return Number(v || 0).toFixed(2);
}

function getBalanceClass(v) {
  if (Math.abs(v) < 0.01) return "";
  return v >= 0 ? "balance-positive" : "balance-negative";
}

export default function TrialBalance() {
  // filters and inputs — using the same IDs for compatibility with any CSS/scripts
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("");
  const [dateFilterType, setDateFilterType] = useState("all");
  const [monthFilter, setMonthFilter] = useState(String(new Date().getMonth() + 1));
  const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [accounts, setAccounts] = useState([]);

  // populate accounts on mount (demo generator used in the original HTML)
  useEffect(() => {
    const data = generateTrialBalanceData();
    setAccounts(data);
  }, []);

  // helper: filtered list per current filters
  const filteredAccounts = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    return accounts.filter((acc) => {
      if (q) {
        const matchesQ =
          (acc.ledgerCode || "").toLowerCase().includes(q) ||
          (acc.ledgerDescription || "").toLowerCase().includes(q);
        if (!matchesQ) return false;
      }
      if (accountType) {
        if (acc.ledgerType !== accountType) return false;
      }
      if (balanceFilter) {
        const v = acc.endClosing || 0;
        if (balanceFilter === "positive" && v <= 0) return false;
        if (balanceFilter === "negative" && v >= 0) return false;
        if (balanceFilter === "zero" && Math.abs(v) > 0.01) return false;
      }
      // date filters in original were UI controls but trial-balance generator is static demo;
      // if you later feed actual account/activity data by date, implement date checks here.
      return true;
    });
  }, [accounts, search, accountType, balanceFilter]);

  // totals
  const totals = useMemo(() => {
    const t = { initialClosing: 0, currentActivities: 0, endClosing: 0 };
    filteredAccounts.forEach((a) => {
      t.initialClosing += Number(a.initialClosing || 0);
      t.currentActivities += Number(a.currentActivities || 0);
      t.endClosing += Number(a.endClosing || 0);
    });
    return t;
  }, [filteredAccounts]);

  // handlers
  const handleRefresh = () => {
    // in real app: fetch fresh data from API.
    // keep generator for demo parity
    const data = generateTrialBalanceData();
    setAccounts(data);
    // reset filters as original "refresh" might do
    setSearch("");
    setAccountType("");
    setBalanceFilter("");
    setDateFilterType("all");
    setMonthFilter(String(new Date().getMonth() + 1));
    setYearFilter(String(new Date().getFullYear()));
    setStartDateFilter("");
    setEndDateFilter("");
  };

  const handleExport = () => {
    // CSV: Account Code,Account Description,Initial Balance,Current Activities,End Balance
    const header = ["Account Code", "Account Description", "Initial Balance", "Current Activities", "End Balance"];
    const rows = filteredAccounts.map((a) => [
      a.ledgerCode,
      `"${(a.ledgerDescription || "").replace(/"/g, '""')}"`,
      formatCurrency(a.initialClosing || 0),
      formatCurrency(a.currentActivities || 0),
      formatCurrency(a.endClosing || 0)
    ]);
    const csv = [header.join(",")].concat(rows.map((r) => r.join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trial-balance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // derived lists for account type dropdown (unique ledgerType values)
  const accountTypes = useMemo(() => {
    const set = new Set(accounts.map((a) => a.ledgerType).filter(Boolean));
    return Array.from(set);
  }, [accounts]);

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
                <h5>Trial Balance</h5>
                <div className="d-flex gap-3">
                  <button id="refreshBtn" onClick={handleRefresh} className="btn btn-primary fw-medium btn-hover-transform">
                    Refresh Data
                  </button>
                  <button id="exportBtn" onClick={handleExport} className="btn btn-success fw-medium btn-hover-transform">
                    Export to CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-3">
                <div className="card-body">
                  <div className="w-100 transform-hover" style={{ maxWidth: "100%" }}>
                    <div className="mb-4 p-4 rounded-3 border">
                      <div className="row g-4 mb-4">
                        <div className="col-md">
                          <label htmlFor="searchInput" className="form-label text-sm fw-medium text-secondary mb-1">Search Accounts</label>
                          <input
                            id="searchInput"
                            type="text"
                            placeholder="Search by code or description"
                            className="form-control shadow-sm focus-ring"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>

                        <div className="col-md">
                          <label htmlFor="accountTypeFilter" className="form-label text-sm fw-medium text-secondary mb-1">Account Type</label>
                          <select
                            id="accountTypeFilter"
                            className="form-select shadow-sm focus-ring"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                          >
                            <option value="">All Types</option>
                            {accountTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>

                        <div className="col-md">
                          <label htmlFor="balanceFilter" className="form-label text-sm fw-medium text-secondary mb-1">Balance Status</label>
                          <select
                            id="balanceFilter"
                            className="form-select shadow-sm focus-ring"
                            value={balanceFilter}
                            onChange={(e) => setBalanceFilter(e.target.value)}
                          >
                            <option value="">All Balances</option>
                            <option value="positive">Positive Balance</option>
                            <option value="negative">Negative Balance</option>
                            <option value="zero">Zero Balance</option>
                          </select>
                        </div>
                      </div>

                      <div className="border-top pt-4 mt-4">
                        <h3 className="fs-6 fw-medium text-secondary mb-3">Date Filter</h3>
                        <div className="row g-4">
                          <div className="col-md">
                            <label htmlFor="dateFilterType" className="form-label text-sm fw-medium text-secondary mb-1">Filter Type</label>
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
                            <label htmlFor="monthFilter" className="form-label text-sm fw-medium text-secondary mb-1">Month</label>
                            <select id="monthFilter" className="form-select shadow-sm focus-ring" value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i+1} value={String(i+1)}>{new Date(0, i).toLocaleString(undefined, { month: "long" })}</option>
                              ))}
                            </select>
                          </div>

                          <div id="yearFilterContainer" className={`col-md ${dateFilterType === "month" || dateFilterType === "year" ? "" : "d-none"}`}>
                            <label htmlFor="yearFilter" className="form-label text-sm fw-medium text-secondary mb-1">Year</label>
                            <select id="yearFilter" className="form-select shadow-sm focus-ring" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                              {Array.from({ length: 11 }, (_, i) => {
                                const y = new Date().getFullYear() - 5 + i;
                                return <option key={y} value={String(y)}>{y}</option>;
                              })}
                            </select>
                          </div>

                          <div id="customDateFilterContainer" className={`col-md-6 ${dateFilterType === "custom" ? "" : "d-none"}`}>
                            <div className="row g-4">
                              <div className="col-md-6">
                                <label htmlFor="startDateFilter" className="form-label text-sm fw-medium text-secondary mb-1">Start Date</label>
                                <input id="startDateFilter" type="date" className="form-control shadow-sm focus-ring" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                              </div>
                              <div className="col-md-6">
                                <label htmlFor="endDateFilter" className="form-label text-sm fw-medium text-secondary mb-1">End Date</label>
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
                            <th className="px-4 py-3 text-start fw-semibold">Account Code</th>
                            <th className="px-4 py-3 text-start fw-semibold">Account Description</th>
                            <th className="px-4 py-3 text-end fw-semibold">Initial Balance</th>
                            <th className="px-4 py-3 text-end fw-semibold">Current Activities</th>
                            <th className="px-4 py-3 text-end fw-semibold">End Balance</th>
                          </tr>
                        </thead>
                        <tbody id="trialBalanceTableBody">
                          {filteredAccounts.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center">No trial balance data available. Please check your accounts and transactions.</td>
                            </tr>
                          ) : (
                            filteredAccounts.sort((a, b) => a.ledgerCode.localeCompare(b.ledgerCode, undefined, { numeric: true })).map((acc) => (
                              <tr key={acc.ledgerCode} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-4 py-4 text-nowrap font-monospace fw-medium">{acc.ledgerCode}</td>
                                <td className="px-4 py-4 text-nowrap">{acc.ledgerDescription}</td>
                                <td className={`px-4 py-4 text-nowrap text-end ${getBalanceClass(acc.initialClosing)}`}>${formatCurrency(acc.initialClosing)}</td>
                                <td className={`px-4 py-4 text-nowrap text-end ${getBalanceClass(acc.currentActivities)}`}>${formatCurrency(acc.currentActivities)}</td>
                                <td className={`px-4 py-4 text-nowrap text-end ${getBalanceClass(acc.endClosing)}`}>${formatCurrency(acc.endClosing)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        <tfoot className={`fw-semibold ${Math.abs(totals.initialClosing) > 0.01 || Math.abs(totals.currentActivities) > 0.01 || Math.abs(totals.endClosing) > 0.01 ? "bg-danger-subtle" : "bg-light"}`}>
                          <tr>
                            <td className="px-4 py-3 text-start" colSpan={2}>TOTALS</td>
                            <td className="px-4 py-3 text-end">${formatCurrency(totals.initialClosing)}</td>
                            <td className="px-4 py-3 text-end">${formatCurrency(totals.currentActivities)}</td>
                            <td className="px-4 py-3 text-end">${formatCurrency(totals.endClosing)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div id="noDataMessage" className={`d-none text-center text-secondary mt-4 ${filteredAccounts.length === 0 ? "" : "d-none"}`}>
                      <p>No trial balance data available. Please check your accounts and transactions.</p>
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
