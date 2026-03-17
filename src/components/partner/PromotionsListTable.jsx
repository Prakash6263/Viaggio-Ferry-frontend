'use client';

import React, { useEffect, useState } from "react";
import Can from "../CanDisable"; // Import CanDisable component
import { promotionApi } from "../../api/promotionApi";

export default function PromotionsListTable() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promotionApi.getPromotions(pagination.page, pagination.limit);
      console.log("[v0] Promotions response:", response);
      if (response && response.data) {
        setPromotions(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching promotions:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || !promotions.length) return;
    
    const el = document.getElementById("promotionsTable");
    if (!el || !window.DataTable) return;

    try { if (el._dt) { el._dt.destroy(); el._dt = null; } } catch {}

    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true,
      columnDefs: [
        { orderable: false, targets: -1 } // disable sorting on Actions column
      ],
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });
    el._dt = dt;
    return () => { try { dt.destroy(); } catch {} el._dt = null; };
  }, [promotions, loading]);

  const getStatusClass = (status) => {
    if (status === "Active") return "status-active";
    if (status === "Scheduled") return "status-scheduled";
    if (status === "Expired") return "status-expired";
    return "status-inactive";
  };

  const formatBenefitValue = (benefit) => {
    if (!benefit || !benefit.isEnabled) return "-";
    return benefit.valueType === "percentage" ? `${benefit.value}%` : `${benefit.value} units`;
  };

  const formatBenefitsColumn = (promo) => {
    const benefits = [];
    
    if (promo.passengerBenefit && promo.passengerBenefit.isEnabled) {
      benefits.push(`Passenger: ${formatBenefitValue(promo.passengerBenefit)}`);
    }
    if (promo.cargoBenefit && promo.cargoBenefit.isEnabled) {
      benefits.push(`Cargo: ${formatBenefitValue(promo.cargoBenefit)}`);
    }
    if (promo.vehicleBenefit && promo.vehicleBenefit.isEnabled) {
      benefits.push(`Vehicle: ${formatBenefitValue(promo.vehicleBenefit)}`);
    }
    if (promo.serviceBenefits && promo.serviceBenefits.length > 0) {
      promo.serviceBenefits.forEach((service) => {
        const serviceValue = service.valueType === "percentage" ? `${service.value}%` : `${service.value} units`;
        benefits.push(`${service.title}: ${serviceValue}`);
      });
    }
    
    return benefits.length > 0 ? benefits.join("\n") : "-";
  };

  const formatEligibilityColumn = (promo) => {
    const eligibility = [];
    
    if (promo.passengerBenefit && promo.passengerBenefit.isEnabled) {
      eligibility.push(`Passenger: ${formatBenefitValue(promo.passengerBenefit)}`);
    }
    if (promo.cargoBenefit && promo.cargoBenefit.isEnabled) {
      eligibility.push(`Cargo: ${formatBenefitValue(promo.cargoBenefit)}`);
    }
    if (promo.vehicleBenefit && promo.vehicleBenefit.isEnabled) {
      eligibility.push(`Vehicle: ${formatBenefitValue(promo.vehicleBenefit)}`);
    }
    
    return eligibility.length > 0 ? eligibility.join("\n") : "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="card-table card p-2">
        <div className="card-body text-center">
          <p>Loading promotions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-table card p-2">
        <div className="card-body text-center text-danger">
          <p>Error loading promotions: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        <div className="table-responsive">
          <table id="promotionsTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Promotion Name</th>
                <th>Status</th>
                <th>Basis</th>
                <th>Benefits</th>
                <th>Eligibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="promotions-table-body">
              {promotions && promotions.length > 0 ? (
                promotions.map((promo) => (
                  <tr key={promo._id}>
                    <td>{promo.promotionName}</td>
                    <td><span className={`status ${getStatusClass(promo.status)}`}>{promo.status}</span></td>
                    <td>
                      {promo.promotionBasis === "Trip" && promo.trip ? `Trip: ${promo.trip.tripName}` : `Period: ${formatDate(promo.startDate)} - ${formatDate(promo.endDate)}`}
                    </td>
                    <td style={{ whiteSpace: "pre-line" }}>{formatBenefitsColumn(promo)}</td>
                    <td style={{ whiteSpace: "pre-line" }}>{formatEligibilityColumn(promo)}</td>
                    <td>
                      <Can action="update" path="/company/partner-management/promotions">
                        <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil"></i></button>
                      </Can>
                      <Can action="delete" path="/company/partner-management/promotions">
                        <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash"></i></button>
                      </Can>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No promotions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
