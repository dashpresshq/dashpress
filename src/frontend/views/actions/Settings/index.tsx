import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  Text,
} from "@hadmean/chromista";
import { useRouteParam, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { BaseActionsLayout } from "../_Base";
import { useActionsList, useActivateActionMutation } from "../actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";

export function ActionSettings() {
  const currentKey = useRouteParam("key");

  const actionsList = useActionsList();

  const activateActionMutation = useActivateActionMutation(currentKey);

  const currentAction = (actionsList.data || []).find(
    ({ key }) => key === currentKey
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
        deleteAction={{
          action: () => {},
          isMakingDeleteRequest: false,
        }}
      >
        <ViewStateMachine
          loading={actionsList.isLoading}
          error={actionsList.error}
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
            <SchemaForm
              fields={currentAction.configurationSchema}
              onSubmit={activateActionMutation.mutateAsync}
              initialValues={{}}
              buttonText="Activate Action"
            />
          ) : (
            <Text>404: Unknown Action</Text>
          )}
        </ViewStateMachine>
      </SectionBox>
    </BaseActionsLayout>
  );
}

// if not active then just activate
// if activated then Integrations, Configure, Deactivate
// Your Password to view the configuration
