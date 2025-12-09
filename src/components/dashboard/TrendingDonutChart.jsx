import React from "react";
import  {useChartJS}  from "../../hooks/useChartJS";
export function TrendingDonutChart() {
useChartJS({
canvasId: "donutChart",
config: {
type: "doughnut",
data: {
labels: ["Category 1","Category 2","Category 3","Category 4"],
datasets: [{
data: [50000, 25000, 15000, 10000],
backgroundColor: ["#4e73df","#1cc88a","#e74a3b","#f6c23e"],
cutout: "70%",
}],
},
options: { responsive: true, plugins: { legend: { display: false } } },
},
});


return (
<div className="col-lg-6">
<div className="card card-purple">
<div className="card-header card-header-dashboard">
<div className="d-flex justify-content-between align-items-center">
<h5 className="card-title">Trending Ferry</h5>
<div>
<select className="form-select form-select-sm d-inline w-auto">
<option>Metric</option>
<option>Revenue</option>
</select>
<select className="form-select form-select-sm d-inline w-auto ms-2">
<option>Today</option>
<option>This Week</option>
</select>
</div>
</div>
</div>
<div className="card-body">
<div className="row">
<div className="col-6"><canvas id="donutChart"></canvas></div>
<div className="col-6">
<ul className="legend-list mt-4">
<li><span style={{ background: "#4e73df" }}></span> Category 1 – <strong>$50,000</strong></li>
<li><span style={{ background: "#1cc88a" }}></span> Category 2 – <strong>$25,000</strong></li>
<li><span style={{ background: "#e74a3b" }}></span> Category 3 – <strong>$15,000</strong></li>
<li><span style={{ background: "#f6c23e" }}></span> Category 4 – <strong>$10,000</strong></li>
</ul>
</div>
</div>
</div>
</div>
</div>
);
}