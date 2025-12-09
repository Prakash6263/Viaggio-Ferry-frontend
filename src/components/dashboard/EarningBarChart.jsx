import React from "react";
import { useChartJS } from "../../hooks/useChartJS";


export function EarningBarChart() {
useChartJS({
canvasId: "barChart",
config: {
type: "bar",
data: {
labels: ["01","02","03","04","05","06","07","08","09","10","11"],
datasets: [
{ label: "Order", data: [10,20,40,50,30,25,20,15,70,90,30], backgroundColor: "#1cc88a" },
{ label: "Refunds", data: [70,60,100,90,110,120,100,60,150,140,100], backgroundColor: "#e74a3b" },
{ label: "Earnings", data: [120,130,170,180,175,190,190,160,220,200,180], backgroundColor: "#002b5c" },
],
},
options: {
responsive: true,
plugins: { legend: { labels: { color: "#333" } } },
scales: {
x: { ticks: { color: "#333" }, stacked: false },
y: { ticks: { color: "#333" }, beginAtZero: true },
},
},
},
});


return (
<div className="col-lg-6">
<div className="card card-purple">
<div className="card-header card-header-dashboard">
<div className="d-flex justify-content-between align-items-center">
<h5 className="card-title">Earning Statistics</h5>
</div>
</div>
<div className="card-body">
<div className="chart-container">
<canvas id="barChart"></canvas>
</div>
</div>
</div>
</div>
);
}