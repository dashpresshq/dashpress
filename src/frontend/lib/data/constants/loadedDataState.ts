import { DataStateKeys } from "../types";

export function loadedDataState<T>(input: T): DataStateKeys<T> {
  return {
    data: input,
    error: null,
    isLoading: false,
  };
}
