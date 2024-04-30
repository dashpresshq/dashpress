import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect } from "react";
import { IIntegrationsList } from "shared/types/actions";
import { ToastService } from "frontend/lib/toast";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { typescriptSafeObjectDotKeys } from "shared/lib/objects";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import {
  useActivationConfiguration,
  useUpdateActivatedIntegrationMutation,
} from "../actions.store";
import { PasswordMessage, PasswordToReveal } from "../../Password";

interface IProps {
  integrationDetail: IIntegrationsList;
  activationId: string;
}

export function Configure({ activationId, integrationDetail }: IProps) {
  const updateActivatedIntegrationMutation =
    useUpdateActivatedIntegrationMutation(activationId);
  const activationConfiguration = useActivationConfiguration(activationId);
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);
  useEffect(() => {
    if (activationConfiguration.error) {
      ToastService.error(activationConfiguration.error);
    }
  }, [activationConfiguration.error]);

  if (
    typescriptSafeObjectDotKeys(integrationDetail.configurationSchema)
      .length === 0
  ) {
    return (
      <Stack $justify="center">
        <Typo.SM $textStyle="italic">
          This action does not have configuration
        </Typo.SM>
      </Stack>
    );
  }

  if (activationConfiguration.data === undefined) {
    return (
      <PasswordToReveal
        label={`${integrationDetail.title}'s Configuration`}
        isLoading={activationConfiguration.isLoading}
      />
    );
  }
  return (
    <>
      <PasswordMessage />
      <Spacer />
      <SchemaForm
        fields={integrationDetail.configurationSchema}
        onSubmit={updateActivatedIntegrationMutation.mutateAsync}
        initialValues={activationConfiguration.data || {}}
        buttonText={domainMessages.FORM_LANG.UPDATE}
        systemIcon="Save"
      />
    </>
  );
}
