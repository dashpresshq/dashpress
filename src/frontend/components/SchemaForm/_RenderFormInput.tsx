import { sluggify } from "shared/lib/strings";
import { ISchemaFormConfig } from "shared/form-schemas/types";
import { IColorableSelection } from "shared/types/ui";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { FormInput } from "frontend/design-system/components/Form/FormInput";
import { FormNumberInput } from "frontend/design-system/components/Form/FormNumberInput";
import { FormSelect } from "frontend/design-system/components/Form/FormSelect";
import { FormDateInput } from "frontend/design-system/components/Form/FormDateInput";
import { AsyncFormSelect } from "frontend/design-system/components/Form/FormSelect/Async";
import { FormSwitch } from "frontend/design-system/components/Form/FormSwitch";
import { FormCodeEditor } from "frontend/design-system/components/Form/FormCodeEditor";
import { FormTextArea } from "frontend/design-system/components/Form/FormTextArea";
import { FormFileInput } from "frontend/design-system/components/Form/FormFileInput";
import { FormSelectButton } from "frontend/design-system/components/Form/FormSelectButton";
import { FormRichTextArea } from "frontend/design-system/components/Form/FormRichTextArea";
import { FieldInputProps, FieldMetaState } from "react-final-form";
import { ISharedFormInput } from "frontend/design-system/components/Form/_types";

interface IProps {
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  renderProps: {
    input: FieldInputProps<any, HTMLElement>;
    meta: FieldMetaState<any>;
  };
  apiSelections?: ISchemaFormConfig["apiSelections"];
  entityFieldSelections?: IColorableSelection[];
  required: boolean;
  disabled: boolean;
  label: string;
  placeholder?: string;
  description?: string;
  rightActions?: ISharedFormInput["rightActions"];
}

export function RenderFormInput({
  renderProps,
  label,
  type,
  entityFieldSelections = [],
  apiSelections,
  required,
  disabled,
  description,
  placeholder,
  rightActions,
}: IProps) {
  const formProps = {
    label,
    required,
    disabled,
    placeholder: placeholder || label,
    description,
    rightActions,
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
          name={sluggify(label)}
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
      return <FormRichTextArea {...formProps} />;

    case "image":
    case "file":
      return <FormFileInput {...formProps} uploadUrl="/api/upload" />;

    default:
      return <FormInput {...formProps} />;
  }
}
// TODO: Rating Input (for contributors)
