import React, { useEffect } from "react";

export default function UserListTable() {
  // Initialize DataTables safely
useEffect(() => {
  const init = () => {
    const tableEl = document.querySelector("#example");
    if (!window.DataTable || !tableEl) return;

    // prevent double init in dev / StrictMode
    if (tableEl.dataset.dtInitialized) return;

    const dt = new window.DataTable("#example", {
      // show dropdown + search + info + paging
      paging: true,
      pageLength: 10,                // default selected value
      lengthMenu: [10, 25, 50, 100], // dropdown values
      searching: true,
      ordering: true,
      info: true,

      // DataTables v2 layout (Bootstrap 5)
      layout: {
        topStart: "pageLength",
        topEnd: "search",
        bottomStart: "info",
        bottomEnd: "paging",
      },
    });

    // optional: placeholder text for search input
    const wrapper = tableEl.closest(".dataTables_wrapper");
    const searchInput = wrapper?.querySelector('input[type="search"]');
    if (searchInput) searchInput.placeholder = "Search:";

    tableEl.dataset.dtInitialized = "true";

    // cleanup on unmount / route change
    return () => {
      try { dt.destroy(); } catch {}
      delete tableEl.dataset.dtInitialized;
    };
  };

  const t = setTimeout(init, 0);
  return () => clearTimeout(t);
}, []);


  return (
    <div className="card-table card p-2">
      <div className="card-body">
        {/* inline styles copied from HTML */}
        <style>{`
          .status-label{display:inline-block;min-width:40px;text-align:center;padding:.25rem .5rem;border-radius:.25rem;font-weight:500}
          .status-yes{background-color:#ffc107;color:#212529}
          .form-switch .form-check-input{width:45px;height:22px;cursor:pointer}
          .form-switch .form-check-input:checked{background-color:#0d6efd;border-color:#0d6efd}
          .badge-agent{font-weight:600}
        `}</style>

        <div className="table-responsive">
          <table id="example" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Agent Assignment</th>
                <th>Is Salesman</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>John Smith</td>
                <td>john.smith@company.com</td>
                <td>Finance Manager</td>
                <td><span className="badge bg-primary badge-agent">Company</span></td>
                <td><span className="status-label bg-secondary text-white">No</span></td>
                <td>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                  </div>
                </td>
                <td>
                  <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash"></i></button>
                </td>
              </tr>

              <tr>
                <td>Sarah Johnson</td>
                <td>sarah.j@marineagent.com</td>
                <td>Operations Manager</td>
                <td><span className="badge bg-info text-white badge-agent">Marine Agent A1</span></td>
                <td><span className="status-label bg-secondary text-white">No</span></td>
                <td>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                  </div>
                </td>
                <td>
                  <button className="btn btn-outline-primary btn-sm"><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-outline-danger btn-sm ms-1"><i className="bi bi-trash"></i></button>
                </td>
              </tr>

              <tr>
                <td>Michael Brown</td>
                <td>michael.b@commercialagent.com</td>
                <td>Sales Representative</td>
                <td><span className="badge bg-success text-white badge-agent">Commercial Agent A1.1</span></td>
                <td><span className="status-label status-yes text-white">Yes</span></td>
                <td>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" defaultChecked />
                  </div>
                </td>
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
