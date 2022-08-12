import { IEntityRelation } from "shared/types";
import { DataStateKeys } from "@gothicgeeks/shared";

export const getEntitiesTabsCount = (
  type: IEntityRelation["type"],
  countData: DataStateKeys<{
    count: number;
  }>
): string => {
  if (type === "toOne") {
    return "";
  }
  const countResult = countData?.isLoading
    ? "Loading..."
    : countData?.data?.count;
  return `(${countResult})`;
};
