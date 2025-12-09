import React, { useEffect } from "react";

export default function CurrencyListTable() {
  useEffect(() => {
    const el = document.getElementById("currencyTable");
    if (!el || !window.DataTable) return;

    // destroy if hot-reloaded
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
          <table id="currencyTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Currency Code</th>
                <th>Currency Name</th>
                <th>Last Rate Update</th>
                <th>Current Rate (Variable)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SDG</td>
                <td>Sudanese Pound</td>
                <td>9/11/2024, 9:30:00 AM</td>
                <td>650.00</td>
              </tr>
              <tr>
                <td>SAR</td>
                <td>Saudi Riyal</td>
                <td>9/9/2024, 3:00:00 PM</td>
                <td>3.75</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
