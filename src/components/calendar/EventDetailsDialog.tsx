import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock, Edit2, Trash2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface EventDetailsDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdate: (event: CalendarEvent) => Promise<void>;
  onEventDelete: (id: string) => Promise<void>;
}

export const EventDetailsDialog = ({
  event,
  open,
  onOpenChange,
  onEventUpdate,
  onEventDelete,
}: EventDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [time, setTime] = useState("09:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      
      if (event.due_date) {
        const date = new Date(event.due_date);
        setEventDate(date);
        setTime(format(date, "HH:mm"));
      } else {
        setEventDate(undefined);
        setTime("09:00");
      }
    }
  }, [event]);

  const handleToggleComplete = async () => {
    if (!event) return;

    setIsSubmitting(true);
    try {
      await onEventUpdate({
        ...event,
        is_completed: !event.is_completed,
      });

      toast({
        title: "Sucesso",
        description: event.is_completed 
          ? "Atividade marcada como pendente" 
          : "Atividade marcada como concluída",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar atividade",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !title.trim()) {
      toast({
        title: "Erro",
        description: "O título da atividade é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let dueDateString = event.due_date;
      if (eventDate) {
        const [hours, minutes] = time.split(':');
        const dateWithTime = new Date(eventDate);
        dateWithTime.setHours(parseInt(hours), parseInt(minutes));
        dueDateString = dateWithTime.toISOString();
      }

      await onEventUpdate({
        ...event,
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDateString,
      });

      setIsEditing(false);
      toast({
        title: "Sucesso",
        description: "Atividade atualizada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar atividade",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    setIsSubmitting(true);
    try {
      await onEventDelete(event.id);
      onOpenChange(false);
      
      toast({
        title: "Sucesso",
        description: "Atividade excluída com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir atividade",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Atividade</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSubmitting}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Atividade</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da atividade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da atividade (opcional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? (
                        format(eventDate, "dd 'de' MMM", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-time">Horário</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <Badge variant={event.is_completed ? "default" : "secondary"}>
                {event.is_completed ? "Concluída" : "Pendente"}
              </Badge>
            </div>

            {event.description && (
              <div className="space-y-2">
                <Label>Descrição</Label>
                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                  {event.description}
                </p>
              </div>
            )}

            {event.due_date && (
              <div className="space-y-2">
                <Label>Data e Hora</Label>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  {format(new Date(event.due_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  <Clock className="h-4 w-4 ml-2" />
                  {format(new Date(event.due_date), "HH:mm")}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Status</Label>
              <Button
                variant={event.is_completed ? "outline" : "default"}
                className="w-full"
                onClick={handleToggleComplete}
                disabled={isSubmitting}
              >
                {event.is_completed ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Marcar como Pendente
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Marcar como Concluída
                  </>
                )}
              </Button>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};