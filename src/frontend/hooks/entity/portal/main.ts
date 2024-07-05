import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import type { DataStateKeys } from "frontend/lib/data/types";
import { noop } from "shared/lib/noop";
import type { DataCrudKeys } from "shared/types/data";

export function usePortalHiddenEntityColumns(
  entity: string,
  crudKey: DataCrudKeys
): DataStateKeys<string[]> {
  noop(entity, crudKey);
  return loadedDataState<string[]>([]);
}
