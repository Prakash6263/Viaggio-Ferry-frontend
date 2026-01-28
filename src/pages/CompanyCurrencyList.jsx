// import React from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";
// import CurrencyListTable from "../components/admin/CurrencyListTable";
// import { Link } from "react-router-dom";

// export default function CompanyCurrencyList() {
//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <PageWrapper>
//         {/* Page Header */}
//         <div className="page-header">
//           <div className="content-page-header">
//             <h5>Currencies</h5>
//             <div className="list-btn" style={{ justifySelf: "end" }}>
//               <ul className="filter-list">
//                 <li>
//                   <Link className="btn btn-turquoise" to="/company/administration/add-currency">
//                     <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
//                     Add New Currency
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="row">
//           <div className="col-sm-12">
//             <CurrencyListTable />
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
import CurrencyListTable from "../components/admin/CurrencyListTable";
import { Link } from "react-router-dom";
import Can from "../components/Can";

export default function CompanyCurrencyList() {
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
              <h5>Currencies</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* CREATE action - uses LIST route path */}
                    <Can action="create" path="/company/administration/currency">
                      <Link className="btn btn-turquoise" to="/company/administration/add-currency">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                        Add New Currency
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
              <CurrencyListTable />
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
