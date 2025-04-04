
import { Analyzer, AnalyzerWithStatus, AnalyzerStatus } from '@/types/analyzer';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import AnalyzerForm from './AnalyzerForm';

interface AnalyzerTableProps {
  analyzers: AnalyzerWithStatus[];
  onDeleteAnalyzer: (id: string) => void;
  onUpdateAnalyzer: (id: string, data: Partial<Analyzer>) => void;
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
}

const getStatusDisplay = (status: AnalyzerStatus) => {
  switch (status) {
    case 'in-day':
      return { label: 'Em Dia', color: 'bg-green-500 hover:bg-green-600' };
    case 'expiring-soon':
      return { label: 'Vencerá', color: 'bg-orange-500 hover:bg-orange-600' };
    case 'expired':
      return { label: 'Vencido', color: 'bg-red-500 hover:bg-red-600' };
    case 'in-calibration':
      return { label: 'Em Calibração', color: 'bg-blue-500 hover:bg-blue-600' };
    default:
      return { label: 'Desconhecido', color: 'bg-gray-500 hover:bg-gray-600' };
  }
};

const statusFilters = [
  { value: null, label: 'Todos', count: 0, color: 'bg-slate-700 hover:bg-slate-800' },
  { value: 'in-day', label: 'Em Dia', count: 0, color: 'bg-green-500 hover:bg-green-600' },
  { value: 'expiring-soon', label: 'Vencerá', count: 0, color: 'bg-orange-500 hover:bg-orange-600' },
  { value: 'expired', label: 'Vencido', count: 0, color: 'bg-red-500 hover:bg-red-600' },
  { value: 'in-calibration', label: 'Em Calibração', count: 0, color: 'bg-blue-500 hover:bg-blue-600' }
];

const AnalyzerTable = ({ 
  analyzers, 
  onDeleteAnalyzer, 
  onUpdateAnalyzer,
  selectedStatus,
  onStatusChange
}: AnalyzerTableProps) => {
  const [editingAnalyzer, setEditingAnalyzer] = useState<AnalyzerWithStatus | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditClick = (analyzer: AnalyzerWithStatus) => {
    setEditingAnalyzer(analyzer);
    setEditDialogOpen(true);
  };

  const handleSaveChanges = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    if (editingAnalyzer) {
      onUpdateAnalyzer(editingAnalyzer.id, data);
      setEditDialogOpen(false);
    }
  };

  // Count analyzers by status
  const statusCounts = analyzers.reduce((acc, analyzer) => {
    acc[analyzer.status] = (acc[analyzer.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Update status filters with counts
  const filtersWithCounts = statusFilters.map(filter => ({
    ...filter,
    count: filter.value === null 
      ? analyzers.length 
      : (statusCounts[filter.value as AnalyzerStatus] || 0)
  }));

  const filteredAnalyzers = selectedStatus 
    ? analyzers.filter(analyzer => analyzer.status === selectedStatus) 
    : analyzers;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gerenciamento de Analisadores</h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {filtersWithCounts.map((filter) => (
          <Button
            key={filter.label}
            variant="outline"
            className={`${
              selectedStatus === filter.value 
                ? filter.color + ' text-white' 
                : 'bg-transparent hover:bg-muted'
            }`}
            onClick={() => onStatusChange(filter.value)}
          >
            {filter.label} ({filter.count})
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NS/PT</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnalyzers.length > 0 ? (
              filteredAnalyzers.map((analyzer) => {
                const status = getStatusDisplay(analyzer.status);
                return (
                  <TableRow key={analyzer.id}>
                    <TableCell>{analyzer.serial_number}</TableCell>
                    <TableCell>{analyzer.name}</TableCell>
                    <TableCell>{analyzer.brand}</TableCell>
                    <TableCell>{analyzer.model}</TableCell>
                    <TableCell>
                      {format(new Date(analyzer.calibration_due_date), 'MMM yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(analyzer)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteAnalyzer(analyzer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum analisador encontrado com esses critérios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Analisador</DialogTitle>
          </DialogHeader>
          
          {editingAnalyzer && (
            <AnalyzerForm 
              onSubmit={handleSaveChanges} 
              inDialog={true} 
              initialData={editingAnalyzer}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyzerTable;
