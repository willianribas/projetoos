import React, { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarContent } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import { AddEventDialog } from "@/components/calendar/AddEventDialog";
import { EventDetailsDialog } from "@/components/calendar/EventDetailsDialog";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.due_date && isSameDay(new Date(event.due_date), date)
    );
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowAddDialog(true);
  };

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const renderCalendarGrid = () => {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Calculate days to show (including days from previous/next month to fill the grid)
    const firstDayOfWeek = monthStart.getDay();
    const lastDayOfWeek = monthEnd.getDay();
    
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek));
    
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="p-3 text-center font-medium text-muted-foreground bg-muted/50 rounded-lg">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {allDays.map(day => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={cn(
                "min-h-[120px] p-2 border border-border/50 rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/30",
                !isCurrentMonth && "text-muted-foreground bg-muted/20",
                isCurrentDay && "bg-primary/10 border-primary/50"
              )}
            >
              <div className={cn(
                "text-sm font-medium mb-1",
                isCurrentDay && "text-primary font-bold"
              )}>
                {format(day, 'd')}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <Badge
                    key={event.id}
                    variant={event.is_completed ? "secondary" : "default"}
                    className="w-full text-xs p-1 justify-start truncate cursor-pointer hover:bg-primary/80"
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    {event.title}
                  </Badge>
                ))}
                {dayEvents.length > 3 && (
                  <Badge variant="outline" className="w-full text-xs p-1 justify-center">
                    +{dayEvents.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <SidebarContent>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando calendário...</p>
            </div>
          </div>
        </SidebarContent>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <SidebarContent>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
                <p className="text-muted-foreground">Gerencie suas atividades e compromissos</p>
              </div>
            </div>
            
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Atividade
            </Button>
          </div>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-2xl">
                  {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                </span>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {renderCalendarGrid()}
            </CardContent>
          </Card>

          {/* Dialogs */}
          <AddEventDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            selectedDate={selectedDate}
            onEventCreate={async (event) => {
              await createEvent(event);
            }}
          />

          <EventDetailsDialog
            event={selectedEvent}
            open={!!selectedEvent}
            onOpenChange={(open) => !open && setSelectedEvent(null)}
            onEventUpdate={async (event) => {
              await updateEvent(event);
            }}
            onEventDelete={async (id) => {
              await deleteEvent(id);
            }}
          />
        </div>
      </SidebarContent>
    </div>
  );
};

export default Calendar;