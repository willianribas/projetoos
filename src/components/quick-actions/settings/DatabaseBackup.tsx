
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Database, Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";

export const DatabaseBackup = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.email === "williann.dev@gmail.com";

  const handleExportDatabase = async () => {
    try {
      // Users can only export their own service orders
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('user_id', user?.id)
        .is('deleted_at', null);

      if (error) throw error;

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup-ordens-servico-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Backup realizado com sucesso!",
        description: "Os dados foram exportados em formato JSON.",
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro ao exportar dados",
        description: "Não foi possível realizar o backup dos dados.",
        variant: "destructive",
      });
    }
  };

  const handleImportOwnBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContent = await file.text();
      let importedData;
      
      try {
        importedData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Formato de arquivo inválido. O arquivo deve ser um JSON válido.');
      }

      if (!Array.isArray(importedData)) {
        throw new Error('Formato de arquivo inválido. O conteúdo deve ser um array de ordens de serviço.');
      }

      // Validate structure of imported data
      if (importedData.length > 0) {
        const requiredFields = ['numeroos', 'patrimonio', 'equipamento', 'status'];
        const firstItem = importedData[0];
        const missingFields = requiredFields.filter(field => !Object.prototype.hasOwnProperty.call(firstItem, field));
        
        if (missingFields.length > 0) {
          throw new Error(`Formato de arquivo inválido. Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        }
      }

      // For regular users, update the data to have the current user's ID and remove existing IDs
      const filtered = importedData.map(item => ({
        ...item,
        user_id: user?.id, // Update user_id to current user
        id: undefined // Remove any existing IDs to create new records
      }));

      // Insert the data
      const { error: insertError } = await supabase
        .from('service_orders')
        .insert(filtered);

      if (insertError) throw insertError;

      await queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });

      toast({
        title: "Dados importados com sucesso!",
        description: `${filtered.length} ordens de serviço foram importadas para sua conta.`,
      });
    } catch (error: any) {
      console.error('Erro ao importar dados:', error);
      toast({
        title: "Erro ao importar dados",
        description: error.message || "Verifique se o arquivo está no formato correto.",
        variant: "destructive",
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdminImportDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isAdmin) return;

    try {
      const fileContent = await file.text();
      let importedData;
      
      try {
        importedData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error('Formato de arquivo inválido. O arquivo deve ser um JSON válido.');
      }

      if (!Array.isArray(importedData)) {
        throw new Error('Formato de arquivo inválido. O conteúdo deve ser um array de ordens de serviço.');
      }

      // Validate structure of imported data
      if (importedData.length > 0) {
        const requiredFields = ['numeroos', 'patrimonio', 'equipamento', 'status'];
        const firstItem = importedData[0];
        const missingFields = requiredFields.filter(field => !Object.prototype.hasOwnProperty.call(firstItem, field));
        
        if (missingFields.length > 0) {
          throw new Error(`Formato de arquivo inválido. Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        }
      }

      const { error: deleteError } = await supabase
        .from('service_orders')
        .delete()
        .neq('id', 0);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('service_orders')
        .insert(importedData.map(({ id, ...rest }) => rest));

      if (insertError) throw insertError;

      await queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });

      toast({
        title: "Dados importados com sucesso!",
        description: "O banco de dados foi atualizado com os dados do backup.",
      });
    } catch (error: any) {
      console.error('Erro ao importar dados:', error);
      toast({
        title: "Erro ao importar dados",
        description: error.message || "Verifique se o arquivo está no formato correto.",
        variant: "destructive",
      });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Backup do Banco</span>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleExportDatabase}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Minhas OS
          </Button>
          
          {/* Regular users can import their own OS */}
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={isAdmin ? handleAdminImportDatabase : handleImportOwnBackup}
              accept=".json"
              className="hidden"
            />
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isAdmin ? "Importar Backup (Administrador)" : "Importar Minhas OS"}
            </Button>
          </div>
        </div>
      </div>
      
      {isAdmin && (
        <div className="pl-6 text-xs text-muted-foreground">
          Como administrador, você pode realizar operações de backup completo do banco de dados.
          Ao importar um backup, todos os dados existentes serão substituídos.
        </div>
      )}
      
      {!isAdmin && (
        <div className="pl-6 text-xs text-muted-foreground">
          Você pode exportar suas ordens de serviço e importá-las novamente.
          Isso é útil para transferir suas OS entre contas ou fazer backup pessoal.
        </div>
      )}
    </div>
  );
};
