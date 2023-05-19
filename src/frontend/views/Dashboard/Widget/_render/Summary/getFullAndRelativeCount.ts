import { abbreviateNumber } from "@hadmean/protozoa";

export const getFullAndRelativeCount = (
  fullCount: number,
  relativeCount?: number
): [string, string, "up" | "down" | "side"] => {
  const fullCountReturn = abbreviateNumber(fullCount);
  if (!relativeCount) {
    return [fullCountReturn, "", "side"];
  }
  if (relativeCount === 0) {
    return [fullCountReturn, "N/A", "side"];
  }

  const difference = fullCount - relativeCount;

  const percentage = Math.abs(
    ((fullCount - relativeCount) / relativeCount) * 100
  );

  return [
    fullCountReturn,
    `${Math.round(percentage)}%`,
    // eslint-disable-next-line no-nested-ternary
    difference === 0 ? "side" : difference >= 0 ? "up" : "down",
  ];
};
