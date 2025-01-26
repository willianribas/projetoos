import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, BarChart, Settings } from "lucide-react";

interface QuickActionsProps {
  setShowTable: (show: boolean) => void;
  showTable: boolean;
  setShowStats: (show: boolean) => void;
  showStats: boolean;
}

const QuickActions = ({ 
  setShowTable, 
  showTable, 
  setShowStats, 
  showStats 
}: QuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm">
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
            }}
          >
            Ordem de Serviços Salvas
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm">
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
            }}
          >
            Ver Estatísticas
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-400" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full hover:bg-primary/10">
            Ajustar Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;