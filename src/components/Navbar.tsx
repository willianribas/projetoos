
import React, { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative h-12 transition-all duration-300 group",
        "hover:bg-[#FFDEE2] dark:hover:bg-[#FFDEE2]/10",
        isHovered ? "w-auto px-4" : "w-12"
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "h-5 w-5 transition-colors duration-300",
          isActive ? "text-primary" : "text-muted-foreground",
          "group-hover:text-[#ff8fa3] dark:group-hover:text-[#ff8fa3]"
        )} />
        <AnimatePresence>
          {isHovered && (
            <motion.span 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap overflow-hidden pl-6"
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}
    </Button>
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
        <div className="flex items-center space-x-2 ml-0">
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
