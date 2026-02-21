import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import AddPromotionForm from "../components/partner/AddPromotionForm";
import Can from "../components/Can";

export default function CompanyAddPromotion() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <Can action="create" path="/company/partner-management/promotions">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <AddPromotionForm />
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
