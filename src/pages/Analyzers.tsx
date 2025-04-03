
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnalyzerForm from '@/components/AnalyzerForm';
import AnalyzerTable from '@/components/AnalyzerTable';
import { useAnalyzers } from '@/hooks/useAnalyzers';
import { Analyzer } from '@/types/analyzer';
import { Button } from '@/components/ui/button';
import { ActivitySquare, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AnalyzersPage = () => {
  const { analyzers, loading, addAnalyzer, updateAnalyzer, deleteAnalyzer } = useAnalyzers();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleSubmit = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    addAnalyzer(data);
    setFormDialogOpen(false);
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Analisadores</h1>
            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ActivitySquare className="mr-2 h-4 w-4" /> 
                  <Plus className="h-4 w-4 mr-1" /> Analisador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Analisador</DialogTitle>
                </DialogHeader>
                <AnalyzerForm onSubmit={handleSubmit} />
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <AnalyzerTable 
              analyzers={analyzers} 
              onDeleteAnalyzer={deleteAnalyzer}
              onUpdateAnalyzer={updateAnalyzer}
              selectedStatus={selectedStatus}
              onStatusChange={handleStatusChange}
            />
          )}

          <div className="text-center text-sm text-foreground/60 py-4">
            &copy; {new Date().getFullYear()} Daily.Flow. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzersPage;
