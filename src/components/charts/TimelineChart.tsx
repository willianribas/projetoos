import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ServiceOrder } from "@/types";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineChartProps {
  serviceOrders: ServiceOrder[];
}

const TimelineChart = ({ serviceOrders }: TimelineChartProps) => {
  // Agrupa as OS por data
  const timelineData = serviceOrders.reduce((acc, order) => {
    if (!order.created_at) return acc;

    const date = format(parseISO(order.created_at), 'dd/MM/yyyy', { locale: ptBR });
    
    if (!acc[date]) {
      acc[date] = {
        date,
        criadas: 0,
        finalizadas: 0,
      };
    }

    acc[date].criadas += 1;
    
    if (order.status === 'OSP') {
      acc[date].finalizadas += 1;
    }

    return acc;
  }, {} as Record<string, { date: string; criadas: number; finalizadas: number }>);

  // Converte o objeto em array e ordena por data
  const data = Object.values(timelineData).sort((a, b) => {
    const dateA = parseISO(format(parseISO(a.date.split('/').reverse().join('-')), 'yyyy-MM-dd'));
    const dateB = parseISO(format(parseISO(b.date.split('/').reverse().join('-')), 'yyyy-MM-dd'));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Timeline de OS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis 
                dataKey="date" 
                stroke="currentColor"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                stroke="currentColor"
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <p className="text-sm font-medium mb-1">{label}</p>
                        <p className="text-sm text-blue-500">
                          Criadas: {payload[0].value}
                        </p>
                        <p className="text-sm text-green-500">
                          Finalizadas: {payload[1].value}
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
              <Line
                type="monotone"
                dataKey="criadas"
                name="OS Criadas"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="finalizadas"
                name="OS Finalizadas"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineChart;