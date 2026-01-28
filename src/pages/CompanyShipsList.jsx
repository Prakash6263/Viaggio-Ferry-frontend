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
          <div className="page-header">
            <div className="content-page-header">
              <h5>Ships</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* CREATE action - uses LIST route path */}
                    <Can action="create" path="/company/fleet-management/ships">
                      <Link className="btn btn-turquoise" to="/company/fleet-management/add-ship">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                        Add New Ship
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

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
