// // src/pages/TicketingRulesPage.jsx
// import React, { useEffect, useRef } from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";
// import { Link } from "react-router-dom";

// /**
//  * TicketingRulesPage - converts ticketing-rules.html
//  * - keeps markup and classes identical (only JSX changes)
//  * - defensive DataTable init on the table element
//  * - keeps the Add Ticket Rule link identical
//  */
// export default function TicketingRulesPage() {
//   const tableRef = useRef(null);

//   useEffect(() => {
//     const el = tableRef.current;
//     if (!el) return;

//     // destroy previous instance if created by us
//     try {
//       if (el._dt && typeof el._dt.destroy === "function") {
//         el._dt.destroy();
//         el._dt = null;
//       }
//     } catch (e) {
//       el._dt = null;
//     }

//     if (!window.DataTable) {
//       console.warn("DataTable not available on window. Include DataTable scripts in public/index.html.");
//       return;
//     }

//     try {
//       // instantiate DataTable defensively
//       el._dt = new window.DataTable(el, {
//         // leave default options so the look is same as original
//       });
//     } catch (err) {
//       console.error("DataTable init failed:", err);
//     }

//     return () => {
//       try {
//         if (el && el._dt && typeof el._dt.destroy === "function") {
//           el._dt.destroy();
//           el._dt = null;
//         }
//       } catch (err) {
//         // ignore
//       }
//     };
//   }, []);

//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <PageWrapper>
//         <div className="content container-fluid">
//           <style>{`
//             .rule-card { background-color: #f2f9ff; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; }
//             .badge-type { font-size: 0.8rem; font-weight: bold; }
//             .btn-remove { background-color: #dc3545; color: white; }
//           `}</style>

//           <div className="page-header">
//             <div className="content-page-header">
//               <h5>Ticketing Rule Management</h5>
//               <div className="list-btn" style={{ justifySelf: "end" }}>
//                 <ul className="filter-list">
//                   <li>
//                     <Link className="btn btn-turquoise" to="/company/add-ticket-rule">
//                       <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add Ticket Rule
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-sm-12">
//               <div className="card-table card p-2">
//                 <div className="card-body">
//                   <div className="table-responsive">
//                     {/* keep id "example" as in original HTML */}
//                     <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
//                       <thead>
//                         <tr>
//                           <th>Rule Type</th>
//                           <th>Rule Name</th>
//                           <th>Timeframe Before Departure</th>
//                           <th>Fee (Fixed or %)</th>
//                           <th>Conditions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td>VOID</td>
//                           <td>VOID - 24 Hours</td>
//                           <td>Within 24 Hours</td>
//                           <td>0%</td>
//                           <td>Ticket must be purchased at least 7 days before departure.</td>
//                         </tr>
//                         <tr>
//                           <td>REISSUE</td>
//                           <td>REISSUE - Standard</td>
//                           <td>24-72 Hours Before</td>
//                           <td>$50 or 10%</td>
//                           <td>Allowed for same-class changes only.</td>
//                         </tr>
//                         <tr>
//                           <td>REFUND</td>
//                           <td>REFUND - Premium</td>
//                           <td>More than 72 Hours Before</td>
//                           <td>$0</td>
//                           <td>Only for Premium or Business class tickets.</td>
//                         </tr>
//                         <tr>
//                           <td>REFUND</td>
//                           <td>REFUND - Economy</td>
//                           <td>Less than 72 Hours Before</td>
//                           <td>$100 or 25%</td>
//                           <td>Non-refundable if within 24 hours.</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </PageWrapper>
//     </div>
//   );
// }



'use client';

// src/pages/TicketingRulesPage.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";
import Can from "../components/Can";
import { ticketingRuleApi } from "../api/ticketingRuleApi";

/**
 * TicketingRulesPage - displays ticketing rules with API integration
 * - keeps markup and classes identical (only JSX changes)
 * - defensive DataTable init on the table element
 * - fetches data from API and populates table
 */
export default function TicketingRulesPage() {
  const tableRef = useRef(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    ruleType: ""
  });

  // Fetch rules from API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ticketingRuleApi.getTicketingRules(
          pagination.page,
          pagination.limit,
          filters
        );
        setRules(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0
        }));
      } catch (err) {
        console.error("[v0] Error fetching ticketing rules:", err);
        setError(err.message || "Failed to fetch ticketing rules");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [pagination.page, filters]);

  // Format fee display
  const formatFee = (feeObj) => {
    if (!feeObj) return "-";
    const { type, value } = feeObj;
    if (type === "NONE") return "-";
    if (type === "FIXED") return `₹${value}`;
    if (type === "PERCENTAGE") return `${value}%`;
    return "-";
  };

  // Format timeframe display
  const formatTimeframe = (rule) => {
    if (rule.sameDayOnly) return "Same Day";
    if (rule.startOffsetDays > 0) {
      return `${rule.startOffsetDays} Day${rule.startOffsetDays > 1 ? "s" : ""} Before`;
    }
    return `${rule.restrictedWindowHours} Hour${rule.restrictedWindowHours > 1 ? "s" : ""} Before`;
  };

  // Initialize DataTable
  useEffect(() => {
    if (loading || !tableRef.current) return;

    const el = tableRef.current;

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
  }, [rules, loading]);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <style>{`
            .rule-card { background-color: #f2f9ff; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; }
            .badge-type { font-size: 0.8rem; font-weight: bold; }
            .btn-remove { background-color: #dc3545; color: white; }
            .loading-spinner { text-align: center; padding: 2rem; }
            .error-message { color: #dc3545; padding: 1rem; background-color: #f8d7da; border-radius: 0.5rem; margin-bottom: 1rem; }
          `}</style>

          <div className="page-header">
            <div className="content-page-header">
              <h5>Ticketing Rule Management</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Can action="create">
                      <Link className="btn btn-turquoise" to="/company/add-ticket-rule">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add Ticket Rule
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {loading ? (
                    <div className="loading-spinner">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading ticketing rules...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      {/* keep id "example" as in original HTML */}
                      <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Rule Type</th>
                            <th>Rule Name</th>
                            <th>Timeframe Before Departure</th>
                            <th>Normal Fee</th>
                            <th>Restricted Penalty</th>
                            <th>No Show Penalty</th>
                            <th>Conditions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rules.length > 0 ? (
                            rules.map((rule) => (
                              <tr key={rule.id || rule._id}>
                                <td>
                                  <span className={`badge badge-${rule.ruleType === 'VOID' ? 'danger' : rule.ruleType === 'REFUND' ? 'success' : 'info'}`}>
                                    {rule.ruleType}
                                  </span>
                                </td>
                                <td>{rule.ruleName}</td>
                                <td>{formatTimeframe(rule)}</td>
                                <td>{formatFee(rule.normalFee)}</td>
                                <td>{formatFee(rule.restrictedPenalty)}</td>
                                <td>{formatFee(rule.noShowPenalty)}</td>
                                <td>{rule.conditions || "-"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                                No ticketing rules found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </PageWrapper>
    </div>
  );
}
