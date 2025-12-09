import React, { useEffect } from "react";

export default function ContactMessagesTable() {
  useEffect(() => {
    const el = document.getElementById("contactMessagesTable");
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
          <table id="contactMessagesTable" className="table table-striped" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message (preview)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-10-22 11:05</td>
                <td>Neha Sharma</td>
                <td>neha@example.com</td>
                <td>Schedule Inquiry</td>
                <td>Hi, I want to know schedule for…</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#viewContactModal">
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm ms-1">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td>2025-10-20 17:40</td>
                <td>Omar Ali</td>
                <td>omar@shipper.com</td>
                <td>Group Booking</td>
                <td>We need 20 seats on…</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#viewContactModal">
                    <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm ms-1">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              {/* add more rows or load from API later */}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal (simple) */}
      <div className="modal fade" id="viewContactModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Message</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
            </div>
            <div className="modal-body">
              <div className="mb-2"><strong>Name:</strong> Neha Sharma</div>
              <div className="mb-2"><strong>Email:</strong> neha@example.com</div>
              <div className="mb-2"><strong>Subject:</strong> Schedule Inquiry</div>
              <div className="mb-0"><strong>Message:</strong> Hi, I want to know schedule for…</div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button className="btn btn-turquoise">Reply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
