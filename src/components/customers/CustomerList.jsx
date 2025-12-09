// src/components/customers/CustomerList.jsx
import React, { useEffect, useRef } from "react";

/**
 * CustomerList
 * - Initializes DataTable with JS data + columns mapping (no DOM mismatch)
 * - Renders table <thead> only (DataTable will populate body)
 * - Dispatches custom events 'dt-delete' and 'dt-edit' on button clicks
 * - Listens to customers changes and re-inits safely
 */
export default function CustomerList({ customers = [], onDelete, onEdit }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // If there is an existing instance, attempt to destroy it safely.
    try {
      if (el._dt && typeof el._dt.destroy === "function") {
        // destroy only if element is still connected
        if (el.isConnected || document.contains(el)) {
          el._dt.destroy();
        } else {
          try { el._dt.destroy(); } catch (err) { /* ignore */ }
        }
        el._dt = null;
      }
    } catch (err) {
      console.warn("Warning while destroying previous DataTable instance:", err);
      el._dt = null;
    }

    if (!window.DataTable) {
      console.warn("DataTable library not found on window. Skipping initialization.");
      return;
    }

    // prepare columns mapping (must match thead order)
    const columns = [
      { title: "Name", data: "name" },
      { title: "Partner", data: "partner" },
      { title: "Nationality", data: "nationality" },
      { title: "WhatsApp Number", data: "whatsapp" },
      { title: "Address", data: "address" },
      { title: "Status", data: "status" },
      {
        title: "Actions",
        data: null,
        orderable: false,
        searchable: false,
        // render cell content (works for many DataTable variants)
        render: function (data, type, row, meta) {
          return `<button class="btn btn-sm btn-info edit-btn" data-id="${row.id}">Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn ms-2" data-id="${row.id}">Delete</button>`;
        },
      },
    ];

    // transform customers into flat data rows (whatsapp/address combined)
    const data = customers.map((c) => ({
      ...c,
      whatsapp: `${c.countryCode || ""} ${c.whatsappNumber || ""}`.trim(),
      address: `${c.street || ""}, ${c.city || ""}, ${c.country || ""}`.replace(/(^[,\s,]+|[,\s,]+$)/g, ""),
    }));

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
        // if your DataTable version uses columnDefs instead of columns.render, adjust above
      });
    } catch (err) {
      console.error("Failed to initialize DataTable:", err);
      return;
    }

    // store instance on element for hot-reload safety
    el._dt = dt;

    // Delegate click handler to capture edit/delete button clicks
    const handleClick = (e) => {
      const t = e.target;
      // support clicks on inner elements (icon inside button)
      const btn = t.closest?.("button") || t;
      if (!btn) return;
      if (btn.matches && btn.matches(".delete-btn")) {
        const id = btn.getAttribute("data-id");
        if (id != null) window.dispatchEvent(new CustomEvent("dt-delete", { detail: { id } }));
      } else if (btn.matches && btn.matches(".edit-btn")) {
        const id = btn.getAttribute("data-id");
        if (id != null) window.dispatchEvent(new CustomEvent("dt-edit", { detail: { id } }));
      }
    };

    el.addEventListener("click", handleClick);

    // Listen for custom events in component scope and call callbacks
    const onDtDelete = (ev) => onDelete?.(Number(ev.detail.id));
    const onDtEdit = (ev) => onEdit?.(Number(ev.detail.id));

    window.addEventListener("dt-delete", onDtDelete);
    window.addEventListener("dt-edit", onDtEdit);

    // cleanup
    return () => {
      // remove event listeners
      try { el.removeEventListener("click", handleClick); } catch (e) { /* ignore */ }
      try { window.removeEventListener("dt-delete", onDtDelete); } catch (e) { /* ignore */ }
      try { window.removeEventListener("dt-edit", onDtEdit); } catch (e) { /* ignore */ }

      // destroy datatable instance safely
      try {
        if (el._dt && typeof el._dt.destroy === "function") {
          if (el.isConnected || document.contains(el)) {
            el._dt.destroy();
          } else {
            try { el._dt.destroy(); } catch (inner) { /* ignore */ }
          }
        }
      } catch (err) {
        console.warn("Error during DataTable destroy in cleanup:", err);
      } finally {
        if (el) el._dt = null;
      }
    };
  }, [customers, onDelete, onEdit]);

  // Render table with thead only; DataTable will use the provided data to build tbody
  return (
    <div id="customerTableContainer" className="table-responsive">
      <table ref={tableRef} className="table table-striped mb-0" id="example" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th className="px-4 py-3 text-start fw-semibold">Name</th>
            <th className="px-4 py-3 text-start fw-semibold">Partner</th>
            <th className="px-4 py-3 text-start fw-semibold">Nationality</th>
            <th className="px-4 py-3 text-start fw-semibold">WhatsApp Number</th>
            <th className="px-4 py-3 text-start fw-semibold">Address</th>
            <th className="px-4 py-3 text-start fw-semibold">Status</th>
            <th className="px-4 py-3 text-center fw-semibold">Actions</th>
          </tr>
        </thead>
        <tbody />
      </table>
    </div>
  );
}
