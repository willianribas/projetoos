import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ClipboardList, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu,
  Clock 
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { SidebarBase } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { useSidebar } from "./ui/sidebar-context";
import { Button } from "./ui/button";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();

  const menuItems = [
    {
      title: "Ordem de Serviços",
      icon: ClipboardList,
      path: "/",
    },
    {
      title: "Monitor ADE",
      icon: Clock,
      path: "/ade-monitor",
    },
    {
      title: "Estatísticas",
      icon: BarChart2,
      path: "/statistics",
    },
  ];

  const bottomMenuItems = [
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings",
      onClick: () => navigate("/settings"),
    },
    {
      title: "Sair",
      icon: LogOut,
      onClick: signOut,
    },
  ];

  return (
    <SidebarBase
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="p-4 flex items-center gap-3 overflow-hidden">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="p-0 shrink-0"
        >
          <Menu className="h-6 w-6 text-foreground/60" />
        </Button>
        <span 
          className={cn(
            "text-foreground font-semibold text-lg transition-all duration-300 opacity-0",
            isOpen && "opacity-100"
          )}
        >
          Daily.Flow
        </span>
      </div>
      <nav className="flex-1 pt-4">
        {menuItems.map((item) => (
          <SidebarNavItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            isActive={location.pathname === item.path}
            isOpen={isOpen}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>
      <div className="mt-auto mb-4">
        {bottomMenuItems.map((item) => (
          <SidebarNavItem
            key={item.title}
            icon={item.icon}
            title={item.title}
            isActive={location.pathname === item.path}
            isOpen={isOpen}
            onClick={item.onClick}
          />
        ))}
      </div>
    </SidebarBase>
  );
};

export default Sidebar;