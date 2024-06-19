import { useEffect, useState } from "react";
import { IPaginatedDataState } from "shared/types/data";
import { useSyncPaginatedDataState } from "../portal";
import { IDataTableProps } from "../types";
import { useCurrentTableStateStore } from "./useCurrentTableState.store";
import { useEntityContextState } from "./useEntityContextState";
import { DEFAULT_TABLE_STATE } from "@/components/app/table";

export const useTableState = (
  contextKey: string,
  persistentFilters: IDataTableProps["persistentFilters"],
  defaultTableState?: IDataTableProps["defaultTableState"]
) => {
  /*
   We want to key the entity state based on the entity since NextJS reuses the same component
   For different entity views
   So this is as good as useState but with entity context
   */
  const [paginatedDataState, setPaginatedDataState] = useEntityContextState(
    contextKey,
    defaultTableState
  );

  /*
   We dont want the state from the <Table /> to be passed back to the <Table />
   As this will cause some infinite loop
   So we only set this when we want to override the Table state
  */
  const [overridePaginatedDataState, setOverridePaginatedDataState] =
    useState<IPaginatedDataState<unknown>>(DEFAULT_TABLE_STATE);

  /*
    We want to have a copy of the current state so that we can use it in other functionalities
    Like export and share state
  */
  const setGlobalTableState = useCurrentTableStateStore(
    (state) => state.setTableState
  );

  /*
   The current state is actually the table filters + some other persistent filters
   */
  const currentState: IPaginatedDataState<any> = {
    ...paginatedDataState,
    filters: [...paginatedDataState.filters, ...persistentFilters],
  };

  /*
   When the entity changes we want to reset the current state to the table override state
   So that the table can reset to the current entity state
  */
  useEffect(() => {
    if (paginatedDataState) {
      setOverridePaginatedDataState(paginatedDataState);
    }
  }, [contextKey]);

  /*
   Sync the current state to the global state
   */
  useEffect(() => {
    setGlobalTableState(currentState);
  }, [JSON.stringify(currentState)]);

  useSyncPaginatedDataState();

  return [
    currentState,
    overridePaginatedDataState,
    setPaginatedDataState,
  ] as const;
};
