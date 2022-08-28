import noop from "lodash/noop";

const hexToRgb = (_hex: string): [string, string, string] => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = _hex.replace(shorthandRegex, (_, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!rgb) {
    return ["0", "0", "0"];
  }

  const [_, r, g, b] = rgb;
  noop(_);
  return [r, g, b];
};

export const isBlackOrWhite = (color: string) => {
  const blackOrWhiteAggregate = hexToRgb(color).reduce((hexAcc, currentHex) => {
    return hexAcc + parseInt(currentHex, 16);
  }, 0);

  return blackOrWhiteAggregate / 3 > 128 ? "#000" : "#fff";
};
