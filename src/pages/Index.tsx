import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Settings, 
  Users, 
  Search,
  DollarSign,
  FileText,
  ArrowRight,
  Wrench
} from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema OS</h1>
        <p className="text-gray-600">Sistema de Gerenciamento de Ordens de Serviço</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-2">
        <Input 
          placeholder="Buscar OS, cliente ou serviço..." 
          className="max-w-xl"
        />
        <Button>
          <Search className="mr-2" />
          Buscar
        </Button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              Nova OS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Criar Nova OS</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Gerenciar Clientes</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-500" />
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Gerenciar Serviços</Button>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Ver Relatórios</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Gerar Relatórios</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Ajustar Sistema</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;