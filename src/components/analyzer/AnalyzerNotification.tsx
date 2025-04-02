
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Analyzer } from "@/types/analyzer";

interface AnalyzerNotificationProps {
  analyzers: Analyzer[];
}

export function AnalyzerNotification({ analyzers }: AnalyzerNotificationProps) {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  
  // Count analyzers that need attention (expired or expiring soon)
  const expiredCount = analyzers.filter(a => a.status === 'vencido').length;
  const expiringCount = analyzers.filter(a => a.status === 'vencera').length;
  
  // Determine if we should show notification
  useEffect(() => {
    if (expiredCount > 0 || expiringCount > 0) {
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [expiredCount, expiringCount]);
  
  if (!showNotification) return null;
  
  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-900/20">
      <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500" />
      <AlertTitle className="text-orange-800 dark:text-orange-500 flex items-center gap-2">
        Atenção aos analisadores
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-400 mt-2">
        <div className="space-y-2">
          {expiredCount > 0 && (
            <p>
              <span className="font-semibold">{expiredCount}</span> analisador{expiredCount > 1 ? 'es' : ''} com calibração vencida.
            </p>
          )}
          {expiringCount > 0 && (
            <p>
              <span className="font-semibold">{expiringCount}</span> analisador{expiringCount > 1 ? 'es' : ''} com calibração a vencer nos próximos 60 dias.
            </p>
          )}
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-orange-700 border-orange-300 hover:bg-orange-100 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-800/30"
              onClick={() => navigate('/analisadores')}
            >
              Ver Analisadores
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
