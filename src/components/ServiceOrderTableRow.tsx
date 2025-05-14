
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MoreVertical,
  Edit,
  Trash,
  Share2
} from "lucide-react";
import { ServiceOrder } from "@/types";
import { useState } from "react";
import { ShareServiceOrderDialog } from "./ShareServiceOrderDialog";

interface ServiceOrderTableRowProps {
  order: ServiceOrder;
  index: number;
  getStatusColor: (status: string) => string;
  onRowClick: (order: ServiceOrder, index: number) => void;
  onDelete: (e: React.MouseEvent, order: ServiceOrder) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  batchMode?: boolean;
}

export function ServiceOrderTableRow({
  order,
  index,
  getStatusColor,
  onRowClick,
  onDelete,
  isSelected = false,
  onToggleSelect = () => {},
  batchMode = false,
}: ServiceOrderTableRowProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Custom status badge with transparent background, colored border and text
  const StatusBadge = ({ status }: { status: string }) => {
    const colorClass = getStatusColor(status).replace('bg-', 'border-');
    const textColorClass = getStatusColor(status).replace('bg-', 'text-');
    
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass} ${textColorClass} bg-transparent`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <TableRow 
        className={`cursor-pointer ${isSelected ? 'bg-muted/90' : ''}`}
        onClick={() => batchMode ? onToggleSelect() : onRowClick(order, index)}
      >
        {batchMode && (
          <TableCell className="w-[40px] text-center">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={() => onToggleSelect()}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto"
            />
          </TableCell>
        )}
        <TableCell className="text-center font-medium">{order.numeroos}</TableCell>
        <TableCell className="text-center">{order.patrimonio}</TableCell>
        <TableCell className="text-center">{order.equipamento}</TableCell>
        <TableCell className="text-center max-w-[300px] truncate">
          {order.observacao || "-"}
        </TableCell>
        <TableCell className="text-center">
          <StatusBadge status={order.status} />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onRowClick(order, index);
                }}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onDelete(e, order);
                }}>
                  <Trash className="mr-2 h-4 w-4" /> Excluir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setShowShareDialog(true);
                }}>
                  <Share2 className="mr-2 h-4 w-4" /> Compartilhar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
      {showShareDialog && (
        <ShareServiceOrderDialog
          serviceOrder={order}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </>
  );
}
