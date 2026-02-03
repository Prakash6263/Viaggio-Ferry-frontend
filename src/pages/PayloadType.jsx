'use client';

import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Can from "../components/Can";
import PayloadTypeTable from "../components/payloadTypes/PayloadTypeTable";
import PayloadTypeModal from "../components/payloadTypes/PayloadTypeModal";

const PayloadType = () => {
  const [activeTab, setActiveTab] = useState("passenger");
  const [editingData, setEditingData] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleEdit = (payloadType) => {
    setEditingData(payloadType);
    // Trigger modal to open
    setTimeout(() => {
      const modalElement = document.getElementById(`${payloadType.category || activeTab}Modal`);
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 0);
  };

  const handleCreateNew = () => {
    setEditingData(null);
  };

  const handleSuccess = () => {
    setRefreshCounter((prev) => prev + 1);
    setEditingData(null);
  };

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <Can action="read">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Payload Type Management</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Can action="create" path="/company/settings/payload-type">
                      <button
                        className="btn btn-turquoise"
                        onClick={handleCreateNew}
                        data-bs-toggle="modal"
                        data-bs-target={`#${activeTab}Modal`}
                        type="button"
                      >
                        <i className="fa fa-plus-circle me-2"></i>
                        Add New Payload Type
                      </button>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* Tabs */}
                  <ul className="nav nav-tabs" id="payloadTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "passenger" ? "active" : ""
                        }`}
                        id="passenger-tab"
                        type="button"
                        role="tab"
                        aria-controls="passenger"
                        aria-selected={activeTab === "passenger"}
                        onClick={() => setActiveTab("passenger")}
                      >
                        <i className="bi bi-people-fill"></i> Passenger Types
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "cargo" ? "active" : ""
                        }`}
                        id="cargo-tab"
                        type="button"
                        role="tab"
                        aria-controls="cargo"
                        aria-selected={activeTab === "cargo"}
                        onClick={() => setActiveTab("cargo")}
                      >
                        <i className="bi bi-box-seam"></i> Cargo Types
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "vehicle" ? "active" : ""
                        }`}
                        id="vehicle-tab"
                        type="button"
                        role="tab"
                        aria-controls="vehicle"
                        aria-selected={activeTab === "vehicle"}
                        onClick={() => setActiveTab("vehicle")}
                      >
                        <i className="bi bi-truck-front-fill"></i> Vehicle Types
                      </button>
                    </li>
                  </ul>

                  {/* Tab Contents */}
                  <div className="tab-content" id="payloadTabsContent" style={{ paddingTop: "20px" }}>
                    {/* Passenger Types Tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "passenger" ? "show active" : ""
                      }`}
                      id="passenger"
                      role="tabpanel"
                      aria-labelledby="passenger-tab"
                    >
                      <PayloadTypeTable
                        key={`passenger-${refreshCounter}`}
                        type="passenger"
                        onEdit={handleEdit}
                        onRefresh={handleRefresh}
                      />
                    </div>

                    {/* Cargo Types Tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "cargo" ? "show active" : ""
                      }`}
                      id="cargo"
                      role="tabpanel"
                      aria-labelledby="cargo-tab"
                    >
                      <PayloadTypeTable
                        key={`cargo-${refreshCounter}`}
                        type="cargo"
                        onEdit={handleEdit}
                        onRefresh={handleRefresh}
                      />
                    </div>

                    {/* Vehicle Types Tab */}
                    <div
                      className={`tab-pane fade ${
                        activeTab === "vehicle" ? "show active" : ""
                      }`}
                      id="vehicle"
                      role="tabpanel"
                      aria-labelledby="vehicle-tab"
                    >
                      <PayloadTypeTable
                        key={`vehicle-${refreshCounter}`}
                        type="vehicle"
                        onEdit={handleEdit}
                        onRefresh={handleRefresh}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Can>

        {/* Modals for each type */}
        <PayloadTypeModal
          type="passenger"
          onSuccess={handleSuccess}
          editingData={activeTab === "passenger" ? editingData : null}
        />
        <PayloadTypeModal
          type="cargo"
          onSuccess={handleSuccess}
          editingData={activeTab === "cargo" ? editingData : null}
        />
        <PayloadTypeModal
          type="vehicle"
          onSuccess={handleSuccess}
          editingData={activeTab === "vehicle" ? editingData : null}
        />
      </PageWrapper>
    </div>
  );
};

export default PayloadType;
