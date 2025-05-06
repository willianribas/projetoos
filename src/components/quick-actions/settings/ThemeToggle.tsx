
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">Tema</span>
      <div className="flex items-center gap-2">
        <Sun className="h-4 w-4 text-gray-600" />
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          aria-label="Toggle theme"
        />
        <Moon className="h-4 w-4 text-gray-600" />
      </div>
    </div>
  );
};
