import React from "react";
import Header from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { PageWrapper } from "../components/layout/PageWrapper";
import { StatCards } from "../components/dashboard/StatCards";
import { EarningBarChart } from "../components/dashboard/EarningBarChart";
import { TrendingDonutChart } from "../components/dashboard/TrendingDonutChart";
import { RevenueLineChart } from "../components/dashboard/RevenueLineChart";
import { RecentB2BTable } from "../components/dashboard/RecentB2BTable";
import { RecentB2CTable } from "../components/dashboard/RecentB2CTable";
import { useThemeToggle } from "../hooks/useThemeToggle";


export default function Dashboard() {
useThemeToggle();
return (
<div className="main-wrapper">
<Header />
<Sidebar />
<PageWrapper>
<div className="content container-fluid">
<StatCards />


<div className="row g-4">
<EarningBarChart />
<TrendingDonutChart />
</div>


<div className="row">
<RevenueLineChart />
<RecentB2BTable />
</div>


<RecentB2CTable />
</div>
</PageWrapper>
</div>
);
}