import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { useServiceOrders } from "./ServiceOrderProvider";
import { toast } from "@/hooks/use-toast";

interface ServiceOrderFormProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: any) => void;
  statusOptions: Array<{
    value: string;
    label: string;
    color: string;
  }>;
}

const ServiceOrderForm = ({ form, isOpen, setIsOpen, onSubmit, statusOptions }: ServiceOrderFormProps) => {
  const { serviceOrders } = useServiceOrders();
  const currentYear = new Date().getFullYear();
  const yearSuffix = currentYear.toString().slice(-2);
  const [selectedYear, setSelectedYear] = useState(yearSuffix);

  const years = Array.from({ length: 12 }, (_, i) => (24 + i).toString());

  const handleSubmit = async (data: any) => {
    const formattedOSNumber = `${selectedYear}.${data.numeroos.padStart(2, '0')}`;
    
    // Check for duplicate OS numbers
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
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8">
      <Card className="border-muted bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Nova Ordem de Serviço
            </span>
          </CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0 hover:bg-primary/10">
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
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
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
  );
};

export default ServiceOrderForm;
