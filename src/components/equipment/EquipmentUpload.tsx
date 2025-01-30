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
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Equipment {
  numero_serie?: string;
  identificador?: string;
  tipo_equipamento: string;  // This is required
  marca?: string;
  modelo?: string;
}

interface ColumnMapping {
  [key: string]: {
    selected: boolean;
    mappedTo: keyof Equipment | '';
  };
}

export const EquipmentUpload = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startRow, setStartRow] = useState<number>(6);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});

  const equipmentFields: { value: keyof Equipment; label: string }[] = [
    { value: 'numero_serie', label: 'Número de Série' },
    { value: 'identificador', label: 'Identificador' },
    { value: 'tipo_equipamento', label: 'Tipo de Equipamento' },
    { value: 'marca', label: 'Marca' },
    { value: 'modelo', label: 'Modelo' },
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Adjust the range to start from the specified row
      const range = utils.decode_range(worksheet['!ref'] || 'A1');
      range.s.r = startRow - 1; // Adjust for 0-based index
      worksheet['!ref'] = utils.encode_range(range);
      
      const jsonData = utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        const columns = Object.keys(jsonData[0]);
        setAvailableColumns(columns);
        
        // Initialize column mapping
        const initialMapping: ColumnMapping = {};
        columns.forEach(col => {
          initialMapping[col] = {
            selected: false,
            mappedTo: '',
          };
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

  const handleImport = async () => {
    try {
      const mappedData = previewData.map(row => {
        const equipment: Partial<Equipment> = {};
        
        Object.entries(columnMapping).forEach(([excelColumn, mapping]) => {
          if (mapping.selected && mapping.mappedTo && row[excelColumn] !== undefined) {
            equipment[mapping.mappedTo] = String(row[excelColumn]);
          }
        });

        return equipment;
      }).filter((equipment): equipment is Equipment => {
        return typeof equipment.tipo_equipamento === 'string';
      });

      if (mappedData.length === 0) {
        throw new Error('Nenhum equipamento válido encontrado para importar');
      }

      const { error } = await supabase
        .from('equipments')
        .insert(mappedData);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${mappedData.length} equipamentos importados com sucesso.`,
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
            <DialogTitle>Mapeamento de Colunas</DialogTitle>
            <DialogDescription>
              Selecione as colunas da planilha e mapeie para os campos correspondentes
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <Input
                placeholder="Filtrar por palavra-chave..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full"
              />
              
              <div className="grid gap-4">
                {availableColumns.map((column) => (
                  <div key={column} className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={column}
                        checked={columnMapping[column]?.selected}
                        onCheckedChange={(checked) => 
                          setColumnMapping(prev => ({
                            ...prev,
                            [column]: {
                              ...prev[column],
                              selected: checked === true,
                            }
                          }))
                        }
                      />
                      <Label htmlFor={column}>{column}</Label>
                    </div>
                    
                    {columnMapping[column]?.selected && (
                      <Select
                        value={columnMapping[column]?.mappedTo}
                        onValueChange={(value) => 
                          setColumnMapping(prev => ({
                            ...prev,
                            [column]: {
                              ...prev[column],
                              mappedTo: value as keyof Equipment,
                            }
                          }))
                        }
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Mapear para..." />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentFields.map(field => (
                            <SelectItem key={field.value} value={field.value}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {previewData.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Preview dos dados:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {availableColumns.map(column => (
                          columnMapping[column]?.selected && (
                            <th key={column} className="text-left p-2 border">
                              {column} → {columnMapping[column]?.mappedTo}
                            </th>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 3).map((row, index) => (
                        <tr key={index}>
                          {availableColumns.map(column => (
                            columnMapping[column]?.selected && (
                              <td key={column} className="p-2 border">
                                {row[column] || '-'}
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