import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const equipmentSchema = z.object({
  numero_serie: z.string().optional(),
  identificador: z.string().optional(),
  tipo_equipamento: z.string().min(1, "Tipo de equipamento é obrigatório"),
  marca: z.string().optional(),
  modelo: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EquipmentForm = ({ open, onOpenChange }: EquipmentFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      numero_serie: '',
      identificador: '',
      tipo_equipamento: '',
      marca: '',
      modelo: '',
    },
  });

  const onSubmit = async (data: EquipmentFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar equipamentos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('equipments')
        .insert([{ ...data, user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Equipamento adicionado com sucesso.",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar equipamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Equipamento</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo_equipamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Equipamento*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numero_serie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Série</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="identificador"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identificador</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};