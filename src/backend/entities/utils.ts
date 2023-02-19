export function sortByList<
  T extends Record<string, unknown>,
  K extends keyof T
>(inputArray: T[], sortList: string[], key: K) {
  if (sortList.length === 0) {
    return;
  }
  const sortMap = Object.fromEntries(
    sortList.map((item, index) => [item, index + 1])
  );

  inputArray.sort(
    (a, b) =>
      (sortMap[a[key] as string] || Infinity) -
      (sortMap[b[key] as string] || Infinity)
  );
}
