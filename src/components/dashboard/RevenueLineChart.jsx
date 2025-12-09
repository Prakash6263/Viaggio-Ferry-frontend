import React from "react";
import { useChartJS } from "../../hooks/useChartJS";


export function RevenueLineChart() {
useChartJS({
canvasId: "revenueChart",
config: {
type: "line",
data: {
labels: ["Jan","Feb","Mar","Apr","May","Jun"],
datasets: [{
label: "Total B2C Revenue",
data: [105000, 111000, 128000, 119000, 135000, 139000],
borderColor: "#00D2CB",
backgroundColor: "#00d2cb40",
tension: 0.3,
fill: true,
pointRadius: 5,
pointHoverRadius: 7,
}],
},
options: {
responsive: true,
plugins: { legend: { display: true, labels: { color: "#333" } } },
scales: { x: { ticks: { color: "#333" } }, y: { ticks: { color: "#333" } } },
},
},
});


return (
<div className="col-xl-6 d-flex">
<div className="card flex-fill card-purple">
<div className="card-header card-header-dashboard">
<div className="d-flex justify-content-between align-items-center">
<h5 className="card-title">B2C Revenue (Last 6 Months)</h5>
</div>
</div>
<div className="card-body">
<canvas id="revenueChart" height="150"></canvas>
</div>
</div>
</div>
);
}