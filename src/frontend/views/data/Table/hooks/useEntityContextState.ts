import { DEFAULT_TABLE_STATE } from "@hadmean/chromista";
import { IPaginatedDataState } from "@hadmean/protozoa";
import { useContextState } from "frontend/hooks/state";
import { ITableViewProps } from "../types";

export const useEntityContextState = (
  contextKey: string,
  defaultTableState: ITableViewProps["defaultTableState"]
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
