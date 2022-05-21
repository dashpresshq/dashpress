import { IUseApiOptions } from "./types";
export function buildApiOptions<T>(options: IUseApiOptions<T>) {
  return {
    enabled: options.enabled,
    select: (data: T) => {
      if (options.selector) {
        return options.selector(data);
      }
      return data;
    },
  };
}
