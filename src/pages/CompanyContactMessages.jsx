import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import ContactMessagesTable from "../components/admin/ContactMessagesTable";

export default function CompanyContactMessages() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="page-header">
          <div className="content-page-header">
            <h5>Contact Messages</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <ContactMessagesTable />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
