import { useEffect, useState } from "react";

function useSelections<T>() {
  const [selections, setSelections] = useState<Record<number, T[]>>({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // So that I dont dirty this code with things like `(selections[currentPage] || []).doSomething`
    setSelections({
      ...selections,
      [currentPage]: selections[currentPage] ?? [],
    });
  }, [currentPage]);

  return {
    allSelections: Object.values(selections).flatMap((x) => x),
    currentPageSelection: selections[currentPage] || [],
    selectMutiple: (items: T[]) => {
      setSelections({ ...selections, [currentPage]: items });
    },
    clearAll: () => {
      setSelections({ ...selections, [currentPage]: [] });
    },
    setCurrentPage,
    toggleSelection: (input: T) => {
      if (selections[currentPage].includes(input)) {
        setSelections({
          ...selections,
          [currentPage]: selections[currentPage].filter(
            (selection) => selection !== input
          ),
        });
        return;
      }
      setSelections({
        ...selections,
        [currentPage]: [...selections[currentPage], input],
      });
    },
  };
}

export const useStringSelections = () => useSelections<string>();
