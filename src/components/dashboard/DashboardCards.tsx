import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, AlertTriangle, Plus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardsProps {
  serviceOrders: any[];
  onCreateNew?: () => void;
}

export const DashboardCards = ({ serviceOrders, onCreateNew }: DashboardCardsProps) => {
  const totalOS = serviceOrders?.length || 0;
  const pendingOS = serviceOrders?.filter(so => so.status === 'pendente')?.length || 0;
  const inProgressOS = serviceOrders?.filter(so => so.status === 'em_andamento')?.length || 0;
  const completedOS = serviceOrders?.filter(so => so.status === 'concluida')?.length || 0;

  const cards = [
    {
      title: "Total de OS",
      value: totalOS,
      description: "Ordens cadastradas",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      change: "+12% este mês"
    },
    {
      title: "Pendentes",
      value: pendingOS,
      description: "Aguardando início",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      change: `${pendingOS > 0 ? 'Requer atenção' : 'Tudo em dia'}`
    },
    {
      title: "Em Andamento",
      value: inProgressOS,
      description: "Sendo executadas",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      change: "Monitorando"
    },
    {
      title: "Concluídas",
      value: completedOS,
      description: "Finalizadas",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      change: "+8% esta semana"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Action Card */}
      <Card className="modern-card border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bem-vindo ao Sistema de OS</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Gerencie suas ordens de serviço de forma eficiente
              </p>
            </div>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Nova OS
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="dashboard-grid">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="modern-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg", card.bgColor)}>
                  <Icon className={cn("w-4 h-4", card.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                <div className="flex items-center mt-3">
                  <Badge variant="outline" className="text-xs">
                    {card.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Performance Card */}
      <Card className="modern-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Performance do Sistema</CardTitle>
              <CardDescription>Métricas de eficiência das ordens de serviço</CardDescription>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4.2</div>
              <div className="text-sm text-muted-foreground">Dias Médios</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-muted-foreground">Satisfação</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};