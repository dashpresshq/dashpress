import { createStore } from "frontend/lib/store";

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
    setWidgetRelativeDate: ({ currentRelativeDay, widgetId }) => {
      set((store) => {
        return {
          widgetRelativeDate: {
            ...store.widgetRelativeDate,
            [widgetId]: currentRelativeDay,
          },
        };
      });
    },
  })
);
