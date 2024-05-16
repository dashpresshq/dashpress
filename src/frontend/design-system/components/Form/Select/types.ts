import { ISharedFormInput } from "../types";

export interface IBaseFormSelect extends ISharedFormInput {
  disabledOptions?: string[];
  nullable?: boolean;
  defaultLabel?: string;
}
