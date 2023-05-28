import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationHelpers,
  SLUG_LOADING_VALUE,
  useApi,
  useApiMutateOptitmisticOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { IWidgetConfig } from "shared/types/dashboard";
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
      enabled: !!widgetId,
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
    successMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.MUTATION_LANG.CREATE,
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
    otherEndpoints: [DASHBOARD_WIDGET_SCRIPT_ENDPOINT(widgetId)],
    onMutate: MutationHelpers.update,
    successMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.MUTATION_LANG.EDIT,
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
    successMessage: DASHBOARD_WIDGETS_CRUD_CONFIG.MUTATION_LANG.DELETE,
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
  });

  return useMutation(async (widgetList: string[]) => {
    await makePatchRequest(DASHBOARD_ENDPOINT(dashboardId), widgetList);
    return widgetList;
  }, apiMutateOptions);
}
