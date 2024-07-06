import { msg } from "@lingui/macro";
import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import type { IFormProps } from "frontend/lib/form/types";
import { composeValidators, required } from "frontend/lib/validations";
import { Field, Form } from "react-final-form";

import { FormButton } from "@/components/app/button/form";
import { FormInput } from "@/components/app/form/input/text";

import { getFieldsOffFormat } from "./utils";

interface IRelationsSettings {
  format: string;
  fields: string[];
}

export function EntityRelationsForm({
  onSubmit,
  entityFields,
  initialValues,
}: IFormProps<IRelationsSettings> & {
  entityFields: string[];
}) {
  const domainMessages = useAppConfigurationDomainMessages(
    "entity_relation_template"
  );

  return (
    <Form
      onSubmit={async (values: IRelationsSettings) =>
        await onSubmit({ ...values, fields: getFieldsOffFormat(values.format) })
      }
      validate={(values) => {
        const error: Partial<IRelationsSettings> = {};
        const fields = getFieldsOffFormat(values.format);
        const invalidField = fields.find(
          (field) => !entityFields.includes(field)
        );
        if (invalidField) {
          const validFields = entityFields.map((field) => ` '${field}'`);
          error.format = `'${invalidField}' is not a valid entity field. Valid fields are ${validFields}`;
        }
        return error;
      }}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, pristine }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Field
              name="format"
              validate={composeValidators(required)}
              validateFields={[]}
            >
              {({ input, meta }) => (
                <FormInput
                  label={msg`Display Format`}
                  description="Handlebars with valid fields from entity eg. {{ lastName }} - {{  firstName}}"
                  required
                  meta={meta}
                  input={input}
                />
              )}
            </Field>
            <FormButton
              text={domainMessages.FORM_LANG.UPSERT}
              isMakingRequest={submitting}
              systemIcon="Save"
              disabled={pristine}
            />
          </form>
        );
      }}
    />
  );
}
