import { DEFAULT_TABLE_STATE } from "@hadmean/chromista";
import { useContextState } from "frontend/hooks/state";
import { IPaginatedDataState } from "shared/types/data";
import { IDataTableProps } from "../types";

export const useEntityContextState = (
  contextKey: string,
  defaultTableState: IDataTableProps["defaultTableState"]
) => {
  const pristineState = { ...DEFAULT_TABLE_STATE, ...defaultTableState };

  const [entityPaginatedDataState, setEntityPaginatedDataState] =
    useContextState<IPaginatedDataState<any>>(
      "entities",
      contextKey,
      pristineState
    );

  return [entityPaginatedDataState, setEntityPaginatedDataState] as const;
};
