import { UseQueryOptions } from "react-query";
import { IUseApiOptions } from "./types";

export function buildApiOptions<T>(
  options: IUseApiOptions<T>
): UseQueryOptions<T> {
  return {
    ...options,
    select: (data: T) => {
      if (options.selector) {
        return options.selector(data);
      }
      return data;
    },
  };
}
