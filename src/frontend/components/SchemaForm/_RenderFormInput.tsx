import {
  AsyncFormSelect,
  FormCodeEditor,
  FormDateInput,
  FormFileInput,
  FormInput,
  FormNumberInput,
  FormSelect,
  FormSwitch,
  FormSelectButton,
  FormTextArea,
} from "@hadmean/chromista";
import { ISharedFormInput } from "@hadmean/chromista/dist/components/Form/_types";
import { StringUtils } from "@hadmean/protozoa";
import { ISchemaFormConfig } from "shared/form-schemas/types";
import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";

interface IProps {
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  renderProps: ISharedFormInput;
  apiSelections?: ISchemaFormConfig["apiSelections"];
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
  apiSelections,
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
    if (entityFieldSelections.length > 1 && entityFieldSelections.length <= 4) {
      return (
        <FormSelectButton {...formProps} selectData={entityFieldSelections} />
      );
    }
    return <FormSelect {...formProps} selectData={entityFieldSelections} />;
  }

  if (apiSelections) {
    return (
      <AsyncFormSelect
        {...formProps}
        url={apiSelections.listUrl}
        referenceUrl={apiSelections.referenceUrl}
      />
    );
  }

  switch (type) {
    case "email":
    case "password":
    case "url":
    case "color":
      return <FormInput type={type} {...formProps} />;
    case "number":
      return <FormNumberInput {...formProps} />;

    case "datetime-local":
      return <FormDateInput {...formProps} />;

    case "selection":
    case "selection-enum":
      return <FormSelect {...formProps} selectData={entityFieldSelections} />;

    case "reference":
      return (
        <AsyncFormSelect
          {...formProps}
          url={apiSelections?.listUrl}
          referenceUrl={apiSelections?.referenceUrl}
        />
      );

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

    case "richtext":
      return <FormTextArea {...formProps} />;

    case "image":
    case "file":
      return <FormFileInput {...formProps} uploadUrl="/api/upload" />;

    default:
      return <FormInput {...formProps} />;
  }
}
// TODO Rating Input (for contributors)
