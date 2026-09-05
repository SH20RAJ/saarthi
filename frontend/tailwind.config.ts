import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        x: {
          black: "#000000",
          card: "#16181c",
          cardHover: "#1c1f23",
          border: "#2f3336",
          borderLight: "#38444d",
          text: "#e7e9ea",
          muted: "#71767b",
          blue: "#1d9bf0",
          blueHover: "#1a8cd8",
          pill: "#eff3f4",
          pillHover: "#d7dbdc",
        },
        primary: {
          DEFAULT: "#1d9bf0", // X Blue
          foreground: "#FFFFFF",
          hover: "#1a8cd8",
        },
        secondary: {
          DEFAULT: "#16181c", // X Card
          foreground: "#e7e9ea",
        },
        accent: {
          DEFAULT: "#eff3f4", // X High-contrast white
          foreground: "#000000",
        },
        success: {
          DEFAULT: "#00ba7c", // X verified green
          foreground: "#FFFFFF",
        },
        warning: {
          DEFAULT: "#ffd400", // X gold
          foreground: "#000000",
        },
        danger: {
          DEFAULT: "#f4212e", // X red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        pill: "9999px",
      },
      boxShadow: {
        x: "0 0 0 1px #2f3336",
        xHover: "0 0 0 1px #38444d",
      }
    },
  },
  plugins: [],
};
export default config;
