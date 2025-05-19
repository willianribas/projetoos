
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

interface StatisticsCardProps {
  setShowStats: (show: boolean) => void;
  showStats: boolean;
  setShowTable: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
}

export const StatisticsCard = ({
  setShowStats,
  showStats,
  setShowTable,
  setShowSettings,
}: StatisticsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all border-muted bg-card/50 backdrop-blur-sm animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant={showStats ? "secondary" : "outline"} 
          className={`w-full hover:bg-purple-500/10 group transition-all ${
            showStats ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : ''
          }`}
          onClick={() => {
            setShowStats(!showStats);
            setShowTable(false);
            setShowSettings(false);
          }}
        >
          <BarChart3 className={`h-4 w-4 mr-2 ${showStats ? "text-purple-500" : "text-muted-foreground group-hover:text-purple-500"}`} />
          {showStats ? "Ocultar Estatísticas" : "Ver Estatísticas"}
        </Button>
      </CardContent>
    </Card>
  );
};
