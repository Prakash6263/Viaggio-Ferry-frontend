import React from "react";


export function RecentB2BTable() {
return (
<div className="col-md-6">
<div className="card flex-fill card-purple">
<div className="card-header card-header-dashboard">
<div className="d-flex justify-content-between align-items-center">
<h5 className="card-title">Recent B2B Bookings</h5>
</div>
</div>
<div className="card-body">
<div className="table-responsive mt-3 mb-5">
<table className="table table-striped">
<thead>
<tr>
<th>Booking ID</th>
<th>Agent</th>
<th>Trip</th>
<th>Amount</th>
</tr>
</thead>
<tbody>
<tr>
<td>#B2B-1001</td>
<td>Global Marine</td>
<td>Port A to Port</td>
<td>$850.00</td>
</tr>
<tr>
<td>#B2B-1002</td>
<td>Sea World Tours</td>
<td>Port C to Port</td>
<td>$1,200.00</td>
</tr>
<tr>
<td>#B2B-1003</td>
<td>Voyage Inc.</td>
<td>Port B to Port</td>
<td>$450.00</td>
</tr>
<tr>
<td>#B2B-1001</td>
<td>Global Marine</td>
<td>Port A to Port</td>
<td>$850.00</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</div>
);
}