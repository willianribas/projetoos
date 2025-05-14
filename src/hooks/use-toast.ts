
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  Toaster as ToasterComponent,
} from "@/components/ui/toaster";
import { useToast as useToastPrimitive } from "@radix-ui/react-toast";

type ToastOptions = Omit<ToastProps, "children">;
type ToastMessageProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
} & ToastOptions;

interface ToastState {
  toasts: ToastOptions[];
}

const toastState: ToastState = {
  toasts: []
};

export const useToast = () => {
  const toastPrimitive = useToastPrimitive();
  
  return {
    ...toastPrimitive,
    toast: (props: ToastMessageProps) => toast(props),
    toasts: toastState.toasts,
  };
};

const toast = ({ title, description, variant = "default", action, ...props }: ToastMessageProps) => {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Add toast to state
  toastState.toasts = [
    ...toastState.toasts, 
    { id, title, description, variant, action, ...props }
  ];
  
  // Return toast id for potential future reference
  return id;
};

export { toast };
