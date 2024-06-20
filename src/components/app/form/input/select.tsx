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
import { IBaseFormSelect } from "@/frontend/design-system/components/Form/Select/types";

interface IFormSelect extends IBaseFormSelect {
  selectData: ISelectData[];
  onSearch?: ISelectProps["onSearch"];
}

export function FormSelect(formInput: IFormSelect) {
  const {
    input,
    selectData,
    meta,
    disabled,
    label: formLabel,
    disabledOptions,
    placeholder,
    onSearch,
  } = formInput;
  const { _ } = useLingui();

  return (
    <LabelAndError formInput={formInput}>
      <Select
        {...input}
        {...generateFormArias(meta)}
        className={generateClassNames(meta)}
        options={selectData}
        placeholder={
          placeholder ||
          fakeMessageDescriptor(`--- ${_(msg`Select ${_(formLabel)}`)} ---`)
        }
        disabled={disabled}
        disabledOptions={disabledOptions}
        onSearch={onSearch}
      />
    </LabelAndError>
  );
}
