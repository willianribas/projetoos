import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ClipboardList, 
  Settings, 
  Wrench,
  Search,
  ChevronDown,
  ChevronUp
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [isOpen, setIsOpen] = useState(true);

  const statusOptions = [
    { value: "ADE", label: "ADE - Aguardando Disponibilidade", color: "text-[#221F26]" },
    { value: "AVT", label: "AVT - Aguardando vinda técnica", color: "text-[#F97316]" },
    { value: "EXT", label: "EXT - Serviço Externo", color: "text-[#9b87f5]" },
    { value: "A.M", label: "A.M - Aquisição de Material", color: "text-[#ea384c]" },
    { value: "INST", label: "INST - Instalação", color: "text-muted-foreground" },
    { value: "M.S", label: "M.S - Material Solicitado", color: "text-[#33C3F0]" },
    { value: "OSP", label: "OSP - Ordem de Serviço Pronta", color: "text-[#22c55e]" },
    { value: "E.E", label: "E.E - Em Execução", color: "text-[#F97316]" }
  ];

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "text-muted-foreground";
  };

  const onSubmit = (data: any) => {
    setServiceOrders([...serviceOrders, data]);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Sistema OS
        </h1>
        <p className="text-muted-foreground">
          Sistema de Gerenciamento de Ordens de Serviço
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-2">
        <Input 
          placeholder="Buscar OS, patrimônio ou equipamento..." 
          className="max-w-xl bg-card/50 border-muted"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button className="bg-primary hover:bg-primary/90">
          <Search className="mr-2" />
          Buscar
        </Button>
      </div>

      {/* Nova OS Form */}
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="mb-8"
      >
        <Card className="border-muted bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-400" />
              Nova Ordem de Serviço
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
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
                            <Input placeholder="Digite o número da OS" className="bg-background/50" {...field} />
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
                            <Input placeholder="Digite o número do patrimônio" className="bg-background/50" {...field} />
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
                            <Input placeholder="Digite o equipamento" className="bg-background/50" {...field} />
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
                              <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem 
                                  key={status.value} 
                                  value={status.value}
                                  className={status.color}
                                >
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
                            className="min-h-[100px] bg-background/50"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Salvar OS
                  </Button>
                </form>
              </Form>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Quick Actions Grid */}
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
              onClick={() => setShowTable(!showTable)}
            >
              Ordem de Serviços Salvas
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-muted bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-purple-400" />
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full hover:bg-primary/10">
              Gerenciar Serviços
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
          <CardContent>
            <Button variant="outline" className="w-full hover:bg-primary/10">
              Ajustar Sistema
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Table of Service Orders */}
      {showTable && (
        <Card className="mt-8 border-muted bg-card/50 backdrop-blur-sm">
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
                    <TableCell className={getStatusColor(order.status)}>
                      {order.status}
                    </TableCell>
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
