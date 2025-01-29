import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, BarChart2, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { SidebarBase } from "@/components/ui/sidebar";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { useSidebar } from "./ui/sidebar-context";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isOpen } = useSidebar();

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
  ];

  const bottomMenuItems = [
    {
      title: "Configurações",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Sair",
      icon: LogOut,
      onClick: signOut,
    },
  ];

  return (
    <SidebarBase>
      <div className="p-4 flex items-center gap-3">
        <Menu className="h-6 w-6 text-foreground/60" />
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
            isActive={item.path ? location.pathname === item.path : false}
            isOpen={isOpen}
            onClick={item.onClick || (() => navigate(item.path!))}
          />
        ))}
      </div>
    </SidebarBase>
  );
};

export default Sidebar;