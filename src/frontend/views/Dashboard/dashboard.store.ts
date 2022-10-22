import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationHelpers,
  MutationsLang,
  useApi,
  useApiMutateOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { HOME_DASHBOARD_KEY, IWidgetConfig } from "shared/types/dashboard";

const DASHBOARD_ENDPOINT = (dashboardId: string) =>
  `/api/dashboards/${dashboardId}`;

export const useDashboardWidgets = (dashboardId = HOME_DASHBOARD_KEY) => {
  return useApi<IWidgetConfig[]>(DASHBOARD_ENDPOINT(dashboardId), {
    errorMessage: dataNotFoundMessage("Dashboard widgets"),
  });
};

export function useCreateDashboardWidgetMutation(
  dashboardId = HOME_DASHBOARD_KEY
) {
  const apiMutateOptions = useApiMutateOptions<IWidgetConfig[], IWidgetConfig>({
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
  dashboardId = HOME_DASHBOARD_KEY
) {
  const apiMutateOptions = useApiMutateOptions<IWidgetConfig[], IWidgetConfig>({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
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

export function useDeleteDashboardWidgetMutation(
  dashboardId = HOME_DASHBOARD_KEY
) {
  const apiMutateOptions = useApiMutateOptions<IWidgetConfig[], string>({
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

export function useArrangeDashboardWidgetMutation(
  dashboardId = HOME_DASHBOARD_KEY
) {
  const apiMutateOptions = useApiMutateOptions<IWidgetConfig[], string[]>({
    dataQueryPath: DASHBOARD_ENDPOINT(dashboardId),
    onMutate: MutationHelpers.sortOrder,
    successMessage: MutationsLang.saved("Widget Order"),
  });

  return useMutation(async (widgetList: string[]) => {
    await makePatchRequest(DASHBOARD_ENDPOINT(dashboardId), widgetList);
    return widgetList;
  }, apiMutateOptions);
}
