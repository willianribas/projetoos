
import React, { useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">Tema</span>
      <div className="flex items-center gap-2">
        <span className="text-sm">{theme === "dark" ? "Escuro" : "Claro"}</span>
        <Switch
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          aria-label="Toggle theme"
        />
        {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </div>
    </div>
  );
};
