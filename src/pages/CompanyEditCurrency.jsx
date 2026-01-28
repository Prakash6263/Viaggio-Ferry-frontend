"use client"
import { useParams } from "react-router-dom"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import EditCurrencyForm from "../components/admin/EditCurrencyForm"
import { Link } from "react-router-dom"
import Can from "../components/Can"

export default function CompanyEditCurrency() {
  const { currencyId } = useParams()

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* UPDATE action - uses LIST route path */}
        <Can action="update" path="/company/administration/currency">
          {/* Back Button */}
          <div className="mb-3">
            <Link to="/company/administration/currency" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row g-4">
            <div className="col-md-12">
              <div className="card flex-fill">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Edit Currency</h5>
                  </div>
                </div>
                <div className="card-body">
                  <EditCurrencyForm currencyId={currencyId} />
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  )
}
