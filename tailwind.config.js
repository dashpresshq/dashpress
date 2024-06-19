const { fontFamily } = require("tailwindcss/defaultTheme");
// const {
//   default: flattenColorPalette,
// } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
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
        // input: "hsl(var(--input))",
        // ring: "hsl(var(--ring))",
        // background: "hsl(var(--background))",
        // foreground: "hsl(var(--foreground))",
        soft: "hsl(var(--soft))",
        muted: "hsl(var(--muted))",
        main: "hsl(var(--main))",
        border: "hsl(var(--border))",
        base: "hsl(var(--base))",
        foundation: "hsl(var(--foundation))",
        "primary-text": "hsl(var(--primary-text))",
        hover: "hsla(var(--border), 0.3)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          "shade-light": "hsla(var(--primary), 0.1)",
          "shade-thick": "hsla(var(--primary), 0.85)",
          "shade-thick-xl": "hsla(var(--primary), 0.9)",
          "shade-thick-xxl": "hsla(var(--primary), 0.95)",
        },
        "shade-text": "hsl(var(--shade-text))",

        // secondary: {
        //   DEFAULT: "hsl(var(--secondary))",
        //   foreground: "hsl(var(--secondary-foreground))",
        // },
        // destructive: {
        //   DEFAULT: "hsl(var(--destructive))",
        //   foreground: "hsl(var(--destructive-foreground))",
        // },
        // accent: {
        //   DEFAULT: "hsl(var(--accent))",
        //   foreground: "hsl(var(--accent-foreground))",
        // },
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
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
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
    // require("@tailwindcss/typography"),
    // addVariablesForColors,
  ],
};

// function addVariablesForColors({ addBase, theme }) {
//   const allColors = flattenColorPalette(theme("colors"));
//   const newVars = Object.fromEntries(
//     Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
//   );

//   addBase({
//     ":root": newVars,
//   });
// }
