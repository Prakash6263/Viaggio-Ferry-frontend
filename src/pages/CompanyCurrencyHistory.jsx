"use client"
import { useParams } from "react-router-dom"
import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import CurrencyHistoryTable from "../components/admin/CurrencyHistoryTable"
import { Link } from "react-router-dom"

export default function CompanyCurrencyHistory() {
  const { currencyId } = useParams()

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Back Button */}
        <div className="mb-3">
          <Link to="/company/administration/currency" className="btn btn-turquoise">
            <i className="bi bi-arrow-left"></i> Back to List
          </Link>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header">
            <h5>Currency Exchange Rate History</h5>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-sm-12">
            <CurrencyHistoryTable currencyId={currencyId} />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
