import React, { useEffect, useState } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link, useNavigate } from "react-router-dom";
import Can from "../components/Can";
import CanDisable from "../components/CanDisable";
import { markupDiscountApi } from "../api/markupDiscountApi";
import Swal from "sweetalert2";
import MarkupDiscountDetailsModal from "../components/markup/MarkupDiscountDetailsModal";

/**
 * MarkupDiscountBoardPage
 * - Fetches markup/discount rules from API
 * - Uses CirclesWithBar loader like Currency page
 * - Displays data in Rules List table with pagination
 */
export default function MarkupDiscountBoardPage() {
  const navigate = useNavigate();
  
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRules, setTotalRules] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLayer, setSelectedLayer] = useState("");
  const [selectedRuleType, setSelectedRuleType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // History states
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState("last7days");
  const [selectedActionType, setSelectedActionType] = useState("");

  // Rule details modal state
  const [selectedRuleId, setSelectedRuleId] = useState(null);

  // Fetch rules from API with filters
  const fetchRules = async (filterOverrides = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = filterOverrides.page || page;
      const currentLimit = filterOverrides.limit || limit;
      
      // Build filter options - only include non-empty filters
      const filterOptions = {};
      const search = filterOverrides.search !== undefined ? filterOverrides.search : searchTerm;
      const layer = filterOverrides.layer !== undefined ? filterOverrides.layer : selectedLayer;
      const ruleType = filterOverrides.ruleType !== undefined ? filterOverrides.ruleType : selectedRuleType;
      const status = filterOverrides.status !== undefined ? filterOverrides.status : selectedStatus;
      
      // Only add to filterOptions if value is not empty
      if (search && search.trim()) filterOptions.search = search;
      if (layer) filterOptions.layer = layer;
      if (ruleType) filterOptions.ruleType = ruleType;
      if (status) filterOptions.status = status;
      
      console.log("[v0] Fetching markup/discount rules...", { page: currentPage, limit: currentLimit, filters: filterOptions });
      
      const response = await markupDiscountApi.getRules(currentPage, currentLimit, filterOptions);
      console.log("[v0] API Response:", response);

      if (response.success && response.data) {
        // Transform API response to match table format
        const transformedRules = response.data.map((rule) => ({
          id: rule._id,
          ruleName: rule.ruleName,
          ruleType: rule.ruleType,
          ruleValue: rule.ruleValue,
          valueType: rule.valueType,
          appliedLayer: rule.appliedLayer,
          status: rule.status,
          createdAt: rule.createdAt,
          services: getServices(rule.serviceDetails),
          providerType: rule.providerType,
          visaType: rule.visaType,
        }));
        setRules(transformedRules);
        setTotalRules(response.meta?.total || transformedRules.length);
        console.log("[v0] Rules loaded successfully:", transformedRules.length);
      } else {
        setRules([]);
        console.log("[v0] No rules data in response");
      }
    } catch (err) {
      console.error("[v0] Error fetching rules:", err);
      setError(err.message || "Failed to load markup/discount rules");
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history from API
  const fetchHistory = async (dateRange = selectedDateRange, actionType = selectedActionType) => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);

      console.log("[v0] Fetching markup/discount history...", { dateRange, actionType });

      const response = await markupDiscountApi.getMarkupDiscountHistory(dateRange, actionType);
      console.log("[v0] History API Response:", response);

      if (response.success && response.data) {
        setHistory(response.data);
        console.log("[v0] History loaded successfully:", response.data.length);
      } else {
        setHistory([]);
        console.log("[v0] No history data in response");
      }
    } catch (err) {
      console.error("[v0] Error fetching history:", err);
      setHistoryError(err.message || "Failed to load history");
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Helper function to extract service types from serviceDetails
  const getServices = (serviceDetails) => {
    const services = [];
    if (serviceDetails) {
      if (serviceDetails.passenger?.length > 0) services.push("Passenger");
      if (serviceDetails.cargo?.length > 0) services.push("Cargo");
      if (serviceDetails.vehicle?.length > 0) services.push("Vehicle");
    }
    return services;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Format date and time for history display
  const formatHistoryDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get badge color based on action type
  const getActionBadgeClass = (actionType) => {
    switch (actionType) {
      case "Created":
        return "bg-success";
      case "Updated":
        return "bg-primary";
      case "Deleted":
        return "bg-danger";
      case "Activated":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  // Get border color based on action type
  const getActionBorderClass = (actionType) => {
    switch (actionType) {
      case "Created":
        return "border-success-subtle";
      case "Updated":
        return "border-primary-subtle";
      case "Deleted":
        return "border-danger-subtle";
      case "Activated":
        return "border-warning-subtle";
      default:
        return "border-primary-subtle";
    }
  };

  // Open rule details modal
  const openRuleDetails = (ruleId) => {
    console.log("[v0] Opening rule details for ID:", ruleId);
    setSelectedRuleId(ruleId);
    
    // Show modal with a small delay to ensure state is updated
    setTimeout(() => {
      const modalElement = document.getElementById("markupDiscountDetailsModal");
      console.log("[v0] Modal element found:", !!modalElement);
      
      if (modalElement) {
        try {
          // Destroy any existing modal instance
          const existingModal = window.bootstrap.Modal.getInstance(modalElement);
          if (existingModal) {
            existingModal.dispose();
          }
          
          // Create new modal instance and show it
          const modal = new window.bootstrap.Modal(modalElement);
          modal.show();
          console.log("[v0] Modal shown successfully");
        } catch (err) {
          console.error("[v0] Error showing modal:", err);
        }
      } else {
        console.error("[v0] Modal element not found");
      }
    }, 100);
  };

  // Handle edit
  const handleEdit = (ruleId) => {
    navigate(`/company/markup/edit/${ruleId}`);
  };

  // Handle delete
  const handleDelete = async (ruleId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        console.log("[v0] Deleting rule with ID:", ruleId);
        const res = await markupDiscountApi.deleteRule(ruleId);
        console.log("[v0] Delete response:", res);
        
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: res.message || "Rule has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchRules();
        }
      } catch (err) {
        console.error("[v0] Error deleting rule:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete rule",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchRules();
    fetchHistory();
  }, []);

  // Fetch rules on mount and when filters change
  useEffect(() => {
    fetchRules();
  }, [page, limit, searchTerm, selectedLayer, selectedRuleType, selectedStatus]);

  return (
    <div className="main-wrapper">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Page wrapper (keeps same outer wrapper as original) */}
      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Markup &amp; Discount Management</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <button className="btn btn-secondary me-2">Export</button>
                  </li>
                  <li>
                    <Can action="create">
                      <Link className="btn btn-turquoise" to="/company/markup/add-rule">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Rule
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row text-center g-3 mb-4">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Total Rules</h6>
                  <h2>24</h2>
                  <small className="text-success">↑ 12% from last month</small>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Avg. Markup</h6>
                  <h2>7.2%</h2>
                  <small className="text-warning">– 0% from last month</small>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Revenue Impact</h6>
                  <h2>$12.4K</h2>
                  <small className="text-success">↑ 8.3% from last month</small>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h6>Rule Performance</h6>
                  <h2>87%</h2>
                  <small className="text-success">↑ 5.1% from last month</small>
                </div>
              </div>
            </div>
          </div>

          {/* Commission Flow */}
          <div className="card p-4 mb-4">
            <h5 className="mb-2">Commission Flow Structure</h5>
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div className="badge bg-primary p-3">
                Company
                <br />
                <br />
                <small>Sets markup/discount rules</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Marine Agent
                <br />
                <br />
                <small>Applies to services</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Commercial Agent
                <br />
                <br />
                <small>Further adjustments</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Selling Agent
                <br />
                <br />
                <small>Final pricing</small>
              </div>
              <span>→</span>
              <div className="badge bg-primary p-3">
                Customer
                <br />
                <br />
                <small>Receives final price</small>
              </div>
            </div>
          </div>

          {/* Card/Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <ul className="nav nav-pills mb-3" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="Commission Rules-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#rule-list"
                        type="button"
                        role="tab"
                      >
                        Rules list
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="commission-history-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#rule-history"
                        type="button"
                        role="tab"
                      >
                        History
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {/* RULES LIST TAB */}
                    <div className="tab-pane fade show active" id="rule-list">
                      <div className="row mb-3 g-2">
                        <div className="col-md-3">
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search rules..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <select 
                            className="form-select"
                            value={selectedRuleType}
                            onChange={(e) => setSelectedRuleType(e.target.value)}
                          >
                            <option value="">All Types</option>
                            <option value="Markup">Markup</option>
                            <option value="Discount">Discount</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select 
                            className="form-select"
                            value={selectedLayer}
                            onChange={(e) => setSelectedLayer(e.target.value)}
                          >
                            <option value="">All Layers</option>
                            <option value="Company">Company</option>
                            <option value="Marine Agent">Marine Agent</option>
                            <option value="Commercial Agent">Commercial Agent</option>
                            <option value="Selling Agent">Selling Agent</option>
                            <option value="Salesman">Salesman</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <select 
                            className="form-select"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                          >
                            <option value="">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      {/* Pagination and Per-Page Controls */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <label htmlFor="limit" className="form-label me-2">
                            Entries per page:
                          </label>
                          <select 
                            id="limit"
                            className="form-select d-inline-block"
                            style={{ width: "auto" }}
                            value={limit}
                            onChange={(e) => {
                              setLimit(parseInt(e.target.value));
                              setPage(1); // Reset to page 1 when changing limit
                            }}
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-muted">
                            Showing {rules.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalRules)} of {totalRules} entries
                          </span>
                        </div>
                      </div>

                      {/* Loading State */}
                      {loading && (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
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

                      {/* Error State */}
                      {error && !loading && (
                        <div className="alert alert-danger" role="alert">
                          <strong>Error!</strong> {error}
                        </div>
                      )}

                      {/* Table */}
                      {!loading && !error && (
                        <div className="table-responsive">
                          <table className="table table-striped" style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th><input type="checkbox" /></th>
                                <th>Rule Name</th>
                                <th>Type</th>
                                <th>Value</th>
                                <th>Applied To</th>
                                <th>Services</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {rules && rules.length > 0 ? (
                                rules.map((rule) => (
                                  <tr key={rule.id}>
                                    <td><input type="checkbox" /></td>
                                    <td>
                                      {rule.ruleName}
                                      <div className="rule-sub">Created: {formatDate(rule.createdAt)}</div>
                                    </td>
                                    <td>
                                      <span className={`badge ${rule.ruleType === "Markup" ? "badge-markup" : "badge-discount"}`}>
                                        {rule.ruleType}
                                      </span>
                                    </td>
                                    <td>
                                      {rule.ruleValue}
                                      {rule.valueType === "percentage" ? "%" : ""}
                                    </td>
                                    <td>{rule.appliedLayer || "N/A"}</td>
                                    <td>
                                      {rule.services && rule.services.length > 0 ? (
                                        rule.services.map((service) => (
                                          <span key={service} className="service-badge me-1">
                                            {service}
                                          </span>
                                        ))
                                      ) : (
                                        <span>N/A</span>
                                      )}
                                    </td>
                                    <td>
                                      <span className={`badge ${rule.status === "Active" ? "badge-status-active" : "badge-status-pending"}`}>
                                        {rule.status}
                                      </span>
                                    </td>
                                    <td className="action-icons">
                                      <CanDisable action="update" path="/company/markup">
                                        <button
                                          className="btn btn-sm btn-primary-navy"
                                          onClick={() => handleEdit(rule.id)}
                                          title="Edit Rule"
                                        >
                                          <i className="bi bi-pencil-square"></i>
                                        </button>
                                      </CanDisable>
                                      <CanDisable action="delete" path="/company/markup">
                                        <button
                                          className="btn btn-sm btn-danger ms-2"
                                          onClick={() => handleDelete(rule.id)}
                                          title="Delete Rule"
                                        >
                                          <i className="bi bi-trash3"></i>
                                        </button>
                                      </CanDisable>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="8" className="text-center py-4">
                                    No markup/discount rules found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* HISTORY TAB */}
                    <div className="tab-pane fade" id="rule-history">
                      <div className="history-card">
                        <div className="row g-3 mb-4">
                          <div className="col-md-4">
                            <select className="form-select">
                              <option>All Rules</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <select 
                              className="form-select"
                              value={selectedActionType}
                              onChange={(e) => setSelectedActionType(e.target.value)}
                            >
                              <option value="">All Actions</option>
                              <option value="Created">Created</option>
                              <option value="Updated">Updated</option>
                              <option value="Activated">Activated</option>
                              <option value="Deactivated">Deactivated</option>
                              <option value="Deleted">Deleted</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <select 
                              className="form-select"
                              value={selectedDateRange}
                              onChange={(e) => setSelectedDateRange(e.target.value)}
                            >
                              <option value="last7days">Last 7 Days</option>
                              <option value="last30days">Last 30 Days</option>
                              <option value="last90days">Last 90 Days</option>
                            </select>
                          </div>
                          <div className="col-md-1 d-grid">
                            <button 
                              className="btn btn-primary" 
                              onClick={() => fetchHistory(selectedDateRange, selectedActionType)}
                            >
                              Apply
                            </button>
                          </div>
                        </div>

                        {/* Loading State */}
                        {historyLoading && (
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

                        {/* Error State */}
                        {historyError && !historyLoading && (
                          <div className="alert alert-danger" role="alert">
                            <strong>Error!</strong> {historyError}
                          </div>
                        )}

                        {/* History Items */}
                        {!historyLoading && !historyError && history && history.length > 0 ? (
                          history.map((item, index) => (
                            <div key={index} className={`history-item border-start border-4 ${getActionBorderClass(item.actionType)}`}>
                              <span className={`badge ${getActionBadgeClass(item.actionType)}`}>
                                {item.actionType}
                              </span>
                              <h6 className="mt-2">{item.ruleName}</h6>
                              <p>{item.description}</p>
                              <div className="d-flex justify-content-between">
                                <span className="history-meta">
                                  By {item.changedBy || "System"} • {formatHistoryDate(item.changedAt)}
                                </span>
                                <div className="d-flex gap-2">
                                  <a 
                                    href="#" 
                                    className="view-link"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      openRuleDetails(item._id || item.ruleId);
                                    }}
                                  >
                                    View Details
                                  </a>
                                  <a 
                                    href="#" 
                                    className="view-link"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleEdit(item._id || item.ruleId);
                                    }}
                                  >
                                    Edit
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : !historyLoading && !historyError ? (
                          <div className="alert alert-info" role="alert">
                            No history records found
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </PageWrapper>

      {/* Markup/Discount Rule Details Modal */}
      <MarkupDiscountDetailsModal ruleId={selectedRuleId} />
    </div>
  );
}
