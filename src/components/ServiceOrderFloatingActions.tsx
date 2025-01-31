import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, History } from "lucide-react";
import ServiceOrderCommentsDialog from "./comments/ServiceOrderCommentsDialog";
import { ServiceOrderHistory } from "./quick-actions/ServiceOrderHistory";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

interface ServiceOrderFloatingActionsProps {
  serviceOrderId: number;
}

export default function ServiceOrderFloatingActions({
  serviceOrderId,
}: ServiceOrderFloatingActionsProps) {
  const [showComments, setShowComments] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <Button
        variant="default"
        size="icon"
        className="rounded-full h-12 w-12 shadow-lg"
        onClick={() => setShowComments(true)}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      <Button
        variant="default"
        size="icon"
        className="rounded-full h-12 w-12 shadow-lg"
        onClick={() => setShowHistory(true)}
      >
        <History className="h-5 w-5" />
      </Button>

      <ServiceOrderCommentsDialog
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        serviceOrderId={serviceOrderId}
      />

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Histórico da Ordem de Serviço</DialogTitle>
          <ServiceOrderHistory serviceOrderId={serviceOrderId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}