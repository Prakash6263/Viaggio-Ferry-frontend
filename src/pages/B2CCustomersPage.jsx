// src/pages/B2CCustomersPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import CustomerList from "../components/customers/CustomerList";
import CustomerForm from "../components/customers/CustomerForm";

export default function B2CCustomersPage() {
  const [view, setView] = useState("list"); // "list" | "form"
  const [customers, setCustomers] = useState([]);
  const partners = ["Partner A", "Partner B", "Partner C"];
  const nationalities = ["USA", "Canada", "UK", "Egypt", "Saudi Arabia", "UAE", "Qatar", "Germany", "France", "Japan"];
  const countryCodes = [
    { code: "+1", name: "USA/Canada" },
    { code: "+44", name: "UK" },
    { code: "+91", name: "India" },
    { code: "+20", name: "Egypt" },
    { code: "+966", name: "Saudi Arabia" },
    { code: "+971", name: "UAE" },
    { code: "+974", name: "Qatar" },
    { code: "+49", name: "Germany" },
    { code: "+33", name: "France" },
    { code: "+81", name: "Japan" },
  ];

  // Seed sample data (like your HTML script window.onload)
  useEffect(() => {
    setCustomers([
      { id: 1, name: "John Doe", partner: "Partner A", nationality: "USA", countryCode: "+1", whatsappNumber: "555-123-4567", street: "123 Main St", city: "Anytown", country: "USA", status: "Active" },
      { id: 2, name: "Jane Smith", partner: "Partner B", nationality: "Canada", countryCode: "+44", whatsappNumber: "7700-900-123", street: "456 Oak Ave", city: "Sometown", country: "Canada", status: "Inactive" },
    ]);
  }, []);

  const handleAddClick = () => setView("form");
  const handleCancel = () => setView("list");

  const handleSaveCustomer = (data) => {
    // assign an id and push; in real app call API
    setCustomers((prev) => [...prev, { id: Date.now(), ...data }]);
    setView("list");
  };

  const handleDelete = (id) => setCustomers((prev) => prev.filter(c => c.id !== id));

  const handleEdit = (id, updated) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {view === "list" ? (
            <div id="listViewContainer">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>B2C Customers</h5>
                <button id="addNewBtn" className="btn btn-turquoise fw-medium btn-hover-transform" onClick={handleAddClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-1" viewBox="0 0 20 20" fill="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Customer
                </button>
              </div>

              <div className="row">
                <div className="col-sm-12">
                  <div className="card-table card p-3">
                    <div className="card-body">
                      <CustomerList
                        customers={customers}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div id="formViewContainer">
              <div className="card-table card p-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5>Add New Customer</h5>
                    <button id="cancelBtn" className="btn btn-secondary fw-medium btn-hover-transform" onClick={handleCancel}>Cancel</button>
                  </div>

                  <CustomerForm
                    partners={partners}
                    nationalities={nationalities}
                    countryCodes={countryCodes}
                    onCancel={handleCancel}
                    onSave={handleSaveCustomer}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}
