import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Moroccan street & medina visual palette
        majorelle: {
          DEFAULT: "var(--majorelle)",
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          900: "#172554",
        },
        saffron: {
          DEFAULT: "var(--saffron)",
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        terracotta: {
          DEFAULT: "var(--terracotta)",
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#ea580c",
          600: "#c2410c",
          700: "#9a3412",
        },
        tealMedina: {
          DEFAULT: "var(--teal-medina)",
          50: "#f0fdfa",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          900: "#134e4a",
        },
        plaster: "var(--plaster)",
        surface: "var(--surface)",
        borderMuted: "var(--border-muted)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Cairo", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "Cairo", "Tahoma", "sans-serif"],
      },
      keyframes: {
        pulseBeat: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
        tileLock: {
          "0%": { transform: "translateY(-12px) scale(0.95)", opacity: "0.5" },
          "70%": { transform: "translateY(2px) scale(1.04)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
      animation: {
        "pulse-beat": "pulseBeat 0.3s ease-in-out",
        "tile-lock": "tileLock 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};

export default config;
