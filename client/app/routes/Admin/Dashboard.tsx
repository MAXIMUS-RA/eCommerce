import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  created_at: string;
  status: string;
  user_email?: string;
}

const chartConfig = {
  orders: {
    label: "Замовлення",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Дохід (₴)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/admin/orders");
        const ordersData = response.data.orders || [];
        setOrders(ordersData);

        const processedData = processOrdersForChart(ordersData);
        setChartData(processedData);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const processOrdersForChart = (orders: Order[]) => {
    const monthlyData: { [key: string]: { orders: number; revenue: number } } =
      {};

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "long",
      });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { orders: 0, revenue: 0 };
      }

      monthlyData[monthKey].orders += 1;
      monthlyData[monthKey].revenue += parseFloat(
        order.total_amount.toString()
      );
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split("-");
        const monthName = new Date(
          parseInt(year),
          parseInt(month) - 1
        ).toLocaleDateString("uk-UA", {
          month: "long",
          year: "numeric",
        });

        return {
          month: monthName,
          orders: data.orders,
          revenue: Math.round(data.revenue),
        };
      })
      .slice(-6);
  };

  const getTotalOrders = () => orders.length;
  const getTotalRevenue = () =>
    orders.reduce(
      (sum, order) => sum + parseFloat(order.total_amount.toString()),
      0
    );
  const getCurrentMonthGrowth = () => {
    if (chartData.length < 2) return 0;
    const current = chartData[chartData.length - 1]?.orders || 0;
    const previous = chartData[chartData.length - 2]?.orders || 0;
    return previous > 0
      ? Math.round(((current - previous) / previous) * 100)
      : 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження даних...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Панель управління
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Всього замовлень
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTotalOrders()}
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Загальний дохід
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              $ {getTotalRevenue().toLocaleString("uk-UA")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Зростання за місяць
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                getCurrentMonthGrowth() >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {getCurrentMonthGrowth() >= 0 ? "+" : ""}
              {getCurrentMonthGrowth()}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Статистика замовлень</CardTitle>
          <CardDescription>
            Показує кількість замовлень за останні 6 місяців
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)} 
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="var(--color-orders)"
                fillOpacity={0.4}
                stroke="var(--color-orders)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {getCurrentMonthGrowth() >= 0 ? "Зростання" : "Зниження"} на{" "}
                {Math.abs(getCurrentMonthGrowth())}% цього місяця
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                За останні 6 місяців
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Дохід за місяцями</CardTitle>
          <CardDescription>
            Показує сумарний дохід за останні 6 місяців
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value, name) => [
                      `₴${value.toLocaleString("uk-UA")}`,
                      "Дохід",
                    ]}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="var(--color-revenue)"
                fillOpacity={0.4}
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
