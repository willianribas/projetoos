import { Bell } from "lucide-react";

export const EmptyNotifications = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-foreground/60">
      <Bell className="h-8 w-8 mb-2 opacity-50" />
      <p className="text-sm">Nenhuma notificação</p>
    </div>
  );
};