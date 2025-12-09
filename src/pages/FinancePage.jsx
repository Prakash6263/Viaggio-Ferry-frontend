"use client"

import { useEffect } from "react"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import { Link } from "react-router-dom"

export default function FinancePage() {
  useEffect(() => {
    // Load Chart.js script dynamically since it's used in the original HTML
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
    script.async = true
    script.onload = () => {
      const canvas = document.getElementById("revenueChart")
      if (canvas && window.Chart) {
        const ctx = canvas.getContext("2d")
        new window.Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Total B2C Revenue",
                data: [105000, 111000, 128000, 119000, 135000, 139000],
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,0.2)",
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                labels: { color: "#333" },
              },
            },
            scales: {
              x: { ticks: { color: "#333" } },
              y: { ticks: { color: "#333" } },
            },
          },
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header">
            <h5>Finance</h5>
          </div>
        </div>
        {/* /Page Header */}

        {/* Finance Features Grid */}
        <div className="row g-4 finance">
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-blue">
                <i className="fas fa-book"></i>
              </div>
              <h6 className="fw-bold">Chart of Accounts</h6>
              <p className="mb-3">Define and manage accounts for all transactions</p>
              <Link to="/company/finance/chart-of-accounts" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-green">
                <i className="fas fa-university"></i>
              </div>
              <h6 className="fw-bold">Bank & Cash Accounts</h6>
              <p className="mb-3">Manage bank accounts, balances, and cash</p>
              <Link to="/company/finance/bank-cash-accounts" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-yellow">
                <i className="fas fa-pen-nib"></i>
              </div>
              <h6 className="fw-bold">Journal Entries</h6>
              <p className="mb-3">Record manual debit/credit entries</p>
              <Link to="/company/finance/journal-entries" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-red">
                <i className="fas fa-wallet"></i>
              </div>
              <h6 className="fw-bold">Agent Top-up Deposits</h6>
              <p className="mb-3">Track and manage agent wallet funding</p>
              <Link to="/company/finance/agent-top-up-deposits" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-purple">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <h6 className="fw-bold">Payments & Receipts</h6>
              <p className="mb-3">Manage incoming and outgoing transactions</p>
              <Link to="/company/finance/payments-receipts" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-green">
                <i className="fas fa-file-invoice"></i>
              </div>
              <h6 className="fw-bold">General Ledger</h6>
              <p className="mb-3">Full ledger of all accounting entries</p>
              <Link to="/company/finance/general-ledger" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-yellow">
                <i className="fas fa-balance-scale"></i>
              </div>
              <h6 className="fw-bold">Trial Balance</h6>
              <p className="mb-3">Check balances before closing accounts</p>
              <Link to="/company/finance/trial-balance" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-blue">
                <i className="fas fa-chart-line"></i>
              </div>
              <h6 className="fw-bold">Income Statement</h6>
              <p className="mb-3">Track revenue and expenses</p>
              <Link to="/company/finance/income-statement" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-red">
                <i className="fas fa-balance-scale-right"></i>
              </div>
              <h6 className="fw-bold">Balance Sheet</h6>
              <p className="mb-3">Assets, liabilities, and equity summary</p>
              <Link to="/company/finance/balance-sheet" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-4 text-center">
              <div className="finance-icon icon-green">
                <i className="fas fa-university"></i>
              </div>
              <h6 className="fw-bold">Accounting periods</h6>
              <p className="mb-3">Manage bank accounts and time period</p>
              <Link to="/company/finance/accounting-periods" className="btn btn-sm btn-turquoise">
                Open
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
