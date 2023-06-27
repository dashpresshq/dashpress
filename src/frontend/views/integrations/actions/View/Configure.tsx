import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect } from "react";
import { IIntegrationsList } from "shared/types/actions";
import { ToastService } from "frontend/lib/toast";
import { Typo } from "frontend/design-system/primitives/Text";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import {
  useActivationConfiguration,
  useUpdateActivatedActionMutation,
} from "../actions.store";
import { usePasswordStore } from "../../password.store";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "../constants";

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

  const passwordStore = usePasswordStore();

  if (Object.keys(integrationDetail.configurationSchema).length === 0) {
    return (
      <Stack justify="center">
        <Typo.SM textStyle="italic">
          This action does not have configuration
        </Typo.SM>
      </Stack>
    );
  }

  if (
    activationConfiguration.error ||
    activationConfiguration.isLoading ||
    !passwordStore.password
  ) {
    return (
      <>
        <Typo.SM textStyle="italic">
          For security reasons, Please input your account password to reveal
          this action configuration
        </Typo.SM>
        <Spacer />
        <SchemaForm
          fields={{
            password: {
              type: "password",
              validations: [
                {
                  validationType: "required",
                },
              ],
            },
          }}
          onSubmit={async ({ password }: { password: string }) => {
            passwordStore.setPassword(password);
          }}
          icon="eye"
          buttonText={() => {
            return activationConfiguration.isLoading
              ? `Revealing ${integrationDetail.title}'s Configuration`
              : `Reveal ${integrationDetail.title}'s Configuration`;
          }}
        />
      </>
    );
  }
  return (
    <SchemaForm
      fields={integrationDetail.configurationSchema}
      onSubmit={updateActivatedActionMutation.mutateAsync}
      initialValues={activationConfiguration.data || {}}
      buttonText={ACTION_INTEGRATIONS_CRUD_CONFIG.FORM_LANG.UPDATE}
      icon="save"
    />
  );
}
