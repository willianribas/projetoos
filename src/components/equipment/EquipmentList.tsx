import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface Equipment {
  id: number;
  numero_serie: string | null;
  identificador: string | null;
  tipo_equipamento: string;
  marca: string | null;
  modelo: string | null;
}

export const EquipmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const { data: equipments, isLoading } = useQuery({
    queryKey: ['equipments', searchTerm, filterField, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('equipments')
        .select('*');

      if (searchTerm) {
        if (filterField === 'all') {
          query = query.or(
            `numero_serie.ilike.%${searchTerm}%,` +
            `identificador.ilike.%${searchTerm}%,` +
            `tipo_equipamento.ilike.%${searchTerm}%,` +
            `marca.ilike.%${searchTerm}%,` +
            `modelo.ilike.%${searchTerm}%`
          );
        } else {
          query = query.ilike(filterField, `%${searchTerm}%`);
        }
      }

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      const { data, error } = await query
        .range(start, end)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Equipment[];
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ['equipments-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('equipments')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const totalPages = Math.ceil((totalCount || 0) / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar equipamentos..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={filterField} onValueChange={setFilterField}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os campos</SelectItem>
            <SelectItem value="numero_serie">Número de Série</SelectItem>
            <SelectItem value="identificador">Identificador</SelectItem>
            <SelectItem value="tipo_equipamento">Tipo de Equipamento</SelectItem>
            <SelectItem value="marca">Marca</SelectItem>
            <SelectItem value="modelo">Modelo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Carregando...</div>
      ) : !equipments?.length ? (
        <div className="text-center py-4 text-muted-foreground">
          Nenhum equipamento encontrado
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {equipments.map((equipment) => (
            <div
              key={equipment.id}
              className="p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
            >
              <div className="space-y-2">
                <h3 className="font-medium text-lg">
                  {equipment.tipo_equipamento}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {equipment.numero_serie && (
                    <p>
                      <span className="font-medium text-foreground">Nº Série:</span> {equipment.numero_serie}
                    </p>
                  )}
                  {equipment.identificador && (
                    <p>
                      <span className="font-medium text-foreground">ID:</span> {equipment.identificador}
                    </p>
                  )}
                  {equipment.marca && (
                    <p>
                      <span className="font-medium text-foreground">Marca:</span> {equipment.marca}
                    </p>
                  )}
                  {equipment.modelo && (
                    <p>
                      <span className="font-medium text-foreground">Modelo:</span> {equipment.modelo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};