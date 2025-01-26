import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface SettingsCardProps {
  setShowSettings: (show: boolean) => void;
  showSettings: boolean;
}

export const SettingsCard = ({
  setShowSettings,
  showSettings,
}: SettingsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-400" />
          Configurações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full hover:bg-primary/10"
          onClick={() => setShowSettings(!showSettings)}
        >
          Definir Configurações
        </Button>
      </CardContent>
    </Card>
  );
};