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
  // Count occurrences of each status
  const statusCount = serviceOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Map status counts to chart data format
  const data = statusOptions
    .map((status) => ({
      name: status.label,
      value: statusCount[status.value] || 0,
      color: status.color,
    }))
    .filter((item) => item.value > 0); // Only show statuses that have orders

  const getStatusColor = (colorClass: string) => {
    // Remove 'text-' prefix if present
    const color = colorClass.replace("text-", "");
    
    // Map color classes to actual hex colors
    const colorMap: Record<string, string> = {
      "yellow-500": "#EAB308",
      "blue-500": "#3B82F6",
      "green-500": "#22C55E",
      "red-500": "#EF4444",
      "[#F97316]": "#F97316",
      "[#9b87f5]": "#9b87f5",
      "[#ea384c]": "#ea384c",
      "pink-500": "#EC4899",
      "[#33C3F0]": "#33C3F0",
      "[#22c55e]": "#22c55e",
      "[#f59e0b]": "#f59e0b",
      "blue-900": "#1E3A8A",
      "[#D946EF]": "#D946EF"
    };

    return colorMap[color] || "#666666"; // Fallback color
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

  const totalOrders = serviceOrders.length;

  return (
    <Card className="border-muted bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Distribuição por Status
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total de {totalOrders} {totalOrders === 1 ? 'ordem de serviço' : 'ordens de serviço'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={180}
                innerRadius={60}
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
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
                    const percentage = ((data.value / totalOrders) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-xl">
                        <p className="text-sm font-semibold text-primary">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantidade: <span className="font-medium text-foreground">{data.value}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Percentual: <span className="font-medium text-foreground">{percentage}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value, entry) => (
                  <span className="text-sm font-medium" style={{ color: entry.color }}>
                    {value}
                  </span>
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
