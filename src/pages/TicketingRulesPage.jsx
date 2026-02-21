// src/pages/TicketingRulesPage.jsx
import React, { useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";
import Can from "../components/Can";
import CanDisable from "../components/CanDisable";

/**
 * TicketingRulesPage - converts ticketing-rules.html
 * - keeps markup and classes identical (only JSX changes)
 * - defensive DataTable init on the table element
 * - keeps the Add Ticket Rule link identical
 */
export default function TicketingRulesPage() {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // destroy previous instance if created by us
    try {
      if (el._dt && typeof el._dt.destroy === "function") {
        el._dt.destroy();
        el._dt = null;
      }
    } catch (e) {
      el._dt = null;
    }

    if (!window.DataTable) {
      console.warn("DataTable not available on window. Include DataTable scripts in public/index.html.");
      return;
    }

    try {
      // instantiate DataTable defensively
      el._dt = new window.DataTable(el, {
        // leave default options so the look is same as original
      });
    } catch (err) {
      console.error("DataTable init failed:", err);
    }

    return () => {
      try {
        if (el && el._dt && typeof el._dt.destroy === "function") {
          el._dt.destroy();
          el._dt = null;
        }
      } catch (err) {
        // ignore
      }
    };
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <Can action="read" path="/company/sales-booking/ticketing-rules">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <h5>Ticketing Rules</h5>
                <div className="list-btn" style={{ justifySelf: "end" }}>
                  <ul className="filter-list">
                    <li>
                      <Can action="create" path="/company/sales-booking/ticketing-rules">
                        <Link to="/company/ticketing-rules/add" className="btn btn-turquoise">
                          <i className="fa fa-plus-circle me-2" aria-hidden="true"></i> Add Ticket Rule
                        </Link>
                      </Can>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card">
                  <div className="card-body">
                    <table className="table table-hover" ref={tableRef}>
                      <thead>
                        <tr>
                          <th>Rule Name</th>
                          <th>Type</th>
                          <th>Timeframe</th>
                          <th>Fee</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Void Rule</td>
                          <td><span className="badge bg-danger">VOID</span></td>
                          <td>24 hours before departure</td>
                          <td>$25 or 10%</td>
                          <td>
                            <CanDisable action="update" path="/company/sales-booking/ticketing-rules">
                              <button className="btn btn-sm btn-outline-primary me-1">Edit</button>
                            </CanDisable>
                            <CanDisable action="delete" path="/company/sales-booking/ticketing-rules">
                              <button className="btn btn-sm btn-outline-danger">Delete</button>
                            </CanDisable>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
