
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground shadow-md backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-background/80 text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10",
        warning: "border-yellow-500/50 text-yellow-600 dark:text-yellow-500 dark:border-yellow-500/50 [&>svg]:text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
        success: "border-green-500/50 text-green-600 dark:text-green-500 dark:border-green-500/50 [&>svg]:text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/20",
        info: "border-blue-500/50 text-blue-600 dark:text-blue-500 dark:border-blue-500/50 [&>svg]:text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  autoDismiss?: number; // Time in ms after which to auto-dismiss
}

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(({ className, variant, autoDismiss, ...props }, ref) => {
  const [visible, setVisible] = React.useState(true);
  
  React.useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, autoDismiss);
      
      return () => clearTimeout(timer);
    }
  }, [autoDismiss]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      />
    </motion.div>
  );
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
