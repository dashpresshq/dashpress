import { ISharedFormInput } from "../_types";

export interface IBaseFormSelect extends ISharedFormInput {
  disabledOptions?: string[];
  nullable?: boolean;
  defaultLabel?: string;
}
