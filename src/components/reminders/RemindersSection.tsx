
import { useReminders } from '@/hooks/useReminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clipboard, PlusCircle } from 'lucide-react';
import AddReminderDialog from './AddReminderDialog';
import ReminderCard from './ReminderCard';
import { Button } from '@/components/ui/button';

const RemindersSection = () => {
  const { 
    reminders, 
    isLoading, 
    createReminder, 
    updateReminder, 
    deleteReminder,
    toggleComplete 
  } = useReminders();
  
  // Determine if we should show the compact view (no reminders)
  const isCompactView = reminders.length === 0 && !isLoading;
  
  return (
    <Card className="mb-6 border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className={`flex flex-row items-center justify-between ${isCompactView ? 'py-2 sm:py-3' : 'py-3 sm:py-4'}`}>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clipboard className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Lembretes
          </span>
        </CardTitle>
        
        <AddReminderDialog onAddReminder={createReminder} />
      </CardHeader>
      
      {(!isCompactView) && (
        <CardContent className="pb-3 sm:pb-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : reminders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reminders.map(reminder => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onDelete={deleteReminder}
                  onUpdate={updateReminder}
                  onToggleComplete={toggleComplete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clipboard className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Você não possui lembretes.</p>
              <p className="text-sm mb-4">Adicione lembretes importantes para se manter organizado.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default RemindersSection;
