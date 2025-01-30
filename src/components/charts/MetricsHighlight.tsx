import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrder } from "@/types";
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface MetricsHighlightProps {
  serviceOrders: ServiceOrder[];
}

const MetricsHighlight = ({ serviceOrders }: MetricsHighlightProps) => {
  const totalOrders = serviceOrders.length;
  const completedOrders = serviceOrders.filter(order => order.status === "OSP").length;
  const pendingOrders = serviceOrders.filter(order => order.status === "ADE").length;
  const inProgressOrders = serviceOrders.filter(order => 
    ["AVT", "EXT", "A.M", "INST", "M.S", "E.E"].includes(order.status)
  ).length;

  const metrics = [
    {
      title: "Total de OS",
      value: totalOrders,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      description: "Ordens de serviço registradas"
    },
    {
      title: "OS Finalizadas",
      value: completedOrders,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      description: "Ordens de serviço concluídas"
    },
    {
      title: "OS Pendentes",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      description: "Aguardando disponibilidade"
    },
    {
      title: "OS em Andamento",
      value: inProgressOrders,
      icon: AlertTriangle,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      description: "Em processo de execução"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={metric.title} 
            className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold">
                      {metric.value}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {metric.description}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsHighlight;