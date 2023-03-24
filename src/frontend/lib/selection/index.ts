import { createStore } from "@hadmean/protozoa";

type IStore = {
  values: Record<string, Record<string, boolean>>;
  set: (value: { key: string; value: Record<string, boolean> }) => void;
};

const useSelectionStore = createStore<IStore>((set) => ({
  values: {},
  set: ({ key, value }) =>
    set(({ values }) => ({
      values: { ...values, [key]: value },
    })),
}));

export function useStringSelections(key: string) {
  const [values, set] = useSelectionStore((store) => [store.values, store.set]);

  const selections = values[key] || {};

  const setSelections = (value: Record<string, boolean>) => {
    set({ key, value });
  };

  return {
    toggleSelection: (input: string) => {
      setSelections({ ...selections, [input]: !selections[input] });
    },
    allSelections: Object.entries(selections)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([_]) => _),
    selectMutiple: (items: string[]) => {
      const update = Object.fromEntries(items.map((item) => [item, true]));
      setSelections({ ...selections, ...update });
    },
    deSelectMutiple: (items: string[]) => {
      const update = Object.fromEntries(items.map((item) => [item, false]));

      setSelections({ ...selections, ...update });
    },
    isSelected: (item: string) => {
      return selections[item];
    },
    clearAll: () => {
      setSelections({});
    },
  };
}
