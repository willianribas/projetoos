import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ServiceOrder } from "@/types";
import { differenceInHours, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimeAnalysisChartsProps {
  serviceOrders: ServiceOrder[];
}

const TimeAnalysisCharts = ({ serviceOrders }: TimeAnalysisChartsProps) => {
  // Calculate time spent in each status
  const calculateTimeInStatus = () => {
    const statusTimes: { [key: string]: number } = {
      "M.S": 0,
      ADE: 0,
      "A.M": 0,
    };

    serviceOrders.forEach((order) => {
      if (["M.S", "ADE", "A.M"].includes(order.status)) {
        const hours = differenceInHours(
          new Date(),
          parseISO(order.created_at)
        );
        statusTimes[order.status] += hours;
      }
    });

    return Object.entries(statusTimes).map(([status, hours]) => ({
      status,
      hours,
      days: Math.floor(hours / 24),
    }));
  };

  const timeData = calculateTimeInStatus();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Tempo Total em Cada Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="status"
                  stroke="currentColor"
                  className="text-xs"
                />
                <YAxis
                  stroke="currentColor"
                  className="text-xs"
                  label={{ 
                    value: 'Horas', 
                    angle: -90, 
                    position: 'insideLeft',
                    className: "text-xs fill-current" 
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <p className="text-sm font-medium">{data.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {data.hours} horas ({data.days} dias)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="hours"
                  name="Horas"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeData.map((item) => (
              <div key={item.status} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.status}</span>
                  <span className="text-muted-foreground">
                    {item.hours} horas ({item.days} dias)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(item.hours / Math.max(...timeData.map(d => d.hours))) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeAnalysisCharts;