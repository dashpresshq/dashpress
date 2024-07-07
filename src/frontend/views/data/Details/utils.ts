import type { DataStateKeys } from "@/frontend/lib/data/types";
import type { IEntityRelation } from "@/shared/types/db";

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
