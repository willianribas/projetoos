import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceOrder } from "@/types";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, BarChart2 } from "lucide-react";

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
    hours: calculateAverageTimeInStatus(status),
    days: Math.round(calculateAverageTimeInStatus(status) / 24 * 10) / 10
  }));

  const maxHours = Math.max(...averageTimes.map(t => t.hours));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ADE":
        return "#3b82f6";
      case "A.M":
        return "#10b981";
      case "M.S":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5 text-primary animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Análise de Tempo por Status
          </span>
        </CardTitle>
        <BarChart2 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px] animate-scale-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageTimes} className="animate-fade-in">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="status" 
                stroke="currentColor" 
                className="text-muted-foreground text-xs"
              />
              <YAxis 
                label={{ 
                  value: 'Tempo Médio (Dias)', 
                  angle: -90, 
                  position: 'insideLeft',
                  className: "text-muted-foreground text-xs"
                }} 
                stroke="currentColor"
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${Math.round(value / 24 * 10) / 10} dias (${Math.round(value)} horas)`,
                  "Tempo Médio"
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              <Bar 
                dataKey="hours" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
                className="animate-fade-in"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 animate-fade-in">
          {averageTimes.map(({ status, hours, days }) => (
            <div key={status} className="space-y-2 hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: getStatusColor(status) }}
                  />
                  {status}
                </span>
                <span className="text-muted-foreground">
                  {days} dias ({hours} horas)
                </span>
              </div>
              <Progress 
                value={(hours / maxHours) * 100} 
                className="h-2 animate-scale-in"
                style={{ 
                  backgroundColor: `${getStatusColor(status)}20`,
                  '--progress-background': getStatusColor(status)
                } as React.CSSProperties}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusTimeAnalysis;