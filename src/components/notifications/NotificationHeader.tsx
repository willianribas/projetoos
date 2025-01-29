import { Bell } from "lucide-react";

export const NotificationHeader = () => {
  return (
    <div className="px-4 py-3 font-medium border-b flex items-center gap-2">
      <Bell className="h-4 w-4 text-foreground/70" />
      <span>Notificações</span>
    </div>
  );
};