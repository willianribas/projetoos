import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import { ServiceOrder } from "@/types";

interface StatusDistributionChartProps {
  serviceOrders: ServiceOrder[];
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
}

const StatusDistributionChart = ({
  serviceOrders,
  statusOptions,
}: StatusDistributionChartProps) => {
  const statusCount = serviceOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = statusOptions
    .map((status) => ({
      name: status.label,
      value: statusCount[status.value] || 0,
      color: status.color.replace("text-", ""),
    }))
    .filter(item => item.value > 0);

  const getStatusColor = (color: string) => {
    switch (color) {
      case "blue-900":
        return "#1e3a8a";
      case "[#F97316]":
        return "#F97316";
      case "[#9b87f5]":
        return "#9b87f5";
      case "[#ea384c]":
        return "#ea384c";
      case "pink-500":
        return "#ec4899";
      case "[#33C3F0]":
        return "#33C3F0";
      case "[#22c55e]":
        return "#22c55e";
      case "[#f59e0b]":
        return "#f59e0b";
      default:
        return "#666666";
    }
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.color)}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">
                          {data.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: {data.value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span className="text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;