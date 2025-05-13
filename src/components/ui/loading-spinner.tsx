import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "relative flex items-center justify-center",
  {
    variants: {
      size: {
        default: "h-10 w-10",
        sm: "h-6 w-6",
        lg: "h-16 w-16",
        xl: "h-24 w-24",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        destructive: "text-destructive",
        muted: "text-muted-foreground",
        accent: "text-accent",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string;
  textPlacement?: "bottom" | "right";
  textClassName?: string;
  type?: "spinner" | "dots" | "pulse" | "bounce" | "progress" | "gradient";
  progressValue?: number;
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ 
    className, 
    size, 
    variant, 
    text,
    textPlacement = "bottom",
    textClassName,
    type = "spinner",
    progressValue = 0,
    ...props 
  }, ref) => {
    const spinTransition = {
      repeat: Infinity,
      ease: "linear",
      duration: 1.5,
    };
    
    const pulseTransition = {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 0.8,
    };
    
    const bounceTransition = {
      y: {
        duration: 0.4,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeOut",
      },
    };
    
    const dotsTransition = {
      repeat: Infinity,
      repeatType: "loop" as const,
      duration: 1.8,
    };
    
    const renderSpinner = () => {
      switch (type) {
        case "spinner":
          return (
            <motion.div
              className={cn(
                "h-full w-full rounded-full border-4 border-t-current border-r-current border-b-transparent border-l-transparent",
              )}
              animate={{ rotate: 360 }}
              transition={spinTransition}
            />
          );
          
        case "dots":
          return (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn("h-2 w-2 rounded-full bg-current")}
                  initial={{ scale: 0.8, opacity: 0.4 }}
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    ...dotsTransition,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          );
          
        case "pulse":
          return (
            <motion.div
              className={cn("h-full w-full rounded-full bg-current")}
              initial={{ opacity: 0.6, scale: 0.8 }}
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.8, 1, 0.8] }}
              transition={pulseTransition}
            />
          );
          
        case "bounce":
          return (
            <div className="flex gap-2 items-end">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full bg-current",
                    i === 0 && "h-3 w-3",
                    i === 2 && "h-3 w-3"
                  )}
                  animate={{ y: ["0%", "-50%", "0%"] }}
                  transition={{
                    ...bounceTransition.y,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          );
          
        case "progress":
          return (
            <div className="w-full h-2 bg-current/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-current"
                initial={{ width: "0%" }}
                animate={{ 
                  width: progressValue ? `${progressValue}%` : "100%" 
                }}
                transition={
                  progressValue 
                  ? { duration: 0.5, ease: "easeOut" }
                  : { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }
              />
            </div>
          );
          
        case "gradient":
          return (
            <div className="relative h-full w-full rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent -translate-x-full"
                animate={{ translateX: ["0%", "200%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="absolute inset-0 rounded-full border-2 border-current opacity-20" />
            </div>
          );
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          textPlacement === "bottom" ? "flex-col items-center gap-2" : "flex-row items-center gap-3",
          className
        )}
        {...props}
      >
        <div className={spinnerVariants({ size, variant })}>
          {renderSpinner()}
        </div>
        
        {text && (
          <motion.p
            className={cn(
              "text-sm font-medium text-center",
              variant === "default" && "text-primary",
              variant === "secondary" && "text-secondary",
              variant === "destructive" && "text-destructive",
              variant === "muted" && "text-muted-foreground",
              variant === "accent" && "text-accent",
              variant === "white" && "text-white",
              textClassName
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner"; 