import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import AddShipForm from "../components/ships/AddShipForm";
import Can from "../components/Can";

export default function CompanyEditShip() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <Can action="update">
          <div className="mb-3">
            <button className="btn btn-turquoise" onClick={() => window.history.back()}>
              <i className="bi bi-arrow-left"></i> Back to List
            </button>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Edit Ship</h5>
                  </div>
                </div>
                <div className="card-body">
                  <AddShipForm />
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
