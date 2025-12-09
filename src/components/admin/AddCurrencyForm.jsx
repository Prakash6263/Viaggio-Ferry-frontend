import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddCurrencyForm() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [rates, setRates] = useState([
    { id: 1, at: "", rate: "" }
  ]);

  const addRate = () => {
    setRates((r) => [...r, { id: Date.now(), at: "", rate: "" }]);
  };

  const removeRate = (id) => setRates((r) => r.filter((x) => x.id !== id));

  const update = (id, key, val) =>
    setRates((arr) => arr.map((x) => (x.id === id ? { ...x, [key]: val } : x)));

  const onSubmit = (e) => {
    e.preventDefault();
    // mock submit; wire to API if needed
    const payload = { code, name, rates };
    console.log("Save Currency:", payload);
    navigate("/company/administration/currency");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="currencyCode" className="form-label">Currency Code</label>
          <input
            id="currencyCode"
            className="form-control"
            placeholder="e.g., SDG"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="currencyName" className="form-label">Currency Name</label>
          <input
            id="currencyName"
            className="form-control"
            placeholder="e.g., Sudanese Pound"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <h5 className="mb-3">Exchange Rates (to USD)</h5>

      <div className="rates-container mb-3">
        {rates.map((r) => (
          <div key={r.id} className="row rate-row align-items-center mb-2">
            <div className="col-md-5">
              <input
                type="datetime-local"
                className="form-control"
                placeholder="Effective Date & Time"
                value={r.at}
                onChange={(e) => update(r.id, "at", e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <input
                type="number"
                step="any"
                className="form-control"
                placeholder="Rate"
                value={r.rate}
                onChange={(e) => update(r.id, "rate", e.target.value)}
              />
            </div>
            <div className="col-md-2 text-center">
              <button type="button" className="btn btn-danger btn-sm remove-rate" onClick={() => removeRate(r.id)}>
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-end">
        <button type="button" className="btn btn-success btn-add-rate" onClick={addRate}>
          Add New Rate
        </button>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-turquoise btn-save">Save Currency</button>
      </div>
    </form>
  );
}
