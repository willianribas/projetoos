import React from "react";
import { Boxes } from "lucide-react";

const Header = () => {
  return (
    <div className="mb-8 p-6 bg-card/50 backdrop-blur-sm border border-muted rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <Boxes className="h-8 w-8 text-blue-400" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Sistema OS
        </h1>
      </div>
      <p className="text-muted-foreground text-lg">
        Sistema de Gerenciamento de Ordens de Serviço
      </p>
    </div>
  );
};

export default Header;