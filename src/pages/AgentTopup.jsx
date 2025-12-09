// src/pages/AgentTopup.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

/**
 * AgentTopup.jsx
 * - uses local sample data (replace with API fetch)
 * - initializes DataTable only after rows are present
 * - prevents double-initialization by destroying existing instance first
 * - keeps original markup/classes/ids so CSS doesn't break
 */

export default function AgentTopup() {
  // sample rows — replace with API data when ready
  const sampleData = [
    {
      tx: "AT-0000001",
      date: "2024-05-15",
      payorPartner: "Sabihat",
      payorLedger: "BOK Bank 12345",
      payeePartner: "Nour",
      payeeLedger: "BOK Bank 56541",
      amountCurrency: "500.00 USD",
      roe: "500",
      amountSdg: "250000.00 SDG",
      note: "Initial top-up",
      payorConfirmed: true,
      payeeConfirmed: false,
    },
    // add more demo rows if you like
  ];

  const [rows, setRows] = useState([]); // start empty to simulate async
  const tableSelector = "#example";

  // simulate async load of data (replace with fetch in production)
  useEffect(() => {
    const t = setTimeout(() => {
      setRows(sampleData);
    }, 50); // small delay so DataTable init happens after rows are rendered

    return () => clearTimeout(t);
  }, []);

  // init DataTable after rows change (only when there are rows)
  useEffect(() => {
    const $ = window.jQuery || window.$;

    if (!rows || rows.length === 0) {
      // ensure any previous DataTable is destroyed when rows become empty
      if ($ && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable(tableSelector)) {
        try {
          $(tableSelector).DataTable().clear().destroy();
        } catch (e) {}
      }
      return;
    }

    if ($ && $.fn && $.fn.DataTable) {
      try {
        // destroy if already initialised
        if ($.fn.DataTable.isDataTable(tableSelector)) {
          $(tableSelector).DataTable().clear().destroy();
        }

        // initialize DataTable
        $(tableSelector).DataTable({
          pageLength: 10,
          responsive: true,
        });
      } catch (err) {
        // fail silently to avoid blocking alerts
        // console.warn("DataTable init error", err);
      }
    } else {
      // console.warn("jQuery/DataTables not loaded");
    }

    // cleanup on unmount / rows change
    return () => {
      if ($ && $.fn && $.fn.DataTable && $.fn.DataTable.isDataTable(tableSelector)) {
        try {
          $(tableSelector).DataTable().clear().destroy();
        } catch (e) {}
      }
    };
  }, [rows]);

  // theme toggle parity (keeps old behavior)
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

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Agent Topup</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* keep route used in FinancePage.jsx */}
                    <Link className="btn btn-turquoise" to="/company/finance/add-topup">
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                      Add New Topup
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
                          <th>Payor Partner</th>
                          <th>Payor Ledger</th>
                          <th>Payee Partner</th>
                          <th>Payee Ledger</th>
                          <th>Amount Currency</th>
                          <th>ROE</th>
                          <th>Amount (SDG)</th>
                          <th>Note</th>
                          <th className="text-center">Payor Confirmed</th>
                          <th className="text-center">Payee Confirmed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.length === 0 ? (
                          <tr>
                            <td colSpan="12" className="text-center">Loading...</td>
                          </tr>
                        ) : (
                          rows.map((r, idx) => (
                            <tr key={idx}>
                              <td>{r.tx}</td>
                              <td>{r.date}</td>
                              <td>{r.payorPartner}</td>
                              <td>{r.payorLedger}</td>
                              <td>{r.payeePartner}</td>
                              <td>{r.payeeLedger}</td>
                              <td>{r.amountCurrency}</td>
                              <td>{r.roe}</td>
                              <td>{r.amountSdg}</td>
                              <td>{r.note}</td>
                              <td className="text-center">
                                <input type="checkbox" checked={!!r.payorConfirmed} readOnly />
                              </td>
                              <td className="text-center">
                                <input type="checkbox" checked={!!r.payeeConfirmed} readOnly />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* optionally a fallback Link */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
