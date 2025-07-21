
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AnalyzerForm from '@/components/AnalyzerForm';
import AnalyzerTable from '@/components/AnalyzerTable';
import { useAnalyzers } from '@/hooks/useAnalyzers';
import { Analyzer } from '@/types/analyzer';
import { Button } from '@/components/ui/button';
import { ActivitySquare, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BlobProvider } from '@react-pdf/renderer';
import AnalyzerReportPDF from '@/components/AnalyzerReportPDF';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AnalyzersPage = () => {
  const { analyzers, loading, addAnalyzer, updateAnalyzer, deleteAnalyzer } = useAnalyzers();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportStatus, setReportStatus] = useState<string | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleSubmit = (data: Omit<Analyzer, 'id' | 'created_at' | 'user_id'>) => {
    addAnalyzer(data);
    setIsDialogOpen(false);
  };

  const statusOptions = [
    { value: null, label: 'Todos' },
    { value: 'in-day', label: 'Em Dia' },
    { value: 'expiring-soon', label: 'Vencerá em breve' },
    { value: 'expired', label: 'Vencido' },
    { value: 'in-calibration', label: 'Em Calibração' },
  ];

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Analisadores</h1>
            <div className="flex gap-2">
              <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsReportDialogOpen(true)}
                >
                  <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
                </Button>
                <DialogContent className="sm:max-w-[500px] w-[95%]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      Gerar Relatório por Situação
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Selecione a situação</label>
                      <Select 
                        value={reportStatus || "null"}
                        onValueChange={(value) => setReportStatus(value === "null" ? null : value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a situação" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.label} value={option.value === null ? "null" : option.value || ""}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {reportStatus === null && "Relatório com todos os analisadores"}
                      {reportStatus === 'in-day' && "Relatório apenas com analisadores em dia"}
                      {reportStatus === 'expiring-soon' && "Relatório apenas com analisadores que vencerão em breve"}
                      {reportStatus === 'expired' && "Relatório apenas com analisadores vencidos"}
                      {reportStatus === 'in-calibration' && "Relatório apenas com analisadores em calibração"}
                    </div>
                    <BlobProvider document={<AnalyzerReportPDF analyzers={analyzers} selectedStatus={reportStatus} />}>
                      {({ url, loading }) => (
                        <Button 
                          type="button"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={loading}
                          onClick={() => {
                            if (url) {
                              // Create a link and trigger download
                              const link = document.createElement('a');
                              link.href = url;
                              const statusLabel = statusOptions.find(opt => opt.value === reportStatus)?.label || 'Todos';
                              link.download = `Relatorio_Analisadores_${statusLabel.replace(/\s+/g, '_')}.pdf`;
                              link.click();
                              setIsReportDialogOpen(false);
                            }
                          }}
                        >
                          {loading ? 'Gerando PDF...' : 'Download PDF'}
                        </Button>
                      )}
                    </BlobProvider>
                  </div>
                </DialogContent>
              </Dialog>

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
