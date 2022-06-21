const SOME_VERY_LARGE_NUMBER = 999999999;

export function sortByList<T extends Record<string, string>, K extends keyof T>(
  inputArray: T[],
  sortList: string[],
  key: K
) {
  if (sortList.length === 0) {
    return;
  }
  const sortMap = Object.fromEntries(
    sortList.map((item, index) => [item, index])
  );

  inputArray.sort(
    (a, b) =>
      (sortMap[b[key]] || SOME_VERY_LARGE_NUMBER) -
      (sortMap[a[key]] || SOME_VERY_LARGE_NUMBER)
  );
}
