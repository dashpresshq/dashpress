type TRGB = { r: number; g: number; b: number };
type TLCH = { l: number; c: number; h: number };

export const hexToOklch = (hex: string) => {
  const hexToRGB = (h: string): TRGB => {
    const r: number = parseInt(h.slice(1, 3), 16);
    const g: number = parseInt(h.slice(3, 5), 16);
    const b: number = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToOklch = (rgb: TRGB): TLCH => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const [linearR, linearG, linearB] = [r, g, b].map((c: number) =>
      c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
    );

    // Convert Linear RGB to CIE XYZ
    let x: number =
      linearR * 0.4124564 + linearG * 0.3575761 + linearB * 0.1804375;
    let y: number =
      linearR * 0.2126729 + linearG * 0.7151522 + linearB * 0.072175;
    let z: number =
      linearR * 0.0193339 + linearG * 0.119192 + linearB * 0.9503041;

    // Convert CIE XYZ to CIELAB
    [x, y, z] = [x, y, z].map((c: number) =>
      c > 0.008856 ? c ** (1 / 3) : (903.3 * c + 16) / 116
    );
    let l: number = 116 * y - 16;
    const a: number = 500 * (x - y);
    const bStar: number = 200 * (y - z);

    // Convert CIELAB to Oklch
    // let c: number = Math.sqrt(a * a + bStar * bStar);
    let h: number = Math.atan2(bStar, a) * (180 / Math.PI);
    if (h < 0) h += 360;

    // Assume c_max is the maximum chroma value observed or expected in your conversions
    const c_max = 100; /* your determined or observed maximum chroma value */
    // Adjusted part of the rgbToOklch function for calculating 'c'
    let c: number = Math.sqrt(a * a + bStar * bStar);
    c = (c / c_max) * 0.37; // Scale c to be within 0 and 0.37

    // Scale and round values to match the specified ranges
    l = Math.round(((l + 16) / 116) * 1000) / 10; // Scale l to be between 0 and 1
    c = Number(c.toFixed(2)); // Ensure c is correctly scaled, adjust if necessary based on your color space calculations
    h = Number(h.toFixed(1)); // h is already within 0 to 360

    return {
      l,
      c,
      h,
    };
  };

  return rgbToOklch(hexToRGB(hex));
};
