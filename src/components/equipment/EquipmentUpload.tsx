import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { read, utils } from 'xlsx';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Equipment {
  numero_serie?: string;
  identificador?: string;
  tipo_equipamento: string;  // This is required
  marca?: string;
  modelo?: string;
}

interface ColumnMapping {
  [key: string]: boolean;
}

export const EquipmentUpload = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    numero_serie: true,
    identificador: true,
    tipo_equipamento: true,
    marca: true,
    modelo: true,
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      
      // Get available columns from the first row
      if (jsonData.length > 0) {
        const columns = Object.keys(jsonData[0]);
        setAvailableColumns(columns);
        
        // Initialize column mapping based on available columns
        const initialMapping: ColumnMapping = {};
        columns.forEach(col => {
          initialMapping[col] = true;
        });
        setColumnMapping(initialMapping);
      }
      
      setPreviewData(jsonData);
      setIsOpen(true);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Erro",
        description: "Erro ao ler o arquivo. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  const filterDataByKeyword = (data: any[]) => {
    if (!searchKeyword) return data;
    
    return data.filter(row => 
      Object.entries(row).some(([key, value]) => 
        columnMapping[key] && 
        String(value).toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  };

  const handleImport = async () => {
    try {
      const filteredData = filterDataByKeyword(previewData);
      
      // Map and validate the filtered data
      const validEquipments = filteredData
        .map(row => {
          const equipment: Partial<Equipment> = {};
          
          Object.entries(columnMapping).forEach(([field, isSelected]) => {
            if (isSelected && row[field]) {
              equipment[field as keyof Equipment] = String(row[field]);
            }
          });

          return equipment;
        })
        .filter((equipment): equipment is Equipment => {
          return typeof equipment.tipo_equipamento === 'string';
        });

      if (validEquipments.length === 0) {
        throw new Error('Nenhum equipamento válido encontrado para importar');
      }

      const { error } = await supabase
        .from('equipments')
        .insert(validEquipments);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${validEquipments.length} equipamentos importados com sucesso.`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Erro",
        description: "Erro ao importar equipamentos. Verifique os dados.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Selecione as colunas e filtre os dados</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <Input
                placeholder="Filtrar por palavra-chave..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full"
              />
              
              <div className="grid grid-cols-2 gap-4">
                {availableColumns.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={columnMapping[field]}
                      disabled={field === 'tipo_equipamento'}
                      onCheckedChange={(checked) => 
                        setColumnMapping(prev => ({...prev, [field]: checked === true}))
                      }
                    />
                    <Label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                      {field === 'tipo_equipamento' && ' (Obrigatório)'}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {previewData.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Preview dos dados filtrados:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {availableColumns.map(field => (
                          columnMapping[field] && (
                            <th key={field} className="text-left p-2 border">
                              {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                            </th>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filterDataByKeyword(previewData).slice(0, 3).map((row, index) => (
                        <tr key={index}>
                          {availableColumns.map(field => (
                            columnMapping[field] && (
                              <td key={field} className="p-2 border">
                                {row[field] || '-'}
                              </td>
                            )
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImport}>
              Importar Dados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};