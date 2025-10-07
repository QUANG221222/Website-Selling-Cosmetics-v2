"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { revenueData, categoryStats, mockOrders, mockUsers, mockCosmetics } from "@/data/mockData";
import { TrendingUp, Users, ShoppingCart, Package, DollarSign } from "lucide-react";
import dynamic from 'next/dynamic';
const PieRevenueChart = dynamic(() => import('@/components/layout/PieReveueChart'), { ssr: false });

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const Dashboard = () => {
  // Calculate statistics
  const totalRevenue = revenueData.reduce((sum, month) => sum + month.revenue, 0);
  const totalOrders = mockOrders.length;
  const totalUsers = mockUsers.filter(user => user.role === 'customer').length;
  const totalProducts = mockCosmetics.length;
  const completedOrders = mockOrders.filter(order => order.status === 'completed').length;
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      description: "10 tháng đầu năm",
      icon: DollarSign,
      trend: "+12.5%"
    },
    {
      title: "Đơn hàng",
      value: totalOrders.toString(),
      description: `${completedOrders} hoàn thành, ${pendingOrders} chờ xử lý`,
      icon: ShoppingCart,
      trend: "+8.2%"
    },
    {
      title: "Khách hàng",
      value: totalUsers.toString(),
      description: "Tài khoản đang hoạt động",
      icon: Users,
      trend: "+15.3%"
    },
    {
      title: "Sản phẩm",
      value: totalProducts.toString(),
      description: "Trong kho",
      icon: Package,
      trend: "+4.1%"
    }
  ];

  return (

    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
                <span className="text-xs text-muted-foreground ml-1">so với tháng trước</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Doanh thu theo tháng</CardTitle>
            <CardDescription>
              Biểu đồ doanh thu 10 tháng đầu năm 2024
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
              className="h-[300px] min-h-[300px]"
            >               
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                  />
                  <Bar dataKey="revenue" fill="var(--color-chart-1)" radius={6} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Stats */}
      </div>

      {/* Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Số lượng đơn hàng theo tháng</CardTitle>
          <CardDescription>
            Xu hướng đơn hàng trong 10 tháng đầu năm 2024
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              orders: {
                label: "Đơn hàng",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [value, "Đơn hàng"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="var(--color-chart-2)" 
                  strokeWidth={3}
                  dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
export default Dashboard;