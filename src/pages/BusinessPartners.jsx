// src/pages/BusinessPartnersPage.jsx
import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import PartnerList from "../components/businessPartners/PartnerList";
import PartnerKanban from "../components/businessPartners/PartnerKanban";
import PartnerModal from "../components/businessPartners/PartnerModal";

export default function BusinessPartnersPage() {
  const [view, setView] = useState("list"); // "list" | "kanban"
  const [modalOpen, setModalOpen] = useState(false);

  const partners = [
    { id: 1, name: "Marine Transport Co.", phone: "+123456789", address: "123 Ocean St.", layer: "Marine", status: "Active" },
    { id: 2, name: "Commercial Freight Inc.", phone: "+987654321", address: "456 Main St.", layer: "Commercial", status: "Active" },
    { id: 3, name: "Selling Solutions Ltd.", phone: "+1122334455", address: "789 Market Ave.", layer: "Selling", status: "Inactive" },
  ];

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Partners</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <button id="add-partner-btn" className="btn btn-turquoise" onClick={() => setModalOpen(true)}>
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i> Add New Partner
                    </button>
                  </li>
                  <li>
                    <div className="me-5">
                      <a
                        id="list-btn"
                        className={`btn btn-sm btn-outline-secondary me-2 ${view === "list" ? "active" : ""}`}
                        style={{ padding: 5, borderRadius: 5 }}
                        onClick={() => setView("list")}
                      >
                        <i className="fa-solid fa-bars fa-lg"></i>
                      </a>
                      <a
                        id="kanban-btn"
                        className={`btn btn-sm btn-outline-secondary ${view === "kanban" ? "active" : ""}`}
                        style={{ padding: 5, borderRadius: 5 }}
                        onClick={() => setView("kanban")}
                      >
                        <i className="fa-solid fa-th-large fa-lg"></i>
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="card card-table p-2 d-flex">
            <div className="card-body">
              {view === "list" ? <PartnerList partners={partners} /> : <PartnerKanban partners={partners} />}
            </div>

          <PartnerModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={(payload) => {
            console.log("Saved partner (mock):", payload);
            setModalOpen(false);
          }} />
                    </div>

        </div>
      </PageWrapper>
    </div>
  );
}
