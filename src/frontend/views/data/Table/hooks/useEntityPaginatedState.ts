import { DEFAULT_TABLE_STATE } from "@hadmean/chromista";
import { IPaginatedDataState } from "@hadmean/protozoa";
import { useEffect, useState } from "react";
import { ITableViewProps } from "../types";

export const useEntityPaginatedState = (
  entity: string,
  defaultTableState: ITableViewProps["defaultTableState"]
) => {
  const pristineState = { ...DEFAULT_TABLE_STATE, ...defaultTableState };

  const [entityPaginatedDataState, setEntityPaginatedDataState] = useState<
    Record<string, IPaginatedDataState<any>>
  >({});

  const setPaginatedDataState = (dataState: IPaginatedDataState<any>) => {
    setEntityPaginatedDataState({
      ...entityPaginatedDataState,
      [entity]: dataState,
    });
  };

  useEffect(() => {
    if (!entityPaginatedDataState[entity]) {
      setPaginatedDataState(pristineState);
    }
  }, [entity]);

  return [
    entityPaginatedDataState[entity] || pristineState,
    setPaginatedDataState,
  ] as const;
};
