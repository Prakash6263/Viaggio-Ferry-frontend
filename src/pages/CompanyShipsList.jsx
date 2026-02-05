import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import ShipsListTable from "../components/ships/ShipsListTable";
import Can from "../components/Can";
import { Link } from "react-router-dom";

export default function CompanyShipsList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* READ permission gate - hide entire page if no read access */}
        <Can action="read">
          {/* Page Header */}
    

          <div className="row">
            <div className="col-sm-12">
              <ShipsListTable />
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
