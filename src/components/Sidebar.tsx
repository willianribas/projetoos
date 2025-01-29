import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipboardList, BarChart2, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavItem } from "./sidebar/SidebarNavItem";

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
    <>
      <div
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-all duration-300",
          isOpen ? "w-64" : "w-16"
        )}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="h-full bg-background border-r border-border flex flex-col">
          <SidebarHeader isOpen={isOpen} />
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
          <div className="mt-auto">
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
        </div>
      </div>
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          isOpen ? "ml-64" : "ml-16"
        )}
      >
        <div className="p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Content will be rendered here */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;