
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";
import { MetricCard, ColorOption, IconOption } from "./metrics/types";
import { MetricCardComponent } from "./metrics/MetricCardComponent";
import { availableColors } from "./metrics/constants";
import { ServiceOrder } from "@/types";
import { useAuth } from "@/components/AuthProvider";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface MetricsHighlightProps {
  serviceOrders: ServiceOrder[];
}

const availableIcons = Object.keys(LucideIcons)
  .filter((name) => name !== "createLucideIcon")
  .map((name) => ({
    name,
    label: name.replace(/([A-Z])/g, " $1").trim(),
  }));

const defaultMetrics: MetricCard[] = [
  {
    id: "total",
    title: "Total de OS",
    value: 0,
    iconName: "ClipboardList",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    description: "Ordens de serviço registradas",
    selectedStatuses: null,
  },
  {
    id: "completed",
    title: "OS Finalizadas",
    value: 0,
    iconName: "CheckCircle2",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    description: "Ordens de serviço concluídas",
    selectedStatuses: null,
  },
  {
    id: "pending",
    title: "OS Pendentes",
    value: 0,
    iconName: "Clock",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    description: "Aguardando disponibilidade",
    selectedStatuses: null,
  },
  {
    id: "inProgress",
    title: "OS em Andamento",
    value: 0,
    iconName: "AlertTriangle",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    description: "Em processo de execução",
    selectedStatuses: null,
  },
];

const MetricsHighlight = ({ serviceOrders }: MetricsHighlightProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<MetricCard[]>(defaultMetrics);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string>("#000000");
  const [customBgColor, setCustomBgColor] = useState<string>("#FFFFFF");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    setLoadError(null);
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('dashboard_layout')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading preferences:', error);
        setLoadError('Não foi possível carregar suas preferências');
        return;
      }

      // If no preferences exist, create default ones
      if (!data) {
        await createDefaultPreferences();
        setMetrics(defaultMetrics);
        return;
      }

      // If preferences exist, use them
      if (data?.dashboard_layout) {
        try {
          const savedMetrics = typeof data.dashboard_layout === 'string'
            ? JSON.parse(data.dashboard_layout)
            : data.dashboard_layout;

          const updatedMetrics = defaultMetrics.map(defaultMetric => {
            const savedMetric = savedMetrics.find((m: MetricCard) => m.id === defaultMetric.id);
            return savedMetric ? {
              ...defaultMetric,
              title: savedMetric.title,
              description: savedMetric.description,
              iconName: savedMetric.iconName,
              color: savedMetric.color,
              bgColor: savedMetric.bgColor,
              selectedStatuses: savedMetric.selectedStatuses,
            } : defaultMetric;
          });
          
          setMetrics(updatedMetrics);
        } catch (parseError) {
          console.error('Error parsing dashboard layout:', parseError);
          setLoadError('Erro ao processar preferências do dashboard');
          await createDefaultPreferences();
          setMetrics(defaultMetrics);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setLoadError('Erro ao carregar preferências');
    }
  };
  
  const createDefaultPreferences = async () => {
    if (!user) return;
    
    try {
      const { error: insertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          dashboard_layout: JSON.stringify(defaultMetrics),
        });

      if (insertError) {
        console.error('Error creating default preferences:', insertError);
        throw insertError;
      }
    } catch (error) {
      console.error('Error in createDefaultPreferences:', error);
      throw error;
    }
  };

  const calculateStatusValue = (selectedStatuses: string[] | null) => {
    if (!selectedStatuses) {
      return serviceOrders.length;
    }
    return serviceOrders.filter(order => selectedStatuses.includes(order.status)).length;
  };

  const handleCustomize = async (
    metricId: string,
    field: "title" | "description" | "iconName" | "color" | "selectedStatuses",
    value: any
  ) => {
    try {
      const updatedMetrics = metrics.map((metric) => {
        if (metric.id === metricId) {
          if (field === "color") {
            return { ...metric, color: value.value, bgColor: value.bg };
          }
          return { ...metric, [field]: value };
        }
        return metric;
      });
      
      setMetrics(updatedMetrics);
      setIsEditing(null);

      if (!user) {
        toast({
          title: "Erro ao salvar",
          description: "Você precisa estar logado para salvar personalização.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          dashboard_layout: JSON.stringify(updatedMetrics)
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações.",
      });
    }
  };

  if (loadError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription className="flex justify-between items-center">
          {loadError}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadUserPreferences}
            className="ml-4"
          >
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {metrics.map((metric) => (
        <MetricCardComponent
          key={metric.id}
          metric={metric}
          onCustomize={handleCustomize}
          calculateStatusValue={calculateStatusValue}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          customColor={customColor}
          setCustomColor={setCustomColor}
          customBgColor={customBgColor}
          setCustomBgColor={setCustomBgColor}
          availableColors={availableColors}
          availableIcons={availableIcons}
        />
      ))}
    </div>
  );
};

export default MetricsHighlight;
