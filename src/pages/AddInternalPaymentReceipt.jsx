// src/pages/AddInternalPaymentReceipt.jsx
import React, { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { Link } from "react-router-dom";

/**
 * AddInternalPaymentReceipt.jsx
 * - React form for adding internal payment/receipt
 * - Back link uses FinancePage route
 * - No themeToggle handling here (Header should cover it)
 * - Keeps same classes and structure
 */

export default function AddInternalPaymentReceipt() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState("Incoming (Receipt)");
  const [internal, setInternal] = useState(false);
  const [transactionNumber] = useState("IE-0000002");
  const [payorPartner, setPayorPartner] = useState("N/A");
  const [payorLedger, setPayorLedger] = useState("Account Receivables");
  const [payeePartner, setPayeePartner] = useState("My Partner");
  const [payeeLedger, setPayeeLedger] = useState("Cash");
  const [amount, setAmount] = useState("");
  const [roe, setRoe] = useState(500);
  const [currency, setCurrency] = useState("USD");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const amountDefault = useMemo(() => {
    const a = Number(amount || 0), r = Number(roe || 0);
    if (!a || !r) return "0.00";
    return (a * r).toFixed(2);
  }, [amount, roe]);

  const handleFile = (e) => setFile(e.target.files?.[0] ?? null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      date, type, internal, transactionNumber, payorPartner, payorLedger,
      payeePartner, payeeLedger, amount, roe, currency, amountDefault, note, file
    };
    console.log("submit internal payment/receipt", payload);
    alert("Submit demo — wire to API.");
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="mb-3">
            {/* KEEP FinancePage routing */}
            <Link to="/company/finance/payments-receipts" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Internal Payments & Receipts</h5>
                  </div>
                </div>

                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Transaction Date</label>
                        <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Transaction Type</label>
                        <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                          <option>Incoming (Receipt)</option>
                          <option>Outgoing (Payment)</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">&nbsp;&nbsp;</label>
                        <div className="form-check mt-2">
                          <input className="form-check-input" type="checkbox" id="internalCheck" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
                          <label className="form-check-label" htmlFor="internalCheck">Internal Transaction</label>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Transaction #</label>
                        <input type="text" className="form-control" value={transactionNumber} readOnly />
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-section card p-3">
                          <h6 className="fw-bold mb-3">Payor Details</h6>
                          <div className="mb-3">
                            <label className="form-label">External Partner (Payor)</label>
                            <select className="form-select" value={payorPartner} onChange={(e) => setPayorPartner(e.target.value)}>
                              <option>N/A</option>
                              <option>Client A</option>
                              <option>Client B</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Payor Ledger</label>
                            <input type="text" className="form-control" value={payorLedger} onChange={(e) => setPayorLedger(e.target.value)} />
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-section card p-3">
                          <h6 className="fw-bold mb-3">Payee Details</h6>
                          <div className="mb-3">
                            <label className="form-label">My Partner (Payee)</label>
                            <select className="form-select" value={payeePartner} onChange={(e) => setPayeePartner(e.target.value)}>
                              <option>My Partner</option>
                              <option>Supplier A</option>
                              <option>Supplier B</option>
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Payee Ledger</label>
                            <input type="text" className="form-control" value={payeeLedger} onChange={(e) => setPayeeLedger(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-3">
                        <label className="form-label">Amount Currency</label>
                        <input type="text" className="form-control" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">ROE (Rate of Exchange)</label>
                        <input type="text" className="form-control" value={roe} onChange={(e) => setRoe(e.target.value)} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Currency</label>
                        <select className="form-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                          <option>USD</option>
                          <option>EUR</option>
                          <option>INR</option>
                        </select>
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Amount (SDG)</label>
                        <input type="text" className="form-control" value={amountDefault} readOnly />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-8">
                        <label className="form-label">Note</label>
                        <textarea className="form-control" rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a reference note for this transaction"></textarea>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Document Upload</label>
                        <input type="file" className="form-control" onChange={handleFile} />
                      </div>
                    </div>

                    <div className="d-grid gap-2 mb-3">
                      <button type="submit" className="btn btn-turquoise">Confirm Journal Entry</button>
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
