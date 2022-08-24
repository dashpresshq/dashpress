import {
  AsyncFormSelect,
  FormCodeEditor,
  FormInput,
  FormNumberInput,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from "@hadmean/chromista";
import { ISharedFormInput } from "@hadmean/chromista/dist/components/Form/_types";
import { StringUtils } from "@hadmean/protozoa";
import { IColorableSelection } from "shared/types";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";

interface IProps {
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  renderProps: ISharedFormInput;
  selectionUrl?: string;
  entityFieldSelections?: IColorableSelection[];
  required: boolean;
  disabled: boolean;
  label: string;
}

export function RenderFormInput({
  renderProps,
  label,
  type,
  entityFieldSelections = [],
  selectionUrl,
  required,
  disabled,
}: IProps) {
  const formProps = {
    label,
    required,
    disabled,
    ...renderProps,
  };

  if (entityFieldSelections.length > 0) {
    return <FormSelect {...formProps} selectData={entityFieldSelections} />;
  }

  if (selectionUrl) {
    return <AsyncFormSelect {...formProps} url={selectionUrl} />;
  }

  switch (type) {
    case "email":
    case "password":
    case "url":
      return <FormInput type={type} {...formProps} />;
    case "number":
      return <FormNumberInput {...formProps} />;

    case "selection":
    case "selection-enum":
      return <FormSelect {...formProps} selectData={entityFieldSelections} />;

    case "reference":
      return <AsyncFormSelect {...formProps} url={selectionUrl} />;

    case "boolean":
      return (
        <FormSwitch
          name={StringUtils.sluggify(label)}
          value={formProps.input.value}
          onChange={formProps.input.onChange}
          {...formProps}
        />
      );

    case "json":
      return <FormCodeEditor {...formProps} />;

    case "textarea":
      return <FormTextArea {...formProps} />;
    default:
      return <FormInput {...formProps} />;
  }
}
