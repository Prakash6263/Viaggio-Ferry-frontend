import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTaxForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "",
    name: "",
    value: "",
    type: "%",            // "%" | "Fixed"
    ledger: "",
    taxform: "Refundable",// "Refundable" | "Non Refundable"
    active: true,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to API; for now just navigate back
    console.log("Save Tax:", form);
    navigate("/company/administration/taxes");
  };

  return (
    <form id="groupForm" onSubmit={onSubmit}>
      <h5 className="mb-3">Add New Tax</h5>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Tax Code</label>
          <input
            type="text" className="form-control" placeholder="e.g., VAT"
            name="code" value={form.code} onChange={onChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Tax Name</label>
          <input
            type="text" className="form-control" placeholder="e.g., Value Added Tax"
            name="name" value={form.name} onChange={onChange}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">Tax Value</label>
          <input
            type="number" step="any" className="form-control" placeholder="e.g., 15.00"
            name="value" value={form.value} onChange={onChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Tax Type</label>
          <select className="form-select" name="type" value={form.type} onChange={onChange}>
            <option value="%">%</option>
            <option value="Fixed">Fixed</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Ledger Code in CoA</label>
          <input
            type="text" className="form-control" placeholder="e.g., 21500"
            name="ledger" value={form.ledger} onChange={onChange}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Tax form</label>
          <select className="form-select" name="taxform" value={form.taxform} onChange={onChange}>
            <option value="Refundable">Refundable</option>
            <option value="Non Refundable">Non Refundable</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Status</label>
          <div>
            <label className="status-toggle" style={{ position: "relative", display: "inline-block", width: 50, height: 24 }}>
              <input type="checkbox" name="active" checked={form.active} onChange={onChange}
                     style={{ opacity: 0, width: 0, height: 0 }} />
              <span className="slider"
                    style={{ position: "absolute", cursor: "pointer", inset: 0, backgroundColor: form.active ? "#2575fc" : "#ccc",
                             transition: ".4s", borderRadius: 24 }} />
              <span style={{ position: "absolute", height: 16, width: 16, left: form.active ? 30 : 4, bottom: 4,
                             backgroundColor: "#fff", transition: ".4s", borderRadius: "50%" }} />
            </label>
            <span className="ms-2">{form.active ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </div>

      <div>
        <button type="button" className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Cancel</button>
        <button type="submit" className="btn btn-turquoise">Save Tax</button>
      </div>
    </form>
  );
}
