import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, ClipboardList, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div
      className="fixed left-0 top-0 h-full z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={cn(
          "h-full bg-card/50 backdrop-blur-sm border-r border-border/50 transition-all duration-300 flex flex-col",
          isOpen ? "w-64" : "w-16"
        )}
      >
        <div className="p-4">
          <Menu className="h-6 w-6 text-foreground/60" />
        </div>
        <nav className="flex-1 pt-4">
          {menuItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center px-4 py-3 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors",
                location.pathname === item.path && "text-foreground bg-foreground/5"
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span className="ml-4">{item.title}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;