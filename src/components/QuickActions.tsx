import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Wrench, Settings } from "lucide-react";

interface QuickActionsProps {
  setShowTable: (show: boolean) => void;
  showTable: boolean;
}

const QuickActions = ({ setShowTable, showTable }: QuickActionsProps) => {
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
            onClick={() => setShowTable(!showTable)}
          >
            Ordem de Serviços Salvas
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-400" />
            Serviços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full hover:bg-primary/10">
            Gerenciar Serviços
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