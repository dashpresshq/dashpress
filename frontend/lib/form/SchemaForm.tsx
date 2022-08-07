import { FormButton } from "@gothicgeeks/design-system";
import { IColorableSelection } from "frontend/views/entity/Configure/Fields/types";
import { RenderFormInput } from "frontend/views/entity/_RenderFormInput";
import { Field, Form } from "react-final-form";
import { FIELD_TYPES_CONFIG_MAP } from "shared/validations";
import { runValidationError } from "shared/validations/run";
import { IFieldValidationItem } from "shared/validations/types";
import { userFriendlyCase } from "../strings";

interface ISchemaFormConfig {
  selections?: IColorableSelection[];
  type: keyof typeof FIELD_TYPES_CONFIG_MAP;
  label?: string;
  validations: IFieldValidationItem[];
}

interface IProps<T> {
  fields: Record<keyof T, ISchemaFormConfig>;
  onSubmit: (data: T) => void;
  initialValues?: T;
  buttonText: string;
}

export function SchemaForm<T extends Record<string, unknown>>({
  onSubmit,
  fields,
  buttonText,
  initialValues,
}: IProps<T>) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={runValidationError(
        Object.keys(fields),
        Object.fromEntries(
          Object.entries(fields).map(([field, config]) => [
            field,
            config.validations,
          ])
        ),
        (field: keyof T) =>
          fields[field].label || userFriendlyCase(field as string)
      )}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          {Object.entries(fields).map(
            ([field, bag]: [string, ISchemaFormConfig]) => (
              <Field key={field} name={field} validateFields={[]}>
                {(renderProps) => (
                  <RenderFormInput
                    type={bag.type}
                    required={bag.validations.some(
                      (validation) => validation.validationType === "required"
                    )}
                    label={bag.label || userFriendlyCase(field)}
                    entityFieldSelections={bag.selections}
                    renderProps={renderProps}
                  />
                )}
              </Field>
            )
          )}
          <FormButton
            text={buttonText}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </form>
      )}
    />
  );
}
