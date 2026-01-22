// import React, { useEffect, useRef } from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";

// /**
//  * CommissionBoardPage
//  * - preserves HTML structure & classes exactly (only JSX changes)
//  * - initializes DataTable defensively on the table ref
//  */
// export default function CommissionBoardPage() {
//   const tableRef = useRef(null);

//   useEffect(() => {
//     const el = tableRef.current;
//     if (!el) return;

//     // If already initialized (maybe a global script did), skip re-init.
//     if (el._dt) return;

//     // If DataTable available (simple-datatables/new DataTable API)
//     if (window.DataTable) {
//       try {
//         // Use selector-based init if necessary (keeps same behavior)
//         // but prefer element constructor to avoid duplicate selector init
//         el._dt = new window.DataTable(el, {
//           // keep defaults — you can add options here
//         });
//       } catch (err) {
//         console.error("DataTable init error:", err);
//       }
//     } else {
//       // if jQuery DataTables (unlikely here) you can add fallback
//       if (window.$ && window.$.fn && window.$.fn.DataTable) {
//         try {
//           const $el = window.$(el);
//           if (!$el.hasClass("dataTable-initialized")) {
//             $el.DataTable({});
//             $el.addClass("dataTable-initialized");
//           }
//         } catch (err) {
//           console.error("jQuery DataTable init error:", err);
//         }
//       } else {
//         console.warn("DataTable library not found. Include it in public/index.html");
//       }
//     }

//     // cleanup: destroy only if we created it
//     return () => {
//       try {
//         if (el && el._dt && typeof el._dt.destroy === "function") {
//           if (el.isConnected || document.contains(el)) el._dt.destroy();
//           else try { el._dt.destroy(); } catch {}
//           el._dt = null;
//         }
//       } catch (err) {
//         // ignore errors on unmount
//       }
//     };
//   }, []);

//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />

//       <PageWrapper>
//         <div className="content container-fluid">
//           {/* Page Header */}
//           <div className="page-header">
//             <div className="content-page-header">
//               <h5>Commission Board</h5>
//               <div className="list-btn" style={{ justifySelf: "end" }}>
//                 <ul className="filter-list">
//                   <li>
//                     <button className="btn btn-secondary me-2">Export</button>
//                   </li>
//                   <li>
//                     <a className="btn btn-turquoise" href="/company/commission/add">
//                       <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Commission
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Statistics Cards */}
//           <div className="row text-center g-3 mb-4">
//             <div className="col-md-3">
//               <div className="card">
//                 <div className="card-body">
//                   <h6>Total Commissions</h6>
//                   <h2>18</h2>
//                   <small className="text-success">↑ 8% from last month</small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card">
//                 <div className="card-body">
//                   <h6>Avg. Commission</h6>
//                   <h2>4.5%</h2>
//                   <small className="text-warning">– 0% from last month</small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card">
//                 <div className="card-body">
//                   <h6>Commission Payout</h6>
//                   <h2>$8.7K</h2>
//                   <small className="text-success">↑ 5.2% from last month</small>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card">
//                 <div className="card-body">
//                   <h6>Rule Performance</h6>
//                   <h2>92%</h2>
//                   <small className="text-success">↑ 3.7% from last month</small>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Commission Flow */}
//           <div className="card p-4 mb-4">
//             <h5 className="mb-2">Commission Flow Structure</h5>
//             <div className="d-flex flex-wrap align-items-center gap-3">
//               <div className="badge bg-primary p-3">Company<br /><br /><small>Pays commission only</small></div>
//               <span>→</span>
//               <div className="badge bg-primary p-3">Marine Agent<br /><br /><small>Receives from Company</small></div>
//               <span>→</span>
//               <div className="badge bg-primary p-3">Commercial Agent<br /><br /><small>Receives from Marine</small></div>
//               <span>→</span>
//               <div className="badge bg-primary p-3">Selling Agent<br /><br /><small>Receives from Commercial</small></div>
//               <span>→</span>
//               <div className="badge bg-primary p-3">Salesman<br /><br /><small>Receives from Selling</small></div>
//             </div>
//           </div>

//           {/* Table Card */}
//           <div className="row">
//             <div className="col-sm-12">
//               <div className="card-table card p-2">
//                 <div className="card-body">
//                   <ul className="nav nav-pills mb-3" role="tablist">
//                     <li className="nav-item">
//                       <button className="nav-link active" id="Commission Rules-tab" data-bs-toggle="pill" data-bs-target="#commission-rules" type="button" role="tab">Commission Rules</button>
//                     </li>
//                     <li className="nav-item">
//                       <button className="nav-link" id="commission-history-tab" data-bs-toggle="pill" data-bs-target="#commission-history" type="button" role="tab">History</button>
//                     </li>
//                   </ul>

//                   <div className="tab-content">
//                     <div className="tab-pane fade show active" id="commission-rules">
//                       <div className="row mb-3 g-2">
//                         <div className="col-md-3">
//                           <input type="text" className="form-control" placeholder="Search commission rules..." />
//                         </div>
//                         <div className="col-md-3">
//                           <select className="form-select">
//                             <option>All Companies</option>
//                             <option>Company A</option>
//                             <option>Company B</option>
//                           </select>
//                         </div>
//                         <div className="col-md-3">
//                           <select className="form-select">
//                             <option>All Layers</option>
//                             <option>Layer 1</option>
//                             <option>Layer 2</option>
//                           </select>
//                         </div>
//                         <div className="col-md-3">
//                           <select className="form-select">
//                             <option>All Statuses</option>
//                             <option>Active</option>
//                             <option>Inactive</option>
//                           </select>
//                         </div>
//                       </div>

//                       <div className="table-responsive">
//                         {/* keep id "example" same as HTML */}
//                         <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
//                           <thead>
//                             <tr>
//                               <th><input type="checkbox" /></th>
//                               <th>Rule Name</th>
//                               <th>Flow</th>
//                               <th>Commission</th>
//                               <th>Services</th>
//                               <th>Routes</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             <tr>
//                               <td><input type="checkbox" /></td>
//                               <td>Company to Marine Commission</td>
//                               <td>Company → Marine Agent</td>
//                               <td>5%</td>
//                               <td>
//                                 <span className="badge badge-service">Passenger</span>
//                                 <span className="badge badge-service">Cargo</span>
//                                 <span className="badge badge-service">Vehicle</span>
//                               </td>
//                               <td>Muscat → Dubai → Abu Dhabi</td>
//                             </tr>
//                             <tr>
//                               <td><input type="checkbox" /></td>
//                               <td>Marine to Commercial Commission</td>
//                               <td>Marine Agent → Commercial Agent</td>
//                               <td>4%</td>
//                               <td>
//                                 <span className="badge badge-service">Passenger</span>
//                                 <span className="badge badge-service">Vehicle</span>
//                               </td>
//                               <td>Muscat → Dubai</td>
//                             </tr>
//                             {/* Additional rows kept identical to HTML as needed */}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>

//                     <div className="tab-pane fade" id="commission-history">
//                       <div className="history-card">
//                         <div className="row g-3 mb-4">
//                           <div className="col-md-4">
//                             <select className="form-select">
//                               <option>All Rules</option>
//                               <option>Company to Marine</option>
//                               <option>Commercial to Selling</option>
//                             </select>
//                           </div>
//                           <div className="col-md-4">
//                             <select className="form-select">
//                               <option>All Actions</option>
//                               <option>Created</option>
//                               <option>Updated</option>
//                               <option>Activated</option>
//                               <option>Deleted</option>
//                             </select>
//                           </div>
//                           <div className="col-md-3">
//                             <select className="form-select">
//                               <option>Last 7 Days</option>
//                               <option>Last 30 Days</option>
//                               <option>Last 6 Months</option>
//                             </select>
//                           </div>
//                           <div className="col-md-1 d-grid">
//                             <button className="btn btn-primary">Apply</button>
//                           </div>
//                         </div>

//                         <div className="history-item border-start border-4 border-primary-subtle">
//                           <span className="badge bg-primary">Updated</span>
//                           <h6 className="mt-2">Company to Marine Commission</h6>
//                           <p>Commission changed from 4% to 5%</p>
//                           <div className="d-flex justify-content-between">
//                             <span className="history-meta">By John Doe • 12 Aug 2023, 10:30 AM</span>
//                             <a href="#" className="view-link">View Details</a>
//                           </div>
//                         </div>

//                         <div className="history-item border-start border-4 border-success-subtle">
//                           <span className="badge bg-success">Created</span>
//                           <h6 className="mt-2">Marine to Commercial Commission</h6>
//                           <p>New commission rule created with 4% rate</p>
//                           <div className="d-flex justify-content-between">
//                             <span className="history-meta">By Jane Smith • 10 Aug 2023, 2:15 PM</span>
//                             <a href="#" className="view-link">View Details</a>
//                           </div>
//                         </div>

//                         <div className="history-item border-start border-4 border-warning-subtle">
//                           <span className="badge bg-warning text-dark">Activated</span>
//                           <h6 className="mt-2">Commercial to Selling Commission</h6>
//                           <p>Commission rule activated after review</p>
//                           <div className="d-flex justify-content-between">
//                             <span className="history-meta">By Mike Johnson • 05 Aug 2023, 9:45 AM</span>
//                             <a href="#" className="view-link">View Details</a>
//                           </div>
//                         </div>

//                         <div className="history-item border-start border-4 border-danger-subtle">
//                           <span className="badge bg-danger">Deleted</span>
//                           <h6 className="mt-2">Old Salesman Commission</h6>
//                           <p>Commission rule deleted as no longer needed</p>
//                           <div className="d-flex justify-content-between">
//                             <span className="history-meta">By Mike Johnson • 01 Aug 2023, 5:00 PM</span>
//                             <a href="#" className="view-link">View Details</a>
//                           </div>
//                         </div>

//                       </div>
//                     </div>
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

import React, { useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Can from "../components/Can";

/**
 * CommissionBoardPage
 * - preserves HTML structure & classes exactly (only JSX changes)
 * - initializes DataTable defensively on the table ref
 */
export default function CommissionBoardPage() {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // If already initialized (maybe a global script did), skip re-init.
    if (el._dt) return;

    // If DataTable available (simple-datatables/new DataTable API)
    if (window.DataTable) {
      try {
        // Use selector-based init if necessary (keeps same behavior)
        // but prefer element constructor to avoid duplicate selector init
        el._dt = new window.DataTable(el, {
          // keep defaults — you can add options here
        });
      } catch (err) {
        console.error("DataTable init error:", err);
      }
    } else {
      // if jQuery DataTables (unlikely here) you can add fallback
      if (window.$ && window.$.fn && window.$.fn.DataTable) {
        try {
          const $el = window.$(el);
          if (!$el.hasClass("dataTable-initialized")) {
            $el.DataTable({});
            $el.addClass("dataTable-initialized");
          }
        } catch (err) {
          console.error("jQuery DataTable init error:", err);
        }
      } else {
        console.warn("DataTable library not found. Include it in public/index.html");
      }
    }

    // cleanup: destroy only if we created it
    return () => {
      try {
        if (el && el._dt && typeof el._dt.destroy === "function") {
          if (el.isConnected || document.contains(el)) el._dt.destroy();
          else try { el._dt.destroy(); } catch {}
          el._dt = null;
        }
      } catch (err) {
        // ignore errors on unmount
      }
    };
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Commission Board</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <button className="btn btn-secondary me-2">Export</button>
                  </li>
                  <li>
                    <Can action="create">
                      <a className="btn btn-turquoise" href="/company/commission/add">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Commission
                      </a>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row text-center g-3 mb-4">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Total Commissions</h6>
                  <h2>18</h2>
                  <small className="text-success">↑ 8% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Avg. Commission</h6>
                  <h2>4.5%</h2>
                  <small className="text-warning">– 0% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Commission Payout</h6>
                  <h2>$8.7K</h2>
                  <small className="text-success">↑ 5.2% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Rule Performance</h6>
                  <h2>92%</h2>
                  <small className="text-success">↑ 3.7% from last month</small>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Flow */}
          <div className="card p-4 mb-4">
            <h5 className="mb-2">Commission Flow Structure</h5>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="badge bg-primary p-3">Company<br /><br /><small>Pays commission only</small></div>
              <span>→</span>
              <div className="badge bg-primary p-3">Marine Agent<br /><br /><small>Receives from Company</small></div>
              <span>→</span>
              <div className="badge bg-primary p-3">Commercial Agent<br /><br /><small>Receives from Marine</small></div>
              <span>→</span>
              <div className="badge bg-primary p-3">Selling Agent<br /><br /><small>Receives from Commercial</small></div>
              <span>→</span>
              <div className="badge bg-primary p-3">Salesman<br /><br /><small>Receives from Selling</small></div>
            </div>
          </div>

          {/* Table Card */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <ul className="nav nav-pills mb-3" role="tablist">
                    <li className="nav-item">
                      <button className="nav-link active" id="Commission Rules-tab" data-bs-toggle="pill" data-bs-target="#commission-rules" type="button" role="tab">Commission Rules</button>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link" id="commission-history-tab" data-bs-toggle="pill" data-bs-target="#commission-history" type="button" role="tab">History</button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="commission-rules">
                      <div className="row mb-3 g-2">
                        <div className="col-md-3">
                          <input type="text" className="form-control" placeholder="Search commission rules..." />
                        </div>
                        <div className="col-md-3">
                          <select className="form-select">
                            <option>All Companies</option>
                            <option>Company A</option>
                            <option>Company B</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select className="form-select">
                            <option>All Layers</option>
                            <option>Layer 1</option>
                            <option>Layer 2</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select className="form-select">
                            <option>All Statuses</option>
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </div>
                      </div>

                      <div className="table-responsive">
                        {/* keep id "example" same as HTML */}
                        <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th><input type="checkbox" /></th>
                              <th>Rule Name</th>
                              <th>Flow</th>
                              <th>Commission</th>
                              <th>Services</th>
                              <th>Routes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>Company to Marine Commission</td>
                              <td>Company → Marine Agent</td>
                              <td>5%</td>
                              <td>
                                <span className="badge badge-service">Passenger</span>
                                <span className="badge badge-service">Cargo</span>
                                <span className="badge badge-service">Vehicle</span>
                              </td>
                              <td>Muscat → Dubai → Abu Dhabi</td>
                            </tr>
                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>Marine to Commercial Commission</td>
                              <td>Marine Agent → Commercial Agent</td>
                              <td>4%</td>
                              <td>
                                <span className="badge badge-service">Passenger</span>
                                <span className="badge badge-service">Vehicle</span>
                              </td>
                              <td>Muscat → Dubai</td>
                            </tr>
                            {/* Additional rows kept identical to HTML as needed */}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="commission-history">
                      <div className="history-card">
                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <select className="form-select">
                              <option>All Rules</option>
                              <option>Company to Marine</option>
                              <option>Commercial to Selling</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <select className="form-select">
                              <option>All Actions</option>
                              <option>Created</option>
                              <option>Updated</option>
                              <option>Activated</option>
                              <option>Deleted</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <select className="form-select">
                              <option>Last 7 Days</option>
                              <option>Last 30 Days</option>
                              <option>Last 6 Months</option>
                            </select>
                          </div>
                          <div className="col-md-1 d-grid">
                            <button className="btn btn-primary">Apply</button>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-primary-subtle">
                          <span className="badge bg-primary">Updated</span>
                          <h6 className="mt-2">Company to Marine Commission</h6>
                          <p>Commission changed from 4% to 5%</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By John Doe • 12 Aug 2023, 10:30 AM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-success-subtle">
                          <span className="badge bg-success">Created</span>
                          <h6 className="mt-2">Marine to Commercial Commission</h6>
                          <p>New commission rule created with 4% rate</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By Jane Smith • 10 Aug 2023, 2:15 PM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-warning-subtle">
                          <span className="badge bg-warning text-dark">Activated</span>
                          <h6 className="mt-2">Commercial to Selling Commission</h6>
                          <p>Commission rule activated after review</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By Mike Johnson • 05 Aug 2023, 9:45 AM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-danger-subtle">
                          <span className="badge bg-danger">Deleted</span>
                          <h6 className="mt-2">Old Salesman Commission</h6>
                          <p>Commission rule deleted as no longer needed</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By Mike Johnson • 01 Aug 2023, 5:00 PM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                      </div>
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
