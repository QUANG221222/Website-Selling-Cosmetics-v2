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
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
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

export default function OrdersChart() {
  const year = new Date().getFullYear();

  const { data: ordersData } = useSuspenseQuery({
    queryKey: ["ordersByMonth", year],
    queryFn: async () => {
      const promises = Array.from({ length: 12 }, (_, i) =>
        dashboardApi.getTotalOrdersByMonth(year, i + 1)
      );
      const results = await Promise.all(promises);

      return results.map((res, idx) => {
        const orders = (res as any)?.data ?? (res as any)?.result ?? res;
        return { month: changeMonth(idx + 1), orders: Number(orders ?? 0) };
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="pt-2">Số lượng đơn hàng theo tháng</CardTitle>
        <CardDescription>
          Xu hướng đơn hàng trong {new Date().getMonth() + 1} tháng đầu năm{" "}
          {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            orders: {
              label: " Đơn hàng",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] w-[80%] pb-10 "
        >
                <LineChart data={ordersData}>
                <CartesianGrid  vertical={false} />                
                  <XAxis 
                    dataKey="month"  
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // tickFormatter={(value) => value.slice(0, 3)} 
                />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [value, " Đơn hàng"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="var(--color-chart-2)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
