
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyzerForm } from "@/components/analyzer/AnalyzerForm";
import { AnalyzerList } from "@/components/analyzer/AnalyzerList";
import { useAnalyzersQuery } from "@/hooks/queries/useAnalyzers";
import Navbar from "@/components/Navbar";

export default function Analyzers() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { data: analyzers, isLoading, isError } = useAnalyzersQuery();
  
  // Group analyzers by status
  const allAnalyzers = analyzers || [];
  const expiredAnalyzers = allAnalyzers.filter(a => a.status === 'vencido');
  const expiringAnalyzers = allAnalyzers.filter(a => a.status === 'vencera');
  const inCalibrationAnalyzers = allAnalyzers.filter(a => a.status === 'em_calibracao');
  const upToDateAnalyzers = allAnalyzers.filter(a => a.status === 'em_dia');

  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div className="pt-16">
        <div className="space-y-4 sm:space-y-6 p-4 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Analisadores</h1>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Analisador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Analisador</DialogTitle>
                </DialogHeader>
                <AnalyzerForm onSuccess={() => setAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Analisadores</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">
                    Todos ({allAnalyzers.length})
                  </TabsTrigger>
                  <TabsTrigger value="em_dia" className="text-green-600">
                    Em Dia ({upToDateAnalyzers.length})
                  </TabsTrigger>
                  <TabsTrigger value="vencera" className="text-orange-600">
                    Vencerá ({expiringAnalyzers.length})
                  </TabsTrigger>
                  <TabsTrigger value="vencido" className="text-red-600">
                    Vencido ({expiredAnalyzers.length})
                  </TabsTrigger>
                  <TabsTrigger value="em_calibracao" className="text-blue-600">
                    Em Calibração ({inCalibrationAnalyzers.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4">Carregando analisadores...</div>
                  ) : isError ? (
                    <div className="text-center py-4 text-destructive">Erro ao carregar analisadores</div>
                  ) : (
                    <AnalyzerList analyzers={allAnalyzers} />
                  )}
                </TabsContent>
                
                <TabsContent value="em_dia">
                  <AnalyzerList analyzers={upToDateAnalyzers} />
                </TabsContent>
                
                <TabsContent value="vencera">
                  <AnalyzerList analyzers={expiringAnalyzers} />
                </TabsContent>
                
                <TabsContent value="vencido">
                  <AnalyzerList analyzers={expiredAnalyzers} />
                </TabsContent>
                
                <TabsContent value="em_calibracao">
                  <AnalyzerList analyzers={inCalibrationAnalyzers} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
