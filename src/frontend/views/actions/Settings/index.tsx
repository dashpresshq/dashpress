import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useRouteParam, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/types/user";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";
import { BaseActionsLayout } from "../_Base";
import { useActionsList, useActiveActionList } from "../actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";
import { ActionSettingsView } from "./View";

export function ActionSettings() {
  const currentKey = useRouteParam("key");

  const actionsList = useActionsList();
  const activeActionsList = useActiveActionList();

  const actionDetails = (actionsList.data || []).find(
    ({ key }) => key === currentKey
  );

  const activeAction = (activeActionsList.data || []).find(
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
        title={actionDetails ? actionDetails.title : "Loading..."}
        description={actionDetails ? actionDetails.description : ""}
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
          <ActionSettingsView
            actionDetails={actionDetails}
            activeAction={activeAction}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseActionsLayout>
  );
}
