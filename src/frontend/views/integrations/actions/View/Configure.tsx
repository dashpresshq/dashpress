import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect } from "react";
import { IIntegrationsList } from "shared/types/actions";
import { ToastService } from "frontend/lib/toast";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import {
  useActivationConfiguration,
  useUpdateActivatedActionMutation,
} from "../actions.store";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "../constants";
import { PasswordMessage, PasswordToReveal } from "../../Password";

interface IProps {
  integrationDetail: IIntegrationsList;
  activationId: string;
}

export function Configure({ activationId, integrationDetail }: IProps) {
  const updateActivatedActionMutation =
    useUpdateActivatedActionMutation(activationId);
  const activationConfiguration = useActivationConfiguration(activationId);

  useEffect(() => {
    if (activationConfiguration.error) {
      ToastService.error(activationConfiguration.error);
    }
  }, [activationConfiguration.error]);

  if (Object.keys(integrationDetail.configurationSchema).length === 0) {
    return (
      <Stack justify="center">
        <Typo.SM textStyle="italic">
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
        onSubmit={updateActivatedActionMutation.mutateAsync}
        initialValues={activationConfiguration.data || {}}
        buttonText={ACTION_INTEGRATIONS_CRUD_CONFIG.FORM_LANG.UPDATE}
        icon="save"
      />
    </>
  );
}
