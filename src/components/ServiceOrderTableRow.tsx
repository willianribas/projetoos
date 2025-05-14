
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
import { Badge } from "@/components/ui/badge";
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
  serviceOrder: ServiceOrder;
  index: number;
  getStatusColor: (status: string) => string;
  statusOptions: { value: string; label: string }[];
  onUpdateServiceOrder: (index: number, updatedOrder: ServiceOrder) => void;
  onDeleteServiceOrder: (id: number) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

export function ServiceOrderTableRow({
  serviceOrder,
  index,
  getStatusColor,
  statusOptions,
  onUpdateServiceOrder,
  onDeleteServiceOrder,
  selectedStatus,
  onStatusChange,
}: ServiceOrderTableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleStatusClick = (status: string) => {
    onStatusChange(selectedStatus === status ? null : status);
  };

  return (
    <>
      <tr>
        <td>{serviceOrder.numeroos}</td>
        <td>{serviceOrder.patrimonio}</td>
        <td>{serviceOrder.equipamento}</td>
        <td>
          <Badge className={getStatusColor(serviceOrder.status)}>
            {serviceOrder.status}
          </Badge>
        </td>
        <td>{serviceOrder.observacao}</td>
        <td>{format(new Date(serviceOrder.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
        <td className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  // Logic to edit
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  onDeleteServiceOrder(serviceOrder.id);
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareDialog(true);
                  }}
                  title="Compartilhar OS"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      {showShareDialog && (
        <ShareServiceOrderDialog
          serviceOrder={serviceOrder}
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </>
  );
}
