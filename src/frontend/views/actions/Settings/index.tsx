/* eslint-disable no-nested-ternary */
import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  Tabs,
  Text,
} from "@hadmean/chromista";
import { useRouteParam, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { BaseActionsLayout } from "../_Base";
import {
  useActionsList,
  useActivateActionMutation,
  useActiveActionList,
} from "../actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ActionSettings() {
  const currentKey = useRouteParam("key");

  const actionsList = useActionsList();
  const activeActionsList = useActiveActionList();

  const activateActionMutation = useActivateActionMutation(currentKey);

  const currentAction = (actionsList.data || []).find(
    ({ key }) => key === currentKey
  );

  const isActionActive = (activeActionsList.data || []).find(
    ({ integrationKey }) => integrationKey === currentKey
  );

  useSetPageDetails({
    pageTitle: "Actions Settings",
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_ACTIONS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox
        title={currentAction ? currentAction.title : "Loading..."}
        description={currentAction ? currentAction.description : ""}
      >
        <ViewStateMachine
          loading={actionsList.isLoading || activeActionsList.isLoading}
          error={actionsList.error || activeActionsList.error}
          loader={
            <FormSkeleton
              schema={[
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
                FormSkeletonSchema.Input,
              ]}
            />
          }
        >
          {currentAction ? (
            isActionActive ? (
              <Tabs
                contents={[
                  {
                    label: "Usages",
                    content: <>Usages</>,
                  },
                  {
                    label: "Configure",
                    content: (
                      // Your Password to view the configuration
                      <SchemaForm
                        fields={currentAction.configurationSchema}
                        onSubmit={activateActionMutation.mutateAsync}
                        initialValues={{}}
                        buttonText="Update Configuration"
                      />
                    ),
                  },
                  {
                    label: "Deactivate",
                    content: <>Some Red Button and can not Deactivate HTTP</>,
                  },
                ]}
              />
            ) : (
              <SchemaForm
                fields={currentAction.configurationSchema}
                onSubmit={activateActionMutation.mutateAsync}
                initialValues={{}}
                buttonText="Activate Action"
              />
            )
          ) : (
            <Text>404: Unknown Action</Text>
          )}
        </ViewStateMachine>
      </SectionBox>
    </BaseActionsLayout>
  );
}
