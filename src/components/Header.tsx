import React from "react";
import { Boxes } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";

const Header = () => {
  return (
    <div className="mb-8 p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Boxes className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Daily.Flow
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <UserProfile />
          <NotificationBell />
        </div>
      </div>
      <p className="text-foreground/90 text-sm sm:text-lg font-medium">
        Sistema de Gerenciamento de Ordens de Serviço
      </p>
    </div>
  );
};

export default Header;