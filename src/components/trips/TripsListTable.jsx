// import React, { useEffect, useRef } from "react";
// import { Link } from "react-router-dom";

// export default function TripsListTable() {
//   const tableRef = useRef(null);

//   useEffect(() => {
//     const el = tableRef.current;
//     if (!el || !window.DataTable) return;

//     try { if (el._dt) { el._dt.destroy(); el._dt = null; } } catch {}
//     const dt = new window.DataTable(el, {
//       paging: true,
//       pageLength: 10,
//       lengthMenu: [10, 25, 50, 100],
//       searching: true,
//       ordering: true,
//       info: true
//     });
//     el._dt = dt;
//     return () => { try { dt.destroy(); } catch {} if (el) el._dt = null; };
//   }, []);

//   const trips = [
//     { id: 1, name: "Trip 001", route: "Muscat to Dubai", vessel: "Example Ship 1", status: "Scheduled" }
//   ];

//   return (
//     <>
//       <div className="page-header">
//         <div className="content-page-header">
//           <h5>Scheduled Ferry Trips</h5>
//           <div className="list-btn" style={{ justifySelf: "end" }}>
//             <ul className="filter-list">
//               <li>
//                 <Link className="btn btn-turquoise" to="/company/ship-trip/add-trip">
//                   <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Trip
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-sm-12">
//           <div className="card-table card p-2">
//             <div className="card-body">
//               <div className="table-responsive">
//                 <table ref={tableRef} id="tripsTable" className="table table-bordered" style={{ width: "100%" }}>
//                   <thead>
//                     <tr>
//                       <th>Trip Name</th>
//                       <th>Departure / Arrival</th>
//                       <th>Vessel</th>
//                       <th>Status</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {trips.map(t => (
//                       <tr key={t.id}>
//                         <td>{t.name}</td>
//                         <td>{t.route}</td>
//                         <td>{t.vessel}</td>
//                         <td>{t.status}</td>
//                         <td className="action-buttons">
//                           <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil" /></button>
//                           <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash" /></button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Can from "../Can";
import CanDisable from "../CanDisable";

export default function TripsListTable() {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el || !window.DataTable) return;

    try { if (el._dt) { el._dt.destroy(); el._dt = null; } } catch {}
    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true
    });
    el._dt = dt;
    return () => { try { dt.destroy(); } catch {} if (el) el._dt = null; };
  }, []);

  const trips = [
    { id: 1, name: "Trip 001", route: "Muscat to Dubai", vessel: "Example Ship 1", status: "Scheduled" }
  ];

  return (
    <>
      <div className="page-header">
        <div className="content-page-header">
          <h5>Scheduled Ferry Trips</h5>
          <div className="list-btn" style={{ justifySelf: "end" }}>
            <ul className="filter-list">
              <li>
                <Can action="create">
                  <Link className="btn btn-turquoise" to="/company/ship-trip/add-trip">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Add New Trip
                  </Link>
                </Can>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-2">
            <div className="card-body">
              <div className="table-responsive">
                <table ref={tableRef} id="tripsTable" className="table table-bordered" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Trip Name</th>
                      <th>Departure / Arrival</th>
                      <th>Vessel</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map(t => (
                      <tr key={t.id}>
                        <td>{t.name}</td>
                        <td>{t.route}</td>
                        <td>{t.vessel}</td>
                        <td>{t.status}</td>
                        <td className="action-buttons">
                          <CanDisable action="update">
                            <button className="btn btn-sm btn-outline-primary me-1"><i className="bi bi-pencil" /></button>
                          </CanDisable>
                          <CanDisable action="delete">
                            <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash" /></button>
                          </CanDisable>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
