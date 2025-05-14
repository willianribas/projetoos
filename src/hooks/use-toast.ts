
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { Toaster as ToasterComponent } from "@/components/ui/toaster";

type ToastOptions = Omit<ToastProps, "children">;
type ToastMessageProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
} & ToastOptions;

interface ToastState {
  toasts: ToastMessageProps[];
}

// Create a local state to track toasts
const toastState: ToastState = {
  toasts: []
};

export const useToast = () => {
  return {
    toast: (props: ToastMessageProps) => toast(props),
    toasts: toastState.toasts,
    dismiss: (toastId?: string) => {
      if (toastId) {
        toastState.toasts = toastState.toasts.filter(t => t.id !== toastId);
      } else {
        toastState.toasts = [];
      }
    }
  };
};

const toast = ({ title, description, variant = "default", action, ...props }: ToastMessageProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Add toast to state
  const toast = { id, title, description, variant, action, ...props };
  
  // Update the toast state
  toastState.toasts = [...toastState.toasts, toast];
  
  // Return toast id for potential future reference
  return id;
};

export { toast };
