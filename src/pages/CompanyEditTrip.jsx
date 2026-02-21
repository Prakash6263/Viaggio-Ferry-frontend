// src/pages/CompanyEditTrip.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import AddTripForm from "../components/trips/AddTripForm";
import { useNavigate, useParams } from "react-router-dom";
import Can from "../components/Can";

export default function CompanyEditTrip() {
  const navigate = useNavigate();
  const { tripId } = useParams();

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <Can action="update" path="/company/ship-trip/trips">
          <div className="content container-fluid">
            {/* Back Button */}
            <div className="mb-3">
              <button className="btn btn-turquoise" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i> Back to List
              </button>
            </div>

            <div className="row g-4">
              <div className="col-md-12">
                <div className="card flex-fill">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title">Edit Ferry Trip</h5>
                    </div>
                  </div>
                  <div className="card-body">
                    <AddTripForm tripId={tripId} isEditMode={true} />
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
