import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { BaseActionsLayout } from "../_Base";
import { useIntegrationsList, useActiveIntegrations } from "./actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";
import { ActionSettingsView } from "./View";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "./constants";

export function ActionsIntegrations() {
  const currentKey = useRouteParam("key");

  const integrationsList = useIntegrationsList();
  const activeActionsList = useActiveIntegrations();

  const integrationDetail = integrationsList.data.find(
    ({ key }) => key === currentKey
  );

  const activeAction = activeActionsList.data.find(
    (integration) => integration === currentKey
  );

  useSetPageDetails({
    pageTitle: ACTION_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.TITLE,
    viewKey: ACTIONS_VIEW_KEY,
    permission: USER_PERMISSIONS.CAN_MANAGE_APP_CREDENTIALS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox
        isLoading={!integrationDetail}
        title={integrationDetail?.title}
        description={integrationDetail ? integrationDetail.description : ""}
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
