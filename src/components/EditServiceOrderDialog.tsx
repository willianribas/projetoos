
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ServiceOrder } from "@/types";
import { X, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  if (!editedOrder) return null;

  const handleAddStatus = () => {
    if (!selectedStatus) return;
    
    // Only add if not already in the array
    if (!editedOrder.status_array?.includes(selectedStatus)) {
      const updatedStatusArray = [...(editedOrder.status_array || []), selectedStatus];
      setEditedOrder({ 
        ...editedOrder, 
        status_array: updatedStatusArray,
        // Also update the primary status
        status: selectedStatus
      });
    }
    
    setSelectedStatus("");
  };

  const handleRemoveStatus = (statusToRemove: string) => {
    if (!editedOrder.status_array) return;
    
    const updatedStatusArray = editedOrder.status_array.filter(
      (status) => status !== statusToRemove
    );
    
    // Update the main status if we're removing the current primary status
    const updatedStatus = statusToRemove === editedOrder.status 
      ? (updatedStatusArray.length > 0 ? updatedStatusArray[0] : "")
      : editedOrder.status;
    
    setEditedOrder({ 
      ...editedOrder, 
      status_array: updatedStatusArray,
      status: updatedStatus
    });
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
            <div className="flex gap-2">
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value}
                      className={status.color}
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                size="icon" 
                variant="outline"
                onClick={handleAddStatus}
                disabled={!selectedStatus}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Status tags display */}
          {editedOrder.status_array && editedOrder.status_array.length > 0 && (
            <div className="space-y-2">
              <label>Status ativos:</label>
              <ScrollArea className="h-20 w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-2">
                  {editedOrder.status_array.map((status) => (
                    <Badge 
                      key={status} 
                      variant="outline"
                      className={`${getStatusColor(status)} flex items-center gap-1`}
                    >
                      <button 
                        type="button"
                        className={`rounded-full p-0.5 ${
                          status === editedOrder.status 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        } mr-1 h-4 w-4 text-[8px] flex items-center justify-center`}
                        onClick={() => handlePrimaryStatusChange(status)}
                        title={status === editedOrder.status ? "Status principal" : "Definir como status principal"}
                      >
                        P
                      </button>
                      {status}
                      <button 
                        type="button" 
                        className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                        onClick={() => handleRemoveStatus(status)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
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
