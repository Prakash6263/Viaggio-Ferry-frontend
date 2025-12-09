// src/pages/PaymentsAndReceipts.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

/**
 * PaymentsAndReceipts.jsx
 * - safe DataTable initialization (destroy previous instance)
 * - renders sample rows (replace with API fetch)
 * - DOES NOT attach themeToggle listeners (Header should own that)
 * - preserves classes and table id="example"
 */

export default function PaymentsAndReceipts() {
  const sampleData = [
    {
      tx: "IE-0000001",
      date: "2024-05-15",
      type: "Incoming",
      internal: "No",
      payorPartner: "Client A",
      payorLedger: "Account Receivables",
      payeePartner: "My Partner",
      payeeLedger: "Cash & Banks",
      amount: "500.00",
      currency: "USD",
    },
    {
      tx: "OI-0000001",
      date: "2024-05-22",
      type: "Outgoing",
      internal: "Yes",
      payorPartner: "My Partner",
      payorLedger: "Cash & Banks",
      payeePartner: "Supplier B",
      payeeLedger: "Account Payables",
      amount: "250.00",
      currency: "USD",
    },
  ];

  const [rows, setRows] = useState([]);
  const tableSelector = "#example";

  // simulate data load (replace with real fetch)
  useEffect(() => {
    const t = setTimeout(() => setRows(sampleData), 50);
    return () => clearTimeout(t);
  }, []);

  // init/destroy DataTable whenever rows change (init only when rows exist)
  useEffect(() => {
    const $ = window.jQuery || window.$;
    if (!rows || rows.length === 0) {
      // destroy existing instance if rows empty
      if ($ && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable(tableSelector)) {
        try {
          $(tableSelector).DataTable().clear().destroy();
        } catch {}
      }
      return;
    }

    if ($ && $.fn && $.fn.DataTable) {
      try {
        if ($.fn.DataTable.isDataTable(tableSelector)) {
          $(tableSelector).DataTable().clear().destroy();
        }
        $(tableSelector).DataTable({
          pageLength: 10,
          responsive: true,
        });
      } catch (err) {
        // fail silently
        // console.warn("DataTable init error:", err);
      }
    } else {
      // console.warn("jQuery/DataTables not loaded");
    }

    return () => {
      if ($ && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable(tableSelector)) {
        try {
          $(tableSelector).DataTable().clear().destroy();
        } catch {}
      }
    };
  }, [rows]);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Internal Payments & Receipts</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* KEEP FinancePage routing */}
                    <Link className="btn btn-turquoise" to="/company/finance/add-internal-payment-receipt">
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                      Add New Internal Payments & Receipts
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered" id="example">
                      <thead>
                        <tr>
                          <th>Transaction #</th>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Internal</th>
                          <th>Payor Partner</th>
                          <th>Payor Ledger</th>
                          <th>Payee Partner</th>
                          <th>Payee Ledger</th>
                          <th>Amount</th>
                          <th>Currency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">Loading...</td>
                          </tr>
                        ) : (
                          rows.map((r, i) => (
                            <tr key={i}>
                              <td>{r.tx}</td>
                              <td>{r.date}</td>
                              <td className={r.type === "Incoming" ? "status-incoming" : "status-outgoing"}>{r.type}</td>
                              <td>{r.internal}</td>
                              <td>{r.payorPartner}</td>
                              <td>{r.payorLedger}</td>
                              <td>{r.payeePartner}</td>
                              <td>{r.payeeLedger}</td>
                              <td>{r.amount}</td>
                              <td>{r.currency}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
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
