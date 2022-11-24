import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { Spacer, Tabs, Text } from "@hadmean/chromista";
import {
  HTTP_ACTION_KEY,
  IActionsList,
  IActivatedAction,
} from "shared/types/actions";
import {
  useActivateActionMutation,
  useActivationConfiguration,
  useDeactivateActionMutation,
  useUpdateActivatedActionMutation,
} from "../actions.store";
import { usePasswordStore } from "../password.store";

interface IProps {
  actionDetails?: IActionsList;
  activeAction?: IActivatedAction;
}

export function ActionSettingsView({ actionDetails, activeAction }: IProps) {
  const activateActionMutation = useActivateActionMutation(actionDetails?.key);
  const activationConfiguration = useActivationConfiguration(
    activeAction?.activationId
  );
  const updateActivatedActionMutation = useUpdateActivatedActionMutation(
    activeAction?.activationId
  );

  const deactivateActionMutation = useDeactivateActionMutation();

  const passwordStore = usePasswordStore();

  if (!actionDetails) {
    return <Text>404: Unknown Action</Text>;
  }

  if (!activeAction) {
    return (
      <SchemaForm
        fields={actionDetails.configurationSchema}
        onSubmit={activateActionMutation.mutateAsync}
        initialValues={{}}
        buttonText="Activate Action"
      />
    );
  }

  const deactivationKey = `DEACTIVATE_${actionDetails.key}`.toUpperCase();

  return (
    <Tabs
      contents={[
        {
          label: "Instances",
          content: <>Usages</>,
        },
        {
          label: "Configure",
          content:
            // eslint-disable-next-line no-nested-ternary
            Object.keys(actionDetails.configurationSchema).length === 0 ? (
              <Text>This action does not have configuration</Text>
            ) : //   Better UX
            // && activationConfiguration.isSuccess
            !passwordStore.password ? (
              <>
                <Text textStyle="italic" size="5">
                  For security reasons, Please input your account password to
                  reveal this action configuration
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
                  buttonText="Set Password"
                />
              </>
            ) : (
              <SchemaForm
                fields={actionDetails.configurationSchema}
                onSubmit={updateActivatedActionMutation.mutateAsync}
                initialValues={activationConfiguration.data || {}}
                buttonText="Update Configuration"
              />
            ),
        },
        {
          label: "Deactivate",
          content:
            actionDetails.key === HTTP_ACTION_KEY ? (
              <Text>The HTTP action can not be deactivated</Text>
            ) : (
              <>
                <Text textStyle="italic" size="5">
                  Deactivating an action will irrevocabily delete its
                  configurations and remove all its instances
                </Text>
                <Spacer />
                <SchemaForm
                  fields={{
                    confirm: {
                      type: "text",
                      label: `Input ${deactivationKey} to continue`,
                      validations: [
                        {
                          validationType: "regex",
                          constraint: {
                            pattern: `${deactivationKey}$`,
                          },
                          errorMessage: "Incorrect value",
                        },
                      ],
                    },
                  }}
                  onSubmit={() =>
                    deactivateActionMutation.mutateAsync(
                      activeAction.activationId
                    )
                  }
                  buttonText="Deactivate Action"
                />
              </>
            ),
        },
      ]}
    />
  );
}
