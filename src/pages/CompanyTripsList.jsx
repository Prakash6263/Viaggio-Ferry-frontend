import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import TripsListTable from "../components/trips/TripsListTable";
import Can from "../components/Can";

export default function CompanyTripsList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* READ action - shows entire trips list if user has read permission */}
        <Can action="read" path="/company/ship-trips/trips">
          <TripsListTable />
        </Can>
      </PageWrapper>
    </div>
  );
}
