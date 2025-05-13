import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "bg-primary text-primary-foreground hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow",
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
        outline3D: "border-2 border-primary bg-background hover:translate-y-[-2px] hover:shadow-md transition-transform",
        pulse: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        pill: "h-10 px-6 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showRipple?: boolean;
  pulseEffect?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, showRipple = false, pulseEffect = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const [rippleArray, setRippleArray] = React.useState<{ x: number; y: number; size: number; id: number }[]>([]);
    const rippleTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const addRipple = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!showRipple) return;
      
      const rippleContainer = event.currentTarget.getBoundingClientRect();
      const size = rippleContainer.width > rippleContainer.height 
        ? rippleContainer.width 
        : rippleContainer.height;
      const x = event.clientX - rippleContainer.left - size / 2;
      const y = event.clientY - rippleContainer.top - size / 2;
      const id = Date.now();

      setRippleArray((prevRipples) => [...prevRipples, { x, y, size, id }]);

      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }

      rippleTimeoutRef.current = setTimeout(() => {
        setRippleArray([]);
        rippleTimeoutRef.current = null;
      }, 1000);
    };

    const pulseVariants = {
      hover: {
        scale: 1.05,
        transition: {
          duration: 0.3,
          yoyo: Infinity,
        },
      },
    };

    if (asChild) {
      return (
        <Slot 
          className={cn(buttonVariants({ variant, size, className }))} 
          ref={ref} 
          {...props} 
        />
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
        ref={ref}
        onClick={addRipple}
        whileHover={variant === "pulse" || pulseEffect ? "hover" : undefined}
        variants={pulseVariants}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {props.children}
        
        {showRipple && rippleArray.length > 0 &&
          rippleArray.map(({ x, y, size, id }) => (
            <motion.span
              key={id}
              style={{
                position: "absolute",
                top: `${y}px`,
                left: `${x}px`,
                width: `${size}px`,
                height: `${size}px`,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                pointerEvents: "none",
              }}
              initial={{ opacity: 0.6, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          ))}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 