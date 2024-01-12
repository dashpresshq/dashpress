import { USER_PERMISSIONS } from "shared/constants/user";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useState } from "react";
import { DOCUMENTATION_LABEL } from "frontend/docs";
import { FormIntegrationsDocumentation } from "frontend/docs/form-integrations";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { useSetPageDetails } from "frontend/lib/routing/usePageDetails";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SectionBox } from "frontend/design-system/components/Section/SectionBox";
import { BaseActionsLayout } from "../_Base";
import {
  useActionIntegrationsList,
  useActiveActionList,
} from "./actions.store";
import { ACTIONS_VIEW_KEY } from "../constants";
import { ActionSettingsView } from "./View";
import { ACTION_INTEGRATIONS_CRUD_CONFIG } from "./constants";

const DOCS_TITLE = ACTION_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.TITLE;

export function ActionsIntegrations() {
  const currentKey = useRouteParam("key");
  const [isDocOpen, setIsDocOpen] = useState(false);

  const integrationsList = useActionIntegrationsList();
  const activeActionsList = useActiveActionList();

  const integrationDetail = integrationsList.data.find(
    ({ key }) => key === currentKey
  );

  const activeAction = activeActionsList.data.find(
    (integrationKey) => integrationKey === currentKey
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
        actionButtons={[
          {
            _type: "normal",
            action: () => setIsDocOpen(true),
            icon: "help",
            label: DOCUMENTATION_LABEL.CONCEPT(DOCS_TITLE),
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
      <FormIntegrationsDocumentation
        title={DOCS_TITLE}
        close={setIsDocOpen}
        isOpen={isDocOpen}
      />
    </BaseActionsLayout>
  );
}
