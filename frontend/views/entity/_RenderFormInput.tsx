import {
  FormCheckBox,
  FormInput,
  FormNumberInput,
  FormTextArea,
} from "@gothicgeeks/design-system";
import { ISharedFormInput } from "@gothicgeeks/design-system/dist/components/Form/_types";
import { TemplateService } from "frontend/lib/templates";
import {
  ENTITY_TYPES_SELECTION_BAG,
  ENTITY_VALIDATION_CONFIG,
} from "../../../shared/validations.constants";
import { IFieldValidationItem } from "./Configure/Fields/FieldsValidation";

export interface IBaseEntityForm {
  fields: string[];
  getEntityFieldLabels: (name: string) => string;
  onSubmit: (data: Record<string, unknown>) => void;
  entityFieldTypes: Record<string, keyof typeof ENTITY_TYPES_SELECTION_BAG>;
}

export interface IEntityFormSettings {
  entityValidationsMap: Record<string, IFieldValidationItem[]>;
}

export const RenderFormInput = ({
  renderProps,
  label,
  type,
}: {
  type: keyof typeof ENTITY_TYPES_SELECTION_BAG;
  renderProps: ISharedFormInput;
  label: string;
}) => {
  const required = true;

  switch (type) {
    case "email":
    case "password":
    case "url":
      return (
        <FormInput
          label={label}
          type={type}
          required={required}
          {...renderProps}
        />
      );
    case "number":
      return (
        <FormNumberInput label={label} required={required} {...renderProps} />
      );

    case "boolean":
      return (
        // TODO use switch with labels
        <FormCheckBox label={label} required={required} {...renderProps} />
      );

    case "textarea":
      return (
        <FormTextArea {...renderProps} label={label} required={required} />
      );
  }

  return <FormInput label={label} required={required} {...renderProps} />;
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
