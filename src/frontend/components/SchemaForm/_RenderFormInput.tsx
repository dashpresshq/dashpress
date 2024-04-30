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
import { useExtendRenderFormInputProps } from "frontend/views/data/portal";
import { useLingui } from "@lingui/react";
import { IRenderFormInputProps } from "./types";

export function RenderFormInput(props: IRenderFormInputProps) {
  const {
    formProps: formProps$1,
    label,
    type,
    entityFieldSelections = [],
    apiSelections,
    required,
    disabled,
    description,
    placeholder,
    rightActions,
    onChange,
  } = useExtendRenderFormInputProps(props);
  const { _ } = useLingui();
  const formProps = {
    label,
    required,
    disabled,
    placeholder: placeholder || label,
    description,
    rightActions,
    meta: formProps$1.meta,
    input: {
      ...formProps$1.input,
      onChange: (value: unknown) => {
        formProps$1.input.onChange(value);
        onChange?.(value);
      },
    },
  };

  if (entityFieldSelections.length > 0) {
    if (
      entityFieldSelections.reduce((acc, selection) => {
        return acc + _(selection.label).length;
      }, 0) < 15
    ) {
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
          name={formProps.input.name}
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
