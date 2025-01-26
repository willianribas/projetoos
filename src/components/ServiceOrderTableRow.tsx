import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ServiceOrder } from "@/types";

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
      className="cursor-pointer hover:bg-muted/60"
      onClick={() => onRowClick(order, index)}
    >
      <TableCell className="w-[120px]">{order.numeroos}</TableCell>
      <TableCell className="w-[120px]">{order.patrimonio}</TableCell>
      <TableCell className="w-[150px]">{order.equipamento}</TableCell>
      <TableCell className="w-[120px]">
        <span
          className={`${getStatusColor(order.status)} border rounded px-2 py-1`}
          style={{ borderColor: "currentColor" }}
        >
          {order.status}
        </span>
      </TableCell>
      <TableCell className="min-w-[300px]">{order.observacao}</TableCell>
      <TableCell className="w-[50px]">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-destructive/90 hover:text-destructive-foreground"
          onClick={(e) => onDelete(e, index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ServiceOrderTableRow;