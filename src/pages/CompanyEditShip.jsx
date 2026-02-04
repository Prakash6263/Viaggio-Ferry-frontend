'use client';

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import AddShipForm from "../components/ships/AddShipForm";
import { shipsApi } from "../api/shipsApi";

export default function CompanyEditShip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ship, setShip] = useState(null);
  const [error, setError] = useState(null);

  // Fetch ship data
  useEffect(() => {
    const fetchShip = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await shipsApi.getShipById(id);
        const shipData = response.data || response;

        console.log("[v0] Fetched ship data:", shipData);
        setShip(shipData);
      } catch (err) {
        console.error("[v0] Error fetching ship:", err);
        setError("Failed to load ship details");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load ship details",
        });
        setTimeout(() => {
          navigate("/company/ship-trip/ships");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShip();
    }
  }, [id, navigate]);

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
          <div className="alert alert-danger">{error}</div>
        </PageWrapper>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="mb-3">
          <Link to="/company/ship-trip/ships" className="btn btn-turquoise">
            <i className="bi bi-arrow-left"></i> Back to List
          </Link>
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
                {ship && <AddShipForm shipId={id} initialData={ship} />}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
