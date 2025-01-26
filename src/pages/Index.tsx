import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Settings, 
  Wrench,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ServiceOrder {
  numeroOS: string;
  patrimonio: string;
  equipamento: string;
  status: string;
  observacao: string;
}

const Index = () => {
  const form = useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [showTable, setShowTable] = useState(false);

  const statusOptions = [
    { value: "ADE", label: "ADE - Aguardando Disponibilidade" },
    { value: "AVT", label: "AVT - Aguardando vinda técnica" },
    { value: "EXT", label: "EXT - Serviço Externo" },
    { value: "A.M", label: "A.M - Aquisição de Material" },
    { value: "INST", label: "INST - Instalação" },
    { value: "M.S", label: "M.S - Material Solicitado" },
    { value: "OSP", label: "OSP - Ordem de Serviço Pronta" }
  ];

  const onSubmit = (data: any) => {
    setServiceOrders([...serviceOrders, data]);
    form.reset();
  };

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
          placeholder="Buscar OS, patrimônio ou equipamento..." 
          className="max-w-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button>
          <Search className="mr-2" />
          Buscar
        </Button>
      </div>

      {/* Nova OS Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            Nova Ordem de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numeroOS"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número OS</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número da OS" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patrimonio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patrimônio</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número do patrimônio" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equipamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o equipamento" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite as observações da OS"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Salvar OS
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-green-500" />
              Ordens de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setShowTable(!showTable)}>
              Ordem de Serviços Salvas
            </Button>
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

      {/* Table of Service Orders */}
      {showTable && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Ordens de Serviço Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número OS</TableHead>
                  <TableHead>Patrimônio</TableHead>
                  <TableHead>Equipamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.numeroOS}</TableCell>
                    <TableCell>{order.patrimonio}</TableCell>
                    <TableCell>{order.equipamento}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.observacao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;