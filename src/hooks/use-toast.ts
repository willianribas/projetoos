
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import {
  toast as toastNotification,
  useToast as useToastHook,
} from "@/components/ui/toaster";

type ToastOptions = Omit<ToastProps, "children">;
type ToastMessageProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
} & ToastOptions;

const toast = ({ title, description, variant = "default", action, ...props }: ToastMessageProps) => {
  return toastNotification({
    title,
    description,
    variant,
    action,
    ...props,
  });
};

export { toast, useToastHook as useToast };
