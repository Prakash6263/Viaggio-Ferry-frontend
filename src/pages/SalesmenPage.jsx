// src/pages/SalesmenPage.jsx
import React, { useState } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import SalesmenList from "../components/salesmen/SalesmenList";

export default function SalesmenPage() {
  // sample data (replace with API data later)
  const [salesmen] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@marineagent.com",
      position: "Salesman",
      assignment: "Company",
      status: true,
    },
  ]);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Salesman List</h5>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <SalesmenList salesmen={salesmen} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
