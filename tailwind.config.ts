import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  content: ["./src/frontend/**/*.{ts,tsx}"],
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
        soft: "oklch(var(--dp-soft))",
        foundation: "oklch(var(--dp-foundation))",
        base: "oklch(var(--dp-base))",

        border: "oklch(var(--dp-border))",
        hover: "oklch(var(--dp-border)/30%)",

        main: "oklch(var(--dp-main))",
        muted: "oklch(var(--dp-muted))",

        "primary-text": "oklch(var(--dp-primary-text))",
        primary: {
          DEFAULT: "oklch(var(--dp-primary))",
          alpha: "oklch(var(--dp-primary)/var(--dp-primary-alpha-opacity))",
          "alpha-text": "oklch(var(--dp-primary-alpha-text))",
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
