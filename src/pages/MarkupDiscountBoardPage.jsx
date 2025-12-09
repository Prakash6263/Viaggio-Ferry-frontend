import React, { useEffect, useRef } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";
/**
 * MarkupDiscountBoardPage
 * - exact markup / classes preserved from markup-discountboard.html
 * - safe DataTable init: only init if not already initialized
 * - theme toggle wired to update documentElement attribute (same as html)
 */
export default function MarkupDiscountBoardPage() {
  const tableRef = useRef(null);
  const themeBtnRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // If DataTable already attached to element, skip re-initializing.
    // This prevents double-init when template script is also included.
    if (!el._dt && window.DataTable) {
      try {
        el._dt = new window.DataTable(el, {});
      } catch (err) {
        console.error("DataTable init error:", err);
      }
    }

    // cleanup not destroying here intentionally: if public script created DataTable,
    // we avoid destroying it because it may be managed elsewhere.
    return () => {
      // only destroy if we created it (we stored it on el._dt)
      try {
        if (el && el._dt && typeof el._dt.destroy === "function") {
          // destroy only if element still connected
          if (el.isConnected || document.contains(el)) {
            el._dt.destroy();
          } else {
            try { el._dt.destroy(); } catch (e) { /* ignore */ }
          }
          el._dt = null;
        }
      } catch (e) {
        // defensive
      }
    };
  }, []);

  useEffect(() => {
    // theme toggle behavior, matching the inline script in original HTML
    const btn = themeBtnRef.current;
    if (!btn) return;
    const html = document.documentElement;

    // initialize icon
    if (localStorage.getItem("theme") === "dark") {
      html.setAttribute("data-theme", "dark");
      btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
      btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
    }

    const onClick = () => {
      if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    };

    btn.addEventListener("click", onClick);
    return () => btn.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="main-wrapper">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Page wrapper (keeps same outer wrapper as original) */}
      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Markup &amp; Discount Management</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <button className="btn btn-secondary me-2">Export</button>
                  </li>
                  <li>
                    <Link className="btn btn-turquoise" to="/company/markup/add-rule">
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Rule
                    </Link>
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
                  <h6>Total Rules</h6>
                  <h2>24</h2>
                  <small className="text-success">↑ 12% from last month</small>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Avg. Markup</h6>
                  <h2>7.2%</h2>
                  <small className="text-warning">– 0% from last month</small>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Revenue Impact</h6>
                  <h2>$12.4K</h2>
                  <small className="text-success">↑ 8.3% from last month</small>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Rule Performance</h6>
                  <h2>87%</h2>
                  <small className="text-success">↑ 5.1% from last month</small>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Flow */}
          <div className="card p-4 mb-4">
            <h5 className="mb-2">Commission Flow Structure</h5>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="badge bg-primary p-3">
                Company
                <br />
                <br />
                <small>Sets markup/discount rules</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Marine Agent
                <br />
                <br />
                <small>Applies to services</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Commercial Agent
                <br />
                <br />
                <small>Further adjustments</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Selling Agent
                <br />
                <br />
                <small>Final pricing</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Customer
                <br />
                <br />
                <small>Receives final price</small>
              </div>
            </div>
          </div>

          {/* Card/Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <ul className="nav nav-pills mb-3" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="Commission Rules-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#rule-list"
                        type="button"
                        role="tab"
                      >
                        Rules list
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="commission-history-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#rule-history"
                        type="button"
                        role="tab"
                      >
                        History
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* RULES LIST TAB */}
                    <div className="tab-pane fade show active" id="rule-list">
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
                        <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th><input type="checkbox" /></th>
                              <th>Rule Name</th>
                              <th>Type</th>
                              <th>Value</th>
                              <th>Applied To</th>
                              <th>Services</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>
                                Marine Agent Markup <div className="rule-sub">Created: 12 Aug 2023</div>
                              </td>
                              <td><span className="badge badge-markup">Markup</span></td>
                              <td>5%</td>
                              <td>Company → Marine Agent</td>
                              <td>
                                <span className="service-badge">Passenger</span>
                                <span className="service-badge">Cargo</span>
                                <span className="service-badge">Vehicle</span>
                              </td>
                              <td><span className="badge badge-status-active">Active</span></td>
                              <td className="action-icons">
                                <button className="btn btn-sm btn-primary-navy"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-sm btn-danger"><i className="bi bi-trash3"></i></button>
                              </td>
                            </tr>

                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>
                                Commercial Agent Discount <div className="rule-sub">Created: 10 Aug 2023</div>
                              </td>
                              <td><span className="badge badge-discount">Discount</span></td>
                              <td>3%</td>
                              <td>Marine Agent → Commercial Agent</td>
                              <td>
                                <span className="service-badge">Passenger</span>
                                <span className="service-badge">Vehicle</span>
                              </td>
                              <td><span className="badge badge-status-active">Active</span></td>
                              <td className="action-icons">
                                <button className="btn btn-sm btn-primary-navy"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-sm btn-danger"><i className="bi bi-trash3"></i></button>
                              </td>
                            </tr>

                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>
                                Selling Agent Cargo Markup <div className="rule-sub">Created: 05 Aug 2023</div>
                              </td>
                              <td><span className="badge badge-markup">Markup</span></td>
                              <td>10%</td>
                              <td>Commercial Agent → Selling Agent</td>
                              <td>
                                <span className="service-badge">Cargo</span>
                              </td>
                              <td><span className="badge badge-status-active">Active</span></td>
                              <td className="action-icons">
                                <button className="btn btn-sm btn-primary-navy"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-sm btn-danger"><i className="bi bi-trash3"></i></button>
                              </td>
                            </tr>

                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>
                                Salesman Passenger Discount <div className="rule-sub">Created: 01 Aug 2023</div>
                              </td>
                              <td><span className="badge badge-discount">Discount</span></td>
                              <td>2%</td>
                              <td>Selling Agent → Salesman</td>
                              <td>
                                <span className="service-badge">Passenger</span>
                              </td>
                              <td><span className="badge badge-status-pending">Pending</span></td>
                              <td className="action-icons">
                                <button className="btn btn-sm btn-primary-navy"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-sm btn-danger"><i className="bi bi-trash3"></i></button>
                              </td>
                            </tr>

                            <tr>
                              <td><input type="checkbox" /></td>
                              <td>
                                Company A Vehicle Markup <div className="rule-sub">Created: 28 Jul 2023</div>
                              </td>
                              <td><span className="badge badge-markup">Markup</span></td>
                              <td>7%</td>
                              <td>Company → Marine Agent</td>
                              <td>
                                <span className="service-badge">Vehicle</span>
                              </td>
                              <td><span className="badge badge-status-active">Active</span></td>
                              <td className="action-icons">
                                <button className="btn btn-sm btn-primary-navy"><i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-sm btn-danger"><i className="bi bi-trash3"></i></button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* HISTORY TAB */}
                    <div className="tab-pane fade" id="rule-history">
                      <div className="history-card">
                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <select className="form-select">
                              <option>All Rules</option>
                              <option>Marine Agent Markup</option>
                              <option>Commercial Agent Discount</option>
                              <option>Selling Agent Cargo Markup</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <select className="form-select">
                              <option>All Actions</option>
                              <option>Created</option>
                              <option>Updated</option>
                              <option>Activated</option>
                              <option>Deactivated</option>
                              <option>Deleted</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <select className="form-select">
                              <option>Last 7 Days</option>
                              <option>Last 30 Days</option>
                              <option>Last 90 Days</option>
                              <option>Custom Range</option>
                            </select>
                          </div>
                          <div className="col-md-1 d-grid">
                            <button className="btn btn-primary">Apply</button>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-primary-subtle">
                          <span className="badge bg-primary">Updated</span>
                          <h6 className="mt-2">Marine Agent Markup</h6>
                          <p>Value changed from 4% to 5%</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By John Doe • 12 Aug 2023, 10:30 AM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-success-subtle">
                          <span className="badge bg-success">Created</span>
                          <h6 className="mt-2">Commercial Agent Discount</h6>
                          <p>New rule created with 3% discount</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By Jane Smith • 10 Aug 2023, 2:15 PM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-warning-subtle">
                          <span className="badge bg-warning text-dark">Activated</span>
                          <h6 className="mt-2">Selling Agent Cargo Markup</h6>
                          <p>Rule activated after review</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By Mike Johnson • 05 Aug 2023, 9:45 AM</span>
                            <a href="#" className="view-link">View Details</a>
                          </div>
                        </div>

                        <div className="history-item border-start border-4 border-danger-subtle">
                          <span className="badge bg-danger">Deleted</span>
                          <h6 className="mt-2">Old Passenger Discount</h6>
                          <p>Rule deleted as no longer needed</p>
                          <div className="d-flex justify-content-between">
                            <span className="history-meta">By Sarah Williams • 01 Aug 2023, 4:20 PM</span>
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
