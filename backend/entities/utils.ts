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
    sortList.map((item, index) => [item, index + 1])
  );

  inputArray.sort(
    (a, b) =>
      (sortMap[a[key]] || SOME_VERY_LARGE_NUMBER) -
      (sortMap[b[key]] || SOME_VERY_LARGE_NUMBER)
  );
}
