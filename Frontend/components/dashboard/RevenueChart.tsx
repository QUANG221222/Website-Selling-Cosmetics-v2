"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { dashboardApi } from "@/lib/api/dashboard";

const changeMonth = (month: number): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1] || "";
};

export default function RevenueChart() {
  const year = new Date().getFullYear();

  const { data: revenueData } = useSuspenseQuery({
    queryKey: ["revenueByMonth", year],
    queryFn: async () => {
      const promises = Array.from({ length: 12 }, (_, i) =>
        dashboardApi.getRevenueByMonth(year, i + 1)
      );
      const results = await Promise.all(promises);

      return results.map((res, idx) => {
        const revenue = (res as any)?.data ?? (res as any)?.result ?? res;
        return { month: changeMonth(idx + 1), revenue: Number(revenue ?? 0) };
      });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="pt-2">Doanh thu theo tháng</CardTitle>
        <CardDescription>
          Biểu đồ doanh thu {new Date().getMonth() + 1} tháng đầu năm{" "}
          {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer
          config={{
            revenue: {
              label: "Doanh thu",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] min-h-[300px] pb-3"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Doanh thu",
                ]}
              />
              <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}