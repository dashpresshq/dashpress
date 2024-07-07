import { DEFAULT_TABLE_STATE } from "@/components/app/table";
import { createStore } from "@/frontend/lib/store";
import type { IPaginatedDataState } from "@/shared/types/data";

type IStore = {
  tableState: IPaginatedDataState<any>;
  setTableState: (tableState: IPaginatedDataState<any>) => void;
};

export const useCurrentTableStateStore = createStore<IStore>((set) => ({
  tableState: DEFAULT_TABLE_STATE,
  setTableState: (tableState) =>
    set(() => ({
      tableState,
    })),
}));
