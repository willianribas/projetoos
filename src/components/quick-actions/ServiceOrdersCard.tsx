import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

interface ServiceOrdersCardProps {
  setShowTable: (show: boolean) => void;
  showTable: boolean;
  setShowStats: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
}

export const ServiceOrdersCard = ({
  setShowTable,
  showTable,
  setShowStats,
  setShowSettings,
}: ServiceOrdersCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-blue-400" />
          Ordens de Serviços
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary/10"
          onClick={() => {
            setShowTable(!showTable);
            setShowStats(false);
            setShowSettings(false);
          }}
        >
          Ordem de Serviços Salvas
        </Button>
      </CardContent>
    </Card>
  );
};