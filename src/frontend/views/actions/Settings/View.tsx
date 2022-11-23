import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { Tabs, Text } from "@hadmean/chromista";
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
  const deactivateActionMutation = useDeactivateActionMutation();
  const activationConfiguration = useActivationConfiguration(
    activeAction.activationId
  );
  const updateActivatedActionMutation = useUpdateActivatedActionMutation(
    activeAction.activationId
  );

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
            passwordStore.password || activationConfiguration.error ? (
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
                <Text>
                  Deactivating an action will irrevocabily delete its
                  configurations and remove all its instances
                </Text>
                <SchemaForm
                  fields={{
                    confirm: {
                      type: "text",
                      validations: [
                        {
                          validationType: "regex",
                          constraint: {
                            pattern:
                              `DEACTIVATE ${actionDetails.title}`.toUpperCase(),
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
