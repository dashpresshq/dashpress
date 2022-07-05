import { FormButton, FormInput, SectionBox } from '@gothicgeeks/design-system';
import { FC } from 'react';
import { Form, Field } from 'react-final-form';
import {
  ButtonLang,
  composeValidators,
  maxLength,
  required,
  VALIDATION_LENGTH,
} from '@gothicgeeks/shared';
import {
  useEntityDiction,
  useEntitySlug,
} from '../../../hooks/entity/entity.config';
import { NAVIGATION_LINKS } from '../../../lib/routing/links';
import { BaseEntitySettingsLayout } from './_Base';
import { IFormProps } from '../../../lib/form/types';
import { useUpsertConfigurationMutation } from '../../../hooks/configuration/configration.store';
// TODO validate plurals are unique
export function EntityDictionSettings() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const upsertConfigurationMutation = useUpsertConfigurationMutation(
    'entity_diction',
    entity,
  );
  return (
    <BaseEntitySettingsLayout
      menuItem={{
        link: NAVIGATION_LINKS.ENTITY.CONFIG.DICTION(entity),
        name: 'Diction Settings',
      }}
    >
      <SectionBox title="Diction Settings">
        <EntityDictionForm
          onSubmit={async (values) => {
            await upsertConfigurationMutation.mutateAsync(
              values as unknown as Record<string, string>,
            );
          }}
          initialValues={entityDiction}
        />
      </SectionBox>
    </BaseEntitySettingsLayout>
  );
}

interface IDictionSettings {
  plural: string;
  singular: string;
}

export const EntityDictionForm: FC<IFormProps<IDictionSettings>> = ({
  onSubmit,
  initialValues,
}) => (
  <Form
    onSubmit={onSubmit}
    initialValues={initialValues}
    render={({ handleSubmit, submitting }) => (
      <form onSubmit={handleSubmit}>
        <Field
          name="plural"
          validate={composeValidators(
            required,
            maxLength(VALIDATION_LENGTH.NAMES),
          )}
          validateFields={[]}
        >
          {(renderProps) => (
            <FormInput label="Plural" required {...renderProps} />
          )}
        </Field>
        <Field
          name="singular"
          validate={composeValidators(
            required,
            maxLength(VALIDATION_LENGTH.NAMES),
          )}
          validateFields={[]}
        >
          {(renderProps) => (
            <FormInput label="Singular" required {...renderProps} />
          )}
        </Field>
        <FormButton
          text={`${ButtonLang.update} Diction`}
          isMakingRequest={submitting}
        />
      </form>
    )}
  />
);
