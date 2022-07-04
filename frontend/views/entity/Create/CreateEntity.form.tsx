import { FormButton, Stack } from "@gothicgeeks/design-system";
import { ButtonLang, resetFormValues } from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import {
  RenderFormInput,
  IBaseEntityForm,
  IEntityFormSettings,
  runValidationError,
  isFieldRequired,
} from "../_RenderFormInput";

export const CreateEntityForm: React.FC<
  IBaseEntityForm & IEntityFormSettings
> = ({
  onSubmit,
  fields,
  getEntityFieldLabels,
  entityFieldTypes,
  entityValidationsMap,
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      validate={runValidationError(
        fields,
        entityValidationsMap,
        getEntityFieldLabels
      )}
      render={({ handleSubmit, form, values, submitting }) => {
        return (
          <form
            noValidate={true}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e)?.then(() => {
                resetFormValues(
                  true,
                  values as Record<string, string>,
                  form as any
                );
              });
            }}
          >
            {fields.map((name) => {
              return (
                <Field key={name} name={name} validateFields={[]}>
                  {(renderProps) => (
                    <RenderFormInput
                      type={entityFieldTypes[name]}
                      required={isFieldRequired(entityValidationsMap, name)}
                      label={getEntityFieldLabels(name)}
                      renderProps={renderProps}
                    />
                  )}
                </Field>
              );
            })}
            <Stack>
              <FormButton
                text={ButtonLang.create}
                isMakingRequest={submitting}
              />
            </Stack>
          </form>
        );
      }}
    />
  );
};

// Create new
// Settings After create go to settings/ go to table
