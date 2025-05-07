
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as LucideIcons from "lucide-react";
import { MetricCard, ColorOption, IconOption } from "./types";
import { statusOptions } from "@/components/ServiceOrderContent";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MetricCardComponentProps {
  metric: MetricCard;
  onCustomize: (
    metricId: string,
    field: "title" | "description" | "iconName" | "color" | "selectedStatuses",
    value: any
  ) => void;
  calculateStatusValue: (statuses: string[] | null) => number;
  isEditing: string | null;
  setIsEditing: (value: string | null) => void;
  customColor: string;
  setCustomColor: (value: string) => void;
  customBgColor: string;
  setCustomBgColor: (value: string) => void;
  availableColors: ColorOption[];
  availableIcons: IconOption[];
}

// Predefined set of relevant icons
const relevantIcons = {
  ClipboardList: LucideIcons.ClipboardList,
  CheckCircle2: LucideIcons.CheckCircle2,
  Clock: LucideIcons.Clock,
  AlertTriangle: LucideIcons.AlertTriangle,
  FileText: LucideIcons.FileText,
  Settings: LucideIcons.Settings,
  BarChart: LucideIcons.BarChart,
  PieChart: LucideIcons.PieChart,
  LineChart: LucideIcons.LineChart,
  Database: LucideIcons.Database,
  Users: LucideIcons.Users,
  Bell: LucideIcons.Bell,
  Search: LucideIcons.Search,
  Filter: LucideIcons.Filter,
  Calendar: LucideIcons.Calendar,
  ChevronDown: LucideIcons.ChevronDown,
} as const;

const renderIcon = (iconName: string) => {
  const IconComponent = relevantIcons[iconName as keyof typeof relevantIcons];
  return IconComponent ? <IconComponent className="h-6 w-6" /> : null;
};

export const MetricCardComponent: React.FC<MetricCardComponentProps> = ({
  metric,
  onCustomize,
  calculateStatusValue,
  isEditing,
  setIsEditing,
  customColor,
  setCustomColor,
  customBgColor,
  setCustomBgColor,
  availableColors,
}) => {
  const { toast } = useToast();
  
  const handleApplyCustomColors = () => {
    onCustomize(metric.id, "color", {
      value: `text-[${customColor}]`,
      bg: `bg-[${customBgColor}]`,
    });
    
    toast({
      title: "Cores personalizadas aplicadas",
      description: "As cores foram aplicadas com sucesso ao card.",
    });
  };

  const handleIconSelection = (iconName: string) => {
    onCustomize(metric.id, "iconName", iconName);
    toast({
      title: "Ícone atualizado",
      description: `O ícone foi alterado para ${iconName}.`,
    });
  };

  const handleColorSelection = (color: ColorOption) => {
    onCustomize(metric.id, "color", {
      value: color.value,
      bg: color.bg,
    });
    
    toast({
      title: "Cor atualizada",
      description: "A cor do card foi atualizada com sucesso.",
    });
  };

  const handleStatusSelection = (statusValue: string, isChecked: boolean) => {
    const newSelectedStatuses = isChecked
      ? [...(metric.selectedStatuses || []), statusValue]
      : (metric.selectedStatuses || []).filter((s) => s !== statusValue);
    
    onCustomize(
      metric.id,
      "selectedStatuses",
      newSelectedStatuses.length > 0 ? newSelectedStatuses : null
    );
  };

  return (
    <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all group">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger>
              <div
                className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className={metric.color}>{renderIcon(metric.iconName)}</div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-2">Cores Personalizadas</p>
                  <div className="flex items-center gap-2">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="iconColor" className="text-xs">Cor do Ícone</Label>
                      <input
                        id="iconColor"
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-full h-8 rounded"
                      />
                    </div>
                    <div className="space-y-1 flex-1">
                      <Label htmlFor="bgColor" className="text-xs">Fundo</Label>
                      <input
                        id="bgColor"
                        type="color"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="w-full h-8 rounded"
                      />
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleApplyCustomColors}
                    className="w-full mt-2"
                  >
                    Aplicar Cores
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ícones</p>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(relevantIcons).map((iconName) => (
                      <button
                        key={iconName}
                        className={`p-2 rounded-lg hover:bg-accent ${
                          metric.iconName === iconName ? "bg-accent ring-2 ring-primary" : ""
                        }`}
                        onClick={() => handleIconSelection(iconName)}
                        title={iconName}
                      >
                        {renderIcon(iconName)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Cores Predefinidas</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableColors.map((color, index) => (
                      <button
                        key={index}
                        className={`p-2 rounded-lg ${color.bg} hover:opacity-80 ${
                          metric.color === color.value ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => handleColorSelection(color)}
                      >
                        <div className={`h-5 w-5 rounded-full ${color.value}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div className="space-y-1 flex-1">
            {isEditing === `${metric.id}-title` ? (
              <input
                className="text-sm font-medium bg-transparent border-b border-primary/20 focus:border-primary outline-none w-full"
                defaultValue={metric.title}
                onBlur={(e) => {
                  onCustomize(metric.id, "title", e.target.value);
                  toast({
                    title: "Título atualizado",
                    description: "O título foi atualizado com sucesso.",
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    onCustomize(metric.id, "title", e.currentTarget.value);
                    setIsEditing(null);
                    toast({
                      title: "Título atualizado",
                      description: "O título foi atualizado com sucesso.",
                    });
                  }
                }}
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
                    {calculateStatusValue(metric.selectedStatuses)}
                    {renderIcon("ChevronDown")}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <p className="text-sm font-medium pb-2 border-b">Filtrar por Status</p>
                    {statusOptions.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-accent">
                        <Checkbox 
                          id={`status-${metric.id}-${status.value}`}
                          checked={metric.selectedStatuses?.includes(status.value) ?? false}
                          onCheckedChange={(checked) => 
                            handleStatusSelection(status.value, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`status-${metric.id}-${status.value}`}
                          className="flex-1 cursor-pointer text-sm"
                        >
                          {status.label} ({calculateStatusValue([status.value])})
                        </Label>
                      </div>
                    ))}
                    <Button
                      variant="outline" 
                      className="w-full text-center mt-2"
                      onClick={() => {
                        onCustomize(metric.id, "selectedStatuses", null);
                        toast({
                          title: "Filtro removido",
                          description: "Mostrando total geral de ordens de serviço.",
                        });
                      }}
                    >
                      Mostrar total geral
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              {isEditing === `${metric.id}-description` ? (
                <input
                  className="text-xs bg-transparent border-b border-primary/20 focus:border-primary outline-none flex-1"
                  defaultValue={metric.description}
                  onBlur={(e) => {
                    onCustomize(metric.id, "description", e.target.value);
                    toast({
                      title: "Descrição atualizada",
                      description: "A descrição foi atualizada com sucesso.",
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onCustomize(metric.id, "description", e.currentTarget.value);
                      setIsEditing(null);
                      toast({
                        title: "Descrição atualizada",
                        description: "A descrição foi atualizada com sucesso.",
                      });
                    }
                  }}
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
};
