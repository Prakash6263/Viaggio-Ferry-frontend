import React from "react";

export function StatCards() {
  return (
    <div className="row mb-3">
      {/* Card 1 */}
      <div className="col-xl-3 col-sm-6 col-12">
        <div className="card card-purple">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-1">
                <i className="fa-solid fa-clipboard-list"></i>
              </span>
              <div className="dash-count">
                <div className="dash-title">Confirmed Bookings (B2C)</div>
                <div className="dash-counts"><p>2,456</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-xl-3 col-sm-6 col-12">
        <div className="card card-blue">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-1">
                <i className="fa-solid fa-clock-rotate-left"></i>
              </span>
              <div className="dash-count">
                <div className="dash-title">Pending Payments</div>
                <div className="dash-counts"><p>124</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-xl-3 col-sm-6 col-12">
        <div className="card card-pink">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-1">
                <i className="fa-solid fa-sack-dollar"></i>
              </span>
              <div className="dash-count">
                <div className="dash-title">Total B2C Revenue</div>
                <div className="dash-counts"><p>$128,450</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-xl-3 col-sm-6 col-12">
        <div className="card card-green">
          <div className="card-body">
            <div className="dash-widget-header">
              <span className="dash-widget-icon bg-1">
                <i className="fa-solid fa-file-invoice-dollar"></i>
              </span>
              <div className="dash-count">
                <div className="dash-title">Outstanding Receivables</div>
                <div className="dash-counts"><p>$1,250</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
