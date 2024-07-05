import type { UseQueryOptions } from "@tanstack/react-query";
import type { IUseApiOptions } from "./types";

export function buildApiOptions<T>(
  options: IUseApiOptions<T>
): Partial<UseQueryOptions<T>> {
  return {
    ...options,
    meta: {
      persist: options.persist,
    },
    select: (data: T) => {
      if (options.selector) {
        return options.selector(data);
      }
      return data;
    },
  };
}
