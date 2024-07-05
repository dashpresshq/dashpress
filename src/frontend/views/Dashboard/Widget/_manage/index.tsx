import { AppLayout } from "frontend/_layouts/app";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useNavigationStack } from "frontend/lib/routing/useNavigationStack";
import { useRouteParam } from "frontend/lib/routing/useRouteParam";
import { SystemIconsList } from "shared/constants/Icons";
import type { IWidgetConfig } from "shared/types/dashboard";

import { ContentLayout } from "@/components/app/content-layout";
import { SectionBox } from "@/components/app/section-box";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { ViewStateMachine } from "@/components/app/view-state-machine";

import { useDashboardWidgets } from "../../dashboard.store";
import { DashboardWidgetForm } from "./Form";

interface IProps {
  onSave: (data: IWidgetConfig) => Promise<void>;
  action: "create" | "edit";
}

export function BaseManageDashboardWidget({ onSave, action }: IProps) {
  const dashboardId = useRouteParam("dashboardId");
  const widgetId = useRouteParam("widgetId");
  const activeEntities = useActiveEntities();
  const widgets = useDashboardWidgets(dashboardId);
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  const { canGoBack, goBack, backLink } = useNavigationStack();

  let widgetValue: Partial<IWidgetConfig> = {
    icon: SystemIconsList[0],
  };

  let widgetError = "";

  if (action === "edit" && !widgets.isLoading) {
    widgetValue = widgets.data.find(({ id }) => id === widgetId);
    if (!widgetValue) {
      widgetError = `Widget with id '${widgetId}' not found`;
    }
  }

  return (
    <AppLayout>
      <ContentLayout.Center>
        <SectionBox
          title={
            action === "create"
              ? domainMessages.TEXT_LANG.CREATE
              : domainMessages.TEXT_LANG.EDIT
          }
          backLink={backLink}
        >
          <ViewStateMachine
            loading={activeEntities.isLoading}
            error={activeEntities.error || widgetError}
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
            <DashboardWidgetForm
              entities={activeEntities.data}
              onSubmit={async (config) => {
                await onSave(config);
                if (canGoBack()) {
                  goBack();
                }
              }}
              action={action}
              initialValues={widgetValue}
            />
          </ViewStateMachine>
        </SectionBox>
      </ContentLayout.Center>
    </AppLayout>
  );
}
