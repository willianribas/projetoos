import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrder } from "@/types";
import { ClipboardList, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MetricsHighlightProps {
  serviceOrders: ServiceOrder[];
}

interface MetricCard {
  id: string;
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
}

const MetricsHighlight = ({ serviceOrders }: MetricsHighlightProps) => {
  const { toast } = useToast();
  const totalOrders = serviceOrders.length;
  const completedOrders = serviceOrders.filter(order => order.status === "OSP").length;
  const pendingOrders = serviceOrders.filter(order => order.status === "ADE").length;
  const inProgressOrders = serviceOrders.filter(order => 
    ["AVT", "EXT", "A.M", "INST", "M.S", "E.E"].includes(order.status)
  ).length;

  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      id: "total",
      title: "Total de OS",
      value: totalOrders,
      icon: ClipboardList,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      description: "Ordens de serviço registradas"
    },
    {
      id: "completed",
      title: "OS Finalizadas",
      value: completedOrders,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      description: "Ordens de serviço concluídas"
    },
    {
      id: "pending",
      title: "OS Pendentes",
      value: pendingOrders,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      description: "Aguardando disponibilidade"
    },
    {
      id: "inProgress",
      title: "OS em Andamento",
      value: inProgressOrders,
      icon: AlertTriangle,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      description: "Em processo de execução"
    },
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleCustomize = async (metricId: string, field: 'title' | 'description', value: string) => {
    try {
      const updatedMetrics = metrics.map(metric => {
        if (metric.id === metricId) {
          return { ...metric, [field]: value };
        }
        return metric;
      });
      setMetrics(updatedMetrics);
      setIsEditing(null);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Use upsert instead of insert
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            dashboard_layout: JSON.stringify(updatedMetrics)
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;

        toast({
          title: "Personalização salva",
          description: "Suas alterações foram salvas com sucesso!",
        });
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={metric.id} 
            className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all group"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-105 transition-transform`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="space-y-1 flex-1">
                  {isEditing === `${metric.id}-title` ? (
                    <input
                      className="text-sm font-medium bg-transparent border-b border-primary/20 focus:border-primary outline-none w-full"
                      defaultValue={metric.title}
                      onBlur={(e) => handleCustomize(metric.id, 'title', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCustomize(metric.id, 'title', e.currentTarget.value)}
                      autoFocus
                    />
                  ) : (
                    <p 
                      className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setIsEditing(`${metric.id}-title`)}
                    >
                      {metric.title}
                    </p>
                  )}
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold">
                      {metric.value}
                    </p>
                    {isEditing === `${metric.id}-description` ? (
                      <input
                        className="text-xs bg-transparent border-b border-primary/20 focus:border-primary outline-none flex-1"
                        defaultValue={metric.description}
                        onBlur={(e) => handleCustomize(metric.id, 'description', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomize(metric.id, 'description', e.currentTarget.value)}
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setIsEditing(`${metric.id}-description`)}
                      >
                        {metric.description}
                      </span>
                    )}
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