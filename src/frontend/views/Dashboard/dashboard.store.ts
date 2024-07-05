import type { IWidgetConfig } from "shared/types/dashboard";
import {
  CRUD_CONFIG_NOT_FOUND,
  useDomainMessages,
} from "frontend/lib/crud-config";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { useApi } from "frontend/lib/data/useApi";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { DASHBOARD_RELATIVE_DAYS } from "./Widget/_components/WidgetHeader/constants";

const DASHBOARD_ENDPOINT = (dashboardId: string) =>
  `/api/dashboards/${dashboardId}`;

const DASHBOARD_WIDGET_SCRIPT_ENDPOINT = (
  widgetId: string,
  relativeDate = DASHBOARD_RELATIVE_DAYS[0].value
) => {
  const base = `/api/dashboards/script?widgetId=${widgetId}`;

  if (!relativeDate) {
    return base;
  }

  return `${base}&relativeDate=${relativeDate}`;
};
export const useDashboardWidgets = (dashboardId: string) => {
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);
  return useApi<IWidgetConfig[]>(DASHBOARD_ENDPOINT(dashboardId), {
    errorMessage: domainMessages.TEXT_LANG.NOT_FOUND,
    defaultData: [],
  });
};

export const useDasboardWidgetScriptData = (
  widgetId: string,
  relativeDate: string
) => {
  return useApi<unknown>(
    DASHBOARD_WIDGET_SCRIPT_ENDPOINT(widgetId, relativeDate),
    {
      errorMessage: CRUD_CONFIG_NOT_FOUND(`Script`),
      defaultData: undefined,
    }
  );
};

export function useCreateDashboardWidgetMutation(dashboardId: string) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  return useApiMutateOptimisticOptions<IWidgetConfig[], IWidgetConfig>({
    mutationFn: async (widget) => {
      await ApiRequest.POST(DASHBOARD_ENDPOINT(dashboardId), widget);
    },
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.append,
    successMessage: { description: domainMessages.MUTATION_LANG.CREATE },
  });
}

export function useUpdateDashboardWidgetMutation(
  dashboardId: string,
  widgetId: string
) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  return useApiMutateOptimisticOptions<IWidgetConfig[], IWidgetConfig>({
    mutationFn: async (widget) => {
      await ApiRequest.PATCH(
        `${DASHBOARD_ENDPOINT(dashboardId)}/${widget.id}`,
        widget
      );
    },
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    otherEndpoints: [DASHBOARD_WIDGET_SCRIPT_ENDPOINT(widgetId)],
    onMutate: MutationHelpers.update,
    successMessage: { description: domainMessages.MUTATION_LANG.EDIT },
  });
}

export function useDeleteDashboardWidgetMutation(dashboardId: string) {
  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  return useApiMutateOptimisticOptions<IWidgetConfig[], string>({
    mutationFn: async (widgetId) => {
      await ApiRequest.DELETE(`${DASHBOARD_ENDPOINT(dashboardId)}/${widgetId}`);
    },
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.delete,
    successMessage: { description: domainMessages.MUTATION_LANG.DELETE },
  });
}

export function useArrangeDashboardWidgetMutation(dashboardId: string) {
  return useApiMutateOptimisticOptions<IWidgetConfig[], string[]>({
    mutationFn: async (widgetList) => {
      await ApiRequest.PATCH(DASHBOARD_ENDPOINT(dashboardId), widgetList);
    },
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.sortOrder,
  });
}
