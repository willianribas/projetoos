
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Plus, X, Calendar } from "lucide-react";
import { ServiceOrder } from "@/types";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMobileDetect } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";

interface ADEMonitorProps {
  serviceOrders: ServiceOrder[];
}

interface CustomNotification {
  id: string;
  title: string;
  description: string;
  date: Date;
  created_at: string;
}

const ADEMonitor = ({ serviceOrders }: ADEMonitorProps) => {
  const navigate = useNavigate();
  const { isMobile } = useMobileDetect();
  const { toast } = useToast();
  const adeOrders = serviceOrders.filter(order => order.status === "ADE");
  const criticalAdeOrders = adeOrders.filter(order => order.priority === "critical");
  const adpdOrders = serviceOrders.filter(order => order.status === "ADPD");
  const msOrders = serviceOrders.filter(order => order.status === "M.S");

  // State for custom notifications
  const [customNotifications, setCustomNotifications] = useState<CustomNotification[]>(() => {
    const saved = localStorage.getItem("customNotifications");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newNotification, setNewNotification] = useState({
    title: "",
    description: "",
    date: new Date(),
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddNotification = () => {
    if (!newNotification.title) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O título da notificação é obrigatório"
      });
      return;
    }
    
    const notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      description: newNotification.description,
      date: newNotification.date,
      created_at: new Date().toISOString()
    };
    
    const updatedNotifications = [...customNotifications, notification];
    setCustomNotifications(updatedNotifications);
    localStorage.setItem("customNotifications", JSON.stringify(updatedNotifications));
    
    setNewNotification({
      title: "",
      description: "",
      date: new Date(),
    });
    
    setDialogOpen(false);
    
    toast({
      title: "Notificação adicionada",
      description: "Sua notificação foi adicionada com sucesso"
    });
  };
  
  const handleDeleteNotification = (id: string) => {
    const updatedNotifications = customNotifications.filter(note => note.id !== id);
    setCustomNotifications(updatedNotifications);
    localStorage.setItem("customNotifications", JSON.stringify(updatedNotifications));
    
    toast({
      title: "Notificação removida",
      description: "Sua notificação foi removida com sucesso"
    });
  };

  if (adeOrders.length === 0 && msOrders.length === 0 && adpdOrders.length === 0 && customNotifications.length === 0) {
    return (
      <div className="text-center p-6">
        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Não há notificações</h3>
        <p className="text-muted-foreground mb-4">Crie uma nova notificação personalizada</p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nova Notificação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NotificationForm 
              newNotification={newNotification} 
              setNewNotification={setNewNotification} 
              handleAddNotification={handleAddNotification}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Calculate days for each ADE order
  const calculateDays = (createdAt: string): number => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  // Find the oldest ADE order
  const adeOrdersWithDays = adeOrders.map(order => ({
    ...order,
    days: calculateDays(order.created_at || "")
  }));
  
  // Sort by days in descending order to get the oldest one first
  adeOrdersWithDays.sort((a, b) => b.days - a.days);
  
  // Get the oldest order's days
  const oldestAdeDays = adeOrdersWithDays.length > 0 ? adeOrdersWithDays[0].days : 0;
  
  // Determine color based on days
  const getDaysColor = (days: number): string => {
    if (days >= 6) return "text-red-500 font-bold";
    if (days >= 3) return "text-orange-500 font-medium";
    return "text-green-500";
  };
  
  // Format date function
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Calculate days until notification date
  const getDaysUntil = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="mb-6 sm:mb-8 mt-3 sm:mt-4 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 animate-pulse" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Notificações
          </span>
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 px-2">
              <Plus className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Nova</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <NotificationForm 
              newNotification={newNotification} 
              setNewNotification={setNewNotification} 
              handleAddNotification={handleAddNotification}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pb-3 sm:pb-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Custom notifications */}
          {customNotifications.length > 0 && (
            <div className="space-y-2">
              {customNotifications.map((notification) => {
                const daysUntil = getDaysUntil(new Date(notification.date));
                let statusColor = "text-green-500";
                if (daysUntil < 0) statusColor = "text-red-500";
                else if (daysUntil <= 3) statusColor = "text-orange-500";
                
                return (
                  <div key={notification.id} className="bg-muted/40 p-3 rounded-md relative animate-fade-in">
                    <button 
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="absolute right-2 top-2 hover:bg-background/80 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        {notification.description && (
                          <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Data:</span>
                          <span className={statusColor}>
                            {formatDate(new Date(notification.date))}
                            {daysUntil === 0 && " (hoje)"}
                            {daysUntil > 0 && ` (em ${daysUntil} dias)`}
                            {daysUntil < 0 && ` (${Math.abs(daysUntil)} dias atrás)`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-between'} animate-fade-in`}>
            <div className="space-y-2 text-left">
              {adeOrders.length > 0 && (
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                  Você tem <span className="font-bold text-blue-400">{adeOrders.length}</span> {adeOrders.length === 1 ? 'OS' : 'ordens de serviço'} em ADE 
                  {oldestAdeDays > 0 && (
                    <span> há <span className={getDaysColor(oldestAdeDays)}>{oldestAdeDays}</span> dias</span>
                  )}.
                </p>
              )}
              
              {adpdOrders.length > 0 && (
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                  Você tem <span className="font-bold text-fuchsia-400">{adpdOrders.length}</span> {adpdOrders.length === 1 ? 'OS' : 'ordens de serviço'} em ADPD.
                </p>
              )}
              
              {criticalAdeOrders.length > 0 && (
                <p className={`${isMobile ? 'text-sm' : 'text-base'} text-foreground/90`}>
                  Você tem <span className="text-red-500 font-bold animate-pulse">{criticalAdeOrders.length}</span> {criticalAdeOrders.length === 1 ? 'OS marcada' : 'ordens de serviço marcadas'} como Crítica.
                </p>
              )}
            </div>
            
            {(adeOrders.length > 0 || adpdOrders.length > 0 || criticalAdeOrders.length > 0) && (
              <Button 
                variant="outline"
                onClick={() => navigate('/ade-monitor')}
                className={`hover:bg-blue-500/10 transition-colors duration-300 hover:scale-105 ${isMobile ? 'w-full mt-2' : ''}`}
                size={isMobile ? "sm" : "default"}
              >
                Ver detalhes
              </Button>
            )}
          </div>
          
          {msOrders.length > 0 && (
            <p className="text-xs sm:text-base text-foreground/90 animate-fade-in text-left">
              Material Solicitado na O.S: {msOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <span className="font-medium hover:text-primary transition-colors">{order.numeroos}</span>
                  {index < msOrders.length - 1 && " | "}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Notification form component
interface NotificationFormProps {
  newNotification: {
    title: string;
    description: string;
    date: Date;
  };
  setNewNotification: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    date: Date;
  }>>;
  handleAddNotification: () => void;
}

const NotificationForm = ({ newNotification, setNewNotification, handleAddNotification }: NotificationFormProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Criar Nova Notificação</DialogTitle>
        <DialogDescription>
          Adicione um lembrete ou notificação personalizada.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Digite o título da notificação"
            value={newNotification.title}
            onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Adicione uma descrição detalhada"
            value={newNotification.description}
            onChange={(e) => setNewNotification({...newNotification, description: e.target.value})}
            className="min-h-24"
          />
        </div>
        <div className="space-y-2">
          <Label>Data</Label>
          <DatePicker
            date={newNotification.date} 
            setDate={(date) => setNewNotification({...newNotification, date: date || new Date()})}
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={handleAddNotification}>
          Adicionar Notificação
        </Button>
      </DialogFooter>
    </>
  );
};

export default ADEMonitor;
