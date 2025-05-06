
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ServiceOrder } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Check } from "lucide-react";

interface EditServiceOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editedOrder: ServiceOrder | null;
  setEditedOrder: (order: ServiceOrder | null) => void;
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
  onSave: () => void;
}

const EditServiceOrderDialog = ({
  isOpen,
  setIsOpen,
  editedOrder,
  setEditedOrder,
  statusOptions,
  onSave,
}: EditServiceOrderDialogProps) => {
  if (!editedOrder) return null;

  const handleStatusToggle = (status: string) => {
    const currentStatuses = editedOrder.status_array || [];
    let newStatuses: string[];
    
    if (currentStatuses.includes(status)) {
      // If removing the primary status, we need to set a new primary status
      const isPrimaryStatus = editedOrder.status === status;
      newStatuses = currentStatuses.filter(s => s !== status);
      
      if (isPrimaryStatus && newStatuses.length > 0) {
        // Set the first remaining status as the primary
        setEditedOrder({
          ...editedOrder,
          status_array: newStatuses,
          status: newStatuses[0]
        });
      } else {
        setEditedOrder({
          ...editedOrder,
          status_array: newStatuses,
          ...(isPrimaryStatus && newStatuses.length === 0 ? { status: "" } : {})
        });
      }
    } else {
      // Adding a new status
      newStatuses = [...currentStatuses, status];
      
      // If this is the first status, make it the primary
      if (newStatuses.length === 1) {
        setEditedOrder({
          ...editedOrder,
          status_array: newStatuses,
          status: status
        });
      } else {
        setEditedOrder({
          ...editedOrder,
          status_array: newStatuses
        });
      }
    }
  };

  const handlePrimaryStatusChange = (newPrimaryStatus: string) => {
    setEditedOrder({ ...editedOrder, status: newPrimaryStatus });
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Ordem de Serviço</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label>Número OS</label>
            <Input
              value={editedOrder.numeroos}
              onChange={(e) =>
                setEditedOrder({ ...editedOrder, numeroos: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label>Patrimônio</label>
            <Input
              value={editedOrder.patrimonio}
              onChange={(e) =>
                setEditedOrder({ ...editedOrder, patrimonio: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label>Equipamento</label>
            <Input
              value={editedOrder.equipamento}
              onChange={(e) =>
                setEditedOrder({ ...editedOrder, equipamento: e.target.value })
              }
            />
          </div>
          
          <div className="space-y-2">
            <label>Status</label>
            <div className="border rounded-md p-3">
              <ToggleGroup 
                type="multiple" 
                className="flex flex-wrap gap-2 w-full"
                value={editedOrder.status_array || []}
                onValueChange={(values) => {
                  // Ensure we don't remove all statuses
                  if (values.length === 0) return;
                  
                  // Update the status array
                  setEditedOrder({
                    ...editedOrder,
                    status_array: values,
                    // If current primary status is removed, set the first one as primary
                    status: values.includes(editedOrder.status) ? editedOrder.status : values[0]
                  });
                }}
              >
                {statusOptions.map((statusOption) => (
                  <ToggleGroupItem 
                    key={statusOption.value} 
                    value={statusOption.value}
                    className={`border ${statusOption.color} transition-colors`}
                    aria-label={statusOption.label}
                  >
                    {statusOption.label}
                    {editedOrder.status === statusOption.value && (
                      <Check className="ml-1 h-3 w-3" />
                    )}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
          
          {/* Display selected statuses and allow setting primary */}
          {editedOrder.status_array && editedOrder.status_array.length > 0 && (
            <div className="space-y-2">
              <label>Status selecionados:</label>
              <ScrollArea className="h-20 w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {editedOrder.status_array.map((status) => (
                    <Badge 
                      key={status} 
                      variant="outline"
                      className={`${getStatusColor(status)} flex items-center gap-1`}
                      onClick={() => handlePrimaryStatusChange(status)}
                    >
                      <span 
                        className={`inline-flex h-2 w-2 rounded-full mr-1 ${
                          status === editedOrder.status ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></span>
                      {status} {status === editedOrder.status && "(Principal)"}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
              <p className="text-xs text-muted-foreground">
                Clique em um status para definir como principal.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <RadioGroup
              value={editedOrder.priority || "normal"}
              onValueChange={(value) =>
                setEditedOrder({
                  ...editedOrder,
                  priority: value as "normal" | "critical",
                })
              }
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="text-green-500">
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="critical" id="critical" />
                <Label htmlFor="critical" className="text-red-500">
                  Crítico
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <label>Observação</label>
            <Textarea
              value={editedOrder.observacao || ""}
              onChange={(e) =>
                setEditedOrder({ ...editedOrder, observacao: e.target.value })
              }
            />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            onClick={onSave}
          >
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceOrderDialog;
