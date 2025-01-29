import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ServiceOrder } from "@/types";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceOrderTableRowProps {
  order: ServiceOrder;
  index: number;
  getStatusColor: (status: string) => string;
  onRowClick: (order: ServiceOrder, index: number) => void;
  onDelete: (e: React.MouseEvent, index: number) => void;
}

const ServiceOrderTableRow = ({
  order,
  index,
  getStatusColor,
  onRowClick,
  onDelete,
}: ServiceOrderTableRowProps) => {
  return (
    <TableRow
      key={order.id}
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onRowClick(order, index)}
    >
      <TableCell className="text-center font-medium">
        {order.numeroos}
      </TableCell>
      <TableCell className="text-center">{order.patrimonio}</TableCell>
      <TableCell className="text-center">{order.equipamento}</TableCell>
      <TableCell className="text-center max-w-[300px] truncate">
        {order.observacao}
      </TableCell>
      <TableCell className="text-center">
        <span 
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium border transition-colors",
            getStatusColor(order.status)
          )}
        >
          {order.status}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={(e) => onDelete(e, index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ServiceOrderTableRow;