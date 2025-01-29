import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BellRing } from "lucide-react";

interface NotificationItemProps {
  message: string;
  timestamp: Date;
  onClick: () => void;
}

export const NotificationItem = ({ message, timestamp, onClick }: NotificationItemProps) => {
  return (
    <Button
      variant="ghost"
      className="w-full p-4 flex items-start gap-3 hover:bg-muted/50"
      onClick={onClick}
    >
      <BellRing className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <div className="flex flex-col items-start gap-1 text-left">
        <p className="text-sm text-foreground/90 font-medium">{message}</p>
        <p className="text-xs text-foreground/60">
          {formatDistanceToNow(new Date(timestamp), {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      </div>
    </Button>
  );
};