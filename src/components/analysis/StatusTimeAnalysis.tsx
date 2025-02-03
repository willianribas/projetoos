import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceOrder } from "@/types";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StatusTimeAnalysisProps {
  serviceOrders: ServiceOrder[];
}

const StatusTimeAnalysis = ({ serviceOrders }: StatusTimeAnalysisProps) => {
  const calculateAverageTimeInStatus = (status: string) => {
    const ordersInStatus = serviceOrders.filter(order => order.status === status);
    if (ordersInStatus.length === 0) return 0;

    const totalHours = ordersInStatus.reduce((acc, order) => {
      const hours = (new Date().getTime() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);
      return acc + hours;
    }, 0);

    return Math.round(totalHours / ordersInStatus.length);
  };

  const statuses = ["ADE", "A.M", "M.S"];
  const averageTimes = statuses.map(status => ({
    status,
    hours: calculateAverageTimeInStatus(status)
  }));

  const maxHours = Math.max(...averageTimes.map(t => t.hours));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Tempo por Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [
                  `${Math.round(value)} horas (${Math.round(value / 24)} dias)`,
                  "Tempo Médio"
                ]}
              />
              <Bar dataKey="hours" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {averageTimes.map(({ status, hours }) => (
            <div key={status} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{status}</span>
                <span>{Math.round(hours)} horas ({Math.round(hours / 24)} dias)</span>
              </div>
              <Progress value={(hours / maxHours) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusTimeAnalysis;