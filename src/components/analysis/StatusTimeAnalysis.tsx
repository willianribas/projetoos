import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceOrder } from "@/types";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusTimeAnalysisProps {
  serviceOrders: ServiceOrder[];
}

const StatusTimeAnalysis = ({ serviceOrders }: StatusTimeAnalysisProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const getMaxHoursForStatus = (status: string) => {
    switch (status) {
      case "ADE":
        return 13 * 24; // 13 days in hours
      case "A.M":
        return 500 * 24; // 500 days in hours
      case "M.S":
        return 5 * 24; // 5 days in hours
      default:
        return 24;
    }
  };

  const calculateAverageTimeInStatus = (status: string) => {
    const ordersInStatus = serviceOrders.filter(order => order.status === status);
    if (ordersInStatus.length === 0) return 0;

    const maxHours = getMaxHoursForStatus(status);

    const totalHours = ordersInStatus.reduce((acc, order) => {
      const hours = (new Date().getTime() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);
      return acc + Math.min(hours, maxHours);
    }, 0);

    return Math.min(totalHours / ordersInStatus.length, maxHours);
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
        return "#3b82f6"; // blue
      case "A.M":
        return "#ea384c"; // red
      case "M.S":
        return "#33C3F0"; // cyan
      default:
        return "#6b7280";
    }
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const filteredData = selectedStatus 
    ? averageTimes.filter(item => item.status === selectedStatus)
    : averageTimes;

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5 text-primary animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Análise de Tempo por Status
          </span>
        </CardTitle>
        <div className="flex gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusClick(status)}
              className="transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: selectedStatus === status ? getStatusColor(status) : 'transparent',
                borderColor: getStatusColor(status),
                color: selectedStatus === status ? 'white' : getStatusColor(status)
              }}
            >
              {status}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px] animate-scale-in">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} className="animate-fade-in">
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
                formatter={(value: number) => [
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
              {filteredData.map((item) => (
                <Bar
                  key={item.status}
                  dataKey="hours"
                  fill={getStatusColor(item.status)}
                  radius={[4, 4, 0, 0]}
                  className="animate-fade-in"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4 animate-fade-in">
          {averageTimes.map(({ status, hours, days }) => (
            <div 
              key={status} 
              className={`space-y-2 p-3 rounded-lg transition-all duration-300 cursor-pointer hover:bg-muted/50 ${
                selectedStatus === status ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{ 
                borderColor: getStatusColor(status),
                backgroundColor: selectedStatus === status ? `${getStatusColor(status)}10` : undefined
              }}
              onClick={() => handleStatusClick(status)}
            >
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: getStatusColor(status) }}
                  />
                  {status}
                </span>
                <span className="text-muted-foreground">
                  {days} dias ({Math.round(hours)} horas)
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