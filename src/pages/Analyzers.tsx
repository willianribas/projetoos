
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnalyzerForm from '@/components/AnalyzerForm';
import AnalyzerTable from '@/components/AnalyzerTable';
import { useAnalyzers } from '@/hooks/useAnalyzers';
import { Analyzer } from '@/types/analyzer';
import { Button } from '@/components/ui/button';
import { ActivitySquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AnalyzersPage = () => {
  const { analyzers, loading, addAnalyzer, updateAnalyzer, deleteAnalyzer } = useAnalyzers();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleSubmit = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    addAnalyzer(data);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Analisadores</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => setIsDialogOpen(true)}
              >
                <ActivitySquare className="mr-2 h-4 w-4" /> Analisador
              </Button>
              <DialogContent className="sm:max-w-[800px] w-[95%] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    Adicionar Analisador
                  </DialogTitle>
                </DialogHeader>
                <AnalyzerForm onSubmit={handleSubmit} inDialog={true} />
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
