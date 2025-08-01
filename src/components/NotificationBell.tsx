
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Share2, Clock, Trash2, X, MoreVertical, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSharedServiceOrders } from "@/hooks/useSharedServiceOrders";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
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

export default function NotificationBell() {
  const { 
    notifications, 
    hasUnread, 
    markAllAsRead, 
    markAsRead, 
    deleteNotification, 
    clearAllNotifications,
    unreadCount 
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { receivedOrders } = useSharedServiceOrders();
  
  const pendingShares = receivedOrders.length;
  const hasSharedOrders = pendingShares > 0;
  const totalNotifications = unreadCount + pendingShares;

  const renderNotificationType = (type: string) => {
    switch (type) {
      case "ADE_8_DAYS":
        return "Alerta ADE - 8+ dias";
      case "shared_service_order":
        return "Ordem de serviço compartilhada";
      case "ade_reminder":
        return "Lembrete ADE";
      case "status_update":
        return "Status atualizado";
      case "deadline_reminder":
        return "Prazo se aproximando";
      default:
        return "Notificação";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ADE_8_DAYS":
        return Clock;
      case "shared_service_order":
        return Share2;
      case "ade_reminder":
        return Clock;
      case "status_update":
        return Bell;
      case "deadline_reminder":
        return Clock;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ADE_8_DAYS":
        return "from-red-500/10 to-orange-500/10 border-red-200/30";
      case "shared_service_order":
        return "from-blue-500/10 to-indigo-500/10 border-blue-200/30";
      case "ade_reminder":
        return "from-yellow-500/10 to-amber-500/10 border-yellow-200/30";
      case "status_update":
        return "from-green-500/10 to-emerald-500/10 border-green-200/30";
      case "deadline_reminder":
        return "from-purple-500/10 to-pink-500/10 border-purple-200/30";
      default:
        return "from-gray-500/10 to-slate-500/10 border-gray-200/30";
    }
  };

  const getNotificationDescription = (notification: any) => {
    switch (notification.notification_type) {
      case "ADE_8_DAYS":
        return "Uma ordem de serviço está há mais de 8 dias em ADE.";
      case "shared_service_order":
        return "Uma nova ordem de serviço foi compartilhada com você.";
      case "ade_reminder":
        return "Lembrete sobre ordem em status ADE.";
      case "status_update":
        return "O status de uma ordem de serviço foi atualizado.";
      case "deadline_reminder":
        return "Uma ordem de serviço está próxima do prazo.";
      default:
        return "Você tem uma nova notificação.";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="ghost" size="icon" className="relative group hover:bg-primary/10 transition-all duration-200">
            <motion.div
              animate={hasUnread || hasSharedOrders ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Bell className="h-[1.2rem] w-[1.2rem] group-hover:text-primary transition-colors" />
            </motion.div>
            <AnimatePresence>
              {totalNotifications > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-red-500 to-pink-500 ring-2 ring-background shadow-lg"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-white text-xs font-bold leading-none"
                  >
                    {totalNotifications > 99 ? "99+" : totalNotifications}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-0 border-0 shadow-2xl bg-gradient-to-br from-background via-background to-muted/10" align="end">
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-border/50">
            <div>
              <h4 className="font-bold text-xl bg-gradient-to-r from-primary via-primary to-purple-500 bg-clip-text text-transparent">
                Notificações
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {totalNotifications > 0 
                  ? `${totalNotifications} ${totalNotifications === 1 ? 'notificação pendente' : 'notificações pendentes'}` 
                  : "Você está em dia com tudo!"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="hover:bg-primary/10 text-xs flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" />
                  Marcar como lidas
                </Button>
              )}
              
              {notifications.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={markAllAsRead}>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Marcar todas como lidas
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Limpar todas
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Limpar todas as notificações?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação irá remover permanentemente todas as suas notificações. Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={clearAllNotifications}>
                            Limpar todas
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Shared Orders Alert */}
          {hasSharedOrders && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 mb-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-200/30 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-full">
                    <Share2 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                      Ordens compartilhadas pendentes
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-300">
                      {pendingShares} aguardando aprovação
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-orange-100 dark:bg-orange-900/30 border-orange-300 text-orange-700 dark:text-orange-200">
                  {pendingShares}
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Notifications List */}
          {notifications.length > 0 ? (
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-3">
                {notifications.map((notification, index) => {
                  const IconComponent = getNotificationIcon(notification.notification_type);
                  const colorClass = getNotificationColor(notification.notification_type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                        !notification.is_read
                          ? `bg-gradient-to-r ${colorClass} shadow-sm`
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                        setOpen(false);
                        if (notification.notification_type === "shared_service_order") {
                          navigate("/");
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-full ${
                          !notification.is_read ? "bg-primary/20" : "bg-muted"
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            !notification.is_read ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-sm truncate">
                              {renderNotificationType(notification.notification_type)}
                            </h5>
                            <div className="flex items-center gap-2">
                              {!notification.is_read && (
                                <motion.div
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-purple-500"
                                />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-destructive/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                            {getNotificationDescription(notification)}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm")}
                            </p>
                            {notification.service_order_id && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                OS #{notification.service_order_id}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Bell className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h5 className="font-semibold text-base mb-2">
                Nenhuma notificação
              </h5>
              <p className="text-muted-foreground/70 text-sm max-w-xs mx-auto">
                Quando você receber notificações, elas aparecerão aqui. Você está em dia com tudo! 🎉
              </p>
            </motion.div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
