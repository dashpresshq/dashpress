import {
  dataNotFoundMessage,
  makeDeleteRequest,
  makePatchRequest,
  makePostRequest,
  MutationsLang,
  useApi,
  useApiMutateOptions,
} from "@hadmean/protozoa";
import { useMutation } from "react-query";
import { HOME_DASHBOARD_KEY, IWidgetConfig } from "shared/types";
/* eslint-disable no-param-reassign */
/* eslint-disable default-param-last */
const MutationHelpers = {
  append: <T, K>(old: T[] | undefined = [], formData: K) => [...old, formData],
  remove: <T>(old: T[] | undefined = [], formData: T) => [
    ...old.filter((oldItem) => formData !== oldItem),
  ],
  mergeArray: <T, K>(old: T[] | undefined = [], formData: K[] = []) => [
    ...old,
    ...formData,
  ],
  mergeObject: <T, K extends Partial<T>>(old: T | undefined, formData: K): T =>
    ({ ...old, ...formData } as unknown as T),
  replace: <T>(_: T, formData: T) => formData,
  update: <T extends { id: string }, K extends { id: string }>(
    old: T[] | undefined = [],
    formData: K
  ) => {
    const index = old.findIndex(({ id }) => id === formData.id);
    if (index > -1) {
      old[index] = { ...old[index], ...formData };
    }
    return [...old];
  },
  delete: <T extends { id: string }>(
    old: T[] | undefined = [],
    currentDataId: string
  ) => [...old.filter(({ id }) => currentDataId !== id)],
  sortOrder: <T extends { id: string }>(
    old: T[] | undefined = [],
    order: string[]
  ) => {
    const oldMap = Object.fromEntries(
      old.map((oldItem) => [oldItem.id, oldItem])
    );
    return order.map((orderId) => oldMap[orderId]);
  },
  removeMany: <T>(old: T[] | undefined = [], formData: T[]) => [
    ...old.filter((oldItem) => !formData.includes(oldItem)),
  ],
};

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
    successMessage: MutationsLang.saved("Order"),
  });

  return useMutation(async (widgetList: string[]) => {
    await makePatchRequest(DASHBOARD_ENDPOINT(dashboardId), widgetList);
    return widgetList;
  }, apiMutateOptions);
}
