import React, { useEffect } from "react";

export default function TaxesListTable() {
  useEffect(() => {
    const el = document.getElementById("taxesTable");
    if (!el || !window.DataTable) return;

    // destroy any previous instance (hot reload / route changes)
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

    return () => { try { dt.destroy(); } catch {}; el._dt = null; };
  }, []);

  return (
    <div className="card-table card p-2">
      <div className="card-body">
        {/* inline helpers copied from HTML */}
        <style>{`
          .status-label{display:inline-block;min-width:40px;text-align:center;padding:.25rem .5rem;border-radius:.25rem;font-weight:500}
          .status-yes{background-color:#ffc107;color:#212529}
          .badge-active{background:#22c55e;color:#fff}
          .badge-inactive{background:#e5e7eb;color:#111827}
          .form-switch .form-check-input{width:45px;height:22px;cursor:pointer}
          .form-switch .form-check-input:checked{background-color:#0d6efd;border-color:#0d6efd}
        `}</style>

        <div className="table-responsive">
          <table id="taxesTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Tax Code</th>
                <th>Tax Name</th>
                <th>Ledger Code</th>
                <th>Tax Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>VAT</td>
                <td>Value Added Tax</td>
                <td>21500</td>
                <td>15.00 %</td>
                <td><span className="badge badge-active">Active</span></td>
                <td>
                  <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil" /></button>
                  <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash" /></button>
                </td>
              </tr>
              <tr>
                <td>ECO</td>
                <td>Eco Fee</td>
                <td>21600</td>
                <td>5.00 Fixed</td>
                <td><span className="badge badge-inactive">Inactive</span></td>
                <td>
                  <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil" /></button>
                  <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
