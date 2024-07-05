import { useContextState } from "frontend/hooks/state";
import type { IPaginatedDataState } from "shared/types/data";
import { DEFAULT_TABLE_STATE } from "@/components/app/table";
import type { IDataTableProps } from "../types";

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
