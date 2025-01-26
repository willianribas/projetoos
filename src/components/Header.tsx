import React from "react";
import { Boxes } from "lucide-react";

const Header = () => {
  return (
    <div className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <Boxes className="h-8 w-8 text-blue-500" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sistema OS
        </h1>
      </div>
      <p className="text-foreground/90 text-lg font-medium">
        Sistema de Gerenciamento de Ordens de Serviço
      </p>
    </div>
  );
};

export default Header;