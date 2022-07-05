import { FormButton, Stack } from '@gothicgeeks/design-system';
import { ButtonLang, resetFormValues } from '@gothicgeeks/shared';
import { Form, Field } from 'react-final-form';
import {
  RenderFormInput,
  IBaseEntityForm,
  IEntityFormSettings,
  runValidationError,
  isFieldRequired,
} from '../_RenderFormInput';

export const CreateEntityForm: React.FC<
  IBaseEntityForm & IEntityFormSettings
> = ({
  onSubmit,
  fields,
  getEntityFieldLabels,
  entityFieldSelections,
  entityFieldTypes,
  entityValidationsMap,
}) => (
  <Form
    onSubmit={onSubmit}
    validate={runValidationError(
      fields,
      entityValidationsMap,
      getEntityFieldLabels,
    )}
    render={({
      handleSubmit, form, values, submitting, pristine,
    }) => (
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e)?.then(() => {
            resetFormValues(
              true,
                  values as Record<string, string>,
                  form as any,
            );
          });
        }}
      >
        {fields.map((name) => (
          <Field key={name} name={name} validateFields={[]}>
            {(renderProps) => (
              <RenderFormInput
                type={entityFieldTypes[name]}
                required={isFieldRequired(entityValidationsMap, name)}
                label={getEntityFieldLabels(name)}
                entityFieldSelections={entityFieldSelections[name]}
                renderProps={renderProps}
              />
            )}
          </Field>
        ))}
        <Stack>
          <FormButton
            text={ButtonLang.create}
            isMakingRequest={submitting}
            disabled={pristine}
          />
        </Stack>
      </form>
    )}
  />
);

// Create new
// Settings After create go to settings/ go to table
