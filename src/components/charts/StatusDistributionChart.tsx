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

  const data = statusOptions.map((status) => ({
    name: status.label,
    value: statusCount[status.value] || 0,
    color: status.color.replace("text-", ""),
  }));

  const getStatusColor = (color: string) => {
    const colorMap: Record<string, string> = {
      "blue-900": "#1e3a8a",
      "[#F97316]": "#F97316",
      "[#9b87f5]": "#9b87f5",
      "[#ea384c]": "#ea384c",
      "pink-500": "#ec4899",
      "[#33C3F0]": "#33C3F0",
      "[#22c55e]": "#22c55e",
      "[#F97316]": "#F97316",
    };
    return colorMap[color] || "#666666";
  };

  return (
    <Card className="mt-8 border-muted bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Distribuição de OS por Status</CardTitle>
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
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  value,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = 25 + innerRadius + (outerRadius - innerRadius);
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      className="fill-foreground text-sm"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                    >
                      {value > 0 ? `${value}` : ""}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getStatusColor(entry.color)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium">
                          {payload[0].name}: {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;