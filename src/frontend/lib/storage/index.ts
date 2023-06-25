export const StorageService = {
  getString: (path: string): string | null => window.localStorage.getItem(path),
  setString: (path: string, value: string): void =>
    window.localStorage.setItem(path, value),
  removeString: (path: string): void => window.localStorage.removeItem(path),
};

export const TemporayStorageService = {
  getString: (path: string): string | null | false =>
    typeof window !== "undefined" && window.sessionStorage.getItem(path),
  setString: (path: string, value: string): void =>
    window.sessionStorage.setItem(path, value),
  removeString: (path: string): void => window.sessionStorage.removeItem(path),
};
