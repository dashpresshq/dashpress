export function defaultToEmptyArray<T>(input: T[] | undefined): T[] {
  return input || [];
}
