// src/components/commission/CommissionTable.jsx
import React, { useEffect, useRef } from "react";

/**
 * CommissionTable
 * - preserves original table markup and classes/ids
 * - initializes DataTable defensively (uses window.DataTable)
 */
export default function CommissionTable({ rows = [] }) {
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // destroy previous instance if we created it
    try {
      if (el._dt && typeof el._dt.destroy === "function") {
        if (el.isConnected || document.contains(el)) el._dt.destroy();
        el._dt = null;
      }
    } catch (e) {
      el._dt = null;
    }

    if (!window.DataTable) {
      console.warn("DataTable library not found on window. Include DataTable script in public/index.html.");
      return;
    }

    // If already initialized by page scripts, skip (prevents double init)
    if (!el._dt) {
      try {
        el._dt = new window.DataTable(el, {
          // keep defaults so behaviour matches original
        });
      } catch (err) {
        console.error("DataTable init failed:", err);
      }
    }

    return () => {
      try {
        if (el && el._dt && typeof el._dt.destroy === "function") {
          if (el.isConnected || document.contains(el)) el._dt.destroy();
          el._dt = null;
        }
      } catch (err) {
        // ignore
      }
    };
  }, [rows]);

  return (
    <div className="table-responsive">
      <table ref={tableRef} id="example" className="table table-striped" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Rule Name</th>
            <th>Flow</th>
            <th>Commission</th>
            <th>Services</th>
            <th>Routes</th>
          </tr>
        </thead>
        <tbody>
          {/* keep markup exactly like HTML; use rows prop if provided, otherwise sample rows */}
          {(rows.length ? rows : [
            {
              id: 1,
              name: "Company to Marine Commission",
              flow: "Company → Marine Agent",
              commission: "5%",
              services: ["Passenger","Cargo","Vehicle"],
              routes: "Muscat → Dubai → Abu Dhabi"
            },
            {
              id: 2,
              name: "Marine to Commercial Commission",
              flow: "Marine Agent → Commercial Agent",
              commission: "4%",
              services: ["Passenger","Vehicle"],
              routes: "Muscat → Dubai"
            }
          ]).map((r) => (
            <tr key={r.id}>
              <td><input type="checkbox" /></td>
              <td>{r.name}</td>
              <td>{r.flow}</td>
              <td>{r.commission}</td>
              <td>
                {r.services.map((s, i) => (
                  <span key={i} className="badge badge-service">{s}</span>
                ))}
              </td>
              <td>{r.routes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
