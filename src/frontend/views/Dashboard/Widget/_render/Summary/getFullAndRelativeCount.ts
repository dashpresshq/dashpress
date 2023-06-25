import { isEmpty } from "class-validator";
import { abbreviateNumber } from "frontend/lib/numbers";
import { ISummaryCardWidgetData } from "./types";

export const getFullAndRelativeCount = (
  fullCount$1: number | string,
  relativeCount$1?: number | string
): [string, string, "up" | "down" | "side"] => {
  const fullCount = Number(fullCount$1);

  const fullCountReturn = abbreviateNumber(fullCount);
  if (isEmpty(relativeCount$1)) {
    return [fullCountReturn, "", "side"];
  }

  const relativeCount = Number(relativeCount$1);

  if (Number(relativeCount) === 0) {
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

const extractNumber = (data: number | { count?: number }): number => {
  if (!data) {
    return undefined;
  }
  if (typeof data === "number") {
    return data;
  }
  return data.count;
};

export const splitSummaryCardWidgetDataToRelativeCount = (
  summaryCardWidgetData: ISummaryCardWidgetData
): [number, number] => {
  if (typeof summaryCardWidgetData === "number") {
    return [summaryCardWidgetData, undefined];
  }
  const firstValue = extractNumber(summaryCardWidgetData[0]);
  const secondValue = extractNumber(summaryCardWidgetData[1]);

  return [firstValue, secondValue];
};
