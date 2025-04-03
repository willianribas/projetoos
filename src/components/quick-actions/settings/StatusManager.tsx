import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, Tag, CheckCircle2 } from "lucide-react";
import { HexColorPicker } from "react-colorful";

// Import the service order statuses
import { statusOptions as serviceOrderStatusOptions } from "@/components/ServiceOrderContent";

// Define the analyzer statuses
const analyzerStatusOptions = [
  { value: 'in-day', label: 'Em Dia', color: 'bg-green-500 hover:bg-green-600' },
  { value: 'expiring-soon', label: 'Vencerá', color: 'bg-orange-500 hover:bg-orange-600' },
  { value: 'expired', label: 'Vencido', color: 'bg-red-500 hover:bg-red-600' },
  { value: 'in-calibration', label: 'Em Calibração', color: 'bg-blue-500 hover:bg-blue-600' }
];

interface StatusOption {
  value: string;
  label: string;
  color: string;
}

export const StatusManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<"serviceOrders" | "analyzers">("serviceOrders");
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [currentStatus, setCurrentStatus] = useState<StatusOption | null>(null);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newColor, setNewColor] = useState("#ffffff");
  const [isAddMode, setIsAddMode] = useState(false);
  
  // Load the statuses based on the edit mode
  useEffect(() => {
    if (editMode === "serviceOrders") {
      setStatuses([...serviceOrderStatusOptions]);
    } else {
      setStatuses([...analyzerStatusOptions]);
    }
    setCurrentStatus(null);
    setIsAddMode(false);
  }, [editMode]);

  const handleColorChange = (color: string) => {
    setNewColor(color);
  };

  const handleEditStatus = (status: StatusOption) => {
    setCurrentStatus(status);
    setNewLabel(status.label);
    setNewValue(status.value);
    
    // Extract color from Tailwind class
    const colorMatch = status.color.match(/bg-([a-z]+-[0-9]+)/);
    if (colorMatch) {
      // Just a visual feedback, we'll keep the original Tailwind class
      setNewColor("#ffffff");
    } else {
      setNewColor("#ffffff");
    }
    
    setIsAddMode(false);
  };

  const handleAddStatus = () => {
    setCurrentStatus(null);
    setNewLabel("");
    setNewValue("");
    setNewColor("#3b82f6"); // Default blue color
    setIsAddMode(true);
  };

  const handleSaveStatus = () => {
    // Validation
    if (!newLabel.trim()) {
      toast({
        title: "Erro",
        description: "O nome do status não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    if (!newValue.trim()) {
      toast({
        title: "Erro",
        description: "O valor do status não pode estar vazio",
        variant: "destructive",
      });
      return;
    }

    // For now, we just show a toast. In a real application, you would save this to a database.
    toast({
      title: "Sucesso",
      description: `Status ${isAddMode ? "adicionado" : "atualizado"} com sucesso`,
    });
    
    setColorPickerOpen(false);
    setCurrentStatus(null);
    setIsAddMode(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-gray-400" />
          Gerenciar Status
        </CardTitle>
        <CardDescription>
          Edite os status disponíveis para ordens de serviço e analisadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Editar Status
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gerenciar Status</DialogTitle>
            </DialogHeader>
            
            <div className="flex gap-2 my-4">
              <Button 
                variant={editMode === "serviceOrders" ? "default" : "outline"}
                onClick={() => setEditMode("serviceOrders")}
                className="flex-1"
              >
                Status de Ordens de Serviço
              </Button>
              <Button 
                variant={editMode === "analyzers" ? "default" : "outline"}
                onClick={() => setEditMode("analyzers")}
                className="flex-1"
              >
                Status de Analisadores
              </Button>
            </div>
            
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statuses.map((status) => (
                    <TableRow key={status.value}>
                      <TableCell>{status.label}</TableCell>
                      <TableCell>{status.value}</TableCell>
                      <TableCell>
                        <div className={`w-6 h-6 rounded-full ${status.color.split(' ')[0]}`} />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditStatus(status)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleAddStatus}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Status
              </Button>
              
              {(currentStatus || isAddMode) && (
                <div className="space-y-4 border rounded-md p-4 mt-4">
                  <h3 className="text-lg font-medium">
                    {isAddMode ? "Adicionar Status" : "Editar Status"}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status-name">Nome do Status</Label>
                    <Input 
                      id="status-name"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Ex: Em Progresso"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status-value">Valor do Status</Label>
                    <Input 
                      id="status-value"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Ex: in_progress"
                      disabled={!isAddMode} // Only allow editing value when adding new status
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cor do Status</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-6 h-6 rounded-full ${currentStatus?.color.split(' ')[0] || `bg-[${newColor}]`}`}
                        onClick={() => setColorPickerOpen(!colorPickerOpen)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {currentStatus ? "As cores são gerenciadas pelo sistema" : "Escolha uma cor"}
                      </span>
                    </div>
                    
                    {colorPickerOpen && isAddMode && (
                      <div className="mt-2">
                        <HexColorPicker color={newColor} onChange={handleColorChange} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setCurrentStatus(null);
                        setIsAddMode(false);
                        setColorPickerOpen(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveStatus}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <p className="text-sm text-muted-foreground mt-2">
          Personalize os status disponíveis para ordens de serviço e analisadores
        </p>
      </CardContent>
    </Card>
  );
};
