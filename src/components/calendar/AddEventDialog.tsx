import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date | null;
  onEventCreate: (event: {
    title: string;
    description?: string;
    due_date?: string;
  }) => Promise<void>;
}

export const AddEventDialog = ({
  open,
  onOpenChange,
  selectedDate,
  onEventCreate,
}: AddEventDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date | undefined>(selectedDate || undefined);
  const [time, setTime] = useState("09:00");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título da atividade é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let dueDateString = undefined;
      if (eventDate) {
        const [hours, minutes] = time.split(':');
        const dateWithTime = new Date(eventDate);
        dateWithTime.setHours(parseInt(hours), parseInt(minutes));
        dueDateString = dateWithTime.toISOString();
      }

      await onEventCreate({
        title: title.trim(),
        description: description.trim() || undefined,
        due_date: dueDateString,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setEventDate(undefined);
      setTime("09:00");
      onOpenChange(false);

      toast({
        title: "Sucesso",
        description: "Atividade criada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar atividade",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Atividade</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da atividade"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
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
              <Label htmlFor="time">Horário</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
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
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Atividade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};