
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
import { IEntityField } from "../../../backend/entities/types";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import { useEntityDiction, useEntitySlug } from "../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../hooks/entity/entity.store";

export function EntityCreate() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);

  const onSubmit = () => {};
  // TODo handle loading || error;
  return (
    <AppLayout
      breadcrumbs={[
        { label: entityDiction.plural, value: NAVIGATION_LINKS.ENTITY.TABLE(entity) },
        { label: "Create", value: NAVIGATION_LINKS.ENTITY.CREATE(entity) },
      ]}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.create(entityDiction.singular)}
          backLink={{ link: NAVIGATION_LINKS.ENTITY.TABLE(entity), label: entityDiction.plural }}
        >
          <ErrorAlert message={"error"} />
          <CreateEntityForm
            onSubmit={onSubmit}
            fields={entityScalarFields.data || []}
            isMakingRequest={false}
            resetForm={false}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

export const CreateEntityForm: React.FC<{
  fields: IEntityField[];
  isMakingRequest: boolean;
  initialValues?: unknown;
  onSubmit: () => void;
  resetForm: boolean;
}> = ({ onSubmit, isMakingRequest, initialValues, resetForm, fields }) => {
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
            {fields.map(({ name }) => {
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
