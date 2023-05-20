import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationHelpers,
  MutationsLang,
  SLUG_LOADING_VALUE,
  useApi,
  useApiMutateOptitmisticOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { IWidgetConfig } from "shared/types/dashboard";

const DASHBOARD_ENDPOINT = (dashboardId: string) =>
  `/api/dashboards/${dashboardId}`;

const DASHBOARD_WIDGET_SCRIPT_ENDPOINT = (
  widgetId: string,
  relativeDate: string
) => {
  const base = `/api/dashboards/script?widgetId=${widgetId}`;

  if (!relativeDate) {
    return base;
  }

  return `${base}&relativeDate=${relativeDate}`;
};
export const useDashboardWidgets = (dashboardId: string) => {
  return useApi<IWidgetConfig[]>(DASHBOARD_ENDPOINT(dashboardId), {
    errorMessage: dataNotFoundMessage("Dashboard widgets"),
    enabled: !!dashboardId && dashboardId !== SLUG_LOADING_VALUE,
  });
};

export const useDasboardWidgetScriptData = (
  widgetId: string,
  relativeDate: string
) => {
  return useApi<unknown>(
    DASHBOARD_WIDGET_SCRIPT_ENDPOINT(widgetId, relativeDate),
    {
      errorMessage: dataNotFoundMessage("Dashboard widget script"),
      enabled: !!widgetId && !!relativeDate,
    }
  );
};

export function useCreateDashboardWidgetMutation(dashboardId: string) {
  const apiMutateOptions = useApiMutateOptitmisticOptions<
    IWidgetConfig[],
    IWidgetConfig
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.append,
    successMessage: MutationsLang.create("Widget"),
  });

  return useMutation(async (widget: IWidgetConfig) => {
    await makePostRequest(DASHBOARD_ENDPOINT(dashboardId), widget);
    return widget;
  }, apiMutateOptions);
}

export function useUpdateDashboardWidgetMutation(
  dashboardId: string,
  widgetId: string
) {
  const apiMutateOptions = useApiMutateOptitmisticOptions<
    IWidgetConfig[],
    IWidgetConfig
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    otherEndpoints: [DASHBOARD_WIDGET_SCRIPT_ENDPOINT(widgetId, "")],
    onMutate: MutationHelpers.update,
    successMessage: MutationsLang.edit("Widget"),
  });

  return useMutation(async (widget: IWidgetConfig) => {
    await makePatchRequest(
      `${DASHBOARD_ENDPOINT(dashboardId)}/${widget.id}`,
      widget
    );
    return widget;
  }, apiMutateOptions);
}

export function useDeleteDashboardWidgetMutation(dashboardId: string) {
  const apiMutateOptions = useApiMutateOptitmisticOptions<
    IWidgetConfig[],
    string
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.delete,
    successMessage: MutationsLang.delete("Widget"),
  });

  return useMutation(async (widgetId: string) => {
    await makeDeleteRequest(`${DASHBOARD_ENDPOINT(dashboardId)}/${widgetId}`, {
      widgetId,
    });
    return widgetId;
  }, apiMutateOptions);
}

export function useArrangeDashboardWidgetMutation(dashboardId: string) {
  const apiMutateOptions = useApiMutateOptitmisticOptions<
    IWidgetConfig[],
    string[]
  >({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.sortOrder,
    successMessage: MutationsLang.saved("Widget Order"),
  });

  return useMutation(async (widgetList: string[]) => {
    await makePatchRequest(DASHBOARD_ENDPOINT(dashboardId), widgetList);
    return widgetList;
  }, apiMutateOptions);
}
