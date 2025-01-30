import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { SidebarContent } from '@/components/ui/sidebar';
import { Database } from '@/integrations/supabase/types';
import { Search } from 'lucide-react';

type Equipment = Database['public']['Tables']['equipments']['Row'];

const Equipment = () => {
  const [patrimonio, setPatrimonio] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');

  const { data: equipments, isLoading } = useQuery({
    queryKey: ['equipments', patrimonio, tipoEquipamento],
    queryFn: async () => {
      let query = supabase
        .from('equipments')
        .select('*');

      if (patrimonio) {
        query = query.ilike('patrimonio', `%${patrimonio}%`);
      }
      if (tipoEquipamento) {
        query = query.ilike('tipo_equipamento', `%${tipoEquipamento}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Equipment[];
    },
  });

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <SidebarContent>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <Header />
          <div className="px-4 sm:px-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="patrimonio" className="text-sm font-medium">
                    Patrimônio
                  </label>
                  <div className="relative">
                    <Input
                      id="patrimonio"
                      value={patrimonio}
                      onChange={(e) => setPatrimonio(e.target.value)}
                      placeholder="Buscar por patrimônio..."
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="tipo" className="text-sm font-medium">
                    Tipo de Equipamento
                  </label>
                  <div className="relative">
                    <Input
                      id="tipo"
                      value={tipoEquipamento}
                      onChange={(e) => setTipoEquipamento(e.target.value)}
                      placeholder="Buscar por tipo..."
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card">
                <div className="p-4">
                  {isLoading ? (
                    <div className="text-center py-4">Carregando...</div>
                  ) : !equipments?.length ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum equipamento encontrado
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {equipments.map((equipment) => (
                        <div
                          key={equipment.id}
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
                        >
                          <div>
                            <h3 className="font-medium">
                              Patrimônio: {equipment.patrimonio}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Tipo: {equipment.tipo_equipamento}
                            </p>
                            {equipment.descricao && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {equipment.descricao}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {equipment.status && (
                              <span className="px-2 py-1 rounded-full bg-primary/10">
                                {equipment.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </div>
  );
};

export default Equipment;