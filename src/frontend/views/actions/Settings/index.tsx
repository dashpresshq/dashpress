import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useRouteParam, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { BaseActionsLayout } from "../_Base";
import { useActionsList, useActivateActionMutation } from "../actions.store";

export function ActionSettings() {
  const currentKey = useRouteParam("key");

  const actionsList = useActionsList();

  const activateActionMutation = useActivateActionMutation(currentKey);

  const currentAction = (actionsList.data || []).find(
    ({ key }) => key === currentKey
  );

  useSetPageDetails({
    pageTitle: "Actions Settings",
    viewKey: "ACTIONS_VIEW_KEY",
    permission: USER_PERMISSIONS.CAN_MANAGE_ACTIONS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox
        title={currentAction ? currentAction.title : "Loading..."}
        description={currentAction ? currentAction.description : ""}
        deleteAction={{
          action: () => {
            console.log("dsd");
          },
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
          <SchemaForm
            fields={currentAction.configurationSchema}
            onSubmit={activateActionMutation.mutateAsync}
            initialValues={{}}
            buttonText="Activate Action"
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseActionsLayout>
  );
}
