/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import { useAppConfiguration } from "@/frontend/hooks/configuration/configuration.store";

import { usePortalThemes } from "./portal";

type ThreeNumbers = readonly [number, number, number];

function hexToRgb(hex$1: string): ThreeNumbers {
  let hex = hex$1.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToXyz([r, g, b]: ThreeNumbers) {
  r /= 255;
  g /= 255;
  b /= 255;

  r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
  g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
  b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.072175) / 1.0;
  const z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;

  return [x, y, z] as const;
}

function xyzToLab([x, y, z]: ThreeNumbers) {
  x = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return [l, a, b] as const;
}

function labToOklch([l, a, b]: ThreeNumbers) {
  const c = Math.sqrt(a * a + b * b);
  const h = Math.atan2(b, a);
  const hDegrees = (h * 180) / Math.PI;
  const hPositive = hDegrees < 0 ? hDegrees + 360 : hDegrees;

  return [l / 100, c / 100, hPositive] as const;
}

function hexToOklch(hex: string) {
  const rgb = hexToRgb(hex);
  const xyz = rgbToXyz(rgb);
  const lab = xyzToLab(xyz);
  const [l, c, h] = labToOklch(lab);
  return `${l.toFixed(3)}% ${c.toFixed(3)} ${h.toFixed(3)}`;
}

export const useAppTheme = () => {
  const themeColor = useAppConfiguration("theme_color");

  usePortalThemes();

  document.documentElement.style.setProperty(
    "--app-primary",
    hexToOklch(themeColor.data.primary)
  );
};
