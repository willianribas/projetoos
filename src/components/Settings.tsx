import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useTheme } from "next-themes";
import { Moon, Sun, FileDown } from "lucide-react";
import ServiceOrderPDF from "./ServiceOrderPDF";
import { ServiceOrder } from "@/types";
import { Toggle } from "@/components/ui/toggle";

interface SettingsProps {
  serviceOrders: ServiceOrder[];
}

const Settings = ({ serviceOrders }: SettingsProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
          <PDFDownloadLink
            document={<ServiceOrderPDF serviceOrders={serviceOrders} />}
            fileName="ordens-servico.pdf"
          >
            {({ loading }) => (
              <Button variant="outline" disabled={loading} type="button">
                <FileDown className="mr-2 h-4 w-4" />
                {loading ? "Gerando PDF..." : "Exportar PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </CardContent>
    </Card>
  );
};

export default Settings;