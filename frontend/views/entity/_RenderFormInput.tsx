import {
  FormInput,
  FormNumberInput,
  FormSelect,
  FormSwitch,
  FormTextArea,
} from "@gothicgeeks/design-system";
import { ISharedFormInput } from "@gothicgeeks/design-system/dist/components/Form/_types";
import { StringUtils } from "@gothicgeeks/shared";
import { TemplateService } from "frontend/lib/templates";
import {
  ENTITY_TYPES_SELECTION_BAG,
  ENTITY_VALIDATION_CONFIG,
} from "../../../shared/validations.constants";
import { IFieldValidationItem } from "./Configure/Fields/FieldsValidation";
import { IColorableSelection } from "./Configure/Fields/types";

export interface IBaseEntityForm {
  fields: string[];
  entityFieldSelections: Record<string, IColorableSelection[]>;
  getEntityFieldLabels: (name: string) => string;
  onSubmit: (data: Record<string, unknown>) => void;
  entityFieldTypes: Record<string, keyof typeof ENTITY_TYPES_SELECTION_BAG>;
}

export interface IEntityFormSettings {
  entityValidationsMap: Record<string, IFieldValidationItem[]>;
}

interface IProps {
  type: keyof typeof ENTITY_TYPES_SELECTION_BAG;
  renderProps: ISharedFormInput;
  entityFieldSelections?: IColorableSelection[];
  required: boolean;
  label: string;
}

export const RenderFormInput = ({
  renderProps,
  label,
  type,
  entityFieldSelections = [],
  required,
}: IProps) => {
  const formProps = {
    label,
    required,
    ...renderProps,
  };

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
  }

  return <FormInput {...formProps} />;
};

export const isFieldRequired = (
  entityValidationsMap: Record<string, IFieldValidationItem[]>,
  field: string
): boolean => {
  return !!entityValidationsMap[field].find(
    (item) => item.validationType === "required"
  );
};

export const runValidationError =
  (
    fields: string[],
    entityValidationsMap: Record<string, IFieldValidationItem[]>,
    getEntityFieldLabels: (input: string) => string
  ) =>
  (values: Record<string, unknown>) => {
    const validations = Object.fromEntries(
      fields.map((field) => {
        const validationsToRun = entityValidationsMap[field] || [];

        const firstFailedValidation = validationsToRun.find((validation) => {
          return ENTITY_VALIDATION_CONFIG[
            validation.validationType
          ]?.implementation(
            values[field],
            validation.errorMessage,
            validation.constraint || {},
            values
          );
        });

        return [
          field,
          firstFailedValidation
            ? TemplateService.compile(firstFailedValidation.errorMessage, {
                name: getEntityFieldLabels(field),
                ...firstFailedValidation.constraint,
              })
            : undefined,
        ];
      })
    );
    return validations;
  };
