import {
  FormSkeleton,
  FormSkeletonSchema,
  SectionBox,
  SectionCenter,
} from "@hadmean/chromista";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { IWidgetConfig } from "shared/types/dashboard";
import { useActiveEntities } from "frontend/hooks/entity/entity.store";
import { useRouteParam } from "@hadmean/protozoa";
import { SystemIconsList } from "shared/constants/Icons";
import { useNavigationStack } from "frontend/lib/routing";
import { AppLayout } from "frontend/_layouts/app";
import { DashboardWidgetForm } from "./Form";
import { useDashboardWidgets } from "../../dashboard.store";

interface IProps {
  onSave: (data: IWidgetConfig) => Promise<IWidgetConfig>;
  title: string;
}

export function BaseManageDashboardWidget({ onSave, title }: IProps) {
  const dashboardId = useRouteParam("dashboardId");
  const widgetId = useRouteParam("widgetId");
  const activeEntities = useActiveEntities();
  const widgets = useDashboardWidgets(dashboardId);

  const { canGoBack, goBack, backLink } = useNavigationStack();

  return (
    <AppLayout>
      <SectionCenter>
        <SectionBox title={`${title} Dashboard Widget`} backLink={backLink}>
          <ViewStateMachine
            loading={activeEntities.isLoading}
            error={activeEntities.error}
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
                if (canGoBack) {
                  goBack();
                }
              }}
              initialValues={
                (widgets.data || []).find(({ id }) => id === widgetId) || {
                  icon: SystemIconsList[0],
                }
              }
            />
          </ViewStateMachine>
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
