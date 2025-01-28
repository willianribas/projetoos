import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { statusOptions } from "@/components/ServiceOrderContent";

interface StatusSelectorProps {
  selectedStatuses: string[];
  onStatusToggle: (status: string) => void;
}

const StatusSelector = ({ selectedStatuses, onStatusToggle }: StatusSelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((status) => {
        const Icon = status.icon;
        const isSelected = selectedStatuses.includes(status.value);
        
        return (
          <Badge
            key={status.value}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer flex items-center gap-1 font-medium",
              isSelected && "bg-primary text-primary-foreground"
            )}
            onClick={() => onStatusToggle(status.value)}
          >
            {isSelected && <Check className="h-3 w-3" />}
            <Icon className="h-3 w-3" />
            {status.value}
          </Badge>
        );
      })}
    </div>
  );
};

export default StatusSelector;