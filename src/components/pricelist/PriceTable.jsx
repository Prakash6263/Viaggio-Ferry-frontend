import React from "react";

/**
 * PriceTable - preserves exact markup/classes of the HTML table view
 * Props:
 *  - rows: array of row objects (optional). If absent, sample rows are shown.
 */
export default function PriceTable({ rows = [], onRowClick }) {
  const data = rows.length ? rows : [
    // sample data (keeps same markup as html)
    { id: 1, name: "Summer 2024 Passenger List", date: "2024-06-01 08:00", taxBase: "Fare Only", currency: "USD" },
    { id: 2, name: "Fall 2024 Passenger List", date: "2024-09-01 09:00", taxBase: "Fare & Taxes", currency: "EUR" },
  ];

  return (
    <div className="table-responsive">
      <table className="table table-striped mb-0">
        <thead>
          <tr>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Price List Name</th>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Effective Date &amp; Time</th>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Tax Base</th>
            <th scope="col" className="px-4 py-3 text-start fw-semibold">Currency</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.map((r) => (
            <tr
              key={r.id}
              className="cursor-pointer"
              onClick={() => onRowClick && onRowClick(r)}
            >
              <td className="px-4 py-4 text-nowrap">{r.name}</td>
              <td className="px-4 py-4 text-nowrap">{r.date}</td>
              <td className="px-4 py-4 text-nowrap">{r.taxBase}</td>
              <td className="px-4 py-4 text-nowrap">{r.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
