import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, BarChart, Settings, FileDown, Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import { BlobProvider } from "@react-pdf/renderer";
import ServiceOrderPDF from "./ServiceOrderPDF";
import { ServiceOrder } from "@/types";

interface QuickActionsProps {
  setShowTable: (show: boolean) => void;
  showTable: boolean;
  setShowStats: (show: boolean) => void;
  showStats: boolean;
  serviceOrders: ServiceOrder[];
}

const QuickActions = ({ 
  setShowTable, 
  showTable, 
  setShowStats, 
  showStats,
  serviceOrders
}: QuickActionsProps) => {
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = React.useState(false);

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
              setShowSettings(false);
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
              setShowSettings(false);
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
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full hover:bg-primary/10"
            onClick={() => setShowSettings(!showSettings)}
          >
            Definir Configurações
          </Button>
          
          {showSettings && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tema</span>
                <Toggle
                  pressed={theme === "dark"}
                  onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Toggle>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Exportar OS</span>
                <BlobProvider document={<ServiceOrderPDF serviceOrders={serviceOrders} />}>
                  {({ url, loading }) => (
                    <Button 
                      variant="outline" 
                      disabled={loading} 
                      type="button"
                      onClick={() => {
                        if (url) {
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = 'ordens-servico.pdf';
                          link.click();
                        }
                      }}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      {loading ? "Gerando PDF..." : "Exportar PDF"}
                    </Button>
                  )}
                </BlobProvider>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;