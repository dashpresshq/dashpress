export interface IFilterProps<T, K> {
  column: {
    filterValue: T | undefined;
    setFilter: (value: T | undefined) => void;
  };
  bag: K;
}
