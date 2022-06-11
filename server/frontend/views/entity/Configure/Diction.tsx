import {
  ErrorAlert,
  FormButton,
  FormInput,
  SectionBox,
} from "@gothicgeeks/design-system";
import { useEntityDiction, useEntitySlug } from "../../../hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { BaseEntitySettingsLayout } from "./_Base";
import { Form, Field } from "react-final-form";
import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
  VALIDATION_LENGTH,
} from "@gothicgeeks/shared";
import { IFormProps } from "../../../lib/form/types";
import { useUpsertConfigurationMutation } from "../../../hooks/configuration/configration.store";

export const EntityDictionSettings = () => {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    "entity_diction",
    entity
  );
  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
        name: "Diction Settings",
      }}
    >
      <SectionBox title="Diction Settings">
        <ErrorAlert message={upsertConfigurationMutation.error} />
        <EntityDictionForm
          onSubmit={async (values) => {
            await upsertConfigurationMutation.mutateAsync(
              values as unknown as Record<string, string>
            );
          }}
          initialValues={entityDiction}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
};

interface IDictionSettings {
  plural: string;
  singular: string;
}

export const EntityDictionForm: React.FC<IFormProps<IDictionSettings>> = ({
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
            <Field
              name="plural"
              validate={composeValidators(
                required,
                maxLength(VALIDATION_LENGTH.NAMES)
              )}
              validateFields={[]}
            >
              {(renderProps) => (
                <FormInput label="Plural" required={true} {...renderProps} />
              )}
            </Field>
            <Field
              name="singular"
              validate={composeValidators(
                required,
                maxLength(VALIDATION_LENGTH.NAMES)
              )}
              validateFields={[]}
            >
              {(renderProps) => (
                <FormInput label="Singular" required={true} {...renderProps} />
              )}
            </Field>
            <FormButton
              text={ButtonLang.update + " Diction"}
              isMakingRequest={submitting}
            />
          </form>
        );
      }}
    />
  );
};
