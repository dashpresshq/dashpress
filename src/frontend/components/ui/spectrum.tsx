import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export const spectrumVariants = cva("", {
  variants: {
    spectrum: {
      gray: "border-slate-600 bg-slate-100 text-slate-700",
      green: "border-green-600 bg-green-100 text-green-700",
      red: "border-red-600 bg-red-100 text-red-700",
      blue: "border-blue-600 bg-blue-100 text-blue-700",
      cyan: "border-cyan-600 bg-cyan-100 text-cyan-700",
      yellow: "border-amber-600 bg-amber-100 text-amber-700",
      purple: "border-purple-600 bg-purple-100 text-purple-700",
      lime: "border-lime-600 bg-lime-100 text-lime-700",
      pink: "border-pink-600 bg-pink-100 text-pink-700",
      orange: "border-orange-600 bg-orange-100 text-orange-700",
    },
  },
  defaultVariants: {
    spectrum: "gray",
  },
});

export type SpectrumColorTypes = VariantProps<
  typeof spectrumVariants
>["spectrum"];

export const SPECTRUM_COLORS: Array<SpectrumColorTypes> = [
  "green",
  "red",
  "blue",
  "yellow",
  "purple",
  "cyan",
  "pink",
  "lime",
  "orange",
  "gray",
];
