import { useLocation, useNavigate } from "react-router-dom";
import { ServiceOrder } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentThread } from "@/components/comments/CommentThread";

const DetailedServiceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceOrder = location.state?.serviceOrder as ServiceOrder;

  if (!serviceOrder) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p>Ordem de serviço não encontrada</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          Ordem de Serviço #{serviceOrder.numeroos}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Detalhes da OS</CardTitle>
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

      <Tabs defaultValue="details">
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