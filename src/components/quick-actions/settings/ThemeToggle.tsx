import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === 'dark') {
      setTheme('blue');
    } else if (theme === 'blue') {
      setTheme('dark');
    } else {
      setTheme('dark');
    }
  };

  return (
    <div className="flex items-center justify-between animate-fade-in">
      <span className="text-sm">Tema</span>
      <Toggle
        pressed={theme !== 'light'}
        onPressedChange={handleThemeChange}
        aria-label="Toggle theme"
        className="bg-background hover:bg-background/90"
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-foreground" />
        ) : (
          <Sun className="h-4 w-4 text-foreground" />
        )}
      </Toggle>
    </div>
  );
};