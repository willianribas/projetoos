
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Analyzer, getStatusColor, getStatusText } from "@/types/analyzer";
import { useDeleteAnalyzer } from "@/hooks/mutations/useDeleteAnalyzer";
import EditAnalyzerDialog from "./EditAnalyzerDialog";

interface AnalyzerListProps {
  analyzers: Analyzer[];
}

export function AnalyzerList({ analyzers }: AnalyzerListProps) {
  const { mutate: deleteAnalyzer } = useDeleteAnalyzer();
  const [analyzerToDelete, setAnalyzerToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (analyzerToDelete) {
      deleteAnalyzer(analyzerToDelete);
      setAnalyzerToDelete(null);
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NS/PT</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {analyzers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum analisador cadastrado
                </TableCell>
              </TableRow>
            ) : (
              analyzers.map((analyzer) => (
                <TableRow key={analyzer.id}>
                  <TableCell>{analyzer.serial_number}</TableCell>
                  <TableCell>{analyzer.name}</TableCell>
                  <TableCell>{analyzer.model}</TableCell>
                  <TableCell>
                    {format(new Date(analyzer.calibration_due_date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(analyzer.status)}>
                      {getStatusText(analyzer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditAnalyzerDialog analyzer={analyzer} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setAnalyzerToDelete(analyzer.id || null)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover analisador</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Tem certeza que deseja remover este analisador?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setAnalyzerToDelete(null)}>
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
