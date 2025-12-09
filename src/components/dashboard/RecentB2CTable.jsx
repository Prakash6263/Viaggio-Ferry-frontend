import React from "react";

export function RecentB2CTable() {
  return (
    <div className="row my-4">
      <div className="col-12">
        <div className="card d-flex card-purple">
          <div className="card-header card-header-dashboard">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title">Recent B2C Bookings</h5>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Trip</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>#B2C-1001</td>
                    <td>John Carter</td>
                    <td>Port A → Port B</td>
                    <td><span className="badge bg-success status-badge">Confirmed</span></td>
                    <td>$120.00</td>
                  </tr>

                  <tr>
                    <td>#B2C-1002</td>
                    <td>Aisha Khan</td>
                    <td>Port C → Port D</td>
                    <td><span className="badge bg-warning status-badge">Pending</span></td>
                    <td>$90.00</td>
                  </tr>

                  <tr>
                    <td>#B2C-1003</td>
                    <td>Ben Howard</td>
                    <td>Port B → Port C</td>
                    <td><span className="badge bg-success status-badge">Confirmed</span></td>
                    <td>$150.00</td>
                  </tr>

                  <tr>
                    <td>#B2C-1004</td>
                    <td>Maria Rossi</td>
                    <td>Port A → Port D</td>
                    <td><span className="badge bg-danger status-badge">Cancelled</span></td>
                    <td>$0.00</td>
                  </tr>
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
