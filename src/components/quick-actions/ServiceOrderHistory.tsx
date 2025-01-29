import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Clock, Plus, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface HistoryEntry {
  id: number;
  service_order_id: number;
  numeroos: string;
  patrimonio: string;
  equipamento: string;
  status: string;
  observacao: string | null;
  changed_at: string;
  action: string;
}

interface ServiceOrderHistoryProps {
  serviceOrderId: number;
}

export const ServiceOrderHistory = ({ serviceOrderId }: ServiceOrderHistoryProps) => {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["service_order_history", serviceOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_order_history")
        .select("*")
        .eq('service_order_id', serviceOrderId)
        .order("changed_at", { ascending: false });

      if (error) throw error;
      return data as HistoryEntry[];
    },
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "UPDATE":
        return <Pencil className="h-4 w-4 text-blue-500" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Carregando histórico...</div>;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-gray-400" />
          Histórico de Alterações - OS #{history[0]?.numeroos}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="mb-4 border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getActionIcon(entry.action)}
                  <span className="font-medium">
                    {entry.action === "CREATE" ? "Criação" : 
                     entry.action === "UPDATE" ? "Atualização" : 
                     "Exclusão"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {format(new Date(entry.changed_at), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p><strong>Patrimônio:</strong> {entry.patrimonio}</p>
                <p><strong>Equipamento:</strong> {entry.equipamento}</p>
                <p><strong>Status:</strong> {entry.status}</p>
                {entry.observacao && (
                  <p><strong>Observação:</strong> {entry.observacao}</p>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};