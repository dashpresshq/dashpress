import {
  useSchemaFields,
  useSchemaScalarFields,
} from "../../data-store/schema.data-store";
import { useSlug } from "../../lib/routing/useSlug";
import { AppLayout } from "../../_layouts/app";
import {
  ErrorAlert,
  FormButton,
  FormInput,
  SectionBox,
  SectionCenter,
} from "@gothicgeeks/design-system";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
  TitleLang,
} from "@gothicgeeks/shared";
import { Form, Field } from "react-final-form";
import { IJsonSchemaModel } from "../../../backend/schema/types";

export function CreateModel() {
  const model = useSlug("model");
  const schemaScalarFields = useSchemaScalarFields(model);

  const onSubmit = () => {};
  // TODo handle loading || error;
  return (
    <AppLayout
      breadcrumbs={[
        { label: model, value: `/admin/${model}` },
        { label: "Create", value: `/admin/${model}/create` },
      ]}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.create(model)}
          backLink={{ link: `/admin/${model}`, label: model }}
        >
          <ErrorAlert message={"error"} />
          <ModelCreateForm
            onSubmit={onSubmit}
            schema={schemaScalarFields.data || []}
            isMakingRequest={false}
            resetForm={false}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

export const ModelCreateForm: React.FC<{
  schema: IJsonSchemaModel[];
  isMakingRequest: boolean;
  initialValues?: unknown;
  onSubmit: () => void;
  resetForm: boolean;
}> = ({ onSubmit, isMakingRequest, initialValues, resetForm, schema }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, values }) => {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e)?.then(() => {
                //   resetFormValues(resetForm, values, form);
              });
            }}
          >
            {/* <WhenFieldChanges field="name" becomes={undefined} set="slug" to={SLUG_VALUE} /> */}
            {schema.map(({ name }) => {
              return (
                <Field
                  key={name}
                  name={name}
                  validate={composeValidators(required, maxLength(32))}
                  validateFields={[]}
                >
                  {(renderProps) => (
                    <FormInput label={name} required={true} {...renderProps} />
                  )}
                </Field>
              );
            })}

            {/* <Field
                name="slug"
                validate={composeValidators(
                  required,
                  maxLength(VALIDATION_LENGTH.NAMES),
                  isSlug,
                  uniqueValidation(UniqueValidationEntities.Site, 'slug', initialValues?.id),
                )}
                validateFields={[]}
              >
                {renderProps => <FormInput label="Slug" required={true} {...renderProps} />}
              </Field> */}
            <FormButton
              text={ButtonLang.createOrUpdate(initialValues)}
              isMakingRequest={isMakingRequest}
            />
          </form>
        );
      }}
    />
  );
};
