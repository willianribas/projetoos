import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useCreateAnalyzer } from "@/hooks/mutations/useCreateAnalyzer";

const formSchema = z.object({
  serial_number: z.string().min(1, { message: "NS/PT é obrigatório" }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  model: z.string().min(1, { message: "Modelo é obrigatório" }),
  calibration_due_date: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  in_calibration: z.boolean().default(false),
});

export type AnalyzerFormValues = z.infer<typeof formSchema>;

interface AnalyzerFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<AnalyzerFormValues>;
}

export function AnalyzerForm({ onSuccess, defaultValues }: AnalyzerFormProps) {
  const { mutate: createAnalyzer, isPending } = useCreateAnalyzer();
  
  const form = useForm<AnalyzerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      serial_number: "",
      name: "",
      model: "",
      in_calibration: false,
    },
  });

  const onSubmit = (values: AnalyzerFormValues) => {
    createAnalyzer(values, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serial_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NS/PT</FormLabel>
                <FormControl>
                  <Input placeholder="Número de série ou patrimônio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do analisador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Modelo do analisador" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="calibration_due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Adicionando..." : "Adicionar Analisador"}
        </Button>
      </form>
    </Form>
  );
}
