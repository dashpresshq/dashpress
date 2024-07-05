import type { MessageDescriptor } from "@lingui/core";
import type { UseQueryResult } from "@tanstack/react-query";

export enum DataStates {
  Loading = "loading",
  Error = "error",
  Loaded = "loaded",
}

export type DataStateKeys<T> = Pick<UseQueryResult<T>, "data" | "isLoading"> & {
  error: unknown | Error;
};

export interface IUseApiOptions<T> {
  selector?: (input: any) => T;
  enabled?: boolean;
  persist?: boolean;
  errorMessage?: MessageDescriptor;
  request?: {
    method: "POST" | "PATCH" | "PUT";
    body: Record<string, unknown>;
  };
  defaultData: T;
  /*
  Some requests may go bad in the BE and it is makes sense
  Like checking if something exists in a list
  In this case you would not want an error and want to treat it as a state
  i.e the value doesn't exists
  i.e you want a value (undefined) and you want to handle it in the code
  */
  returnUndefinedOnError?: true;
}
