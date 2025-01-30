import React from "react";
import { Boxes } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import { motion } from "framer-motion";

const Header = () => {
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className="mb-12 p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
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
      <div className="flex flex-wrap">
        {text.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="text-foreground/90 text-sm sm:text-lg font-medium"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default Header;