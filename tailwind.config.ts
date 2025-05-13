import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(1.2)", opacity: "0" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scale-up-down": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "fade-in-out": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-top": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "progress-linear": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "bounce-horizontal": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
        "jump": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "10%": { transform: "translateY(-10px) scale(1.1)" },
          "30%": { transform: "translateY(5px) scale(1)" },
          "50%": { transform: "translateY(-3px) scale(1)" },
          "70%": { transform: "translateY(2px) scale(1)" },
          "90%": { transform: "translateY(-1px) scale(1)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "ripple": "ripple 1s cubic-bezier(0, 0.2, 0.8, 1) forwards",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "scale-up-down": "scale-up-down 2s ease-in-out infinite",
        "fade-in-out": "fade-in-out 2s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-in-top": "slide-in-top 0.5s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.5s ease-out",
        "progress-linear": "progress-linear 2s ease-in-out",
        "bounce-horizontal": "bounce-horizontal 1s ease-in-out infinite",
        "jump": "jump 1s ease-in-out",
        "wiggle": "wiggle 1s ease-in-out",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
        "inner-glow": "inset 0 0 10px rgba(255, 255, 255, 0.5)",
        "inner-glow-dark": "inset 0 0 10px rgba(0, 0, 0, 0.2)",
        "3d-light": "2px 2px 0px rgba(0, 0, 0, 0.1)",
        "3d-dark": "3px 3px 0px rgba(0, 0, 0, 0.2)",
        "3d-primary": "3px 3px 0px hsl(var(--primary))",
        "soft-md": "0 4px 20px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 10px 30px rgba(0, 0, 0, 0.1)",
        "glow-primary": "0 0 20px rgba(var(--primary-rgb), 0.5)",
        "glow-secondary": "0 0 20px rgba(var(--secondary-rgb), 0.5)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "100%",
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--primary))",
              "&:hover": {
                color: "hsl(var(--primary) / 0.8)",
              },
            },
            h1: {
              color: "hsl(var(--foreground))",
              fontFamily: "DM Sans, system-ui, sans-serif",
            },
            h2: {
              color: "hsl(var(--foreground))",
              fontFamily: "DM Sans, system-ui, sans-serif",
            },
            h3: {
              color: "hsl(var(--foreground))",
              fontFamily: "DM Sans, system-ui, sans-serif",
            },
            h4: {
              color: "hsl(var(--foreground))",
              fontFamily: "DM Sans, system-ui, sans-serif",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
