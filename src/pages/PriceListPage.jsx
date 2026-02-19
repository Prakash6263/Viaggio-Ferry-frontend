'use client';

import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import PriceTable from "../components/pricelist/PriceTable";
import PriceDetailsForm from "../components/pricelist/PriceDetailsForm";
import { Link } from "react-router-dom";
import Can from "../components/Can";
import CanDisable from "../components/CanDisable";

/**
 * PriceListPage
 * - composes PriceTable and PriceDetailsForm
 * - keeps original markup: tabs, list/details views, selects with tags behavior
 */
export default function PriceListPage() {
  const [activeTab, setActiveTab] = useState("passenger"); // passenger | vehicle | cargo
  const [showDetailsFor, setShowDetailsFor] = useState(null); // null or "passenger"/"vehicle"/"cargo"
  const [refreshKey, setRefreshKey] = useState(0); // trigger for table refresh
  const [selectedPriceListId, setSelectedPriceListId] = useState(null); // for edit mode

  useEffect(() => {
    // Initialize tab on mount only
    setActiveTab("passenger");
  }, []);

  // handlers for showDetails/showList (keeps same names as original functions)
  const showDetails = (which, priceListId = null) => {
    setShowDetailsFor(which); // 'passenger', 'vehicle', 'cargo'
    setSelectedPriceListId(priceListId); // null for create, ID for edit
  };

  const showList = () => {
    setShowDetailsFor(null);
    setSelectedPriceListId(null);
    // Trigger table refresh when going back from details view
    setRefreshKey(prev => prev + 1);
  };

  // small helper to render correct tab-pane content
  const renderTabPane = (tab) => {
    const listViewId = `${tab}-list-view`;
    const detailsViewId = `${tab}-details-view`;

    if (showDetailsFor === tab) {
      return <div id={detailsViewId} className="details-view"><PriceDetailsForm idPrefix={tab} onBack={showList} priceListId={selectedPriceListId} /></div>;
    }

    // list view
    return (
      <div id={listViewId} className="list-view">
        <Can action="create" path="/company/pricing/pricelist">
          <button className={tab === "passenger" ? "mb-4 btn btn-success fw-medium" : "mb-4 btn btn-turquoise fw-medium"}
                  onClick={() => showDetails(tab)}>
            Add New Price List
          </button>
        </Can>
        <PriceTable category={tab} refreshTrigger={refreshKey} onRowClick={(row) => showDetails(tab, row._id)} />
      </div>
    );
  };

  // hook to wire tab buttons (keeps exact classes and data attributes)
  useEffect(() => {
    // nothing to do: we control tab state via React
    // keep this effect in case you need DOM fallback later
  }, [activeTab]);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* READ permission gate - hide entire page if no read access */}
        <Can action="read">
          <div className="content container-fluid">
            <div className="page-header">
              <div className="content-page-header">
                <h5>Price List</h5>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-3">
                  <div className="card-body">
                    <ul className="nav nav-tabs mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        id="passenger-tab-btn"
                        className={`nav-link tab-btn ${activeTab === "passenger" ? "active" : ""}`}
                        data-bs-toggle="tab"
                        data-bs-target="#passenger-tab"
                        type="button"
                        role="tab"
                        aria-controls="passenger-tab"
                        aria-selected={activeTab === "passenger"}
                        onClick={() => { setActiveTab("passenger"); }}
                      >
                        Passenger
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        id="vehicle-tab-btn"
                        className={`nav-link tab-btn ${activeTab === "vehicle" ? "active" : ""}`}
                        data-bs-toggle="tab"
                        data-bs-target="#vehicle-tab"
                        type="button"
                        role="tab"
                        aria-controls="vehicle-tab"
                        aria-selected={activeTab === "vehicle"}
                        onClick={() => { setActiveTab("vehicle"); }}
                      >
                        Vehicle
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        id="cargo-tab-btn"
                        className={`nav-link tab-btn ${activeTab === "cargo" ? "active" : ""}`}
                        data-bs-toggle="tab"
                        data-bs-target="#cargo-tab"
                        type="button"
                        role="tab"
                        aria-controls="cargo-tab"
                        aria-selected={activeTab === "cargo"}
                        onClick={() => { setActiveTab("cargo"); }}
                      >
                        Cargo
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <div id="passenger-tab" className={`tab-pane fade ${activeTab === "passenger" ? "show active" : ""}`} role="tabpanel">
                      <h2 className="mb-4">Passenger Price Lists</h2>
                      {renderTabPane("passenger")}
                      {showDetailsFor === "passenger" ? null : null}
                    </div>

                    <div id="vehicle-tab" className={`tab-pane fade ${activeTab === "vehicle" ? "show active" : ""}`} role="tabpanel">
                      <h2 className="mb-4">Vehicle Price Lists</h2>
                      {renderTabPane("vehicle")}
                    </div>

                    <div id="cargo-tab" className={`tab-pane fade ${activeTab === "cargo" ? "show active" : ""}`} role="tabpanel">
                      <h2 className="mb-4">Cargo Price Lists</h2>
                      {renderTabPane("cargo")}
                    </div>
                  </div>

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
