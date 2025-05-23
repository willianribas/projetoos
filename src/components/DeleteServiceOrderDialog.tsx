
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
  serviceOrderId?: number;
}

const DeleteServiceOrderDialog = ({
  isOpen,
  setIsOpen,
  onConfirm,
  serviceOrderId,
}: DeleteServiceOrderDialogProps) => {
  const { toast } = useToast();

  const handleConfirm = async () => {
    try {
      console.log("Confirming deletion of service order ID:", serviceOrderId);
      await onConfirm();
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
        </AlertDialogHeader>
        <AlertDialogFooter>
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
