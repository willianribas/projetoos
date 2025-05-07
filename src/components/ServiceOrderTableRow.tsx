
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceOrder } from "@/types";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";

interface ServiceOrderTableRowProps {
  order: ServiceOrder;
  index: number;
  getStatusColor: (status: string) => string;
  onRowClick: (order: ServiceOrder, index: number) => void;
  onDelete: (e: React.MouseEvent<HTMLDivElement>, order: ServiceOrder) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  batchMode?: boolean;
}

const ServiceOrderTableRow = ({
  order,
  index,
  getStatusColor,
  onRowClick,
  onDelete,
  isSelected = false,
  onToggleSelect = () => {},
  batchMode = false
}: ServiceOrderTableRowProps) => {
  const handleRowClick = () => {
    if (batchMode && onToggleSelect) {
      onToggleSelect();
    } else {
      onRowClick(order, index);
    }
  };

  return (
    <TableRow
      className={`cursor-pointer hover:bg-muted/50 transition-all ${isSelected ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
      onClick={handleRowClick}
    >
      {batchMode && (
        <TableCell className="text-center">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect()}
            onClick={(e) => e.stopPropagation()}
            className="data-[state=checked]:bg-primary"
          />
        </TableCell>
      )}
      <TableCell className="text-center font-medium">{order.numeroos}</TableCell>
      <TableCell className="text-center">{order.patrimonio}</TableCell>
      <TableCell className="text-center">{order.equipamento}</TableCell>
      <TableCell className="text-center">{order.observacao || "—"}</TableCell>
      <TableCell className="text-center">
        <Badge className={`${getStatusColor(order.status)}`}>
          {order.status}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRowClick(order, index);
              }}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(e, order);
              }}
              className="flex items-center text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ServiceOrderTableRow;
