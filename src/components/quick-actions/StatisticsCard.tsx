import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

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
    <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5 text-purple-400" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary/10"
          onClick={() => {
            setShowStats(!showStats);
            setShowTable(false);
            setShowSettings(false);
          }}
        >
          Ver Estatísticas
        </Button>
      </CardContent>
    </Card>
  );
};