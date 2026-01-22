// import React from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";
// import TaxesListTable from "../components/admin/TaxesListTable";
// import { Link } from "react-router-dom";

// export default function CompanyTaxesList() {
//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <PageWrapper>
//         {/* Page Header */}
//         <div className="page-header">
//           <div className="content-page-header">
//             <h5>Taxes Management</h5>
//             <div className="list-btn" style={{ justifySelf: "end" }}>
//               <ul className="filter-list">
//                 <li>
//                   <Link className="btn btn-turquoise" to="/company/administration/add-tax">
//                     <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
//                     Add New Tax
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="row">
//           <div className="col-sm-12">
//             <TaxesListTable />
//           </div>
//         </div>
//       </PageWrapper>
//     </div>
//   );
// }



import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import TaxesListTable from "../components/admin/TaxesListTable";
import { Link } from "react-router-dom";
import Can from "../components/Can";

export default function CompanyTaxesList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Page Header */}
        <div className="page-header">
          <div className="content-page-header">
            <h5>Taxes Management</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list">
                <li>
                  <Can action="create">
                    <Link className="btn btn-turquoise" to="/company/administration/add-tax">
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                      Add New Tax
                    </Link>
                  </Can>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="row">
          <div className="col-sm-12">
            <TaxesListTable />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
