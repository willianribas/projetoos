import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ClipboardList, BarChart2, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

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
    <div
      className="fixed left-0 top-0 h-full z-40"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={cn(
          "h-full bg-sidebar backdrop-blur-sm border-r border-sidebar-border transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4">
          <Menu className="h-6 w-6 text-sidebar-foreground/60" />
        </div>
        <nav className="flex-1 pt-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                location.pathname === item.path && "text-sidebar-foreground bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-4">{item.title}</span>}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          {bottomMenuItems.map((item) => (
            <button
              key={item.title}
              onClick={item.onClick || (() => navigate(item.path))}
              className={cn(
                "w-full flex items-center px-4 py-3 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                location.pathname === item.path && "text-sidebar-foreground bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-4">{item.title}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;