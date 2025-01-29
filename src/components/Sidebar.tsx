import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, BarChart2, Settings, LogOut, Menu } from "lucide-react";
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
      title: "Estatísticas",
      icon: BarChart2,
      path: "/statistics",
    },
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings",
    },
  ];

  const bottomMenuItems = [
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
      <div className="p-4 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="p-0"
        >
          <Menu className="h-6 w-6 text-foreground/60" />
        </Button>
        {isOpen && (
          <span className="text-foreground font-semibold text-lg animate-fade-in transition-all duration-300">
            Daily.Flow
          </span>
        )}
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
            isActive={false}
            isOpen={isOpen}
            onClick={item.onClick || (() => {})}
          />
        ))}
      </div>
    </SidebarBase>
  );
};

export default Sidebar;