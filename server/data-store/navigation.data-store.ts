import { INavigationItem } from "../views/_layouts/types";
import { useApi } from "./useData/useApi";

export const useModelMenuItems = () => {
  return useApi<INavigationItem[]>("/api/models/menu", {
    errorMessage: "Menu items could not be retrieved.",
    selector: (input) =>
      input.map(({ label, value }) => ({ title: label, link: value })),
  });
};
