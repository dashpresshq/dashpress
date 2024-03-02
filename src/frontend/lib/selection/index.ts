import { createStore } from "frontend/lib/store";

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

const getAllSelections = (selections: Record<string, boolean>) => {
  return (
    Object.entries(selections)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([_]) => _)
  );
};

export function useStringSelections(key: string) {
  const [values, set] = useSelectionStore((store) => [store.values, store.set]);

  const selections = values[key] || {};

  const setSelections = (value: Record<string, boolean>) => {
    set({ key, value });
  };

  return {
    toggleSelection: (
      input: string,
      withNewSelections?: (newAllSelections: string[]) => void
    ) => {
      const newSelections = { ...selections, [input]: !selections[input] };
      setSelections(newSelections);
      withNewSelections?.(getAllSelections(newSelections));
    },
    allSelections: getAllSelections(selections),
    selectMutiple: (items: string[]) => {
      const update = Object.fromEntries(items.map((item) => [item, true]));
      setSelections({ ...selections, ...update });
    },
    setMultiple: (items: string[]) => {
      const update = Object.fromEntries(items.map((item) => [item, true]));
      setSelections(update);
    },
    deSelectMutiple: (items: string[]) => {
      const update = Object.fromEntries(items.map((item) => [item, false]));

      setSelections({ ...selections, ...update });
    },
    isSelected: (item: string) => {
      return !!selections[item];
    },
    clearAll: () => {
      setSelections({});
    },
  };
}
