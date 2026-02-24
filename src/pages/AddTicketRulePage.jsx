// src/pages/AddTicketRulePage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import RuleCard from "../components/ticketing/RuleCard";
import { useNavigate } from "react-router-dom";
import { ticketingRuleApi } from "../api/ticketingRuleApi";

/**
 * AddTicketRulePage
 * - Matches Postman collection payload structure exactly
 * - All fields from schema are included
 * - Integrates with ticketingRuleApi for CREATE operation
 */
export default function AddTicketRulePage() {
  const [selectedType, setSelectedType] = useState("");
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Theme toggle: keep same look and behavior as original page
    const themeToggle = document.getElementById("themeToggle");
    const html = document.documentElement;
    if (!themeToggle) return;
    const setButton = () => {
      themeToggle.innerHTML = html.getAttribute("data-theme") === "dark"
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-stars-fill"></i>';
    };
    setButton();

    // click handler
    const handler = () => {
      if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
      setButton();
    };
    themeToggle.addEventListener("click", handler);
    return () => themeToggle.removeEventListener("click", handler);
  }, []);

  const addRule = () => {
    if (!selectedType) {
      return alert("Please select a rule type.");
    }
    const id = Date.now().toString(36);
    
    // Create template based on rule type with all required fields from Postman
    const newRule = {
      id,
      ruleType: selectedType,
      ruleName: "",
      sameDayOnly: selectedType === "VOID",
      startOffsetDays: 0,
      restrictedWindowHours: 0,
      normalFee: { type: "NONE", value: 0 },
      restrictedPenalty: { type: "NONE", value: 0 },
      noShowPenalty: { type: "NONE", value: 0 },
      conditions: ""
    };
    
    setRules((r) => [...r, newRule]);
  };

  const removeRule = (id) => {
    setRules((r) => r.filter((x) => x.id !== id));
  };

  const updateRule = (id, fields) => {
    setRules((r) => r.map((row) => (row.id === id ? { ...row, ...fields } : row)));
  };

  const saveRules = async () => {
    try {
      // Validate all rules have required fields
      const validationErrors = [];
      rules.forEach((rule, idx) => {
        if (!rule.ruleName || rule.ruleName.trim() === "") {
          validationErrors.push(`Rule ${idx + 1}: Rule Name is required`);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join("\n"));
        return;
      }

      setLoading(true);
      setError(null);

      // Remove the temporary 'id' field and save each rule to API
      const savePromises = rules.map((rule) => {
        const { id: _, ...payload } = rule; // Remove temp id
        return ticketingRuleApi.createTicketingRule(payload);
      });

      await Promise.all(savePromises);
      
      // Success - navigate back to list
      navigate("/company/ticketing-rules");
    } catch (err) {
      console.error("[v0] Error saving rules:", err);
      setError(err.message || "Failed to save rules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="mb-3">
            <button 
              onClick={() => navigate("/company/ticketing-rules")} 
              className="btn btn-turquoise"
              disabled={loading}
            >
              <i className="bi bi-arrow-left"></i> Back to List
            </button>
          </div>

          <style>{`
            .rule-card { background-color: #f2f9ff; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; }
            .badge-type { font-size: 0.8rem; font-weight: bold; }
            .btn-remove { background-color: #dc3545; color: white; }
            .error-alert { color: #dc3545; padding: 1rem; background-color: #f8d7da; border-radius: 0.5rem; margin-bottom: 1rem; }
          `}</style>

          <div className="page-header">
            <div className="content-page-header">
              <h5>Ticketing Rules Configuration</h5>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="row">
            <div className="col-sm-12">
              <div className="card p-4">
                <h5 className="mb-2">Create Ticketing Rules</h5>

                <div className="row mb-3 align-items-center">
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      id="ruleTypeSelect"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">Select a rule type</option>
                      <option value="VOID">Void</option>
                      <option value="REFUND">Refund</option>
                      <option value="REISSUE">Reissue</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <button 
                      className="btn btn-primary" 
                      id="addRuleBtn" 
                      onClick={addRule}
                      disabled={loading}
                    >
                      Add Rule
                    </button>
                  </div>
                </div>

                <div id="rulesContainer">
                  {rules.map((r) => (
                    <RuleCard key={r.id} rule={r} onRemove={removeRule} onChange={updateRule} />
                  ))}
                </div>

                <button 
                  className="btn btn-turquoise mt-3" 
                  onClick={saveRules}
                  disabled={loading || rules.length === 0}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    "Save Rules"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
