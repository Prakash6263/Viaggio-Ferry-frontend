import React, { useEffect } from "react";

export default function PromotionsListTable() {
  useEffect(() => {
    const el = document.getElementById("promotionsTable");
    if (!el || !window.DataTable) return;

    try { if (el._dt) { el._dt.destroy(); el._dt = null; } } catch {}

    const dt = new window.DataTable(el, {
      paging: true,
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      searching: true,
      ordering: true,
      info: true,
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });
    el._dt = dt;
    return () => { try { dt.destroy(); } catch {} el._dt = null; };
  }, []);

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        <div className="table-responsive">
          <table id="promotionsTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Promotion Name</th>
                <th>Status</th>
                <th>Basis</th>
                <th>Benefits</th>
                <th>Eligibility</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="promotions-table-body">
              <tr>
                <td>Summer Travel Special</td>
                <td><span className="status status-active">Active</span></td>
                <td>Period: Jun 1, 10:00 - Aug 31, 23:59</td>
                <td>Passenger: Buy 2 Get 1 Free<br/>Cargo: 15% Off<br/>Vehicle: $10 Off</td>
                <td>Passenger: Adult, Economy<br/>Cargo: General Goods<br/>Vehicle: Car</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr>
                <td>Holiday Discount</td>
                <td><span className="status status-scheduled">Scheduled</span></td>
                <td>Trip: Morning Express</td>
                <td>Passenger: 20% Off<br/>Vehicle: Buy 1 Get 1 Free</td>
                <td>Passenger: Adult, Business<br/>Vehicle: Car, Motorcycle</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
