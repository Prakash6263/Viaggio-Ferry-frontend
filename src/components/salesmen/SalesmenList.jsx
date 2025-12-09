// src/components/salesmen/SalesmenList.jsx
import React, { useEffect, useRef } from "react";

/**
 * SalesmenList
 * - preserves table markup/classes exactly (thead same as HTML)
 * - initializes DataTables with JS data + explicit columns mapping
 * - robust cleanup: avoids removeChild errors on unmount/hot-reload
 * - emits edit/delete events via callbacks on props
 */
export default function SalesmenList({ salesmen = [], onEdit, onDelete }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // destroy previous instance safely
    try {
      if (el._dt && typeof el._dt.destroy === "function") {
        if (el.isConnected || document.contains(el)) {
          el._dt.destroy();
        } else {
          try { el._dt.destroy(); } catch (e) { /* ignore */ }
        }
        el._dt = null;
      }
    } catch (err) {
      console.warn("Warning destroying old DataTable:", err);
      el._dt = null;
    }

    if (!window.DataTable) {
      console.warn("DataTable not found on window. Please include DataTables scripts in public/index.html");
      return;
    }

    // columns should match the thead order in markup
    const columns = [
      { title: "Full Name", data: "name" },
      { title: "Email", data: "email" },
      { title: "Position", data: "position" },
      { title: "Partner Assignment", data: "assignment" },
      {
        title: "Status",
        data: "status",
        render: function (data) {
          // return HTML for switch badge similar to your template
          return `<div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" ${data ? "checked" : ""} disabled>
                  </div>`;
        },
      },
      {
        title: "Actions",
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row) {
          return `<button class="btn btn-outline-primary btn-sm edit-btn" data-id="${row.id}">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm delete-btn ms-2" data-id="${row.id}">
                    <i class="bi bi-trash"></i>
                  </button>`;
        },
      },
    ];

    // map data to include any computed fields
    const data = salesmen.map((s) => ({ ...s }));

    let dt;
    try {
      dt = new window.DataTable(el, {
        data,
        columns,
        paging: true,
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        searching: true,
        ordering: true,
        info: true,
      });
      el._dt = dt;
    } catch (err) {
      console.error("Failed to initialize DataTable:", err);
      return;
    }

    // delegated click handler to fire callbacks
    const handleClick = (e) => {
      const btn = e.target.closest?.("button") || e.target;
      if (!btn) return;
      if (btn.matches(".edit-btn")) {
        const id = btn.getAttribute("data-id");
        if (id != null) onEdit?.(Number(id));
      } else if (btn.matches(".delete-btn")) {
        const id = btn.getAttribute("data-id");
        if (id != null) onDelete?.(Number(id));
      }
    };

    el.addEventListener("click", handleClick);

    // cleanup
    return () => {
      try { el.removeEventListener("click", handleClick); } catch (e) {}
      try {
        if (el._dt && typeof el._dt.destroy === "function") {
          if (el.isConnected || document.contains(el)) {
            el._dt.destroy();
          } else {
            try { el._dt.destroy(); } catch (inner) {}
          }
        }
      } catch (err) {
        console.warn("Error during DataTable destroy:", err);
      } finally {
        if (el) el._dt = null;
      }
    };
  }, [salesmen, onEdit, onDelete]);

  return (
    <div className="table-responsive">
      <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Partner Assignment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        {/* DataTable will populate tbody */}
        <tbody />
      </table>
    </div>
  );
}
