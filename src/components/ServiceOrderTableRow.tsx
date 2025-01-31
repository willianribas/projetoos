import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { ServiceOrder } from "@/types";
import ServiceOrderFloatingActions from "./ServiceOrderFloatingActions";

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
  const [isSelected, setIsSelected] = React.useState(false);

  const handleRowClick = () => {
    setIsSelected(!isSelected);
    onRowClick(order, index);
  };

  return (
    <>
      <TableRow
        key={index}
        className="cursor-pointer hover:bg-muted/50 transition-colors animate-fade-in"
        onClick={handleRowClick}
      >
        <TableCell className="text-center font-medium">{order.numeroos}</TableCell>
        <TableCell className="text-center">{order.patrimonio}</TableCell>
        <TableCell className="text-center">{order.equipamento}</TableCell>
        <TableCell className="hidden md:table-cell">
          {order.observacao || "-"}
        </TableCell>
        <TableCell className="text-center">
          <div className="flex flex-col gap-1 items-center">
            <Badge
              variant="outline"
              className={`${getStatusColor(
                order.status
              )} transition-colors duration-200`}
            >
              {order.status}
            </Badge>
            <Badge
              variant="outline"
              className={`${
                order.priority === "critical"
                  ? "border-red-500 text-red-500 hover:bg-red-500/10"
                  : "border-green-500 text-green-500 hover:bg-green-500/10"
              } text-xs transition-colors duration-200`}
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
            onClick={(e) => onDelete(e, index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
      {isSelected && <ServiceOrderFloatingActions serviceOrderId={order.id} />}
    </>
  );
};

export default ServiceOrderTableRow;