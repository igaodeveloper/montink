import * as React from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Clock, Sparkles, PercentCircle, BadgePercent, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const promoOfferVariants = cva(
  "group relative flex w-full overflow-hidden rounded-lg shadow-md transition-all",
  {
    variants: {
      variant: {
        default: "bg-background border",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        discount: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
        special: "bg-gradient-to-r from-blue-500 to-purple-600 text-white",
        seasonal: "bg-gradient-to-r from-green-500 to-emerald-700 text-white",
        countdown: "bg-black text-white border border-yellow-400",
        minimal: "bg-background border border-dashed border-primary/50",
      },
      size: {
        default: "p-4",
        sm: "p-3 text-sm",
        lg: "p-6",
        banner: "p-4 sm:p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PromoOfferProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof promoOfferVariants> {
  title: string;
  description?: string;
  code?: string;
  discountValue?: string;
  endDate?: Date;
  showTimer?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  copyCodeEnabled?: boolean;
  codeLabel?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const PromoOffer = React.forwardRef<HTMLDivElement, PromoOfferProps>(
  ({
    className,
    variant,
    size,
    title,
    description,
    code,
    discountValue,
    endDate,
    showTimer = false,
    onClose,
    showCloseButton = true,
    showBadge = false,
    badgeText = "Limited Offer",
    copyCodeEnabled = true,
    codeLabel = "Use code:",
    ctaText,
    onCtaClick,
    ...props
  }, ref) => {
    const [timeLeft, setTimeLeft] = React.useState<{ days: number; hours: number; minutes: number; seconds: number }>({ 
      days: 0, hours: 0, minutes: 0, seconds: 0 
    });
    const [copied, setCopied] = React.useState(false);
    const controls = useAnimation();
    const shimmerControls = useAnimation();

    // Handle countdown timer
    React.useEffect(() => {
      if (endDate && showTimer) {
        const timer = setInterval(() => {
          const now = new Date();
          const difference = endDate.getTime() - now.getTime();
          
          if (difference <= 0) {
            clearInterval(timer);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            onClose?.();
            return;
          }
          
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }, [endDate, showTimer, onClose]);

    // Attention-grabbing animation sequence
    React.useEffect(() => {
      const sequence = async () => {
        await controls.start({ scale: 1.02 });
        await controls.start({ scale: 1 });
      };
      
      const shimmerAnimation = async () => {
        await shimmerControls.start({
          x: "100%",
          transition: { repeat: Infinity, duration: 2, ease: "linear" }
        });
      };
      
      shimmerAnimation();
      
      const interval = setInterval(() => {
        sequence();
      }, 10000);
      
      return () => clearInterval(interval);
    }, [controls, shimmerControls]);

    // Copy code to clipboard
    const copyToClipboard = () => {
      if (code) {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    // Get icon based on variant
    const getIcon = () => {
      switch(variant) {
        case "discount":
          return <PercentCircle className="h-6 w-6" />;
        case "special":
          return <Sparkles className="h-6 w-6" />;
        case "countdown":
          return <Clock className="h-6 w-6" />;
        case "seasonal":
          return <BadgePercent className="h-6 w-6" />;
        default:
          return <Tag className="h-6 w-6" />;
      }
    };

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          className={cn(promoOfferVariants({ variant, size }), className)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            ...controls
          }}
          exit={{ opacity: 0, y: -20 }}
          {...props}
        >
          {/* Badge */}
          {showBadge && (
            <motion.div 
              className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold py-1 px-2 rounded-bl-md rounded-tr-md shadow-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {badgeText}
            </motion.div>
          )}
          
          {/* Close button */}
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-current opacity-70 hover:opacity-100 transition-opacity z-10"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}
          
          <div className="flex items-start gap-4 w-full">
            {/* Icon */}
            <motion.div 
              className="flex-shrink-0 mt-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {getIcon()}
            </motion.div>
            
            <div className="flex-1 space-y-2">
              {/* Title */}
              <motion.div 
                className="font-bold text-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {discountValue && (
                  <span className="font-extrabold mr-2">{discountValue}</span>
                )}
                {title}
              </motion.div>
              
              {/* Description */}
              {description && (
                <motion.div 
                  className="text-sm opacity-90"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {description}
                </motion.div>
              )}
              
              {/* Timer */}
              {showTimer && endDate && (
                <motion.div 
                  className="flex flex-wrap gap-2 mt-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Ends in:</span>
                  </div>
                  <div className="flex gap-2 text-sm font-medium">
                    {timeLeft.days > 0 && (
                      <div className="flex items-center">
                        <span className="bg-black/20 px-2 py-1 rounded">{timeLeft.days}d</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="bg-black/20 px-2 py-1 rounded">{timeLeft.hours.toString().padStart(2, '0')}h</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-black/20 px-2 py-1 rounded">{timeLeft.minutes.toString().padStart(2, '0')}m</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-black/20 px-2 py-1 rounded">{timeLeft.seconds.toString().padStart(2, '0')}s</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Promo Code */}
              {code && (
                <motion.div 
                  className="flex flex-wrap items-center gap-2 mt-3"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-sm">{codeLabel}</span>
                  
                  <div className="relative overflow-hidden">
                    <motion.div
                      className="relative font-mono font-bold bg-black/10 px-3 py-1 rounded-md cursor-pointer"
                      onClick={copyCodeEnabled ? copyToClipboard : undefined}
                      whileHover={copyCodeEnabled ? { scale: 1.05 } : undefined}
                      whileTap={copyCodeEnabled ? { scale: 0.98 } : undefined}
                    >
                      {code}
                      {copied && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center bg-green-500 text-white text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Copied!
                        </motion.div>
                      )}
                      
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{ x: "-100%" }}
                        animate={shimmerControls}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* CTA Button */}
              {ctaText && (
                <motion.button
                  className="mt-4 bg-black/20 hover:bg-black/30 px-4 py-2 rounded-md font-medium text-sm transition-colors"
                  onClick={onCtaClick}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {ctaText}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
);

PromoOffer.displayName = "PromoOffer"; 