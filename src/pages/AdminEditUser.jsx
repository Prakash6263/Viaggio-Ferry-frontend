import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import EditUserForm from "../components/admin/EditUserForm"
import { Link } from "react-router-dom"

export default function AdminEditUser() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        {/* Back Button */}
        <div className="mb-3">
          <Link to="/company/administration/user-list" className="btn btn-turquoise">
            <i className="bi bi-arrow-left"></i> Back to List
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-md-12">
            <div className="card flex-fill">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">Edit User</h5>
                </div>
              </div>

              <div className="card-body">
                <EditUserForm />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
