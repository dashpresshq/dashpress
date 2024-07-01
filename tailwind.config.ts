import { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/frontend/**/*.{ts,tsx}"],
  darkMode: ["class"],
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
        soft: "hsl(var(--dp-soft))",
        muted: "hsl(var(--dp-muted))",
        main: "hsl(var(--dp-main))",
        border: "hsl(var(--dp-border))",
        base: "hsl(var(--dp-base))",
        foundation: "hsl(var(--dp-foundation))",
        "primary-text": "hsl(var(--dp-primary-text))",
        hover: "hsla(var(--dp-border), 0.3)",
        primary: {
          DEFAULT: "hsl(var(--dp-primary))",
          alpha: "hsla(var(--dp-primary), var(--dp-primary-alpha-opacity))",
          "alpha-text": "hsl(var(--dp-primary-alpha-text))",
          "shade-thick": "hsla(var(--dp-primary), 0.85)",
          "shade-thick-xl": "hsla(var(--dp-primary), 0.9)",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        heading: ["var(--font-heading)", ...fontFamily.sans],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
