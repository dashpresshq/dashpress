import { abbreviateNumber } from "frontend/lib/numbers";

export const getFullAndRelativeCount = (
  fullCount: "loading" | number,
  relativeCount: "loading" | number,
  hasDateField: boolean
): [string, string, "up" | "down" | "side"] => {
  if (fullCount === "loading" || relativeCount === "loading") {
    return ["counting", "counting", "side"];
  }
  const fullCountReturn = abbreviateNumber(fullCount);
  if (!hasDateField) {
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
