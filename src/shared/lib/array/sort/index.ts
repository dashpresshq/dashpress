export function sortListByOrder<T, K extends keyof T>(
  order: string[],
  itemsToOrder: T[],
  key: K
): T[] {
  const indexOf = (entry: T) => {
    const index = order.indexOf(entry[key] as unknown as string);
    if (index === -1) {
      return Infinity;
    }
    return index;
  };

  return [...itemsToOrder].sort((a, b) => {
    return indexOf(a) - indexOf(b);
  });
}
