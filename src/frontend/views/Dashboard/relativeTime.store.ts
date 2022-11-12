import { createStore } from "@hadmean/protozoa";
import { DASHBOARD_RELATIVE_DAYS } from "./constants";

type IStore = {
  currentRelativeDay?: string;
  setCurrentRelativeDay: (currentRelativeDay: string) => void;
};

export const useDashboardRelativeDayStore = createStore<IStore>((set) => ({
  currentRelativeDay: DASHBOARD_RELATIVE_DAYS[0].value,
  setCurrentRelativeDay: (currentRelativeDay: string) =>
    set(() => ({
      currentRelativeDay,
    })),
}));
