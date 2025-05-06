
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { useServiceOrders } from "./ServiceOrderProvider";
import { toast } from "@/hooks/use-toast";
import { Plus, PlusCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceOrderFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
}

const ServiceOrderForm = ({ form, onSubmit, statusOptions }: ServiceOrderFormProps) => {
  const { serviceOrders } = useServiceOrders();
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  const [selectedYear, setSelectedYear] = useState(yearSuffix);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const years = Array.from({ length: 12 }, (_, i) => (24 + i).toString());

  const handleAddStatus = () => {
    if (!selectedStatus) return;
    
    if (!selectedStatuses.includes(selectedStatus)) {
      const newStatuses = [...selectedStatuses, selectedStatus];
      setSelectedStatuses(newStatuses);
      
      // Update the primary status field in the form
      if (newStatuses.length === 1) {
        form.setValue("status", selectedStatus);
      }
    }
    
    setSelectedStatus("");
  };

  const handleRemoveStatus = (statusToRemove: string) => {
    const updatedStatuses = selectedStatuses.filter(status => status !== statusToRemove);
    setSelectedStatuses(updatedStatuses);
    
    // Update the primary status field if needed
    if (form.getValues("status") === statusToRemove) {
      form.setValue("status", updatedStatuses.length > 0 ? updatedStatuses[0] : "");
    }
  };

  const handlePrimaryStatusChange = (status: string) => {
    form.setValue("status", status);
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption?.color || "";
  };

  const handleSubmit = async (data: any) => {
    const formattedOSNumber = `${selectedYear}.${data.numeroos.padStart(2, '0')}`;
    
    const isDuplicate = serviceOrders.some(order => order.numeroos === formattedOSNumber);
    
    if (isDuplicate) {
      toast({
        title: "Erro ao criar OS",
        description: `Já existe uma OS com o número ${formattedOSNumber}`,
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...data,
      numeroos: formattedOSNumber,
      status_array: selectedStatuses.length > 0 ? selectedStatuses : [data.status],
    });
    setIsOpen(false);
    setSelectedStatuses([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Adicionar OS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Nova Ordem de Serviço
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <FormField
                control={form.control}
                name="numeroos"
                render={({ field }) => (
                  <FormItem className="md:col-span-4">
                    <FormLabel>Número OS</FormLabel>
                    <div className="flex gap-2">
                      <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              20{year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormControl>
                        <Input 
                          placeholder="Número"
                          className="bg-background/50"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patrimonio"
                render={({ field }) => (
                  <FormItem className="md:col-span-4">
                    <FormLabel>Patrimônio</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o número do patrimônio" className="bg-background/50" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="md:col-span-4">
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value || "normal"}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="normal" id="normal" />
                          <Label htmlFor="normal" className="text-green-500">
                            Normal
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="critical" id="critical" />
                          <Label htmlFor="critical" className="text-red-500">
                            Crítico
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="equipamento"
                render={({ field }) => (
                  <FormItem className="md:col-span-6">
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
                  <FormItem className="md:col-span-6">
                    <FormLabel>Status</FormLabel>
                    <div className="flex gap-2">
                      <Select 
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
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
                      <Button 
                        type="button" 
                        size="icon" 
                        variant="outline"
                        onClick={handleAddStatus}
                        disabled={!selectedStatus}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <input type="hidden" {...field} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Display selected statuses */}
            {selectedStatuses.length > 0 && (
              <div className="space-y-2">
                <label>Status selecionados:</label>
                <ScrollArea className="h-20 w-full rounded-md border p-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedStatuses.map((status) => (
                      <Badge 
                        key={status} 
                        variant="outline"
                        className={`${getStatusColor(status)} flex items-center gap-1`}
                      >
                        <button 
                          type="button"
                          className={`rounded-full p-0.5 ${
                            status === form.getValues("status") 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 hover:bg-gray-300'
                          } mr-1 h-4 w-4 text-[8px] flex items-center justify-center`}
                          onClick={() => handlePrimaryStatusChange(status)}
                          title={status === form.getValues("status") ? "Status principal" : "Definir como status principal"}
                        >
                          P
                        </button>
                        {status}
                        <button 
                          type="button" 
                          className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                          onClick={() => handleRemoveStatus(status)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <FormField
              control={form.control}
              name="observacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite as observações da OS"
                      className="min-h-[120px] bg-background/50"
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
      </DialogContent>
    </Dialog>
  );
};

export default ServiceOrderForm;
