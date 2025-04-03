
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Settings, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { statusOptions } from "@/components/ServiceOrderContent";

// Define a type for status items
type StatusItem = {
  value: string;
  label: string;
  color: string;
};

const colorOptions = [
  { value: "bg-blue-500 hover:bg-blue-600", label: "Azul" },
  { value: "bg-green-500 hover:bg-green-600", label: "Verde" },
  { value: "bg-red-500 hover:bg-red-600", label: "Vermelho" },
  { value: "bg-yellow-500 hover:bg-yellow-600", label: "Amarelo" },
  { value: "bg-orange-500 hover:bg-orange-600", label: "Laranja" },
  { value: "bg-purple-500 hover:bg-purple-600", label: "Roxo" },
  { value: "bg-pink-500 hover:bg-pink-600", label: "Rosa" },
  { value: "bg-indigo-500 hover:bg-indigo-600", label: "Índigo" },
  { value: "bg-gray-500 hover:bg-gray-600", label: "Cinza" },
  { value: "bg-teal-500 hover:bg-teal-600", label: "Teal" },
];

export const StatusManager = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState("os");
  
  // Static list for demonstration purposes
  // In a real application, this would be stored in the database
  const [osStatuses, setOsStatuses] = useState<StatusItem[]>(statusOptions);
  const [analyzerStatuses, setAnalyzerStatuses] = useState<StatusItem[]>([
    { value: "in-day", label: "Em Dia", color: "bg-green-500 hover:bg-green-600" },
    { value: "expiring-soon", label: "Vencerá", color: "bg-orange-500 hover:bg-orange-600" },
    { value: "expired", label: "Vencido", color: "bg-red-500 hover:bg-red-600" },
    { value: "in-calibration", label: "Em Calibração", color: "bg-blue-500 hover:bg-blue-600" }
  ]);
  
  const [newStatus, setNewStatus] = useState({
    value: "",
    label: "",
    color: "bg-blue-500 hover:bg-blue-600"
  });
  
  const [editingStatus, setEditingStatus] = useState<StatusItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddStatus = () => {
    if (!newStatus.value || !newStatus.label) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o valor e o nome do status",
        variant: "destructive",
      });
      return;
    }
    
    const currentStatuses = tab === "os" ? osStatuses : analyzerStatuses;
    
    // Check if the value already exists
    if (currentStatuses.some(status => status.value === newStatus.value)) {
      toast({
        title: "Valor já existe",
        description: "Escolha um valor único para o status",
        variant: "destructive",
      });
      return;
    }
    
    if (tab === "os") {
      setOsStatuses([...osStatuses, { ...newStatus }]);
    } else {
      setAnalyzerStatuses([...analyzerStatuses, { ...newStatus }]);
    }
    
    // Reset the form
    setNewStatus({
      value: "",
      label: "",
      color: "bg-blue-500 hover:bg-blue-600"
    });
    
    toast({
      title: "Status adicionado",
      description: `O status ${newStatus.label} foi adicionado com sucesso!`,
    });
  };
  
  const handleUpdateStatus = () => {
    if (!editingStatus || !editingStatus.value || !editingStatus.label) {
      toast({
        title: "Erro ao atualizar",
        description: "Dados inválidos para atualização",
        variant: "destructive",
      });
      return;
    }
    
    if (tab === "os") {
      setOsStatuses(osStatuses.map(status => 
        status.value === editingStatus.value ? editingStatus : status
      ));
    } else {
      setAnalyzerStatuses(analyzerStatuses.map(status => 
        status.value === editingStatus.value ? editingStatus : status
      ));
    }
    
    setIsEditing(false);
    setEditingStatus(null);
    
    toast({
      title: "Status atualizado",
      description: `O status ${editingStatus.label} foi atualizado com sucesso!`,
    });
  };
  
  const handleDeleteStatus = (statusToDelete: StatusItem) => {
    if (tab === "os") {
      setOsStatuses(osStatuses.filter(status => status.value !== statusToDelete.value));
    } else {
      setAnalyzerStatuses(analyzerStatuses.filter(status => status.value !== statusToDelete.value));
    }
    
    toast({
      title: "Status removido",
      description: `O status ${statusToDelete.label} foi removido com sucesso!`,
    });
  };
  
  const startEditing = (status: StatusItem) => {
    setEditingStatus({ ...status });
    setIsEditing(true);
  };

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Gerenciamento de Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="os">Ordens de Serviço</TabsTrigger>
            <TabsTrigger value="analyzers">Analisadores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="os" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {isEditing ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">Editar Status</h3>
                  <div className="space-y-2">
                    <Label htmlFor="edit-value">Valor</Label>
                    <Input 
                      id="edit-value" 
                      value={editingStatus?.value || ""} 
                      onChange={e => setEditingStatus(prev => prev ? { ...prev, value: e.target.value } : null)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-label">Nome</Label>
                    <Input 
                      id="edit-label" 
                      value={editingStatus?.label || ""} 
                      onChange={e => setEditingStatus(prev => prev ? { ...prev, label: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Cor</Label>
                    <select 
                      id="edit-color" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={editingStatus?.color}
                      onChange={e => setEditingStatus(prev => prev ? { ...prev, color: e.target.value } : null)}
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className={`h-6 w-full rounded ${editingStatus?.color.split(' ')[0]}`}></div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditingStatus(null);
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateStatus}>
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="value">Valor</Label>
                    <Input 
                      id="value" 
                      placeholder="ex: em_andamento" 
                      value={newStatus.value}
                      onChange={e => setNewStatus({ ...newStatus, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="label">Nome</Label>
                    <Input 
                      id="label" 
                      placeholder="ex: Em Andamento" 
                      value={newStatus.label}
                      onChange={e => setNewStatus({ ...newStatus, label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="color">Cor</Label>
                    <select 
                      id="color" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newStatus.color}
                      onChange={e => setNewStatus({ ...newStatus, color: e.target.value })}
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className={`h-6 w-full rounded ${newStatus.color.split(' ')[0]}`}></div>
                  </div>
                  <Button className="md:col-span-3" onClick={handleAddStatus}>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Status
                  </Button>
                </div>
              )}
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-2 font-medium">Status Disponíveis</div>
                <div className="divide-y">
                  {osStatuses.map(status => (
                    <div key={status.value} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${status.color.split(' ')[0]}`}></div>
                        <span className="font-medium">{status.label}</span>
                        <span className="text-xs text-muted-foreground">({status.value})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(status)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o status "{status.label}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStatus(status)}>
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analyzers" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {isEditing ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">Editar Status</h3>
                  <div className="space-y-2">
                    <Label htmlFor="edit-value-analyzer">Valor</Label>
                    <Input 
                      id="edit-value-analyzer" 
                      value={editingStatus?.value || ""} 
                      onChange={e => setEditingStatus(prev => prev ? { ...prev, value: e.target.value } : null)}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-label-analyzer">Nome</Label>
                    <Input 
                      id="edit-label-analyzer" 
                      value={editingStatus?.label || ""} 
                      onChange={e => setEditingStatus(prev => prev ? { ...prev, label: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-color-analyzer">Cor</Label>
                    <select 
                      id="edit-color-analyzer" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={editingStatus?.color}
                      onChange={e => setEditingStatus(prev => prev ? { ...prev, color: e.target.value } : null)}
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className={`h-6 w-full rounded ${editingStatus?.color.split(' ')[0]}`}></div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditingStatus(null);
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateStatus}>
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="value-analyzer">Valor</Label>
                    <Input 
                      id="value-analyzer" 
                      placeholder="ex: defeito_tecnico" 
                      value={newStatus.value}
                      onChange={e => setNewStatus({ ...newStatus, value: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="label-analyzer">Nome</Label>
                    <Input 
                      id="label-analyzer" 
                      placeholder="ex: Defeito Técnico" 
                      value={newStatus.label}
                      onChange={e => setNewStatus({ ...newStatus, label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-1">
                    <Label htmlFor="color-analyzer">Cor</Label>
                    <select 
                      id="color-analyzer" 
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newStatus.color}
                      onChange={e => setNewStatus({ ...newStatus, color: e.target.value })}
                    >
                      {colorOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className={`h-6 w-full rounded ${newStatus.color.split(' ')[0]}`}></div>
                  </div>
                  <Button className="md:col-span-3" onClick={handleAddStatus}>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Status
                  </Button>
                </div>
              )}
              
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted p-2 font-medium">Status Disponíveis</div>
                <div className="divide-y">
                  {analyzerStatuses.map(status => (
                    <div key={status.value} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${status.color.split(' ')[0]}`}></div>
                        <span className="font-medium">{status.label}</span>
                        <span className="text-xs text-muted-foreground">({status.value})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(status)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o status "{status.label}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStatus(status)}>
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
