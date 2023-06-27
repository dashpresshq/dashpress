export function uniqBy<T>(list: T[], key: keyof T): T[] {
  const seen = new Set();
  return list.filter((item) => {
    const k = item[key];
    return seen.has(k) ? false : seen.add(k);
  });
}
