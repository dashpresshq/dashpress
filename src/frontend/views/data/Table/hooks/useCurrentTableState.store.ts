import { DEFAULT_TABLE_STATE } from "@hadmean/chromista";
import { createStore, IPaginatedDataState } from "@hadmean/protozoa";

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
