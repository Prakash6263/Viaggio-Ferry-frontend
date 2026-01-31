import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { PageWrapper } from "../components/layout/PageWrapper";
import CabinForm from "../components/cabin/CabinForm";
import Can from "../components/Can";

export default function AddCabin() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <Can action="create" path="/company/settings/cabin">
          <div className="content container-fluid">
            {/* Back Button */}
            <div className="mb-3">
              <Link to="/company/settings/cabin" className="btn btn-turquoise">
                <i className="bi bi-arrow-left"></i> Back to List
              </Link>
            </div>

            <div className="row">
              <div className="col-sm-12">
                <div className="card-table card p-2">
                  <div className="card-body">
                    <h5 className="mb-3">Add New Cabin</h5>
                    <CabinForm />
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
