import { useMutation } from "react-query";
import { IWidgetConfig } from "shared/types/dashboard";
import { CRUD_CONFIG_NOT_FOUND } from "frontend/lib/crud-config";
import { makeActionRequest } from "frontend/lib/data/makeRequest";
import { MutationHelpers } from "frontend/lib/data/useMutate/mutation-helpers";
import { useApiMutateOptimisticOptions } from "frontend/lib/data/useMutate/useApiMutateOptimisticOptions";
import { useApi } from "frontend/lib/data/useApi";
import { SLUG_LOADING_VALUE } from "frontend/lib/routing/constants";
import { DASHBOARD_RELATIVE_DAYS } from "./Widget/_components/WidgetHeader/constants";
import { DASHBOARD_WIDGETS_CRUD_CONFIG } from "./constants";

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
  return useApi<IWidgetConfig[]>(DASHBOARD_ENDPOINT(dashboardId), {
    errorMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.TEXT_LANG.NOT_FOUND,
    enabled: !!dashboardId && dashboardId !== SLUG_LOADING_VALUE,
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
      errorMessage: CRUD_CONFIG_NOT_FOUND("Script"),
      enabled: !!widgetId,
      defaultData: undefined,
    }
  );
};

export function useCreateDashboardWidgetMutation(dashboardId: string) {
  const apiMutateOptions = useApiMutateOptimisticOptions<
    IWidgetConfig[],
    IWidgetConfig
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.append,
    successMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.MUTATION_LANG.CREATE,
  });

  return useMutation(async (widget: IWidgetConfig) => {
    await makeActionRequest("POST", DASHBOARD_ENDPOINT(dashboardId), widget);
  }, apiMutateOptions);
}

export function useUpdateDashboardWidgetMutation(
  dashboardId: string,
  widgetId: string
) {
  const apiMutateOptions = useApiMutateOptimisticOptions<
    IWidgetConfig[],
    IWidgetConfig
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    otherEndpoints: [DASHBOARD_WIDGET_SCRIPT_ENDPOINT(widgetId)],
    onMutate: MutationHelpers.update,
    successMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.MUTATION_LANG.EDIT,
  });

  return useMutation(async (widget: IWidgetConfig) => {
    await makeActionRequest(
      "PATCH",
      `${DASHBOARD_ENDPOINT(dashboardId)}/${widget.id}`,
      widget
    );
  }, apiMutateOptions);
}

export function useDeleteDashboardWidgetMutation(dashboardId: string) {
  const apiMutateOptions = useApiMutateOptimisticOptions<
    IWidgetConfig[],
    string
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.delete,
    successMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.MUTATION_LANG.DELETE,
  });

  return useMutation(async (widgetId: string) => {
    await makeActionRequest(
      "DELETE",
      `${DASHBOARD_ENDPOINT(dashboardId)}/${widgetId}`,
      {
        widgetId,
      }
    );
  }, apiMutateOptions);
}

export function useArrangeDashboardWidgetMutation(dashboardId: string) {
  const apiMutateOptions = useApiMutateOptimisticOptions<
    IWidgetConfig[],
    string[]
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.sortOrder,
  });

  return useMutation(async (widgetList: string[]) => {
    await makeActionRequest(
      "PATCH",
      DASHBOARD_ENDPOINT(dashboardId),
      widgetList
    );
  }, apiMutateOptions);
}
