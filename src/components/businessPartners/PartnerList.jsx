// src/components/businessPartners/PartnerList.jsx
import React, { useEffect, useRef } from "react";

export default function PartnerList({ partners = [] }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // initialize DataTable safely if DataTable available
    if (window.DataTable) {
      try { if (el._dt) { el._dt.destroy(); el._dt = null; } } catch {}
      const dt = new window.DataTable(el, {
        paging: true,
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        searching: true,
        ordering: true,
        info: true,
      });
      el._dt = dt;
      return () => { try { dt.destroy(); } catch {} if (el) el._dt = null; };
    }
    // if DataTable not loaded, do nothing (HTML script in public/index.html can init)
  }, []);

  const data = partners.length ? partners : [
    { id: 1, name: "Marine Transport Co.", phone: "+123456789", address: "123 Ocean St.", layer: "Marine", status: "Active" },
  ];

  return (
    <div id="list-view" className="card-table active">
      <h4 className="mb-3">List View</h4>
      <div className="table-responsive">
        <table ref={tableRef} className="partner-table table table-striped" id="example">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Layer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.phone}</td>
                <td>{p.address}</td>
                <td>{p.layer}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
