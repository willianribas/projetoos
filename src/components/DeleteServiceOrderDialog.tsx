import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteServiceOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
}

const DeleteServiceOrderDialog = ({
  isOpen,
  setIsOpen,
  onConfirm,
}: DeleteServiceOrderDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi excluída com sucesso.",
        variant: "default",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error deleting service order:", error);
      toast({
        title: "Erro ao excluir ordem de serviço",
        description: error.message || "Não foi possível excluir a ordem de serviço.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta Ordem de Serviço? Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDial<AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteServiceOrderDialog;