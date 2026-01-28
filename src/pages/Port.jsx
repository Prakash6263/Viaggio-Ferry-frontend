'use client';

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import Can from "../components/Can";

export default function Port() {
  const tableRef = useRef(null);

  // Sample data for ports
  const samplePorts = [
    {
      id: 1,
      name: "Port Sudan",
      code: "PSD",
      country: "Sudan",
      timezone: "UTC+02:00",
      status: "Active",
    },
    {
      id: 2,
      name: "Jeddah Islamic Port",
      code: "JED",
      country: "Saudi Arabia",
      timezone: "UTC+03:00",
      status: "Active",
    },
    {
      id: 3,
      name: "Dammam Port",
      code: "DMM",
      country: "Saudi Arabia",
      timezone: "UTC+03:00",
      status: "Active",
    },
    {
      id: 4,
      name: "Aqaba Port",
      code: "AQA",
      country: "Jordan",
      timezone: "UTC+03:00",
      status: "Active",
    },
  ];

  const ports = samplePorts; // Declare the ports variable

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    // Initialize DataTable safely if DataTable available
    if (window.DataTable) {
      try {
        if (el._dt) {
          el._dt.destroy();
          el._dt = null;
        }
      } catch {}
      const dt = new window.DataTable(el, {
        paging: true,
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        searching: true,
        ordering: true,
        info: true,
      });
      el._dt = dt;
      return () => {
        try {
          dt.destroy();
        } catch {}
        if (el) el._dt = null;
      };
    }
  }, []);

  return (
    <div className="main-wrapper">
      <Header />
      <Sidebar />

      <PageWrapper>
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Ports Management</h5>

              <div className="list-btn" style={{ justifySelf: "end" }}>
                <ul className="filter-list">
                  <li>
                    <Can action="create">
                      <Link
                        className="btn btn-turquoise"
                        to="/company/settings/add-port"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        ></i>
                        Add New port
                      </Link>
                    </Can>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-sm-12">
              <div className="card-table card p-2">
                <div className="card-body">
                  <div className="table-responsive">
                    <table
                      ref={tableRef}
                      className="table table-bordered"
                      id="example"
                    >
                      <thead>
                        <tr>
                          <th>Port Name</th>
                          <th>Port Code</th>
                          <th>Country</th>
                          <th>Timezone</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {samplePorts.map((port) => (
                          <tr key={port.id}>
                            <td>{port.name}</td>
                            <td>{port.code}</td>
                            <td>{port.country}</td>
                            <td>{port.timezone}</td>
                            <td>
                              <span className="badge badge-active">
                                {port.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* /table-responsive */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
