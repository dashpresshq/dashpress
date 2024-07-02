import { ISelectData } from "shared/types/options";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/macro";
import { Select, ISelectProps } from "@/components/ui/select";
import { fakeMessageDescriptor } from "@/translations/fake";
import {
  LabelAndError,
  generateClassNames,
  generateFormArias,
} from "@/components/app/form/input/label-and-error";
import { IBaseFormSelect } from "./types";

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
  onSearch?: ISelectProps["onSearch"];
  isLoading?: boolean;
}

export function FormSelect(formInput: IFormSelect) {
  const {
    input,
    selectData,
    meta,
    disabled,
    label: formLabel,
    disabledOptions,
    isLoading,
    onSearch,
  } = formInput;
  const { _ } = useLingui();

  return (
    <LabelAndError formInput={formInput}>
      <Select
        {...input}
        {...generateFormArias(meta)}
        className={generateClassNames(meta)}
        isLoading={isLoading}
        options={selectData}
        placeholder={fakeMessageDescriptor(
          `--- ${_(msg`Select ${_(formLabel)}`)} ---`
        )}
        disabled={disabled}
        disabledOptions={disabledOptions}
        onSearch={onSearch}
      />
    </LabelAndError>
  );
}
