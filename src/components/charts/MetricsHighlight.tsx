import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrder } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricsHighlightProps {
  serviceOrders: ServiceOrder[];
}

interface MetricCard {
  id: string;
  title: string;
  value: number;
  iconName: string;
  color: string;
  bgColor: string;
  description: string;
}

const statusOptions = [
  { value: "ADE", label: "ADE - Aguardando Disponibilidade" },
  { value: "AVT", label: "AVT - Aguardando vinda técnica" },
  { value: "EXT", label: "EXT - Serviço Externo" },
  { value: "A.M", label: "A.M - Aquisição de Material" },
  { value: "INST", label: "INST - Instalação" },
  { value: "M.S", label: "M.S - Material Solicitado" },
  { value: "OSP", label: "OSP - Ordem de Serviço Pronta" },
  { value: "E.E", label: "E.E - Em Execução" }
];

const availableIcons: Array<{ name: string; label: string }> = [
  { name: "ClipboardList", label: "Lista" },
  { name: "CheckCircle2", label: "Concluído" },
  { name: "Clock", label: "Relógio" },
  { name: "AlertTriangle", label: "Alerta" },
  { name: "Building2", label: "Prédio" },
  { name: "Package", label: "Pacote" },
  { name: "Wrench", label: "Ferramenta" },
  { name: "CalendarClock", label: "Calendário" },
  { name: "ShoppingCart", label: "Carrinho" },
  { name: "Hammer", label: "Martelo" },
  { name: "ArrowBigDown", label: "Seta Grande Baixo" },
  { name: "ArrowBigUp", label: "Seta Grande Cima" },
  { name: "ArrowDownLeft", label: "Seta Diagonal Esquerda" },
  { name: "ArrowDownRight", label: "Seta Diagonal Direita" },
  { name: "ArrowUpLeft", label: "Seta Diagonal Cima Esquerda" },
  { name: "ArrowUpRight", label: "Seta Diagonal Cima Direita" },
  { name: "CircleCheck", label: "Círculo Check" },
  { name: "CircleX", label: "Círculo X" },
  { name: "Check", label: "Check" },
  { name: "X", label: "X" },
  { name: "Plus", label: "Mais" },
  { name: "Minus", label: "Menos" }
];

const availableColors = [
  { name: "Azul", value: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50" },
  { name: "Verde", value: "text-green-500", bg: "bg-green-50 dark:bg-green-950/50" },
  { name: "Laranja", value: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/50" },
  { name: "Roxo", value: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/50" },
  { name: "Rosa", value: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-950/50" },
  { name: "Ciano", value: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/50" },
  { name: "Vermelho RGB", value: "text-[#FF0000]", bg: "bg-[#FFE5E5] dark:bg-[#4D0000]/50" },
  { name: "Verde RGB", value: "text-[#00FF00]", bg: "bg-[#E5FFE5] dark:bg-[#004D00]/50" },
  { name: "Azul RGB", value: "text-[#0000FF]", bg: "bg-[#E5E5FF] dark:bg-[#00004D]/50" },
  { name: "Amarelo RGB", value: "text-[#FFFF00]", bg: "bg-[#FFFFF0] dark:bg-[#4D4D00]/50" },
  { name: "Magenta RGB", value: "text-[#FF00FF]", bg: "bg-[#FFE5FF] dark:bg-[#4D004D]/50" },
  { name: "Ciano RGB", value: "text-[#00FFFF]", bg: "bg-[#E5FFFF] dark:bg-[#004D4D]/50" },
  { name: "Coral RGB", value: "text-[#FF7F50]", bg: "bg-[#FFE5DC] dark:bg-[#4D2517]/50" },
  { name: "Violeta RGB", value: "text-[#8A2BE2]", bg: "bg-[#EDE5FF] dark:bg-[#290D44]/50" },
  { name: "Lima RGB", value: "text-[#32CD32]", bg: "bg-[#E8FFE8] dark:bg-[#0F3D0F]/50" }
];

const MetricsHighlight = ({ serviceOrders }: MetricsHighlightProps) => {
  const { toast } = useToast();
  const totalOrders = serviceOrders.length;
  const completedOrders = serviceOrders.filter(order => order.status === "OSP").length;
  const pendingOrders = serviceOrders.filter(order => order.status === "ADE").length;
  const inProgressOrders = serviceOrders.filter(order => 
    ["AVT", "EXT", "A.M", "INST", "M.S", "E.E"].includes(order.status)
  ).length;

  const defaultMetrics: MetricCard[] = [
    {
      id: "total",
      title: "Total de OS",
      value: totalOrders,
      iconName: "ClipboardList",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      description: "Ordens de serviço registradas"
    },
    {
      id: "completed",
      title: "OS Finalizadas",
      value: completedOrders,
      iconName: "CheckCircle2",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      description: "Ordens de serviço concluídas"
    },
    {
      id: "pending",
      title: "OS Pendentes",
      value: pendingOrders,
      iconName: "Clock",
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/50",
      description: "Aguardando disponibilidade"
    },
    {
      id: "inProgress",
      title: "OS em Andamento",
      value: inProgressOrders,
      iconName: "AlertTriangle",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      description: "Em processo de execução"
    },
  ];

  const [metrics, setMetrics] = useState<MetricCard[]>(defaultMetrics);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('dashboard_layout')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading preferences:', error);
          return;
        }

        if (data?.dashboard_layout) {
          const savedMetrics = typeof data.dashboard_layout === 'string' 
            ? JSON.parse(data.dashboard_layout)
            : data.dashboard_layout;

          const updatedMetrics = defaultMetrics.map(defaultMetric => {
            const savedMetric = savedMetrics.find((m: MetricCard) => m.id === defaultMetric.id);
            return savedMetric ? { ...defaultMetric, title: savedMetric.title, description: savedMetric.description, iconName: savedMetric.iconName, color: savedMetric.color, bgColor: savedMetric.bgColor } : defaultMetric;
          });
          setMetrics(updatedMetrics);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleCustomize = async (metricId: string, field: 'title' | 'description' | 'iconName' | 'color', value: any) => {
    try {
      const updatedMetrics = metrics.map(metric => {
        if (metric.id === metricId) {
          if (field === 'color') {
            return { ...metric, color: value.value, bgColor: value.bg };
          }
          return { ...metric, [field]: value };
        }
        return metric;
      });
      setMetrics(updatedMetrics);
      setIsEditing(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            dashboard_layout: updatedMetrics
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

  const calculateStatusValue = (status: string) => {
    return serviceOrders.filter(order => order.status === status).length;
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as Record<string, LucideIcon>)[iconName];
    return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {metrics.map((metric) => (
        <Card 
          key={metric.id} 
          className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all group"
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger>
                  <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-105 transition-transform cursor-pointer`}>
                    <div className={metric.color}>
                      {renderIcon(metric.iconName)}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2">
                      {availableIcons.map((iconOption, index) => (
                        <button
                          key={index}
                          className={`p-2 rounded-lg hover:bg-accent ${metric.iconName === iconOption.name ? 'bg-accent' : ''}`}
                          onClick={() => handleCustomize(metric.id, 'iconName', iconOption.name)}
                          title={iconOption.label}
                        >
                          {renderIcon(iconOption.name)}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {availableColors.map((color, index) => (
                        <button
                          key={index}
                          className={`p-2 rounded-lg ${color.bg} hover:opacity-80 ${metric.color === color.value ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => handleCustomize(metric.id, 'color', { value: color.value, bg: color.bg })}
                        >
                          <div className={`h-5 w-5 rounded-full ${color.value}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-2xl font-bold hover:text-primary transition-colors flex items-center gap-1">
                        {selectedStatus && metric.id === "total" ? calculateStatusValue(selectedStatus) : metric.value}
                        {renderIcon("ChevronDown")}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-2">
                        {statusOptions.map((status) => (
                          <button
                            key={status.value}
                            className="w-full text-left px-2 py-1 rounded hover:bg-accent"
                            onClick={() => setSelectedStatus(status.value)}
                          >
                            {status.label} ({calculateStatusValue(status.value)})
                          </button>
                        ))}
                        <button
                          className="w-full text-left px-2 py-1 rounded hover:bg-accent text-primary"
                          onClick={() => setSelectedStatus(null)}
                        >
                          Mostrar total geral
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
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
      ))}
    </div>
  );
};

export default MetricsHighlight;