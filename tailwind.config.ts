import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease-out forwards",
        "pulse-subtle": "pulseSubtle 1.8s ease-in-out infinite",
        "verdict-in": "verdictIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "mic-ring": "micRing 1.2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        verdictIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        micRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.4)" },
          "70%": { boxShadow: "0 0 0 8px rgba(239,68,68,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
