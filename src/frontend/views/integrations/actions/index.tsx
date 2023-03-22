import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
} from "@hadmean/chromista";
import { useRouteParam, useSetPageDetails } from "frontend/lib/routing";
import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { LINK_TO_DOCS } from "frontend/views/constants";
import { BaseActionsLayout } from "../_Base";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "./actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";
import { ActionSettingsView } from "./View";

export function ActionsIntegrations() {
  const currentKey = useRouteParam("key");

  const integrationsList = useActionIntegrationsList();
  const activeActionsList = useActiveActionList();

  const integrationDetail = (integrationsList.data || []).find(
    ({ key }) => key === currentKey
  );

  const activeAction = (activeActionsList.data || []).find(
    ({ integrationKey }) => integrationKey === currentKey
  );

  useSetPageDetails({
    pageTitle: "Manage Integrations",
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_INTEGRATIONS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox
        isLoading={!integrationDetail}
        title={integrationDetail?.title}
        description={integrationDetail ? integrationDetail.description : ""}
        iconButtons={[
          {
            action: LINK_TO_DOCS(`integrations/form`),
            icon: "help",
            label: "Form Integrations Documentation",
          },
        ]}
      >
        <ViewStateMachine
          loading={integrationsList.isLoading || activeActionsList.isLoading}
          error={integrationsList.error || activeActionsList.error}
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
            integrationDetail={integrationDetail}
            activeAction={activeAction}
          />
        </ViewStateMachine>
      </SectionBox>
    </BaseActionsLayout>
  );
}
