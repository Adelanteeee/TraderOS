import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0B0D",
        surface: {
          DEFAULT: "#14161A",
          elevated: "#1C1F24",
          hover: "#20232A"
        },
        border: {
          DEFAULT: "#242730",
          soft: "#1B1E24"
        },
        text: {
          primary: "#F0F1F3",
          secondary: "#9BA0AA",
          muted: "#5F6470"
        },
        accent: {
          DEFAULT: "#4C7EFF",
          soft: "rgba(76,126,255,0.14)",
          hover: "#6B95FF"
        },
        bull: {
          DEFAULT: "#3FB950",
          soft: "rgba(63,185,80,0.14)"
        },
        bear: {
          DEFAULT: "#E5484D",
          soft: "rgba(229,72,77,0.14)"
        },
        gold: {
          DEFAULT: "#E8A33D",
          soft: "rgba(232,163,61,0.14)"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"]
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px"
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)"
      }
    }
  },
  plugins: []
} satisfies Config;
