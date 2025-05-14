
import { toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/toast";

// Re-export the useToast hook from shadcn/ui
export const useToast = useShadcnToast;

// Create a simplified toast function that leverages Sonner for better toast display
export const toast = {
  // Default success toast
  success: (message: string) => {
    sonnerToast.success(message);
  },
  
  // Default error toast
  error: (message: string) => {
    sonnerToast.error(message);
  },
  
  // Custom toast that leverages the shadcn/ui toast options
  custom: (options: Parameters<typeof useShadcnToast>['0']['toast'][0]) => {
    const { toast } = useShadcnToast();
    toast(options);
  }
};
