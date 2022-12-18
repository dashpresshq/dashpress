import { Spacer, Stack, Text } from "@hadmean/chromista";
import { ToastService } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect } from "react";
import { IIntegrationsList } from "shared/types/actions";
import {
  useActivationConfiguration,
  useUpdateActivatedActionMutation,
} from "../actions.store";
import { usePasswordStore } from "../../password.store";

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
        <Text textStyle="italic" size="5">
          This action does not have configuration
        </Text>
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
        <Text textStyle="italic" size="5">
          For security reasons, Please input your account password to reveal
          this action configuration
        </Text>
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
          buttonText={
            activationConfiguration.isLoading
              ? "Just a sec..."
              : `Reveal ${integrationDetail.title}'s Configuration`
          }
        />
      </>
    );
  }
  return (
    <SchemaForm
      fields={integrationDetail.configurationSchema}
      onSubmit={updateActivatedActionMutation.mutateAsync}
      initialValues={activationConfiguration.data || {}}
      buttonText="Update Configuration"
    />
  );
}
