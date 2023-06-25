import { UseQueryResult } from "react-query";

export type DataStateKeys<T> = Pick<
  UseQueryResult<T>,
  "data" | "isLoading" | "isRefetching" | "error"
>;

export interface IUseApiOptions<T> {
  selector?: (input: any) => T;
  enabled?: boolean;
  errorMessage?: string;
  request?: {
    method: "POST" | "PATCH" | "PUT";
    body: Record<string, unknown>;
  };
  defaultData: T;
  placeholderData?: T;
  /*
  Some requests may go bad in the BE and it is makes sense
  Like checking if something exists in a list
  In this case you would not want an error and want to treat it as a state
  i.e the value doesn't exists
  i.e you want a value (undefined) and you want to handle it in the code
  */
  returnUndefinedOnError?: true;
}
