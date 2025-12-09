import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import TripsListTable from "../components/trips/TripsListTable";

export default function CompanyTripsList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <TripsListTable />
      </PageWrapper>
    </div>
  );
}
