import { createStore } from "@hadmean/protozoa";

type IStore = {
  widgetRelativeDate: Record<string, string>;
  setWidgetRelativeDate: (params: {
    widgetId: string;
    currentRelativeDay: string;
  }) => void;
};

export const useDashboardWidgetRelativeDateStore = createStore<IStore>(
  (set) => ({
    widgetRelativeDate: {},
    setWidgetRelativeDate: ({ currentRelativeDay, widgetId }) =>
      set(({ widgetRelativeDate }) => ({
        ...widgetRelativeDate,
        [widgetId]: currentRelativeDay,
      })),
  })
);
