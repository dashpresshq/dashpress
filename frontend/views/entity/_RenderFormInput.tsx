import {
  FormInput,
  FormNumberInput,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from "@gothicgeeks/design-system";
import { ISharedFormInput } from "@gothicgeeks/design-system/dist/components/Form/_types";
import { StringUtils } from "@gothicgeeks/shared";
import { IFieldValidationItem } from "shared/validations/types";
import { FIELD_TYPES_CONFIG_MAP } from "../../../shared/validations";
import { IColorableSelection } from "./Configure/Fields/types";

export interface IBaseEntityForm {
  fields: string[];
  entityFieldSelections: Record<string, IColorableSelection[]>;
  getEntityFieldLabels: (name: string) => string;
  onSubmit: (data: Record<string, unknown>) => void;
  entityFieldTypes: Record<string, keyof typeof FIELD_TYPES_CONFIG_MAP>;
}

export interface IEntityFormSettings {
  entityValidationsMap: Record<string, IFieldValidationItem[]>;
}

interface IProps {
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  renderProps: ISharedFormInput;
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

  switch (type) {
    case "email":
    case "password":
    case "url":
      return <FormInput type={type} {...formProps} />;
    case "number":
      return <FormNumberInput {...formProps} />;

    case "selection":
    case "selection-enum":
    case "reference":
      return <FormSelect {...formProps} selectData={entityFieldSelections} />;

    case "boolean":
      return (
        <FormSwitch
          name={StringUtils.sluggify(label)}
          value={formProps.input.value}
          onChange={formProps.input.onChange}
          {...formProps}
        />
      );

    case "textarea":
      return <FormTextArea {...formProps} />;
    default:
      return <FormInput {...formProps} />;
  }
}

export const isFieldRequired = (
  entityValidationsMap: Record<string, IFieldValidationItem[]>,
  field: string
): boolean =>
  !!entityValidationsMap[field]?.find(
    (item) => item.validationType === "required"
  );
