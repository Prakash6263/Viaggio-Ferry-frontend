'use client';

import React, { useState, useEffect, useRef } from "react";
import { commissionApi } from "../../api/commissionApi";

export default function RuleDetailsModal({ ruleId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ruleData, setRuleData] = useState(null);
  const closeButtonRef = useRef(null);

  // Fetch rule details when ruleId changes
  useEffect(() => {
    if (ruleId) {
      console.log("[v0] useEffect triggered with ruleId:", ruleId);
      fetchRuleDetails();
    } else {
      console.log("[v0] useEffect: ruleId is empty");
    }
  }, [ruleId]);

  // Add event listeners for when modal is shown/hidden
  useEffect(() => {
    const modalElement = document.getElementById("ruleDetailsModal");
    if (!modalElement) return;

    const handleModalShow = () => {
      console.log("[v0] Modal shown event, ruleId:", ruleId);
      if (ruleId && !ruleData && !loading) {
        console.log("[v0] Fetching details on modal show");
        fetchRuleDetails();
      }
    };

    const handleModalHide = () => {
      console.log("[v0] Modal hidden event");
      // Reset data when modal is hidden
      setRuleData(null);
      setError(null);
    };

    modalElement.addEventListener("shown.bs.modal", handleModalShow);
    modalElement.addEventListener("hidden.bs.modal", handleModalHide);

    return () => {
      modalElement.removeEventListener("shown.bs.modal", handleModalShow);
      modalElement.removeEventListener("hidden.bs.modal", handleModalHide);
    };
  }, [ruleId, ruleData, loading]);

  const fetchRuleDetails = async () => {
    if (!ruleId) {
      console.log("[v0] No ruleId provided to fetchRuleDetails");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("[v0] Fetching rule details for ID:", ruleId);

      const response = await commissionApi.getRuleById(ruleId);
      console.log("[v0] Rule details response:", response);

      if (response && response.success && response.data) {
        console.log("[v0] Setting rule data:", response.data);
        setRuleData(response.data);
      } else if (response && response.data) {
        // Handle case where response doesn't have success flag but has data
        console.log("[v0] Setting rule data (no success flag):", response.data);
        setRuleData(response.data);
      } else {
        console.error("[v0] Invalid response format:", response);
        setError("Failed to load rule details - Invalid response format");
      }
    } catch (err) {
      console.error("[v0] Error fetching rule details:", err);
      console.error("[v0] Error details:", {
        message: err.message,
        stack: err.stack,
        ruleId: ruleId
      });
      setError(err.message || "Error loading rule details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getServiceTypesList = () => {
    if (!ruleData?.serviceDetails) return [];

    const services = [];
    if (ruleData.serviceDetails.passenger?.length > 0) {
      services.push("Passenger");
    }
    if (ruleData.serviceDetails.cargo?.length > 0) {
      services.push("Cargo");
    }
    if (ruleData.serviceDetails.vehicle?.length > 0) {
      services.push("Vehicle");
    }
    return services;
  };

  const renderServiceDetails = () => {
    if (!ruleData?.serviceDetails) return <p>No service details</p>;

    return (
      <div className="row">
        {/* Passenger Section */}
        {ruleData.serviceDetails.passenger?.length > 0 && (
          <div className="col-md-12 mb-3">
            <h6 className="text-muted">Passenger Services</h6>
            <div className="list-group list-group-sm">
              {ruleData.serviceDetails.passenger.map((item, idx) => (
                <div key={idx} className="list-group-item">
                  <div className="row">
                    <div className="col-md-6">
                      <small className="text-muted">Payload Type:</small>
                      <div>{item.payloadTypeId?.name || "N/A"}</div>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">Cabin:</small>
                      <div>{item.cabinId?.name || "N/A"}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cargo Section */}
        {ruleData.serviceDetails.cargo?.length > 0 && (
          <div className="col-md-12 mb-3">
            <h6 className="text-muted">Cargo Services</h6>
            <div className="list-group list-group-sm">
              {ruleData.serviceDetails.cargo.map((item, idx) => (
                <div key={idx} className="list-group-item">
                  <small className="text-muted">Cabin:</small>
                  <div>{item.cabinId?.name || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Section */}
        {ruleData.serviceDetails.vehicle?.length > 0 && (
          <div className="col-md-12 mb-3">
            <h6 className="text-muted">Vehicle Services</h6>
            <div className="list-group list-group-sm">
              {ruleData.serviceDetails.vehicle.map((item, idx) => (
                <div key={idx} className="list-group-item">
                  <small className="text-muted">Cabin:</small>
                  <div>{item.cabinId?.name || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRoutes = () => {
    if (!ruleData?.routes || ruleData.routes.length === 0) {
      return <p>No routes</p>;
    }

    return (
      <div className="list-group list-group-sm">
        {ruleData.routes.map((route, idx) => (
          <div key={idx} className="list-group-item">
            <div className="row">
              <div className="col-md-5">
                <small className="text-muted">From:</small>
                <div>
                  {route.routeFrom?.code} ({route.routeFrom?.country || "N/A"})
                </div>
              </div>
              <div className="col-md-2 text-center">
                <i className="bi bi-arrow-right mt-2"></i>
              </div>
              <div className="col-md-5">
                <small className="text-muted">To:</small>
                <div>
                  {route.routeTo?.code} ({route.routeTo?.country || "N/A"})
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className="modal fade"
      id="ruleDetailsModal"
      tabIndex="-1"
      aria-labelledby="ruleDetailsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title" id="ruleDetailsModalLabel">
              Rule Details
            </h5>
            <button
              ref={closeButtonRef}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="alert alert-danger" role="alert">
                <strong>Error!</strong> {error}
                <div className="mt-2">
                  <small className="text-muted">Rule ID: {ruleId}</small>
                </div>
              </div>
            )}

            {!loading && !error && ruleData && (
              <div className="rule-details">
                {/* Basic Information */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Rule Name</small>
                      <strong>{ruleData.ruleName || "N/A"}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Status</small>
                      <span className={`badge ${ruleData.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                        {ruleData.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Commission Information */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Commission Type</small>
                      <strong>{ruleData.commissionType === "percentage" ? "Percentage (%)" : "Fixed Amount"}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Commission Value</small>
                      <strong>
                        {ruleData.commissionValue}
                        {ruleData.commissionType === "percentage" ? "%" : ""}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Provider Type</small>
                      <strong>{ruleData.providerType || "N/A"}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Provider Company</small>
                      <strong>{ruleData.providerCompany?.companyName || "N/A"}</strong>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Applied Layer */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Applied Layer</small>
                      <strong>{ruleData.appliedLayer || "N/A"}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Partner Scope</small>
                      <strong>{ruleData.partnerScope === "AllChildPartners" ? "All Child Partners" : "Specific Partner"}</strong>
                    </div>
                  </div>
                </div>

                {ruleData.partner && (
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="card-text">
                        <small className="text-muted d-block">Selected Partner</small>
                        <strong>{ruleData.partner?.name || "N/A"}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <hr />

                {/* Service Types */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">Service Types</small>
                  <div className="mb-3">
                    {getServiceTypesList().length > 0 ? (
                      getServiceTypesList().map((service) => (
                        <span key={service} className="badge bg-info me-2">
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">No service types selected</span>
                    )}
                  </div>
                  {renderServiceDetails()}
                </div>

                <hr />

                {/* Visa Type */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Visa Type</small>
                      <strong>{ruleData.visaType || "N/A"}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Priority</small>
                      <strong>{ruleData.priority || 0}</strong>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Routes */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-2">Routes</small>
                  {renderRoutes()}
                </div>

                <hr />

                {/* Date Information */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Effective Date</small>
                      <strong>{formatDate(ruleData.effectiveDate)}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Expiry Date</small>
                      <strong>{formatDate(ruleData.expiryDate)}</strong>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Created At</small>
                      <small>{formatDate(ruleData.createdAt)}</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card-text">
                      <small className="text-muted d-block">Last Updated</small>
                      <small>{formatDate(ruleData.updatedAt)}</small>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
