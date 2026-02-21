"use client"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import EditTaxForm from "../components/admin/EditTaxForm"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import Can from "../components/Can"

export default function CompanyEditTax() {
  const { taxId } = useParams()

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* UPDATE permission gate - hide entire page if no update access */}
        <Can action="update" path="/company/administration/taxes">
          <div className="mb-3">
            <Link to="/company/administration/taxes" className="btn btn-turquoise">
              <i className="bi bi-arrow-left"></i> Back to List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <EditTaxForm taxId={taxId} />
                </div>
              </div>
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  )
}
