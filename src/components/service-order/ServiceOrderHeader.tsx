import { Button } from "@/components/ui/button";
import { Maximize, Minimize } from "lucide-react";

interface ServiceOrderHeaderProps {
  showTable: boolean;
  setShowTable: (show: boolean) => void;
}

export const ServiceOrderHeader = ({ showTable, setShowTable }: ServiceOrderHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">Ordens de Serviço Registradas</h2>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowTable(!showTable)}
        className="animate-fade-in"
      >
        {showTable ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Maximize className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};