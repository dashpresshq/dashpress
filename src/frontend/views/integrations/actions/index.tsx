import { UserPermissions } from "shared/constants/user";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import { msg } from "@lingui/macro";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useDomainMessages } from "frontend/lib/crud-config";
import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { BaseActionsLayout } from "../_Base";
import { useIntegrationsList, useActiveIntegrations } from "./actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";
import { ActionSettingsView } from "./View";

export function ActionsIntegrations() {
  const currentKey = useRouteParam("key");
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);

  const integrationsList = useIntegrationsList();
  const activeActionsList = useActiveIntegrations();

  const integrationDetail = integrationsList.data.find(
    ({ key }) => key === currentKey
  );

  const activeAction = activeActionsList.data.find(
    (integration) => integration === currentKey
  );

  useSetPageDetails({
    pageTitle: domainMessages.TEXT_LANG.TITLE,
    viewKey: ACTIONS_VIEW_KEY,
    permission: UserPermissions.CAN_MANAGE_APP_CREDENTIALS,
  });

  return (
    <BaseActionsLayout>
      <SectionBox
        isLoading={!integrationDetail}
        title={msg`${integrationDetail?.title}`}
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
