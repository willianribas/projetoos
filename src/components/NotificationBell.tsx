
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Share2, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSharedServiceOrders } from "@/hooks/useSharedServiceOrders";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationBell() {
  const { notifications, hasUnread, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { receivedOrders } = useSharedServiceOrders();
  
  const pendingShares = receivedOrders.length;
  const hasSharedOrders = pendingShares > 0;

  const renderNotificationType = (type: string) => {
    switch (type) {
      case "shared_service_order":
        return "Ordem de serviço compartilhada";
      case "ade_reminder":
        return "Lembrete ADE";
      default:
        return "Notificação";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "shared_service_order":
        return Share2;
      case "ade_reminder":
        return Clock;
      default:
        return Bell;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10 transition-colors">
            <motion.div
              animate={hasUnread || hasSharedOrders ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Bell className="h-[1.2rem] w-[1.2rem] group-hover:text-primary transition-colors" />
            </motion.div>
            <AnimatePresence>
              {(hasUnread || hasSharedOrders) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute h-3 w-3 -top-1 -right-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 ring-2 ring-background shadow-lg"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 rounded-full bg-red-400/50"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 border-0 shadow-xl bg-gradient-to-br from-background to-muted/20" align="end">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-border/50">
            <h4 className="font-semibold text-lg bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Notificações
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="hover:bg-primary/10 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          </div>

          {hasSharedOrders && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 mb-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg border border-orange-200/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-full">
                    <Share2 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Ordens compartilhadas pendentes
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-300">
                      {pendingShares} aguardando aprovação
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30 border-orange-300">
                  {pendingShares}
                </Badge>
              </div>
            </motion.div>
          )}

          {notifications.length > 0 ? (
            <ScrollArea className="h-[320px] pr-2">
              <div className="space-y-2">
                {notifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.notification_type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                        !notification.is_read
                          ? "bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/20 shadow-sm"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        setOpen(false);
                        if (notification.notification_type === "shared_service_order") {
                          navigate("/");
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          !notification.is_read ? "bg-primary/20" : "bg-muted"
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            !notification.is_read ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-sm truncate">
                              {renderNotificationType(notification.notification_type)}
                            </h5>
                            {!notification.is_read && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-purple-500 ml-2"
                              />
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.notification_type === "shared_service_order" && 
                              "Uma nova ordem de serviço foi compartilhada com você."}
                            {notification.notification_type === "ade_reminder" && 
                              "Lembrete sobre ordem em status ADE por mais de 8 dias."}
                          </p>
                          
                          <p className="text-[10px] text-muted-foreground/70 mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center"
            >
              <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                Nenhuma notificação no momento
              </p>
              <p className="text-muted-foreground/70 text-xs mt-1">
                Você está em dia com tudo!
              </p>
            </motion.div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
