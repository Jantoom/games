
import type { Config } from "tailwindcss";

export default {
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
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        game: {
          highlight: "#E3F2FD", // Lighter blue for related cells
          active: "#90CAF9",    // Medium blue for selected cell
          conflict: "#FFE0E0",  // Soft red for conflicts
          pencil: "#64B5F6",    // Blue for pencil marks
          gridline: "#1E88E5",  // Darker blue for 3x3 grid lines
        },
        primary: {
          DEFAULT: "#1976D2",   // Main blue color
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#BBDEFB",
          foreground: "#1565C0",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E3F2FD",
          foreground: "#1565C0",
        },
        accent: {
          DEFAULT: "#2196F3",
          foreground: "#FFFFFF",
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
      keyframes: {
        "number-pop": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "number-pop": "number-pop 0.2s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
