"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardApi } from "@/lib/api/dashboard";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

export default function StatsCards() {
  const year = new Date().getFullYear();

  const { data: stats } = useSuspenseQuery({
    queryKey: ["dashboardStats", year],
    queryFn: async () => {
      const [
        revenue,
        orders,
        users,
        products,
        success,
        pending,
        processing,
        cancelled,
      ] = await Promise.all([
        dashboardApi.getRevenueByYear(year),
        dashboardApi.getTotalOrders(),
        dashboardApi.getTotalUsers(),
        dashboardApi.getTotalProducts(),
        dashboardApi.getTotalOrdersSuccess(),
        dashboardApi.getTotalOrdersPending(),
        dashboardApi.getTotalOrdersProcessing(),
        dashboardApi.getTotalOrdersCancelled(),
      ]);

      return {
        totalRevenue: Number(
          (revenue as any)?.data ?? (revenue as any)?.result ?? revenue ?? 0
        ),
        totalOrders: Number(
          (orders as any)?.data ?? (orders as any)?.result ?? orders ?? 0
        ),
        totalUsers: Number(
          (users as any)?.data ?? (users as any)?.result ?? users ?? 0
        ),
        totalProducts: Number(
          (products as any)?.data ?? (products as any)?.result ?? products ?? 0
        ),
        totalOrdersSuccess: Number(
          (success as any)?.data ?? (success as any)?.result ?? success ?? 0
        ),
        totalOrdersPending: Number(
          (pending as any)?.data ?? (pending as any)?.result ?? pending ?? 0
        ),
        totalOrdersProcessing: Number(
          (processing as any)?.data ??
            (processing as any)?.result ??
            processing ??
            0
        ),
        totalOrdersCancelled: Number(
          (cancelled as any)?.data ??
            (cancelled as any)?.result ??
            cancelled ??
            0
        ),
      };
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(stats.totalRevenue),
      description: `${new Date().getMonth() + 1} tháng đầu năm`,
      icon: DollarSign,
    },
    {
      title: "Đơn hàng",
      value: stats.totalOrders.toString(),
      description: `${stats.totalOrdersSuccess} hoàn thành, ${stats.totalOrdersPending} chờ xử lý, ${stats.totalOrdersProcessing} đang xử lý, ${stats.totalOrdersCancelled} đã hủy`,
      icon: ShoppingCart,
    },
    {
      title: "Khách hàng",
      value: stats.totalUsers.toString(),
      description: "Tài khoản đang hoạt động",
      icon: Users,
    },
    {
      title: "Sản phẩm",
      value: stats.totalProducts.toString(),
      description: "Trong kho",
      icon: Package,
    },
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mb-2">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}