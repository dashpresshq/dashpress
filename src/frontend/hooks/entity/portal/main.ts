import { DataStateKeys } from "@hadmean/protozoa";
import noop from "lodash/noop";
import { DataCrudKeys } from "shared/types/data";

export function usePortalHiddenEntityColumns(
  entity: string,
  crudKey: DataCrudKeys
): DataStateKeys<string[]> {
  noop(entity, crudKey);
  return {
    data: [],
    error: null,
    isLoading: false,
    isRefetching: false,
  };
}
