import * as React from "react";
import { motion } from "framer-motion";
import { type LucideIcon, type LucideProps } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconVariants = cva(
  "relative inline-flex",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
      },
      variant: {
        default: "text-foreground",
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        muted: "text-muted-foreground",
        destructive: "text-destructive",
        success: "text-green-500 dark:text-green-400",
        warning: "text-yellow-500 dark:text-yellow-400",
        info: "text-blue-500 dark:text-blue-400",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

export interface AnimatedIconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  animation?: 
    | "pulse" 
    | "spin" 
    | "bounce" 
    | "shake" 
    | "ping" 
    | "wiggle" 
    | "float" 
    | "scale" 
    | "breathe"
    | "hover-rotate"
    | "hover-scale"
    | "hover-bounce"
    | "none";
  strokeWidth?: number;
  iconProps?: Omit<LucideProps, "size" | "className" | "strokeWidth">;
  animationDelay?: number;
  animationDuration?: number;
  hoverAnimation?: boolean;
  circleBackground?: boolean;
  circleBackgroundClassName?: string;
  badgeCount?: number;
  badgeClassName?: string;
}

export const AnimatedIcon = React.forwardRef<HTMLSpanElement, AnimatedIconProps>(
  ({
    className,
    size,
    variant,
    icon: Icon,
    animation = "none",
    strokeWidth = 2,
    iconProps,
    animationDelay = 0,
    animationDuration,
    hoverAnimation = false,
    circleBackground = false,
    circleBackgroundClassName,
    badgeCount,
    badgeClassName,
    ...props
  }, ref) => {
    // Basic animation variants
    const animationVariants = {
      pulse: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
        transition: {
          duration: animationDuration || 1.5,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
      spin: {
        rotate: 360,
        transition: {
          duration: animationDuration || 2,
          repeat: Infinity,
          ease: "linear",
          delay: animationDelay,
        },
      },
      bounce: {
        y: [0, -5, 0],
        transition: {
          duration: animationDuration || 1,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
      shake: {
        x: [0, -3, 3, -3, 0],
        transition: {
          duration: animationDuration || 0.5,
          repeat: Infinity,
          repeatType: "mirror",
          delay: animationDelay,
        },
      },
      ping: {
        scale: [1, 1.1],
        opacity: [1, 0],
        transition: {
          duration: animationDuration || 1,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
      wiggle: {
        rotate: [0, -10, 10, -10, 0],
        transition: {
          duration: animationDuration || 1,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
      float: {
        y: [0, -10, 0],
        transition: {
          duration: animationDuration || 3,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
      scale: {
        scale: [1, 1.2, 1],
        transition: {
          duration: animationDuration || 2,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
      breathe: {
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: animationDuration || 2.5,
          repeat: Infinity,
          delay: animationDelay,
        },
      },
    };

    // Hover animation variants
    const hoverVariants = {
      "hover-rotate": {
        rotate: 10,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      },
      "hover-scale": {
        scale: 1.2,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      },
      "hover-bounce": {
        y: -5,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      },
    };

    // Handle combined animations (hover and auto)
    const getAnimationProps = () => {
      // If no animation is set
      if (animation === "none") {
        // But we have hover animation
        if (hoverAnimation) {
          const hoverType = 
            animation.startsWith("hover-") 
              ? animation 
              : "hover-scale";
              
          return {
            whileHover: hoverVariants[hoverType as keyof typeof hoverVariants],
          };
        }
        return {};
      }
      
      // If we have a non-hover animation
      if (!animation.startsWith("hover-")) {
        return {
          animate: animationVariants[animation as keyof typeof animationVariants],
        };
      }
      
      // If we have a hover animation explicitly set
      return {
        whileHover: hoverVariants[animation as keyof typeof hoverVariants],
      };
    };

    const animationProps = getAnimationProps();
    
    return (
      <span
        ref={ref}
        className={cn(
          iconVariants({ size, variant }),
          className
        )}
        {...props}
      >
        {circleBackground && (
          <span 
            className={cn(
              "absolute inset-0 rounded-full bg-current opacity-10",
              circleBackgroundClassName,
            )}
          />
        )}
        
        <motion.span
          className="inline-flex"
          {...animationProps}
        >
          <Icon 
            strokeWidth={strokeWidth} 
            className="transition-colors" 
            {...iconProps}
          />
        </motion.span>
        
        {typeof badgeCount !== "undefined" && (
          <span
            className={cn(
              "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground",
              badgeClassName
            )}
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        )}
      </span>
    );
  }
);

AnimatedIcon.displayName = "AnimatedIcon";