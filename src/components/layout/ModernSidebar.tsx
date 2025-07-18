import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  Users,
  Wrench,
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ModernSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
  },
  {
    title: "Ordens de Serviço",
    href: "/",
    icon: FileText,
    description: "Gerenciar OS"
  },
  {
    title: "Estatísticas",
    href: "/statistics",
    icon: BarChart3,
    description: "Relatórios e métricas"
  },
  {
    title: "Analisadores",
    href: "/analyzers",
    icon: Wrench,
    description: "Equipamentos de análise"
  },
  {
    title: "Monitoramento ADE",
    href: "/ade-monitor",
    icon: Bell,
    description: "Monitor ADE"
  }
];

const bottomItems = [
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    description: "Configurar sistema"
  }
];

export const ModernSidebar = ({ isOpen, onToggle }: ModernSidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-sidebar-background border-r border-sidebar-border z-50 transition-all duration-300 ease-in-out",
        isOpen ? "w-72" : "w-16",
        "lg:translate-x-0",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className={cn(
              "flex items-center gap-3 transition-opacity duration-200",
              !isOpen && "lg:opacity-0"
            )}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              {isOpen && (
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground">Daily.Flow</h1>
                  <p className="text-xs text-sidebar-foreground/60">Sistema de OS</p>
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-sidebar-foreground/70"
                  )} />
                  
                  {isOpen && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className={cn(
                        "text-xs truncate",
                        isActive ? "text-primary-foreground/80" : "text-sidebar-foreground/50"
                      )}>
                        {item.description}
                      </p>
                    </div>
                  )}
                  
                  {/* Tooltip para quando fechado */}
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-background border border-sidebar-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <p className="text-xs font-medium text-sidebar-foreground">{item.title}</p>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-sidebar-border space-y-2">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <span className="text-sm font-medium">{item.title}</span>}
                  
                  {!isOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-sidebar-background border border-sidebar-border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      <p className="text-xs font-medium text-sidebar-foreground">{item.title}</p>
                    </div>
                  )}
                </NavLink>
              );
            })}

            {/* User Profile */}
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg border border-sidebar-border/50",
              isOpen ? "bg-sidebar-accent/50" : "justify-center"
            )}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user?.user_metadata?.full_name || "Usuário"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors",
                !isOpen && "px-3"
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm">Sair</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};