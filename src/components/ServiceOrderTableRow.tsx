
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ServiceOrderTableRowProps {
  order: ServiceOrder;
  index: number;
  getStatusColor: (status: string) => string;
  onRowClick: (order: ServiceOrder, index: number) => void;
  onDelete: (e: React.MouseEvent, order: ServiceOrder) => void;
}

const ServiceOrderTableRow = ({
  order,
  index,
  getStatusColor,
  onRowClick,
  onDelete,
}: ServiceOrderTableRowProps) => {
  // Get primary status color
  const primaryStatusColor = getStatusColor(order.status);
  
  return (
    <TableRow
      key={index}
      className="cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in"
      onClick={() => onRowClick(order, index)}
    >
      <TableCell className="text-center font-medium">{order.numeroos}</TableCell>
      <TableCell className="text-center">{order.patrimonio}</TableCell>
      <TableCell className="text-center">{order.equipamento}</TableCell>
      <TableCell className="text-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="max-w-[200px] truncate">
                {order.observacao || "-"}
              </div>
            </TooltipTrigger>
            {order.observacao && (
              <TooltipContent>
                <p className="max-w-[300px] text-sm">{order.observacao}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex flex-col gap-1 items-center">
          {/* Primary Status Badge */}
          <Badge
            variant="outline"
            className={`${primaryStatusColor} transition-colors duration-200`}
          >
            {order.status}
          </Badge>
          
          {/* Additional Statuses */}
          {order.status_array && order.status_array.length > 1 && (
            <div className="flex flex-wrap gap-1 justify-center mt-1">
              {order.status_array
                .filter(status => status !== order.status)
                .map((status, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className={`${getStatusColor(status)} text-xs transition-colors duration-200`}
                  >
                    {status}
                  </Badge>
                ))}
            </div>
          )}
          
          {/* Priority Badge */}
          <Badge
            variant="outline"
            className={`${
              order.priority === "critical"
                ? "border-red-500 text-red-500 hover:bg-red-500/10"
                : "border-green-500 text-green-500 hover:bg-green-500/10"
            } text-xs transition-colors duration-200 mt-1`}
          >
            {order.priority === "critical" ? "Crítico" : "Normal"}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={(e) => onDelete(e, order)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ServiceOrderTableRow;
