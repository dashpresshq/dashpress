import { useState } from "react";

function useSelections<T>() {
  const [selections, setSelections] = useState<Set<T>>(new Set([]));

  return {
    toggleSelection: (input: T) => {
      const setClone = new Set(selections);

      if (setClone.has(input)) {
        setClone.delete(input);
      } else {
        setClone.add(input);
      }

      setSelections(setClone);
    },
    allSelections: [...selections],
    selectMutiple: (items: T[]) => {
      const setClone = new Set(selections);

      items.forEach((item) => setClone.add(item));

      setSelections(setClone);
    },
    deSelectMutiple: (items: T[]) => {
      const setClone = new Set(selections);

      items.forEach((item) => setClone.delete(item));

      setSelections(setClone);
    },
    isSelected: (item: T) => {
      return selections.has(item);
    },
  };
}

export const useStringSelections = () => useSelections<string>();
