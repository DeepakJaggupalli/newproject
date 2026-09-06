import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#09090b", // zinc-950
        foreground: "#fafafa", // zinc-50
        card: "#18181b", // zinc-900
        "card-foreground": "#fafafa",
        popover: "#18181b",
        "popover-foreground": "#fafafa",
        primary: "#fafafa",
        "primary-foreground": "#18181b",
        secondary: "#27272a", // zinc-800
        "secondary-foreground": "#fafafa",
        muted: "#27272a",
        "muted-foreground": "#a1a1aa", // zinc-400
        accent: "#27272a",
        "accent-foreground": "#fafafa",
        destructive: "#7f1d1d", // red-900
        "destructive-foreground": "#fca5a5", // red-300
        border: "#27272a",
        input: "#27272a",
        ring: "#d4d4d8", // zinc-300
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        card: "0 8px 30px rgba(0, 0, 0, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        "glowing-orb": "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)",
      },
      animation: {
        "modal-in": "modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "modal-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
