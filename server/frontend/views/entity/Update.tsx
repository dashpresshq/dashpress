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
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../hooks/entity/entity.config";
import { useEntityScalarFields } from "../../hooks/entity/entity.store";
import { Plus } from "react-feather";
import { useRouter } from "next/router";

export function EntityUpdate() {
  const entity = useEntitySlug();
  const id = useEntityId();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const router = useRouter();

  const onSubmit = () => {};
  // TODo handle loading || error;
  return (
    <AppLayout
      titleNeedsContext={true}
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        {
          label: entityDiction.singular,
          value: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
        },
        { label: "Update", value: NAVIGATION_LINKS.ENTITY.UPDATE(entity, id) },
      ]}
      actionItems={[
        {
          label: "Update Settings",
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.UPDATE(entity)),
        },
        {
          label: "Entity Fields",
          IconComponent: Plus,
          onClick: () =>
            router.push(NAVIGATION_LINKS.ENTITY.CONFIG.FIELDS(entity)),
        },
      ]}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.edit(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
            label: entityDiction.singular,
          }}
        >
          <ErrorAlert message={"error"} />
          <EntityUpdateForm
            onSubmit={onSubmit}
            fields={entityScalarFields.data || []}
          />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

export const EntityUpdateForm: React.FC<{
  fields: IEntityField[];
  initialValues?: unknown;
  onSubmit: () => void;
}> = ({ onSubmit, initialValues, fields }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, values, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
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
            <FormButton
              text={ButtonLang.createOrUpdate(initialValues)}
              isMakingRequest={submitting}
            />
          </form>
        );
      }}
    />
  );
};
