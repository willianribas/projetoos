import React from "react";
import { Boxes, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationBell from "./NotificationBell";
import { useAuth } from "./AuthProvider";

const Header = () => {
  const { signOut } = useAuth();

  return (
    <div className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Boxes className="h-8 w-8 text-blue-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sistema OS
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <p className="text-foreground/90 text-lg font-medium">
        Sistema de Gerenciamento de Ordens de Serviço
      </p>
    </div>
  );
};

export default Header;