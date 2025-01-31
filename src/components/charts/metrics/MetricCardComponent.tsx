import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { MetricCard, ColorOption, IconOption } from "./types";
import { ServiceOrder } from "@/types";
import { statusOptions } from "@/components/ServiceOrderContent";

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

const iconComponents: Record<string, LucideIcon> = Object.entries(LucideIcons).reduce(
  (acc, [key, value]) => {
    if (typeof value === "function" && key !== "createLucideIcon") {
      acc[key] = value as LucideIcon;
    }
    return acc;
  },
  {} as Record<string, LucideIcon>
);

const renderIcon = (iconName: string) => {
  const IconComponent = iconComponents[iconName];
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
  availableIcons,
}) => {
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
                <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                  {availableIcons.map((iconOption, index) => (
                    <button
                      key={index}
                      className={`p-2 rounded-lg hover:bg-accent ${
                        metric.iconName === iconOption.name ? "bg-accent" : ""
                      }`}
                      onClick={() => onCustomize(metric.id, "iconName", iconOption.name)}
                      title={iconOption.label}
                    >
                      {renderIcon(iconOption.name)}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-full h-8"
                    />
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => setCustomBgColor(e.target.value)}
                      className="w-full h-8"
                    />
                    <button
                      className="px-2 py-1 rounded bg-primary text-primary-foreground"
                      onClick={() =>
                        onCustomize(metric.id, "color", {
                          value: `text-[${customColor}]`,
                          bg: `bg-[${customBgColor}]`,
                        })
                      }
                    >
                      Aplicar
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {availableColors.map((color, index) => (
                      <button
                        key={index}
                        className={`p-2 rounded-lg ${color.bg} hover:opacity-80 ${
                          metric.color === color.value ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() =>
                          onCustomize(metric.id, "color", {
                            value: color.value,
                            bg: color.bg,
                          })
                        }
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
                onBlur={(e) => onCustomize(metric.id, "title", e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  onCustomize(metric.id, "title", e.currentTarget.value)
                }
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
                    {statusOptions.map((status) => (
                      <label
                        key={status.value}
                        className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-accent cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={metric.selectedStatuses?.includes(status.value) ?? false}
                          onChange={(e) => {
                            const newSelectedStatuses = e.target.checked
                              ? [...(metric.selectedStatuses || []), status.value]
                              : (metric.selectedStatuses || []).filter(
                                  (s) => s !== status.value
                                );
                            onCustomize(
                              metric.id,
                              "selectedStatuses",
                              newSelectedStatuses.length > 0
                                ? newSelectedStatuses
                                : null
                            );
                          }}
                          className="form-checkbox h-4 w-4"
                        />
                        <span>
                          {status.label} ({calculateStatusValue([status.value])})
                        </span>
                      </label>
                    ))}
                    <button
                      className="w-full text-left px-2 py-1 rounded hover:bg-accent text-primary"
                      onClick={() =>
                        onCustomize(metric.id, "selectedStatuses", null)
                      }
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
                  onBlur={(e) =>
                    onCustomize(metric.id, "description", e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    onCustomize(metric.id, "description", e.currentTarget.value)
                  }
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