import { FormButton } from '@gothicgeeks/design-system';
import { ButtonLang } from '@gothicgeeks/shared';
import { FC } from 'react';
import { Form, Field } from 'react-final-form';
import {
  RenderFormInput,
  IBaseEntityForm,
  IEntityFormSettings,
  runValidationError,
  isFieldRequired,
} from '../_RenderFormInput';

export const UpdateEntityForm: FC<
  IBaseEntityForm & {
    initialValues?: Record<string, unknown>;
  } & IEntityFormSettings
> = ({
  onSubmit,
  initialValues,
  fields,
  entityFieldTypes,
  entityFieldSelections,
  entityValidationsMap,
  getEntityFieldLabels,
}) => (
  <Form
      // TODO Send only changed fields
    onSubmit={onSubmit}
    validate={runValidationError(
      fields,
      entityValidationsMap,
      getEntityFieldLabels,
    )}
    initialValues={initialValues}
    render={({ handleSubmit, submitting, pristine }) => (
      <form noValidate onSubmit={handleSubmit}>
        {fields.map((name) => (
          <Field key={name} name={name} validateFields={[]}>
            {(renderProps) => (
              <RenderFormInput
                type={entityFieldTypes[name]}
                label={getEntityFieldLabels(name)}
                entityFieldSelections={entityFieldSelections[name]}
                required={isFieldRequired(entityValidationsMap, name)}
                renderProps={renderProps}
              />
            )}
          </Field>
        ))}
        <FormButton
          text={ButtonLang.update}
          isMakingRequest={submitting}
          disabled={pristine}
        />
      </form>
    )}
  />
);
