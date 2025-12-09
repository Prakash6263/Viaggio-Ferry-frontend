// src/pages/JournalEntries.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

export default function JournalEntries() {
  // sample data — replace with fetch(...) if you load from server
  const sampleData = [
    {
      date: "2025-09-15",
      journalNo: "JN001",
      layer: "Primary",
      partner: "ABC Ltd",
      ledgerCode: "1001",
      ledgerDesc: "Sales Revenue",
      debit: "",
      credit: "5000",
      note: "Invoice Payment",
      currency: "USD",
      amountCurrency: "5000",
      rate: "1.00",
      docRef: "INV-123",
      voyage: "VY001",
      serviceType: "Freight",
    },
    {
      date: "2025-09-16",
      journalNo: "JN002",
      layer: "Adjustment",
      partner: "XYZ Corp",
      ledgerCode: "2002",
      ledgerDesc: "Expense Account",
      debit: "1500",
      credit: "",
      note: "Office Rent",
      currency: "USD",
      amountCurrency: "1500",
      rate: "1.00",
      docRef: "DOC-789",
      voyage: "VY002",
      serviceType: "Services",
    },
    {
      date: "2025-09-17",
      journalNo: "JN003",
      layer: "Primary",
      partner: "LMN Inc",
      ledgerCode: "3003",
      ledgerDesc: "Bank Account",
      debit: "",
      credit: "2000",
      note: "Client Payment",
      currency: "EUR",
      amountCurrency: "1800",
      rate: "0.90",
      docRef: "RCPT-456",
      voyage: "VY003",
      serviceType: "Logistics",
    },
  ];

  const [rows, setRows] = useState([]); // initially empty (simulates async)
  const tableSelector = "#example";

  // simulate loading data (replace with real fetch)
  useEffect(() => {
    // simulate async load — remove setTimeout for real fetch
    const t = setTimeout(() => {
      setRows(sampleData);
    }, 50); // tiny delay so DataTable init waits for rows

    return () => clearTimeout(t);
  }, []);

  // Initialize DataTable after rows are set
  useEffect(() => {
    const $ = window.jQuery || window.$;
    if (!rows || rows.length === 0) {
      // destroy any existing table if data became empty
      if ($ && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable(tableSelector)) {
        try {
          $(tableSelector).DataTable().clear().destroy();
        } catch {}
      }
      return;
    }

    if ($ && $.fn && $.fn.DataTable) {
      try {
        // ensure no double init
        if ($.fn.DataTable.isDataTable(tableSelector)) {
          $(tableSelector).DataTable().clear().destroy();
        }

        // initialize
        $(tableSelector).DataTable({
          pageLength: 10,
          responsive: true,
        });
      } catch (err) {
        // console.warn("DataTable init error:", err);
      }
    } else {
      // console.warn("jQuery/DataTable not loaded");
    }

    // cleanup when rows change/unmount
    return () => {
      if ($ && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable(tableSelector)) {
        try {
          $(tableSelector).DataTable().clear().destroy();
        } catch {}
      }
    };
  }, [rows]); // re-run when rows change

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Journal Entries</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Link className="btn btn-turquoise" to="/company/finance/add-new-journal-entry">
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                      Add New Journal Entry Accounts
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
                          <th>Date</th>
                          <th>Journal No</th>
                          <th>Layer</th>
                          <th>Partner</th>
                          <th>Ledger Code</th>
                          <th>Ledger Desc</th>
                          <th>Debit</th>
                          <th>Credit</th>
                          <th>Note</th>
                          <th>Currency</th>
                          <th>Amount Currency</th>
                          <th>Rate</th>
                          <th>Doc Ref</th>
                          <th>Voyage No</th>
                          <th>Service Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan="15" className="text-center">Loading...</td>
                          </tr>
                        ) : (
                          rows.map((r, i) => (
                            <tr key={i}>
                              <td>{r.date}</td>
                              <td>{r.journalNo}</td>
                              <td>{r.layer}</td>
                              <td>{r.partner}</td>
                              <td>{r.ledgerCode}</td>
                              <td>{r.ledgerDesc}</td>
                              <td>{r.debit || "—"}</td>
                              <td>{r.credit || "—"}</td>
                              <td>{r.note}</td>
                              <td>{r.currency}</td>
                              <td>{r.amountCurrency}</td>
                              <td>{r.rate}</td>
                              <td>{r.docRef}</td>
                              <td>{r.voyage}</td>
                              <td>{r.serviceType}</td>
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
