'use client';

import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageWrapper } from "../../components/layout/PageWrapper";
import Can from "../../components/Can";
import { usePermissions } from "../../hooks/usePermissions";
import Swal from "sweetalert2";
import TicketingRuleFormModal from "../../components/ticketingRules/TicketingRuleFormModal";
import { ticketingRuleApi } from "../../api/ticketingRuleApi";
import AccessDenied from "../../components/AccessDenied";

export default function TicketingRuleList() {
  const { canRead, canWrite, canEdit, canDelete } = usePermissions("sales-bookings", "ticketing-rules");
  
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({ search: "", ruleType: "" });

  // Check if user has read permission
  if (!canRead) {
    return <AccessDenied />;
  }

  const fetchRules = async (page = 1) => {
    try {
      setLoading(true);
      const response = await ticketingRuleApi.getTicketingRules(page, pagination.limit, filters);
      setRules(response.data || []);
      setPagination({
        page: response.page || page,
        limit: response.limit || pagination.limit,
        total: response.total || 0,
      });
    } catch (error) {
      console.error("[v0] Fetch Rules Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch ticketing rules",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules(1);
  }, [filters]);

  const handleEdit = (rule) => {
    setEditingData(rule);
    setTimeout(() => {
      const modalElement = document.getElementById("ticketingRuleModal");
      if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 0);
  };

  const handleCreateNew = () => {
    setEditingData(null);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Confirm Delete",
        text: "Are you sure you want to delete this ticketing rule?",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await ticketingRuleApi.deleteTicketingRule(id);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Ticketing rule has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchRules(pagination.page);
      }
    } catch (error) {
      console.error("[v0] Delete Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to delete ticketing rule",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    fetchRules(1);
    setEditingData(null);
  };

  const formatFee = (fee) => {
    if (!fee || fee.type === "NONE") {
      return "-";
    }
    if (fee.type === "FIXED") {
      return `₹ ${fee.value}`;
    }
    if (fee.type === "PERCENTAGE") {
      return `${fee.value}%`;
    }
    return "-";
  };

  const handleSearchChange = (value) => {
    setFilters({ ...filters, search: value });
  };

  const handleRuleTypeFilter = (value) => {
    setFilters({ ...filters, ruleType: value });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Ticketing Rules Management</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Can module="sales-bookings" submodule="ticketing-rules" action="write">
                      <button
                        className="btn btn-turquoise"
                        onClick={handleCreateNew}
                        data-bs-toggle="modal"
                        data-bs-target="#ticketingRuleModal"
                        type="button"
                      >
                        <i className="fa fa-plus-circle me-2"></i>
                        Add New Ticketing Rule
                      </button>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* Filters */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by rule name"
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <select
                        className="form-select"
                        value={filters.ruleType}
                        onChange={(e) => handleRuleTypeFilter(e.target.value)}
                      >
                        <option value="">All Rule Types</option>
                        <option value="VOID">VOID</option>
                        <option value="REFUND">REFUND</option>
                        <option value="REISSUE">REISSUE</option>
                      </select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="table-responsive">
                    <table className="table table-striped" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Rule Type</th>
                          <th>Rule Name</th>
                          <th>Restricted Window Hours</th>
                          <th>Normal Fee</th>
                          <th>Restricted Penalty</th>
                          <th>No Show Penalty</th>
                          <th>Conditions</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && !rules.length ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              Loading...
                            </td>
                          </tr>
                        ) : rules.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No ticketing rules found
                            </td>
                          </tr>
                        ) : (
                          rules.map((rule) => (
                            <tr key={rule._id}>
                              <td>
                                <span className="badge bg-info">{rule.ruleType}</span>
                              </td>
                              <td>{rule.ruleName}</td>
                              <td>{rule.restrictedWindowHours} hrs</td>
                              <td>{formatFee(rule.normalFee)}</td>
                              <td>{formatFee(rule.restrictedPenalty)}</td>
                              <td>{formatFee(rule.noShowPenalty)}</td>
                              <td>
                                <span title={rule.conditions}>
                                  {rule.conditions ? rule.conditions.substring(0, 30) + "..." : "-"}
                                </span>
                              </td>
                              <td>
                                <div className="actions">
                                  <Can module="sales-bookings" submodule="ticketing-rules" action="edit">
                                    <button
                                      className="btn btn-sm btn-warning me-2"
                                      onClick={() => handleEdit(rule)}
                                      title="Edit"
                                    >
                                      <i className="fa fa-edit"></i>
                                    </button>
                                  </Can>
                                  <Can module="sales-bookings" submodule="ticketing-rules" action="delete">
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleDelete(rule._id)}
                                      title="Delete"
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </Can>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <p>
                        Showing {rules.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{" "}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                      </p>
                    </div>
                    <div className="col-md-6">
                      <nav>
                        <ul className="pagination justify-content-end">
                          <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => fetchRules(pagination.page - 1)}
                              disabled={pagination.page === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li
                              key={page}
                              className={`page-item ${pagination.page === page ? "active" : ""}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => fetchRules(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${pagination.page === totalPages ? "disabled" : ""}`}>
                            <button
                              className="page-link"
                              onClick={() => fetchRules(pagination.page + 1)}
                              disabled={pagination.page === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Modal Form */}
      <TicketingRuleFormModal onSuccess={handleSuccess} editingData={editingData} />
    </div>
  );
}
