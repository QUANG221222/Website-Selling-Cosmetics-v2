"use client";

import { Suspense } from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import OrdersChart from "@/components/dashboard/OrdersChart";
import SkeletonCardsState from "@/components/dashboard/SkeletonCardsState";
import SkeletonRevenueChart from "@/components/dashboard/SkeletonRevenueChart";
import SkeletonOrdersChart from "@/components/dashboard/SkeletonOrdersChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<SkeletonCardsState />}>
          <StatsCards />
        </Suspense>
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="w-full">
        <Suspense fallback={<SkeletonRevenueChart />}>
          <RevenueChart />
        </Suspense>
      </div>

      {/* Orders Chart - Full Width */}
      <div className="w-full">
        <Suspense fallback={<SkeletonOrdersChart />}>
          <OrdersChart />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
