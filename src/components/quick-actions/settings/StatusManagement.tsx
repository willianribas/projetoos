
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PlusCircle, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StatusOption {
  value: string;
  label: string;
  color: string;
  icon: any;
}

interface StatusManagementProps {
  statusOptions: StatusOption[];
  onStatusAdd: (newStatus: StatusOption) => void;
  onStatusRemove: (statusValue: string) => void;
}

export const StatusManagement = ({ statusOptions, onStatusAdd, onStatusRemove }: StatusManagementProps) => {
  const [newStatusValue, setNewStatusValue] = useState('');
  const [newStatusLabel, setNewStatusLabel] = useState('');
  const [newStatusColor, setNewStatusColor] = useState('#000000');
  const { toast } = useToast();

  const handleAddStatus = () => {
    if (!newStatusValue || !newStatusLabel || !newStatusColor) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar um novo status",
        variant: "destructive",
      });
      return;
    }

    if (statusOptions.some(status => status.value === newStatusValue)) {
      toast({
        title: "Status já existe",
        description: "Este valor de status já está em uso",
        variant: "destructive",
      });
      return;
    }

    onStatusAdd({
      value: newStatusValue,
      label: newStatusLabel,
      color: newStatusColor,
      icon: AlertCircle // Usando AlertCircle como ícone padrão
    });

    setNewStatusValue('');
    setNewStatusLabel('');
    setNewStatusColor('#000000');

    toast({
      title: "Status adicionado",
      description: "O novo status foi adicionado com sucesso",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Gerenciar Status</h3>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="statusValue">Valor do Status</Label>
            <Input
              id="statusValue"
              placeholder="Ex: PENDING"
              value={newStatusValue}
              onChange={(e) => setNewStatusValue(e.target.value.toUpperCase())}
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="statusLabel">Nome do Status</Label>
            <Input
              id="statusLabel"
              placeholder="Ex: Pendente"
              value={newStatusLabel}
              onChange={(e) => setNewStatusLabel(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="statusColor">Cor do Status</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="statusColor"
                value={newStatusColor}
                onChange={(e) => setNewStatusColor(e.target.value)}
                className="w-16 h-10 p-1 bg-background/50"
              />
              <Input
                type="text"
                value={newStatusColor}
                onChange={(e) => setNewStatusColor(e.target.value)}
                className="flex-1 bg-background/50"
                placeholder="#000000"
              />
            </div>
          </div>

          <Button onClick={handleAddStatus} className="w-full">
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Status
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Status Atuais</h4>
        <div className="grid gap-2">
          {statusOptions.map((status) => (
            <Card key={status.value} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-medium">{status.label}</span>
                <span className="text-sm text-muted-foreground">({status.value})</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStatusRemove(status.value)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
