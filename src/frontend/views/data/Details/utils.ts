import { IEntityRelation } from "shared/types/db";
import { DataStateKeys } from "frontend/lib/data/types";

export const getEntitiesRelationsCount = (
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
