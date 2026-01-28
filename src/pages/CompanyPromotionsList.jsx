// import React from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";
// import PromotionsListTable from "../components/partner/PromotionsListTable";
// import { Link } from "react-router-dom";

// export default function CompanyPromotionsList() {
//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <PageWrapper>
//         <div className="page-header">
//           <div className="content-page-header">
//             <h5>Promotion</h5>
//             <div className="list-btn" style={{ justifySelf: "end" }}>
//               <ul className="filter-list">
//                 <li>
//                   <Link className="btn btn-turquoise" to="/company/partner-management/add-promotion">
//                     <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
//                     Add New Promotion
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         <div className="row">
//           <div className="col-sm-12">
//             <PromotionsListTable />
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
import PromotionsListTable from "../components/partner/PromotionsListTable";
import { Link } from "react-router-dom";
import Can from "../components/Can";

export default function CompanyPromotionsList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* READ permission gate - hide entire page if no read access */}
        <Can action="read">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Promotion</h5>
              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    {/* CREATE action - uses LIST route path */}
                    <Can action="create" path="/company/partner-management/promotions">
                      <Link className="btn btn-turquoise" to="/company/partner-management/add-promotion">
                        <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                        Add New Promotion
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12">
              <PromotionsListTable />
            </div>
          </div>
        </Can>
      </PageWrapper>
    </div>
  );
}
