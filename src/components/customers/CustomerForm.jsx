// src/components/customers/CustomerForm.jsx
import React, { useState, useEffect } from "react";

export default function CustomerForm({ partners = [], nationalities = [], countryCodes = [], onCancel, onSave }) {
  const [form, setForm] = useState({
    name: "",
    partner: partners[0] || "",
    nationality: nationalities[0] || "",
    password: "",
    countryCode: countryCodes[0]?.code || "",
    whatsappNumber: "",
    street: "",
    city: "",
    country: "",
    status: "Active",
  });

  useEffect(() => {
    // keep select defaults in sync if props change
    setForm(f => ({ ...f, partner: partners[0] || f.partner, nationality: nationalities[0] || f.nationality, countryCode: countryCodes[0]?.code || f.countryCode }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partners.length, nationalities.length, countryCodes.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple validation (password length)
    if (!form.name || !form.password || form.password.length < 8) {
      alert("Please provide required fields and password >= 8 chars");
      return;
    }
    if (onSave) onSave(form);
  };

  return (
    <form id="customerForm" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2 className="mb-4">Customer Details</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <label htmlFor="customerName" className="form-label">Name</label>
            <input type="text" id="customerName" name="name" required className="form-control shadow-sm focus-ring" value={form.name} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label htmlFor="partner" className="form-label">Partner</label>
            <select id="partner" name="partner" className="form-select shadow-sm focus-ring" value={form.partner} onChange={handleChange}>
              {partners.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="nationality" className="form-label">Nationality</label>
            <select id="nationality" name="nationality" required className="form-select shadow-sm focus-ring" value={form.nationality} onChange={handleChange}>
              {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" name="password" required minLength={8} className="form-control shadow-sm focus-ring" value={form.password} onChange={handleChange} />
          </div>

          <div className="col-md-6">
            <label htmlFor="whatsappNumber" className="form-label">WhatsApp Phone Number</label>
            <div className="d-flex">
              <input list="countryCodes" id="countryCode" name="countryCode" required value={form.countryCode} onChange={handleChange} className="form-control rounded-end-0 shadow-sm focus-ring" style={{ width: "33.33%" }} />
              <datalist id="countryCodes">
                {countryCodes.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </datalist>
              <input type="tel" id="whatsappNumber" name="whatsappNumber" required className="form-control rounded-start-0 shadow-sm focus-ring" value={form.whatsappNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="col-md-6">
            <label htmlFor="status" className="form-label">Status</label>
            <select id="status" name="status" required className="form-select shadow-sm focus-ring" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section mt-3">
        <h2 className="fs-5 fw-semibold mb-4">Address</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <label htmlFor="street" className="form-label">Street</label>
            <input type="text" id="street" name="street" required className="form-control shadow-sm focus-ring" value={form.street} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="city" className="form-label">City</label>
            <input type="text" id="city" name="city" required className="form-control shadow-sm focus-ring" value={form.city} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="country" className="form-label">Country</label>
            <input type="text" id="country" name="country" required className="form-control shadow-sm focus-ring" value={form.country} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <button type="submit" className="btn btn-turquoise fw-medium btn-hover-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-1" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
            <path d="M7.707 10.293a1 1 0 010-1.414L9.586 7.5a1 1 0 011.414 0l2.828 2.828a1 1 0 01-1.414 1.414L10 9.414l-1.879 1.879a1 1 0 01-1.414 0z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5 10a5 5 0 1110 0 5 5 0 01-10 0z" clipRule="evenodd" />
          </svg>
          Save Customer
        </button>
      </div>
    </form>
  );
}
