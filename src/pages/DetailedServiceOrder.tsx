import { useLocation } from "react-router-dom";
import { ServiceOrder } from "@/types";
import { ServiceOrderComments } from "@/components/comments/ServiceOrderComments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText } from "lucide-react";

import { CommentThread } from "@/components/comments/CommentThread";

const DetailedServiceOrder = () => {
  const location = useLocation();
  const serviceOrder = location.state?.serviceOrder as ServiceOrder;

  if (!serviceOrder) {
    return <div>Ordem de serviço não encontrada</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Ordem de Serviço #{serviceOrder.numeroos}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patrimônio</p>
              <p>{serviceOrder.patrimonio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Equipamento</p>
              <p>{serviceOrder.equipamento}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge>{serviceOrder.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Prioridade</p>
              <Badge variant={serviceOrder.priority === "critical" ? "destructive" : "default"}>
                {serviceOrder.priority === "critical" ? "Crítico" : "Normal"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="comments">
        <TabsList>
          <TabsTrigger value="details">
            <FileText className="h-4 w-4 mr-2" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Comentários
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Observação</p>
              <p>{serviceOrder.observacao || "Nenhuma observação registrada."}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardContent className="pt-6">
              <CommentThread serviceOrderId={serviceOrder.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedServiceOrder;
