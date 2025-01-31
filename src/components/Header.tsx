import React from "react";
import { Boxes } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { UserProfile } from "./UserProfile";
import { motion } from "framer-motion";

const Header = () => {
  const text = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  const subtitle = "Sistema de Gerenciamento de Ordens de Serviço".split("");
  
  return (
    <div className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Boxes className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Daily.Flow
            </h1>
            <div className="flex flex-wrap">
              {subtitle.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.03,
                    repeat: Infinity,
                    repeatDelay: 5,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                  className="text-muted-foreground text-xs"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <UserProfile />
          <NotificationBell />
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {text.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.03,
              repeat: Infinity,
              repeatDelay: 5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="text-foreground/90 text-lg sm:text-xl font-medium tracking-wide"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default Header;