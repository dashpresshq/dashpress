export interface IFilterProps<T, K> {
  column: {
    filterValue: T | undefined;
    setFilter: (value: T | undefined) => void;
  };
  bag: K;
}

export const FOR_CODE_COV = 1;
