
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";

// Animation variants for different toast types
const toastAnimationVariants = {
  default: {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.9 },
    transition: { type: "spring", stiffness: 350, damping: 25 }
  },
  destructive: {
    initial: { opacity: 0, x: 20, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 50, scale: 0.9 },
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  success: {
    initial: { opacity: 0, y: -20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.8 },
    transition: { type: "spring", stiffness: 380, damping: 20 }
  },
  warning: {
    initial: { opacity: 0, rotate: -3, scale: 0.95 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 3, scale: 0.95 },
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      <AnimatePresence>
        {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
          // Select animation variant based on toast type
          const animation = 
            variant === "destructive" 
              ? toastAnimationVariants.destructive 
              : variant === "success" 
                ? toastAnimationVariants.success 
                : variant === "warning"
                  ? toastAnimationVariants.warning
                  : toastAnimationVariants.default;

          // Group similar toasts - this is a placeholder to show how we would group
          // In a real implementation, this would be based on actual toast content
          const isGrouped = false; // Will be implemented in hook

          return (
            <motion.div
              key={id}
              initial={animation.initial}
              animate={animation.animate}
              exit={animation.exit}
              transition={animation.transition}
            >
              <Toast key={id} {...props} variant={variant} className={`group backdrop-blur-sm border-opacity-50 ${isGrouped ? 'mb-1' : 'mb-2'}`}>
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose />
              </Toast>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <ToastViewport className="md:max-w-[420px]" />
    </ToastProvider>
  );
}
