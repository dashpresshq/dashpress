import { FormSelect } from "frontend/design-system/components/Form/Select";
import { FormDateInput } from "frontend/design-system/components/Form/Date";
import { AsyncFormSelect } from "frontend/design-system/components/Form/Select/Async";
import { FormSwitch } from "frontend/design-system/components/Form/Switch";
import { FormCodeEditor } from "frontend/design-system/components/Form/CodeEditor";
import { FormTextArea } from "frontend/design-system/components/Form/TextArea";
import { FormFileInput } from "frontend/design-system/components/Form/File";
import { FormSelectButton } from "frontend/design-system/components/Form/SelectButton";
import { FormRichTextArea } from "frontend/design-system/components/Form/RichText";
import { useExtendRenderFormInputProps } from "frontend/views/data/portal";
import { useLingui } from "@lingui/react";
import { FormInput } from "frontend/design-system/components/Form/Input";
import { FormNumberInput } from "frontend/design-system/components/Form/Number";
import { FormPasswordInput } from "frontend/design-system/components/Form/Password";
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
    case "url":
    case "color":
      return <FormInput type={type} {...formProps} />;

    case "number":
      return <FormNumberInput {...formProps} />;

    case "password":
      return <FormPasswordInput {...formProps} />;

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
