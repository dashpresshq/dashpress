type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const typescriptSafeObjectDotEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as Entries<T>;

export function typescriptSafeObjectDotKeys<T extends object>(
  object: T
): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}
