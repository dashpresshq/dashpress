export function defaultSearchFunction<
  T extends { label: string },
  K extends keyof T
>(itemsToSearch: T[], searchString: string, labelField: K): Array<T> {
  return itemsToSearch.filter(
    (value) =>
      (value[labelField] as unknown as string)
        .toLowerCase()
        .includes(searchString) ||
      value.label.toLowerCase().includes(searchString)
  );
}
