import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const flipCardVariants = cva(
  "relative w-full perspective-1000",
  {
    variants: {
      size: {
        default: "h-64",
        sm: "h-48",
        lg: "h-80",
        xl: "h-96",
        auto: "h-auto",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface FlipCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flipCardVariants> {
  front: React.ReactNode;
  back: React.ReactNode;
  flipOnHover?: boolean;
  flipped?: boolean;
  onFlip?: (isFlipped: boolean) => void;
  flipDuration?: number;
  perspective?: number;
  flipDirection?: "horizontal" | "vertical";
  frontClassName?: string;
  backClassName?: string;
  baseCardClassName?: string;
}

export const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  ({
    className,
    size,
    front,
    back,
    flipOnHover = false,
    flipped: controlledFlipped,
    onFlip,
    flipDuration = 0.6,
    perspective = 1000,
    flipDirection = "horizontal",
    frontClassName,
    backClassName,
    baseCardClassName,
    ...props
  }, ref) => {
    const [isFlipped, setIsFlipped] = React.useState(controlledFlipped || false);
    
    React.useEffect(() => {
      if (controlledFlipped !== undefined) {
        setIsFlipped(controlledFlipped);
      }
    }, [controlledFlipped]);
    
    const handleFlip = () => {
      if (controlledFlipped === undefined) {
        setIsFlipped(prev => !prev);
      }
      onFlip?.(!isFlipped);
    };

    // Set transform based on flip direction
    const frontTransform = flipDirection === "horizontal" 
      ? isFlipped ? "rotateY(180deg)" : "rotateY(0)"
      : isFlipped ? "rotateX(180deg)" : "rotateX(0)";
      
    const backTransform = flipDirection === "horizontal"
      ? isFlipped ? "rotateY(0)" : "rotateY(180deg)"
      : isFlipped ? "rotateX(0)" : "rotateX(180deg)";
    
    return (
      <div
        ref={ref}
        className={cn(
          flipCardVariants({ size }),
          className,
          "block"
        )}
        style={{ perspective: `${perspective}px` }}
        onMouseEnter={flipOnHover ? () => handleFlip() : undefined}
        onMouseLeave={flipOnHover ? () => handleFlip() : undefined}
        onClick={!flipOnHover ? () => handleFlip() : undefined}
        {...props}
      >
        <div 
          className={cn(
            "relative w-full h-full transition-all preserve-3d",
            flipOnHover ? "cursor-default" : "cursor-pointer",
            baseCardClassName
          )} 
          style={{ 
            transformStyle: "preserve-3d",
            transition: `transform ${flipDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275)` 
          }}
        >
          {/* Front side */}
          <motion.div
            className={cn(
              "absolute inset-0 w-full h-full backface-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
              frontClassName
            )}
            style={{ 
              backfaceVisibility: "hidden",
              transform: frontTransform,
              zIndex: isFlipped ? 0 : 1,
              transition: `transform ${flipDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275)` 
            }}
          >
            {front}
          </motion.div>
          
          {/* Back side */}
          <motion.div
            className={cn(
              "absolute inset-0 w-full h-full backface-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
              backClassName
            )}
            style={{ 
              backfaceVisibility: "hidden",
              transform: backTransform,
              zIndex: isFlipped ? 1 : 0,
              transition: `transform ${flipDuration}s cubic-bezier(0.175, 0.885, 0.32, 1.275)` 
            }}
          >
            {back}
          </motion.div>
        </div>
      </div>
    );
  }
);

FlipCard.displayName = "FlipCard";

export const FlipCardFront = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("p-6 flex flex-col h-full w-full", className)}
    {...props}
  />
);

FlipCardFront.displayName = "FlipCardFront";

export const FlipCardBack = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("p-6 flex flex-col h-full w-full", className)}
    {...props}
  />
);

FlipCardBack.displayName = "FlipCardBack";

export const FlipCardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

FlipCardTitle.displayName = "FlipCardTitle";

export const FlipCardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

FlipCardDescription.displayName = "FlipCardDescription";

export const FlipCardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1", className)} {...props} />
);

FlipCardContent.displayName = "FlipCardContent";

export const FlipCardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center mt-auto pt-4", className)}
    {...props}
  />
);

FlipCardFooter.displayName = "FlipCardFooter"; 