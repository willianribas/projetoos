import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EquipmentStatsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipments: Array<{
    tipo_equipamento: string;
    marca?: string | null;
    modelo?: string | null;
  }>;
}

export const EquipmentStats = ({ open, onOpenChange, equipments }: EquipmentStatsProps) => {
  const getStats = () => {
    const stats = {
      tipos: {} as Record<string, number>,
      marcas: {} as Record<string, number>,
      modelos: {} as Record<string, number>,
    };

    equipments.forEach((eq) => {
      // Contagem por tipo
      stats.tipos[eq.tipo_equipamento] = (stats.tipos[eq.tipo_equipamento] || 0) + 1;
      
      // Contagem por marca
      if (eq.marca) {
        stats.marcas[eq.marca] = (stats.marcas[eq.marca] || 0) + 1;
      }
      
      // Contagem por modelo
      if (eq.modelo) {
        stats.modelos[eq.modelo] = (stats.modelos[eq.modelo] || 0) + 1;
      }
    });

    return stats;
  };

  const stats = getStats();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Estatísticas dos Equipamentos</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Por Tipo de Equipamento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(stats.tipos).map(([tipo, count]) => (
                  <div key={tipo} className="flex justify-between p-2 bg-muted rounded">
                    <span>{tipo}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Por Marca</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(stats.marcas).map(([marca, count]) => (
                  <div key={marca} className="flex justify-between p-2 bg-muted rounded">
                    <span>{marca}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Por Modelo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(stats.modelos).map(([modelo, count]) => (
                  <div key={modelo} className="flex justify-between p-2 bg-muted rounded">
                    <span>{modelo}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};