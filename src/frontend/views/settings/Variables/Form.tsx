import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IKeyValue } from "./types";

export const CAPITAL_AND_UNDERSCORE_REGEX = `^[A-Z_]+$`;

export const FORM_SCHEMA: IAppliedSchemaFormConfig<IKeyValue> = {
  key: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "regex",
        constraint: {
          pattern: CAPITAL_AND_UNDERSCORE_REGEX,
        },
        errorMessage: "Only capital letters and underscores are allowed",
      },
    ],
  },
  value: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
    ],
  },
};

export function KeyValueForm({
  onSubmit,
  initialValues,
}: IFormProps<IKeyValue>) {
  return (
    <SchemaForm<IKeyValue>
      onSubmit={onSubmit}
      initialValues={initialValues}
      buttonText="Save"
      action={initialValues ? "update" : "create"}
      formExtension={{
        fieldsState: `
          return {
            key: {
              disabled: $.action === "update"
            }
          }
        `,
      }}
      fields={FORM_SCHEMA}
    />
  );
}
