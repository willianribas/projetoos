
import { useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { Check, CheckCircle, Circle, Clock, Pencil, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { Reminder } from '@/hooks/useReminders';
import { cn } from '@/lib/utils';
import EditReminderDialog from './EditReminderDialog';

interface ReminderCardProps {
  reminder: Reminder;
  onDelete: (id: string) => void;
  onUpdate: (reminder: Reminder) => void;
  onToggleComplete: (reminder: Reminder) => void;
}

const ReminderCard = ({ reminder, onDelete, onUpdate, onToggleComplete }: ReminderCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    
    return format(date, 'dd/MM/yyyy HH:mm');
  };
  
  const formattedDate = formatDueDate(reminder.due_date);
  
  return (
    <>
      <Card className={cn(
        "border-l-4 transition-all duration-200 hover:shadow-md h-full",
        reminder.is_completed ? "border-l-green-500 bg-green-50/10" : "border-l-blue-500"
      )}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <Checkbox
                checked={reminder.is_completed}
                onCheckedChange={() => onToggleComplete(reminder)}
                className="mt-1"
              />
              <div className={cn(
                "space-y-1 flex-1 min-w-0",
                reminder.is_completed && "text-muted-foreground line-through"
              )}>
                <h3 className="font-medium text-sm truncate">{reminder.title}</h3>
                {reminder.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{reminder.description}</p>
                )}
                {formattedDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formattedDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Pencil className="h-3 w-3" />
                    <span className="sr-only">Editar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar lembrete</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => onDelete(reminder.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Excluir lembrete</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <EditReminderDialog
        reminder={reminder}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={onUpdate}
      />
    </>
  );
};

export default ReminderCard;
