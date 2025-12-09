import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";

export default function CompanyProfile() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Top Bar */}
          <div className="top-bar d-flex justify-content-between align-items-center">
            <div></div>
            {/* Right icons – bars (cards) active, grid (list) normal */}
            <div>
              <Link
                to="/company/settings/company-profile"
                className="actives me-3"
              >
                <i className="fa-solid fa-bars fa-lg" />
              </Link>
              <Link to="/company/settings/company-profile-list">
                <i className="fa-solid fa-th-large fa-lg" />
              </Link>
            </div>
          </div>

          {/* Company Cards */}
          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-3">
              <div className="card p-3 card-purple text-center">
                <div className="circle-avatar bg-primary">OVL</div>
                <h6>Oceanic Ventures Ltd.</h6>
                <p className="text-muted mb-1">USA</p>
                <span className="badge bg-success status-badge">Active</span>
                <div className="mt-3">
                  <button className="btn btn-sm btn-primary">Edit</button>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-3">
              <div className="card p-3 card-purple text-center">
                <div className="circle-avatar bg-success">MLI</div>
                <h6>Marine Logistics Inc.</h6>
                <p className="text-muted mb-1">Canada</p>
                <span className="badge bg-warning text-dark status-badge">
                  Pending
                </span>
                <div className="mt-3">
                  <button className="btn btn-sm btn-primary">Edit</button>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-3">
              <div className="card p-3 card-purple text-center">
                <div className="circle-avatar bg-warning">SBF</div>
                <h6>Sea Breeze Ferries</h6>
                <p className="text-muted mb-1">UK</p>
                <span className="badge bg-success status-badge">Active</span>
                <div className="mt-3">
                  <button className="btn btn-sm btn-primary">Edit</button>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-3">
              <div className="card p-3 card-purple text-center">
                <div className="circle-avatar bg-info">GSC</div>
                <h6>Global Shipping Co.</h6>
                <p className="text-muted mb-1">Australia</p>
                <span className="badge bg-success status-badge">Active</span>
                <div className="mt-3">
                  <button className="btn btn-sm btn-primary">Edit</button>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="col-md-3">
              <div className="card p-3 card-purple text-center">
                <div className="circle-avatar bg-danger">AP</div>
                <h6>Atlantic Passage</h6>
                <p className="text-muted mb-1">Germany</p>
                <span className="badge bg-warning text-dark status-badge">
                  Pending
                </span>
                <div className="mt-3">
                  <button className="btn btn-sm btn-primary">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
