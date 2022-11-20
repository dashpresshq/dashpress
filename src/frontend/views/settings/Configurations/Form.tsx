import { IFormProps } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IKeyValue } from "./types";

// Only capital letters no spaces

export const FORM_SCHEMA: IAppliedSchemaFormConfig<IKeyValue> = {
  key: {
    type: "text",
    validations: [
      {
        validationType: "required",
      },
      {
        validationType: "alphanumeric",
      },
      {
        validationType: "isUpperCase",
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
