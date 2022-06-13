import { AppLayout } from "../../_layouts/app";
import {
  ErrorAlert,
  FormButton,
  FormInput,
  SectionBox,
  SectionCenter,
  Spacer,
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
import {
  useEntityDataDetails,
  useEntityDataUpdationMutation,
} from "../../hooks/data/data.store";

export function EntityUpdate() {
  const entity = useEntitySlug();
  const id = useEntityId();
  const entityDiction = useEntityDiction();
  const entityScalarFields = useEntityScalarFields(entity);
  const router = useRouter();
  const entityDataUpdationMutation = useEntityDataUpdationMutation(entity, id);
  const dataDetails = useEntityDataDetails(entity, id);

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
        {dataDetails.error ? (
          <>
            <Spacer />
            <ErrorAlert message={dataDetails.error} />
            <Spacer />
          </>
        ) : null}
        <SectionBox
          title={TitleLang.edit(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
            label: entityDiction.singular,
          }}
        >
          {dataDetails.isLoading ? (
            <>TODO Loading Data...</>
          ) : (
            <EntityUpdateForm
              onSubmit={entityDataUpdationMutation.mutateAsync}
              fields={entityScalarFields.data || []}
              initialValues={dataDetails.data}
            />
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}

export const EntityUpdateForm: React.FC<{
  fields: IEntityField[];
  initialValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
}> = ({ onSubmit, initialValues, fields }) => {
  return (
    <Form
    // TODO Send only changed fields
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            {fields.map(({ name }) => {
              return (
                <Field
                  key={name}
                  name={name}
                  // validate={composeValidators(required, maxLength(32))}
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
