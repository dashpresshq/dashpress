import { ISystemStatusForDisplay } from "shared/types/options";

export type TableFilterType =
  | { _type: "boolean"; bag: ISystemStatusForDisplay[] }
  | { _type: "date"; bag: undefined }
  | { _type: "idField"; bag: undefined }
  | { _type: "number"; bag: undefined }
  | { _type: "string"; bag: undefined }
  | { _type: "status"; bag: ISystemStatusForDisplay[] }
  | {
      _type: "list";
      bag: string;
    };

export interface IFilterProps<T, K> {
  column: {
    filterValue: T | undefined;
    setFilter: (value: T | undefined) => void;
  };
  bag: K;
}
