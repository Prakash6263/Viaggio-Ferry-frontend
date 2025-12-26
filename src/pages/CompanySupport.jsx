import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import SupportMessagesTable from "../components/admin/SupportMessagesTable"

export default function CompanySupport() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        <div className="page-header">
          <div className="content-page-header">
            <h5>Support</h5>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <SupportMessagesTable />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
