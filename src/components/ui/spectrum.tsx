import { VariantProps, cva } from "class-variance-authority";

export const spectrumVariants = cva("", {
  variants: {
    spectrum: {
      gray: "border-slate-600 text-slate-700 bg-slate-100",
      green: "border-green-600 text-green-700 bg-green-100",
      red: "border-red-600 text-red-700 bg-red-100",
      blue: "border-blue-600 text-blue-700 bg-blue-100",
      yellow: "border-amber-600 text-amber-700 bg-amber-100",
      pink: "border-pink-600 text-pink-700 bg-pink-100",
      orange: "border-orange-600 text-orange-700 bg-orange-100",
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
  "gray",
  "pink",
  "orange",
];
