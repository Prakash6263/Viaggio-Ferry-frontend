import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import ShipsListTable from "../components/ships/ShipsListTable";

export default function CompanyShipsList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="row">
          <div className="col-sm-12">
            <ShipsListTable />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
