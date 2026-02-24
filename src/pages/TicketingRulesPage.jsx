// // src/pages/TicketingRulesPage.jsx
// import React, { useEffect, useRef } from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";
// import { Link } from "react-router-dom";

// /**
//  * TicketingRulesPage - converts ticketing-rules.html
//  * - keeps markup and classes identical (only JSX changes)
//  * - defensive DataTable init on the table element
//  * - keeps the Add Ticket Rule link identical
//  */
// export default function TicketingRulesPage() {
//   const tableRef = useRef(null);

//   useEffect(() => {
//     const el = tableRef.current;
//     if (!el) return;

//     // destroy previous instance if created by us
//     try {
//       if (el._dt && typeof el._dt.destroy === "function") {
//         el._dt.destroy();
//         el._dt = null;
//       }
//     } catch (e) {
//       el._dt = null;
//     }

//     if (!window.DataTable) {
//       console.warn("DataTable not available on window. Include DataTable scripts in public/index.html.");
//       return;
//     }

//     try {
//       // instantiate DataTable defensively
//       el._dt = new window.DataTable(el, {
//         // leave default options so the look is same as original
//       });
//     } catch (err) {
//       console.error("DataTable init failed:", err);
//     }

//     return () => {
//       try {
//         if (el && el._dt && typeof el._dt.destroy === "function") {
//           el._dt.destroy();
//           el._dt = null;
//         }
//       } catch (err) {
//         // ignore
//       }
//     };
//   }, []);

//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <PageWrapper>
//         <div className="content container-fluid">
//           <style>{`
//             .rule-card { background-color: #f2f9ff; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; }
//             .badge-type { font-size: 0.8rem; font-weight: bold; }
//             .btn-remove { background-color: #dc3545; color: white; }
//           `}</style>

//           <div className="page-header">
//             <div className="content-page-header">
//               <h5>Ticketing Rule Management</h5>
//               <div className="list-btn" style={{ justifySelf: "end" }}>
//                 <ul className="filter-list">
//                   <li>
//                     <Link className="btn btn-turquoise" to="/company/add-ticket-rule">
//                       <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add Ticket Rule
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-sm-12">
//               <div className="card-table card p-2">
//                 <div className="card-body">
//                   <div className="table-responsive">
//                     {/* keep id "example" as in original HTML */}
//                     <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
//                       <thead>
//                         <tr>
//                           <th>Rule Type</th>
//                           <th>Rule Name</th>
//                           <th>Timeframe Before Departure</th>
//                           <th>Fee (Fixed or %)</th>
//                           <th>Conditions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr>
//                           <td>VOID</td>
//                           <td>VOID - 24 Hours</td>
//                           <td>Within 24 Hours</td>
//                           <td>0%</td>
//                           <td>Ticket must be purchased at least 7 days before departure.</td>
//                         </tr>
//                         <tr>
//                           <td>REISSUE</td>
//                           <td>REISSUE - Standard</td>
//                           <td>24-72 Hours Before</td>
//                           <td>$50 or 10%</td>
//                           <td>Allowed for same-class changes only.</td>
//                         </tr>
//                         <tr>
//                           <td>REFUND</td>
//                           <td>REFUND - Premium</td>
//                           <td>More than 72 Hours Before</td>
//                           <td>$0</td>
//                           <td>Only for Premium or Business class tickets.</td>
//                         </tr>
//                         <tr>
//                           <td>REFUND</td>
//                           <td>REFUND - Economy</td>
//                           <td>Less than 72 Hours Before</td>
//                           <td>$100 or 25%</td>
//                           <td>Non-refundable if within 24 hours.</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </PageWrapper>
//     </div>
//   );
// }



'use client';

// src/pages/TicketingRulesPage.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";
import Can from "../components/Can";
import { ticketingRuleApi } from "../api/ticketingRuleApi";
import { CirclesWithBar } from "react-loader-spinner";
import Swal from "sweetalert2";

/**
 * TicketingRulesPage - displays ticketing rules with API integration
 * - keeps markup and classes identical (only JSX changes)
 * - defensive DataTable init on the table element
 * - fetches data from API and populates table
 * - includes edit modal and delete functionality
 */
export default function TicketingRulesPage() {
  const tableRef = useRef(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: "",
    ruleType: ""
  });
  const [editingRule, setEditingRule] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Fetch rules from API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ticketingRuleApi.getTicketingRules(
          pagination.page,
          pagination.limit,
          filters
        );
        setRules(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.total || 0
        }));
      } catch (err) {
        console.error("[v0] Error fetching ticketing rules:", err);
        setError(err.message || "Failed to fetch ticketing rules");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, [pagination.page, filters]);

  // Format fee display - no rupee symbol
  const formatFee = (feeObj) => {
    if (!feeObj) return "-";
    const { type, value } = feeObj;
    if (type === "NONE") return "-";
    if (type === "FIXED") return `${value}`;
    if (type === "PERCENTAGE") return `${value}%`;
    return "-";
  };

  // Format timeframe display
  const formatTimeframe = (rule) => {
    if (rule.sameDayOnly) return "Same Day";
    if (rule.startOffsetDays > 0) {
      return `${rule.startOffsetDays} Day${rule.startOffsetDays > 1 ? "s" : ""} Before`;
    }
    return `${rule.restrictedWindowHours} Hour${rule.restrictedWindowHours > 1 ? "s" : ""} Before`;
  };

  // Handle edit button click
  const handleEdit = async (ruleId) => {
    try {
      setEditLoading(true);
      setEditError(null);
      const response = await ticketingRuleApi.getTicketingRuleById(ruleId);
      setEditingRule(response.data || response);
      setEditFormData(response.data || response);
      // Open modal
      const modal = new window.bootstrap.Modal(document.getElementById("editRuleModal"));
      modal.show();
    } catch (err) {
      console.error("[v0] Error fetching rule for edit:", err);
      setEditError(err.message || "Failed to load rule details");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load rule details"
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Handle update rule with SweetAlert
  const handleUpdateRule = async () => {
    try {
      setEditLoading(true);
      setEditError(null);
      const ruleId = editingRule._id || editingRule.id;
      
      // Prepare payload - only send UPDATE fields from Postman collection
      const updatePayload = {
        ruleName: editFormData.ruleName,
        restrictedWindowHours: editFormData.restrictedWindowHours,
        normalFee: editFormData.normalFee,
        restrictedPenalty: editFormData.restrictedPenalty,
        noShowPenalty: editFormData.noShowPenalty,
        conditions: editFormData.conditions
      };
      
      await ticketingRuleApi.updateTicketingRule(ruleId, updatePayload);
      
      // Close modal
      const modal = window.bootstrap.Modal.getInstance(document.getElementById("editRuleModal"));
      if (modal) modal.hide();
      
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Rule has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      
      // Refresh the list
      const response = await ticketingRuleApi.getTicketingRules(
        pagination.page,
        pagination.limit,
        filters
      );
      setRules(response.data || []);
      setEditingRule(null);
    } catch (err) {
      console.error("[v0] Error updating rule:", err);
      setEditError(err.message || "Failed to update rule");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update rule"
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete button click with SweetAlert
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
        await ticketingRuleApi.deleteTicketingRule(ruleId);
        
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Rule has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        
        // Refresh the list
        const response = await ticketingRuleApi.getTicketingRules(
          pagination.page,
          pagination.limit,
          filters
        );
        setRules(response.data || []);
      } catch (err) {
        console.error("[v0] Error deleting rule:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "Failed to delete rule"
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle edit form field changes
  const handleEditFieldChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit form nested field changes for fees
  const handleEditFeeChange = (feeField, type, value) => {
    setEditFormData(prev => ({
      ...prev,
      [feeField]: {
        type,
        value: value === "" ? 0 : parseFloat(value) || 0
      }
    }));
  };

  // Initialize DataTable
  useEffect(() => {
    if (loading || !tableRef.current) return;

    const el = tableRef.current;

    // destroy previous instance if created by us
    try {
      if (el._dt && typeof el._dt.destroy === "function") {
        el._dt.destroy();
        el._dt = null;
      }
    } catch (e) {
      el._dt = null;
    }

    if (!window.DataTable) {
      console.warn("DataTable not available on window. Include DataTable scripts in public/index.html.");
      return;
    }

    try {
      // instantiate DataTable defensively
      el._dt = new window.DataTable(el, {
        // leave default options so the look is same as original
      });
    } catch (err) {
      console.error("DataTable init failed:", err);
    }

    return () => {
      try {
        if (el && el._dt && typeof el._dt.destroy === "function") {
          el._dt.destroy();
          el._dt = null;
        }
      } catch (err) {
        // ignore
      }
    };
  }, [rules, loading]);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <style>{`
            .rule-card { background-color: #f2f9ff; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; }
            .badge-type { font-size: 0.8rem; font-weight: bold; }
            .btn-remove { background-color: #dc3545; color: white; }
            .loading-spinner { text-align: center; padding: 2rem; }
            .error-message { color: #dc3545; padding: 1rem; background-color: #f8d7da; border-radius: 0.5rem; margin-bottom: 1rem; }
            .action-buttons { display: flex; gap: 0.5rem; }
            .action-buttons button { padding: 0.25rem 0.5rem; font-size: 0.85rem; }
          `}</style>

          <div className="page-header">
            <div className="content-page-header">
              <h5>Ticketing Rule Management</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Can action="create">
                      <Link className="btn btn-turquoise" to="/company/add-ticket-rule">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add Ticket Rule
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="row">
            <div className="col-sm-12">
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

                  {!loading && (
                    <div className="table-responsive">
                      {/* keep id "example" as in original HTML */}
                      <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>Rule Type</th>
                            <th>Rule Name</th>
                            <th>Timeframe Before Departure</th>
                            <th>Normal Fee</th>
                            <th>Restricted Penalty</th>
                            <th>No Show Penalty</th>
                            <th>Conditions</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rules.length > 0 ? (
                            rules.map((rule) => (
                              <tr key={rule.id || rule._id}>
                                <td>
                                  <span className={`badge badge-${rule.ruleType === 'VOID' ? 'danger' : rule.ruleType === 'REFUND' ? 'success' : 'primary'}`}>
                                    {rule.ruleType}
                                  </span>
                                </td>
                                <td>{rule.ruleName}</td>
                                <td>{formatTimeframe(rule)}</td>
                                <td>{formatFee(rule.normalFee)}</td>
                                <td>{formatFee(rule.restrictedPenalty)}</td>
                                <td>{formatFee(rule.noShowPenalty)}</td>
                                <td>{rule.conditions || "-"}</td>
                                <td>
                                  <div className="action-buttons">
                                    <Can action="update">
                                      <button 
                                        className="btn btn-sm btn-info"
                                        onClick={() => handleEdit(rule._id || rule.id)}
                                        title="Edit"
                                      >
                                        <i className="fa fa-edit"></i>
                                      </button>
                                    </Can>
                                    <Can action="delete">
                                      <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(rule._id || rule.id)}
                                        title="Delete"
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </Can>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                                No ticketing rules found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Edit Rule Modal */}
        <div className="modal fade" id="editRuleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Ticketing Rule</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {editError && (
                  <div className="alert alert-danger">{editError}</div>
                )}
                {editingRule && (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Rule Type</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editFormData.ruleType || ""} 
                        disabled 
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Rule Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editFormData.ruleName || ""}
                        onChange={(e) => handleEditFieldChange("ruleName", e.target.value)}
                      />
                    </div>

                    {editFormData.ruleType === "VOID" ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">
                            <input
                              type="checkbox"
                              checked={editFormData.sameDayOnly || false}
                              onChange={(e) => handleEditFieldChange("sameDayOnly", e.target.checked)}
                            />
                            {" "}Same Day Only
                          </label>
                        </div>
                      </>
                    ) : null}

                    <div className="mb-3">
                      <label className="form-label">Restricted Window Hours</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        min="0"
                        value={editFormData.restrictedWindowHours || ""}
                        onChange={(e) => handleEditFieldChange("restrictedWindowHours", parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Normal Fee Type</label>
                        <select
                          className="form-select"
                          value={editFormData.normalFee?.type || "NONE"}
                          onChange={(e) => handleEditFeeChange("normalFee", e.target.value, editFormData.normalFee?.value || 0)}
                        >
                          <option value="NONE">None</option>
                          <option value="FIXED">Fixed Amount</option>
                          <option value="PERCENTAGE">Percentage</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Normal Fee Value</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={editFormData.normalFee?.value || ""}
                          disabled={editFormData.normalFee?.type === "NONE"}
                          onChange={(e) => handleEditFeeChange("normalFee", editFormData.normalFee?.type || "FIXED", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Restricted Penalty Type</label>
                        <select
                          className="form-select"
                          value={editFormData.restrictedPenalty?.type || "NONE"}
                          onChange={(e) => handleEditFeeChange("restrictedPenalty", e.target.value, editFormData.restrictedPenalty?.value || 0)}
                        >
                          <option value="NONE">None</option>
                          <option value="FIXED">Fixed Amount</option>
                          <option value="PERCENTAGE">Percentage</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Restricted Penalty Value</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={editFormData.restrictedPenalty?.value || ""}
                          disabled={editFormData.restrictedPenalty?.type === "NONE"}
                          onChange={(e) => handleEditFeeChange("restrictedPenalty", editFormData.restrictedPenalty?.type || "FIXED", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">No Show Penalty Type</label>
                        <select
                          className="form-select"
                          value={editFormData.noShowPenalty?.type || "NONE"}
                          onChange={(e) => handleEditFeeChange("noShowPenalty", e.target.value, editFormData.noShowPenalty?.value || 0)}
                        >
                          <option value="NONE">None</option>
                          <option value="FIXED">Fixed Amount</option>
                          <option value="PERCENTAGE">Percentage</option>
                        </select>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">No Show Penalty Value</label>
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={editFormData.noShowPenalty?.value || ""}
                          disabled={editFormData.noShowPenalty?.type === "NONE"}
                          onChange={(e) => handleEditFeeChange("noShowPenalty", editFormData.noShowPenalty?.type || "FIXED", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Conditions</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editFormData.conditions || ""}
                        onChange={(e) => handleEditFieldChange("conditions", e.target.value)}
                      />
                    </div>
                  </form>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={editLoading}>Close</button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUpdateRule}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
