import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between animate-fade-in">
      <span className="text-sm">Tema</span>
      <Toggle
        pressed={theme === "dark"}
        onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
        aria-label="Toggle theme"
        className="bg-background hover:bg-background/90"
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-[#000000]" />
        )}
      </Toggle>
    </div>
  );
};