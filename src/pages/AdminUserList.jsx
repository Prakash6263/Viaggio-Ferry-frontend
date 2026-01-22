// import React from "react";
// import Header from "../components/layout/Header";
// import { Sidebar } from "../components/layout/Sidebar";
// import { PageWrapper } from "../components/layout/PageWrapper";
// import UserListTable from "../components/admin/UserListTable";
// import { Link } from "react-router-dom";

// export default function AdminUserList() {
//   return (
//     <div className="main-wrapper">
//       <Header />
//       <Sidebar />
//       <PageWrapper>
//         {/* Page Header (same classes as HTML) */}
//         <div className="page-header">
//           <div className="content-page-header d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">User List</h5>
//             <div className="list-btn" style={{ justifySelf: "end" }}>
//               <ul className="filter-list mb-0">
//                 <li>
//                   <Link className="btn btn-turquoise" to="/company/administration/add-user">
//                     <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
//                     Add New User
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="row">
//           <div className="col-sm-12">
//             <UserListTable />
//           </div>
//         </div>
//       </PageWrapper>
//     </div>
//   );
// }


"use client"

import Header from "../components/layout/Header"
import { Sidebar } from "../components/layout/Sidebar"
import { PageWrapper } from "../components/layout/PageWrapper"
import UserListTable from "../components/admin/UserListTable"
import { Link } from "react-router-dom"
import Can from "../components/Can"

export default function AdminUserList() {
  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />
      <PageWrapper>
        {/* Page Header (same classes as HTML) */}
        <div className="page-header">
          <div className="content-page-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">User List</h5>
            <div className="list-btn" style={{ justifySelf: "end" }}>
              <ul className="filter-list mb-0">
                <li>
                  <Can action="create">
                    <Link className="btn btn-turquoise" to="/company/administration/add-user">
                      <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>
                      Add New User
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
            <UserListTable />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}
