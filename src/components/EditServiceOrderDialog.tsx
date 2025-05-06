
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
            <Select
              value={editedOrder.status}
              onValueChange={(value) =>
                setEditedOrder({ ...editedOrder, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
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
          </div>
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
