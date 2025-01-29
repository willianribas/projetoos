import React from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { ServiceOrderHistory } from "../ServiceOrderHistory";

interface HistoryToggleProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

export const HistoryToggle = ({ showHistory, setShowHistory }: HistoryToggleProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm">Histórico de Alterações</span>
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History className="mr-2 h-4 w-4" />
          {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
        </Button>
      </div>
      {showHistory && <ServiceOrderHistory />}
    </>
  );
};