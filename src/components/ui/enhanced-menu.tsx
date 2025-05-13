import * as React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const menuVariants = cva("relative flex", {
  variants: {
    variant: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      minimal: "text-muted-foreground",
    },
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col items-start",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
  },
});

export interface MenuItemProps {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: MenuItemProps[];
  badge?: string;
  badgeVariant?:
    | "default"
    | "primary"
    | "secondary"
    | "outline"
    | "destructive";
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

export interface EnhancedMenuProps
  extends Omit<HTMLMotionProps<"div">, "ref">,
    VariantProps<typeof menuVariants> {
  items: MenuItemProps[];
  activeItemIndex?: number;
  hoverEffect?: "underline" | "highlight" | "scale" | "glow" | "none";
  showIcons?: boolean;
  iconPosition?: "left" | "right";
  itemClassName?: string;
  activeItemClassName?: string;
  itemGap?: "none" | "sm" | "md" | "lg";
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  collapseMobileMenu?: boolean;
}

export const EnhancedMenu = React.forwardRef<HTMLDivElement, EnhancedMenuProps>(
  (
    {
      className,
      variant,
      orientation,
      items,
      activeItemIndex,
      hoverEffect = "highlight",
      showIcons = true,
      iconPosition = "left",
      itemClassName,
      activeItemClassName,
      itemGap = "md",
      mobileBreakpoint = "md",
      collapseMobileMenu = true,
      ...props
    },
    ref,
  ) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [openSubMenus, setOpenSubMenus] = React.useState<number[]>([]);

    const toggleSubMenu = (index: number) => {
      setOpenSubMenus((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index],
      );
    };

    const menuItemGapClass = {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    }[itemGap];

    const mobileBreakpointClass = {
      sm: "sm:flex-row sm:items-center",
      md: "md:flex-row md:items-center",
      lg: "lg:flex-row lg:items-center",
      xl: "xl:flex-row xl:items-center",
      "2xl": "2xl:flex-row 2xl:items-center",
    }[mobileBreakpoint];

    const renderMenuItem = (
      item: MenuItemProps,
      index: number,
      isChild = false,
    ) => {
      const isActive = index === activeItemIndex || item.active;
      const isHovered = hoveredIndex === index;
      const hasSubMenu = item.children && item.children.length > 0;
      const isSubMenuOpen = openSubMenus.includes(index);

      const itemBaseClasses = cn(
        "relative flex items-center px-3 py-2 rounded-md transition-all",
        isActive ? "font-medium" : "font-normal",
        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        hasSubMenu && "cursor-pointer",
        itemClassName,
        isActive && activeItemClassName,
      );

      const hoverClasses = {
        underline: "group",
        highlight: "hover:bg-accent/50 hover:text-accent-foreground",
        scale: "hover:scale-105",
        glow: "hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]",
        none: "",
      }[hoverEffect];

      const IconComponent = hasSubMenu
        ? orientation === "horizontal"
          ? ChevronDown
          : ChevronRight
        : null;

      const content = (
        <div
          className={cn(itemBaseClasses, hoverClasses, "relative")}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={hasSubMenu ? () => toggleSubMenu(index) : item.onClick}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              iconPosition === "right" && "flex-row-reverse",
            )}
          >
            {showIcons && item.icon && (
              <motion.div
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: isActive || isHovered ? 1 : 0.8,
                  scale: isActive || isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                {item.icon}
              </motion.div>
            )}

            <span>{item.label}</span>

            {hasSubMenu && IconComponent && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isSubMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <IconComponent size={14} />
              </motion.div>
            )}

            {item.badge && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "px-1.5 py-0.5 text-xs rounded-full",
                  item.badgeVariant === "primary" &&
                    "bg-primary text-primary-foreground",
                  item.badgeVariant === "secondary" &&
                    "bg-secondary text-secondary-foreground",
                  item.badgeVariant === "destructive" &&
                    "bg-destructive text-destructive-foreground",
                  item.badgeVariant === "outline" && "border border-border",
                  !item.badgeVariant ||
                    (item.badgeVariant === "default" &&
                      "bg-muted text-muted-foreground"),
                )}
              >
                {item.badge}
              </motion.div>
            )}
          </div>

          {hoverEffect === "underline" && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-current"
              initial={{ width: 0 }}
              animate={{ width: isActive || isHovered ? "100%" : 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </div>
      );

      const wrappedContent =
        item.href && !item.disabled && !hasSubMenu ? (
          <Link href={item.href} className="no-underline">
            {content}
          </Link>
        ) : (
          content
        );

      return (
        <div key={index} className="relative">
          {wrappedContent}

          {hasSubMenu && (
            <AnimatePresence>
              {isSubMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "z-10 mt-1 space-y-1",
                    orientation === "horizontal" && !isChild
                      ? "absolute left-0 min-w-[12rem] rounded-md border bg-popover p-1 shadow-md"
                      : "ml-6",
                  )}
                >
                  {item.children?.map((child, childIndex) =>
                    renderMenuItem(
                      child,
                      `${index}-${childIndex}` as unknown as number,
                      true,
                    ),
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {collapseMobileMenu && (
          <div
            className={cn("mb-2", collapseMobileMenu ? "md:hidden" : "hidden")}
          >
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium bg-accent/20 rounded-md"
            >
              <span>Menu</span>
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>
        )}

        <motion.div
          className={cn(
            menuVariants({ variant, orientation }),
            orientation === "horizontal" ? menuItemGapClass : "space-y-1",
            collapseMobileMenu && "flex-col md:flex-row",
            collapseMobileMenu && mobileMenuOpen === false && "hidden md:flex",
            collapseMobileMenu && mobileMenuOpen && "flex",
            !collapseMobileMenu && "flex",
            mobileBreakpointClass,
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
          {...props}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {renderMenuItem(item, index)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  },
);

EnhancedMenu.displayName = "EnhancedMenu";
