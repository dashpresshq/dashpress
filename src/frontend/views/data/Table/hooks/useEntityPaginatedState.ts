import { DEFAULT_TABLE_STATE } from "@hadmean/chromista";
import { IPaginatedDataState } from "@hadmean/protozoa";
import { useContextState } from "frontend/hooks/state";
import { ITableViewProps } from "../types";

export const useEntityPaginatedState = (
  entity: string,
  defaultTableState: ITableViewProps["defaultTableState"]
) => {
  const pristineState = { ...DEFAULT_TABLE_STATE, ...defaultTableState };

  const [entityPaginatedDataState, setEntityPaginatedDataState] =
    useContextState<IPaginatedDataState<any>>(entity, pristineState);

  return [entityPaginatedDataState, setEntityPaginatedDataState] as const;
};
