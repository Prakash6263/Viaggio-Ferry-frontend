import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import PortsListTable from "../components/ports/PortsListTable";
import Can from "../components/Can";
import { Link } from "react-router-dom";

export default function Port() {
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
              <h5>Ports</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* CREATE action - uses LIST route path */}
                    <Can action="create" path="/company/settings/port">
                      <Link
                        className="btn btn-turquoise"
                        to="/company/settings/add-port"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        ></i>
                        Add New Port
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <PortsListTable />
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
