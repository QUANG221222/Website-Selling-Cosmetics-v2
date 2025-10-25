"use client";
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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
} from "lucide-react";
import dynamic from "next/dynamic";
import { dashboardApi } from "@/lib/api/dashboard";
import { useEffect, useState } from "react";

const PieRevenueChart = dynamic(
  () => import("@/components/layout/PieRevenueChart"),
  { ssr: false }
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const Dashboard = () => {
  const year = new Date().getFullYear();

  // Fetch total revenue from API
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    const year = new Date().getFullYear();
    dashboardApi
      .getRevenueByYear(year)
      .then((res) => {
        const revenue = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalRevenue(Number(revenue ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalRevenue(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch revenue by month from API
  const changeMonth = (month: number): string => {
    if (month < 1 || month > 12) return "";
    switch (month) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "";
    }
  };

  // const [revenueByMonth, setRevenueByMonth] = useState<number | null>(null);
  const [revenueData, setRevenueData] = useState<
    { month: string; revenue: number }[]
  >([]);

  useEffect(() => {
    let mounted = true;

    const fetchAllMonths = async () => {
      try {
        // Fetch revenue for each month
        const promises = Array.from({ length: 12 }, (_, i) =>
          dashboardApi.getRevenueByMonth(year, i + 1)
        );
        const results = await Promise.all(promises); // results is an array of revenues ([number, number, ...])

        if (!mounted) return;

        // Map results to desired format
        const data = results.map((res, idx) => {
          const revenue = (res as any)?.data ?? (res as any)?.result ?? res;
          return { month: changeMonth(idx + 1), revenue: Number(revenue ?? 0) };
        });

        setRevenueData(data);
      } catch {
        if (!mounted) return;
        setRevenueData([]);
      }
    };

    fetchAllMonths();

    return () => {
      mounted = false;
    };
  }, [year]);

  // Fetch total orders from API
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalOrders()
      .then((res) => {
        const orders = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalOrders(Number(orders ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalOrders(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch total orders by month from API
  const [totalOrdersData, setTotalOrdersData] = useState<
    { month: string; orders: number }[]
  >([]);
  useEffect(() => {
    let mounted = true;

    const fetchAllMonths = async () => {
      try {
        // Fetch total orders for each month
        const promises = Array.from({ length: 12 }, (_, i) =>
          dashboardApi.getTotalOrdersByMonth(year, i + 1)
        );
        const results = await Promise.all(promises); // results is an array of orders ([number, number, ...])

        if (!mounted) return;

        // Map results to desired format
        const data = results.map((res, idx) => {
          const orders = (res as any)?.data ?? (res as any)?.result ?? res;
          return { month: changeMonth(idx + 1), orders: Number(orders ?? 0) };
        });

        setTotalOrdersData(data);
      } catch {
        if (!mounted) return;
        setTotalOrdersData([]);
      }
    };

    fetchAllMonths();

    return () => {
      mounted = false;
    };
  }, [year]);

  // Fetch total users from API
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalUsers()
      .then((res) => {
        const users = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalUsers(Number(users ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalUsers(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch total products from API
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalProducts()
      .then((res) => {
        const products = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalProducts(Number(products ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalProducts(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch total successful orders from API
  const [totalOrdersSuccess, setTotalOrdersSuccess] = useState<number | null>(
    null
  );
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalOrdersSuccess()
      .then((res) => {
        const orders = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalOrdersSuccess(Number(orders ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalOrdersSuccess(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch total pending orders from API
  const [totalOrdersPending, setTotalOrdersPending] = useState<number | null>(
    null
  );
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalOrdersPending()
      .then((res) => {
        const orders = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalOrdersPending(Number(orders ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalOrdersPending(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch total processing orders from API
  const [totalOrdersProcessing, setTotalOrdersProcessing] = useState<
    number | null
  >(null);
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalOrdersProcessing()
      .then((res) => {
        const orders = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalOrdersProcessing(Number(orders ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalOrdersProcessing(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch total cancelled orders from API
  const [totalOrdersCancelled, setTotalOrdersCancelled] = useState<
    number | null
  >(null);
  useEffect(() => {
    let mounted = true;
    dashboardApi
      .getTotalOrdersCancelled()
      .then((res) => {
        const orders = (res as any)?.data ?? (res as any)?.result ?? res;
        if (mounted) setTotalOrdersCancelled(Number(orders ?? 0));
      })
      .catch(() => {
        if (mounted) setTotalOrdersCancelled(0);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const stats = [
    {
      title: "Tổng doanh thu",
      value:
        totalRevenue !== null ? formatCurrency(totalRevenue) : "Đang tải...",
      description: `${new Date().getMonth() + 1} tháng đầu năm`,
      icon: DollarSign,
    },
    {
      title: "Đơn hàng",
      value: totalOrders !== null ? totalOrders.toString() : "Đang tải...",
      description: `${totalOrdersSuccess} hoàn thành, ${totalOrdersPending} chờ xử lý, ${totalOrdersProcessing} đang xử lý, ${totalOrdersCancelled} đã hủy`,
      icon: ShoppingCart,
    },
    {
      title: "Khách hàng",
      value: totalUsers !== null ? totalUsers.toString() : "Đang tải...",
      description: "Tài khoản đang hoạt động",
      icon: Users,
    },
    {
      title: "Sản phẩm",
      value: totalProducts !== null ? totalProducts.toString() : "Đang tải...",
      description: "Trong kho",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
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
              className="h-[300px] min-h-[300px]"
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
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-chart-1)"
                    radius={6}
                  />
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
            Xu hướng đơn hàng trong {new Date().getMonth() + 1} tháng đầu năm{" "}
            {new Date().getFullYear()}
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
              <LineChart data={totalOrdersData}>
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
};
export default Dashboard;
