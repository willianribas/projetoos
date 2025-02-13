
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart2, 
  Settings, 
  LogOut, 
  Bell,
  FileText 
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const NavItem = ({
  icon: Icon,
  title,
  isActive,
  onClick,
}: {
  icon: any;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant="ghost"
            size="icon"
            className={cn(
              "relative h-12 w-12 transition-all duration-300 hover:bg-accent",
              isActive && "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
            )}
          >
            <Icon className={cn(
              "h-5 w-5 transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground",
            )} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    {
      title: "Início",
      icon: Home,
      path: "/",
    },
    {
      title: "OS Detalhada",
      icon: FileText,
      path: "/detailed-service-order",
    },
    {
      title: "AM/ADE Detalhada",
      icon: Bell,
      path: "/ade-monitor",
    },
    {
      title: "Estatísticas",
      icon: BarChart2,
      path: "/statistics",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <NavItem
            icon={Settings}
            title="Configurações"
            isActive={location.pathname === "/settings"}
            onClick={() => navigate("/settings")}
          />
          <NavItem
            icon={LogOut}
            title="Sair"
            isActive={false}
            onClick={signOut}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
