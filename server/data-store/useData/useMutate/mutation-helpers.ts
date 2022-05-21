// Sure there are plenty libraries that do a better job at this but I just want to be lazy this once
export const MutationHelpers = {
  append: <T, K>(old: T[] | undefined = [], formData: K) => {
    return [...old, formData];
  },
  mergeArray: <T, K>(old: T[] | undefined = [], formData: K[] = []) => {
    return [...old, ...formData];
  },
  mergeObject: <T, K extends Partial<T>>(
    old: T | undefined,
    formData: K
  ): T => {
    return { ...old, ...formData } as unknown as T;
  },
  update:
    (currentDataId: string) =>
    <T extends { id: string }, K>(old: T[] | undefined = [], formData: K) => {
      const index = old.findIndex(({ id }) => id === currentDataId);
      if (index > -1) {
        old[index] = { ...old[index], ...formData };
      }
      return [...old];
    },
  delete:
    (currentDataId: string) =>
    <T extends { id: string }>(old: T[] | undefined = []) => {
      return [...old.filter(({ id }) => currentDataId !== id)];
    },
  removeMany: <T>(old: T[] | undefined = [], formData: T[]) => {
    return [...old.filter((oldItem) => !formData.includes(oldItem))];
    // NOTICE this works only for primitives, Please implement a path fn for more robustness
  },
};
