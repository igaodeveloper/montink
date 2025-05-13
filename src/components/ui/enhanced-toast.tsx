import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-md transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background",
        success:
          "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 group-hover:bg-green-100 dark:group-hover:bg-green-900",
        error:
          "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 group-hover:bg-red-100 dark:group-hover:bg-red-900",
        warning:
          "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900",
        info:
          "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 group-hover:bg-blue-100 dark:group-hover:bg-blue-900",
        modern:
          "border-none bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl",
        glass:
          "border border-white/20 bg-white/10 backdrop-blur-lg shadow-lg group-hover:bg-white/20 dark:border-black/20 dark:bg-black/10 dark:group-hover:bg-black/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  closeButton?: boolean;
  autoClose?: boolean;
  duration?: number;
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({
    className,
    variant,
    title,
    description,
    action,
    icon,
    closeButton = true,
    autoClose = true,
    duration = 5000,
    onClose,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);
    
    React.useEffect(() => {
      if (autoClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onClose?.();
          }, 300);
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [autoClose, duration, onClose]);
    
    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    };
    
    let iconComponent = icon;
    if (!icon && variant) {
      switch (variant) {
        case "success":
          iconComponent = <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
          break;
        case "error":
          iconComponent = <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
          break;
        case "warning":
          iconComponent = <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
          break;
        case "info":
          iconComponent = <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
          break;
        case "modern":
        case "glass":
          iconComponent = <Info className="h-5 w-5 text-white" />;
          break;
      }
    }
    
    const progressBarVariant = (variant === "default" || !variant) 
      ? "bg-primary" 
      : variant === "success"
      ? "bg-green-600 dark:bg-green-400"
      : variant === "error"
      ? "bg-red-600 dark:bg-red-400"
      : variant === "warning"
      ? "bg-yellow-600 dark:bg-yellow-400"
      : variant === "info"
      ? "bg-blue-600 dark:bg-blue-400"
      : variant === "modern"
      ? "bg-white"
      : "bg-white dark:bg-white";
    
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            className={cn(toastVariants({ variant }), "relative", className)}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            {...props}
          >
            <div className="flex items-start gap-3 w-full">
              {iconComponent && (
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {iconComponent}
                  </motion.div>
                </div>
              )}
              
              <div className="flex-1 space-y-1">
                {title && (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="font-medium"
                  >
                    {title}
                  </motion.div>
                )}
                {description && (
                  <motion.div 
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm opacity-90"
                  >
                    {description}
                  </motion.div>
                )}
              </div>
              
              {action && <div className="shrink-0">{action}</div>}
              
              {closeButton && (
                <button
                  className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:text-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              )}
            </div>
            
            {autoClose && (
              <motion.div 
                className={cn("absolute bottom-0 left-0 h-1", progressBarVariant)}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

Toast.displayName = "EnhancedToast";

export { Toast }; 