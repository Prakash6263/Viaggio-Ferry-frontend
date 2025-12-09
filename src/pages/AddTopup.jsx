import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

export default function AddTopup() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [transactionNumber, setTransactionNumber] = useState("AT-0000002");
  const [payorPartner] = useState("Sabihat");
  const [payorLedger, setPayorLedger] = useState("");
  const [payeePartner, setPayeePartner] = useState("");
  const [payeeLedger, setPayeeLedger] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [roe, setRoe] = useState(500);
  const [note, setNote] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    const themeToggle = document.getElementById("themeToggle");
    const html = document.documentElement;
    const handler = () => {
      if (!themeToggle) return;
      if (html.getAttribute("data-theme") === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    };
    if (themeToggle) {
      if (localStorage.getItem("theme") === "dark") {
        html.setAttribute("data-theme", "dark");
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
      themeToggle.addEventListener("click", handler);
    }
    return () => {
      if (themeToggle) themeToggle.removeEventListener("click", handler);
    };
  }, []);

  const amountDefaultCurrency = useMemo(() => {
    const amt = Number(amount || 0);
    const r = Number(roe || 0);
    if (!amt || !r) return "";
    return (amt * r).toFixed(2);
  }, [amount, roe]);

  const handleFileChange = (e) => setDocumentFile(e.target.files?.[0] ?? null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      date,
      transactionNumber,
      payorPartner,
      payorLedger,
      payeePartner,
      payeeLedger,
      amount,
      currency,
      roe,
      amountDefaultCurrency,
      note,
    };
    console.log("submit topup", payload);
    alert("Top-up added (demo). Replace with API call.");
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="mb-3">
            {/* KEEP ROUTE used in FinancePage.jsx */}
            <Link to="/company/finance/agent-top-up-deposits" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <h5 className="mb-3">Add New Topup</h5>

                  <form id="topUpForm" className="row g-4" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                      <label htmlFor="date" className="form-label">Transaction Date</label>
                      <input type="date" id="date" required className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="transactionNumber" className="form-label">Transaction #</label>
                      <input type="text" id="transactionNumber" readOnly className="form-control-plaintext border px-3 py-2 bg-light" value={transactionNumber} />
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3 bg-light">
                        <h5 className="fw-semibold">Payor Details</h5>
                        <div className="mb-3">
                          <label className="form-label">Payor Partner</label>
                          <input type="text" id="payorPartner" value={payorPartner} readOnly className="form-control-plaintext bg-light border px-3 py-2" />
                        </div>
                        <div>
                          <label className="form-label">Payor Ledger</label>
                          <select id="payorLedger" required className="form-select" value={payorLedger} onChange={(e) => setPayorLedger(e.target.value)}>
                            <option value="">Select Ledger</option>
                            <option>BOK Bank 12345</option>
                            <option>BOK Bank 67890</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3 bg-light">
                        <h5 className="fw-semibold">Payee Details</h5>
                        <div className="mb-3">
                          <label className="form-label">Payee Partner</label>
                          <select id="payeePartner" required className="form-select" value={payeePartner} onChange={(e) => setPayeePartner(e.target.value)}>
                            <option value="">Select Payee</option>
                            <option>Nour</option>
                            <option>Ali</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Payee Ledger</label>
                          <select id="payeeLedger" required className="form-select" value={payeeLedger} onChange={(e) => setPayeeLedger(e.target.value)}>
                            <option value="">Select Ledger</option>
                            <option>BOK Bank 56541</option>
                            <option>BOK Bank 11111</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Amount Currency</label>
                      <div className="input-group">
                        <input type="number" id="amount" placeholder="Enter amount" required className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} step="any" />
                        <select id="currency" className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          <option>SDG</option>
                          <option>SAR</option>
                          <option>EGP</option>
                          <option>USD</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">ROE (Rate of Exchange)</label>
                      <input type="number" id="roe" value={roe} required className="form-control" onChange={(e) => setRoe(Number(e.target.value || 0))} step="any" />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Amount (SDG)</label>
                      <input type="text" id="amountDefaultCurrency" readOnly className="form-control-plaintext border bg-light px-3 py-2" value={amountDefaultCurrency} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Confirmation</label>
                      <div className="form-check">
                        <input id="payorConfirmation" type="checkbox" disabled className="form-check-input" />
                        <label className="form-check-label">Payor confirmation</label>
                      </div>
                      <div className="form-check">
                        <input id="payeeConfirmation" type="checkbox" disabled className="form-check-input" />
                        <label className="form-check-label">Payee confirmation</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Note</label>
                      <textarea id="note" rows="2" className="form-control" value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Document Upload</label>
                      <input type="file" id="documentUpload" className="form-control" onChange={handleFileChange} />
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-turquoise">Add Top-up</button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
