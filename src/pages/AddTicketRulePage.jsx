// src/pages/AddTicketRulePage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import RuleCard from "../components/ticketing/RuleCard";
import { useNavigate } from "react-router-dom";

/**
 * AddTicketRulePage
 * - reproduces add-ticket-rule.html behavior using React state
 * - preserves classes and markup so styling stays identical
 */
export default function AddTicketRulePage() {
  const [selectedType, setSelectedType] = useState("");
  const [rules, setRules] = useState([]);
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
    const newRule = {
      id,
      type: selectedType,
      name: `${selectedType} - Example`,
      timeframeBefore: "",
      afterIssued: "",
      fee: "",
      conditions: "",
    };
    setRules((r) => [...r, newRule]);
  };

  const removeRule = (id) => {
    setRules((r) => r.filter((x) => x.id !== id));
  };

  const updateRule = (id, fields) => {
    setRules((r) => r.map((row) => (row.id === id ? { ...row, ...fields } : row)));
  };

  const saveRules = () => {
    // TODO: hook up API; for now we simply navigate back or show success message
    // keep markup: we keep Save Rules button that looks identical
    alert("Rules saved (simulate).");
    navigate("/company/ticketing-rules");
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="mb-3">
            <a href="/company/ticketing-rules" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </a>
          </div>

          <style>{`
            .rule-card { background-color: #f2f9ff; padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; }
            .badge-type { font-size: 0.8rem; font-weight: bold; }
            .btn-remove { background-color: #dc3545; color: white; }
          `}</style>

          <div className="page-header">
            <div className="content-page-header">
              <h5>Ticketing Rules Configuration</h5>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card p-4">
                <h5 className="mb-2">Ticketing Rules Configuration</h5>

                <div className="row mb-3 align-items-center">
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      id="ruleTypeSelect"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">Select a rule type</option>
                      <option value="VOID">Void</option>
                      <option value="REISSUE">Reissue</option>
                      <option value="REFUND">Refund</option>
                      <option value="NOSHOW">No Show</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-primary" id="addRuleBtn" onClick={addRule}>
                      Add Rule
                    </button>
                  </div>
                </div>

                <div id="rulesContainer">
                  {rules.map((r) => (
                    <RuleCard key={r.id} rule={r} onRemove={removeRule} onChange={updateRule} />
                  ))}
                </div>

                <button className="btn btn-turquoise mt-3" onClick={saveRules}>
                  Save Rules
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
