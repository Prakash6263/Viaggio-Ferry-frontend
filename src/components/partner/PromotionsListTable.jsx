'use client';

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import Can from "../Can";
import { usePermissions } from "../../hooks/usePermissions";
import { promotionApi } from "../../api/promotionApi";
import Swal from "sweetalert2";

export default function PromotionsListTable() {
  const navigate = useNavigate();
  const permissions = usePermissions("/company/partner-management/promotions");
  const canUpdate = permissions?.update === true;
  const canDelete = permissions?.delete === true;
  const showActionsColumn = canUpdate || canDelete;
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleDeletePromotion = async (promotionId, promotionName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the promotion "${promotionName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await promotionApi.deletePromotion(promotionId);

        // Immediately remove from state so table re-renders without stale data
        setPromotions((prev) => prev.filter((p) => p._id !== promotionId));

        Swal.fire({
          title: "Deleted!",
          text: "The promotion has been successfully deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("[v0] Error deleting promotion:", err.message);
        Swal.fire({
          title: "Error!",
          text: `Failed to delete promotion: ${err.message}`,
          icon: "error",
        });
      }
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

  const formatServiceBenefit = (service, serviceName) => {
    if (!service || !service.isEnabled) return null;
    
    if (service.calculationType === "quantity" && service.buyX && service.getY) {
      return `${serviceName}: Buy ${service.buyX} Get ${service.getY}`;
    } else if (service.calculationType === "totalValue" && service.minValue && service.discountValue) {
      const discountStr = service.discountType === "percentage" 
        ? `${service.discountValue}% off` 
        : `${service.discountValue} off`;
      return `${serviceName}: Min ${service.minValue}, ${discountStr}`;
    }
    return `${serviceName}: Enabled`;
  };

  const formatBenefitsColumn = (promo) => {
    const benefits = [];
    const sp = promo.servicePromotions;
    
    if (sp) {
      const passengerBenefit = formatServiceBenefit(sp.passenger, "Passenger");
      if (passengerBenefit) benefits.push(passengerBenefit);
      
      const cargoBenefit = formatServiceBenefit(sp.cargo, "Cargo");
      if (cargoBenefit) benefits.push(cargoBenefit);
      
      const vehicleBenefit = formatServiceBenefit(sp.vehicle, "Vehicle");
      if (vehicleBenefit) benefits.push(vehicleBenefit);
    }
    
    return benefits.length > 0 ? benefits.join("\n") : "-";
  };

  const formatEligibilityColumn = (promo) => {
    const eligibility = [];
    const sp = promo.servicePromotions;
    
    if (sp) {
      // Passenger eligibility
      if (sp.passenger && sp.passenger.isEnabled && sp.passenger.eligibility?.length > 0) {
        const passengerItems = sp.passenger.eligibility.map(e => {
          const parts = [];
          if (e.cabinId?.name) parts.push(e.cabinId.name);
          if (e.passengerTypeId?.name) parts.push(e.passengerTypeId.name);
          return parts.join(" - ");
        }).filter(Boolean);
        if (passengerItems.length > 0) {
          eligibility.push(`Passenger: ${passengerItems.join(", ")}`);
        }
      }
      
      // Cargo eligibility
      if (sp.cargo && sp.cargo.isEnabled && sp.cargo.eligibility?.length > 0) {
        const cargoItems = sp.cargo.eligibility.map(e => {
          if (e.payloadId?.name) return e.payloadId.name;
          return null;
        }).filter(Boolean);
        if (cargoItems.length > 0) {
          eligibility.push(`Cargo: ${cargoItems.join(", ")}`);
        }
      }
      
      // Vehicle eligibility
      if (sp.vehicle && sp.vehicle.isEnabled && sp.vehicle.eligibility?.length > 0) {
        const vehicleItems = sp.vehicle.eligibility.map(e => {
          if (e.payloadId?.name) return e.payloadId.name;
          return null;
        }).filter(Boolean);
        if (vehicleItems.length > 0) {
          eligibility.push(`Vehicle: ${vehicleItems.join(", ")}`);
        }
      }
    }
    
    return eligibility.length > 0 ? eligibility.join("\n") : "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
            <CirclesWithBar
              height="100"
              width="100"
              color="#05468f"
              outerCircleColor="#05468f"
              innerCircleColor="#05468f"
              barColor="#05468f"
              ariaLabel="circles-with-bar-loading"
              visible={true}
            />
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-responsive">
            <table id="promotionsTable" className="table table-striped" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Promotion Name</th>
                      <th>Status</th>
                      <th>Basis</th>
                      <th>Benefits</th>
                      <th>Eligibility</th>
                      {showActionsColumn && <th>Actions</th>}
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
                          {showActionsColumn && (
                            <td className="action-buttons">
                              <Can action="update" path="/company/partner-management/promotions">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => navigate(`/company/partner-management/promotions/${promo._id}/edit`)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </Can>
                              <Can action="delete" path="/company/partner-management/promotions">
                                <button
                                  className="btn btn-outline-danger btn-sm ms-1"
                                  onClick={() => handleDeletePromotion(promo._id, promo.promotionName)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </Can>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={showActionsColumn ? "6" : "5"} className="text-center">No promotions found</td>
                      </tr>
                    )}
                  </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
