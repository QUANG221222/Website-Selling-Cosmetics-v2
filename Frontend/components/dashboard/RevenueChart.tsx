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
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
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
    <Card className="col-span-12 lg:col-span-6 xl:col-span-4">
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
          className="h-[350px] w-[80%] pb-3"
        >
            <BarChart
            accessibilityLayer
                data={revenueData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid  />
                <XAxis 
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />

                <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [
                    formatCurrency(value),
                         " Doanh thu"
                    ]}
                />
                <Bar 
                    dataKey="revenue" 
                    fill="var(--color-chart-1)" 
                    radius={6} 
                >
                    <LabelList
                        dataKey="revenue"
                        position="top"
                        offset={12}
                        className="fill-foreground"
                        fontSize={12}
                         formatter={(value: number) => {
                          // Chỉ hiển thị nếu có giá trị
                          return value > 0 ? formatCurrency(value) : "";
                        }}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
