
import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import CabinListTable from "../components/cabin/CabinListTable";
import Can from "../components/Can";
import { Link, useSearchParams } from "react-router-dom";

export default function Cabin() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get type from URL or default to "passenger"
  const activeTab = searchParams.get("type") || "passenger";

  // Handle tab switching with URL sync
  const handleTabChange = (newType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", newType);
    newParams.set("page", "1");
    newParams.delete("search");
    setSearchParams(newParams);
  };

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
              <h5>Cabins</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* CREATE action - uses LIST route path */}
                    <Can action="create" path="/company/settings/cabin">
                      <Link
                        className="btn btn-turquoise"
                        to="/company/settings/add-cabin"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        ></i>
                        Add New Cabin
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  {/* Nav tabs */}
                  <ul className="nav nav-tabs mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "passenger" ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => handleTabChange("passenger")}
                      >
                        Passengers
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "vehicle" ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => handleTabChange("vehicle")}
                      >
                        Vehicles
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "cargo" ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => handleTabChange("cargo")}
                      >
                        Cargo
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    <CabinListTable key={activeTab} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
