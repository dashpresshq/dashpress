import {
  ErrorAlert,
  FormButton,
  FormCheckBox,
  FormInput,
  SectionBox,
} from "@gothicgeeks/design-system";
import {
  useEntityCrudSettings,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "./_Base";
import { Form, Field } from "react-final-form";
import { ButtonLang } from "@gothicgeeks/shared";
import { IFormProps } from "../../../lib/form/types";
import { useUpsertConfigurationMutation } from "../../../hooks/configuration/configration.store";

export const EntityCrudSettings = () => {
  const entity = useEntitySlug();
  const entityCrudSettings = useEntityCrudSettings();
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_crud_settings",
    entity
  );
  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.CRUD(entity),
        name: "CRUD Settings",
      }}
    >
      <SectionBox title="CRUD Settings">
        <ErrorAlert message={upsertConfigurationMutation.error} />
        <EntityCrudForm
          onSubmit={async (values) => {
            await upsertConfigurationMutation.mutateAsync(
              values as unknown as Record<string, string>
            );
          }}
          initialValues={entityCrudSettings.data}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};

interface ICrudSettings {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export const EntityCrudForm: React.FC<IFormProps<ICrudSettings>> = ({
  onSubmit,
  initialValues,
}) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Field name="create" validateFields={[]}>
              {(renderProps) => (
                <FormCheckBox label="Create Able" {...renderProps} />
              )}
            </Field>

            <Field name="read" validateFields={[]}>
              {(renderProps) => (
                <FormCheckBox label="Read Able" {...renderProps} />
              )}
            </Field>

            <Field name="update" validateFields={[]}>
              {(renderProps) => (
                <FormCheckBox label="Update Able" {...renderProps} />
              )}
            </Field>

            <Field name="delete" validateFields={[]}>
              {(renderProps) => (
                <FormCheckBox label="Delete Able" {...renderProps} />
              )}
            </Field>

            <FormButton
              text={ButtonLang.update + " CRUD Settings"}
              isMakingRequest={submitting}
            />
          </form>
        );
      }}
    />
  );
};
