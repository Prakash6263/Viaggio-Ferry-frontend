'use client';

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import { Sidebar } from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { PageWrapper } from "../components/layout/PageWrapper";
import CabinForm from "../components/cabin/CabinForm";
import Can from "../components/Can";
import { cabinsApi } from "../api/cabinsApi";

export default function EditCabin() {
  const { cabinId } = useParams();
  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCabin = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await cabinsApi.getCabinById(cabinId);
        console.log("[v0] API Response:", response);

        // Extract cabin data from nested structure
        let cabinData = response;
        if (response?.data && typeof response.data === "object") {
          cabinData = response.data;
        }

        console.log("[v0] Cabin data loaded:", cabinData);
        setCabin(cabinData);
      } catch (err) {
        console.error("[v0] Error loading cabin:", err);
        setError(err.message || "Failed to load cabin");
      } finally {
        setLoading(false);
      }
    };

    if (cabinId) {
      fetchCabin();
    }
  }, [cabinId]);

  if (loading) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <CirclesWithBar
              height="80"
              width="80"
              color="#05468f"
              outerCircleColor="#05468f"
              innerCircleColor="#05468f"
              barColor="#05468f"
              ariaLabel="circles-with-bar-loading"
              visible={true}
            />
          </div>
        </PageWrapper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-wrapper">
        <Header />
        <Sidebar />
        <PageWrapper>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Cabin</h4>
            <p>{error}</p>
            <hr />
            <Link to="/company/settings/cabin" className="btn btn-turquoise">
              Back to List
            </Link>
          </div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <Can action="update" path="/company/settings/cabin">
          <div className="content container-fluid">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/company/settings/cabin" className="btn btn-turquoise">
                <i className="bi bi-arrow-left"></i> Back to List
              </Link>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-2">
                  <div className="card-body">
                    <h5 className="mb-3">
                      Edit Cabin
                      {cabin && cabin.name && ` - ${cabin.name}`}
                    </h5>
                    {cabin && <CabinForm cabinId={cabinId} initialData={cabin} />}
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
