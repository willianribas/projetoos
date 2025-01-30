import React from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Upload } from "lucide-react";
import { read, utils } from 'xlsx';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Equipment {
  numero_serie?: string;
  identificador?: string;
  tipo_equipamento: string;
  marca?: string;
  modelo?: string;
}

export const EquipmentUpload = () => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json<Equipment>(worksheet);

      // Validate and filter data
      const validEquipments = jsonData.filter(item => item.tipo_equipamento);

      // Insert data into Supabase
      const { error } = await supabase
        .from('equipments')
        .insert(validEquipments);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${validEquipments.length} equipamentos importados com sucesso.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Erro",
        description: "Erro ao importar equipamentos. Verifique o formato do arquivo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
        id="excel-upload"
      />
      <label
        htmlFor="excel-upload"
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Importar Excel</span>
      </label>
    </div>
  );
};