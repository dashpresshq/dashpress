import { FormButton } from "@gothicgeeks/design-system";
import { ButtonLang } from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import { runValidationError } from "shared/validations/run";
import {
  RenderFormInput,
  IBaseEntityForm,
  IEntityFormSettings,
  isFieldRequired,
} from "../_RenderFormInput";

type IProps = IBaseEntityForm & {
  initialValues?: Record<string, unknown>;
} & IEntityFormSettings;

export function UpdateEntityForm({
  onSubmit,
  initialValues,
  fields,
  entityFieldTypes,
  entityFieldSelections,
  entityValidationsMap,
  getEntityFieldLabels,
}: IProps) {
  return (
    <Form
      // TODO Send only changed fields
      onSubmit={onSubmit}
      validate={runValidationError(
        fields,
        entityValidationsMap,
        getEntityFieldLabels
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
}
