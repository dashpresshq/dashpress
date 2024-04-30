export interface IColorMode {
  "soft-color": string;
  "muted-text": string;
  "main-text": string;
  "border-color": string;
  "base-color": string;
  "foundation-color": string;
  "text-on-primary": string;
  "text-on-shade": string;
  "shade-opacity": string;
}

export type IRootColors =
  | keyof IColorMode
  | "primary-shade-color"
  | "primary-color";

export const FOR_CODE_COV = 1;
