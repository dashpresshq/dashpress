import { createStore } from "@gothicgeeks/shared";
import { useEffect } from "react";

type IStore = {
  pageTitle?: string;
  viewKey?: string;
  setPageTitle: (pageTitle: string, viewKey: string) => void;
};

export const usePageTitleStore = createStore<IStore>((set) => ({
  pageTitle: "",
  viewKey: "",
  setPageTitle: (pageTitle: string, viewKey: string) =>
    set(() => ({
      pageTitle,
      viewKey,
    })),
}));

export const useSetPageTitle = (pageTitle: string, viewKey: string) => {
  const setPageTitle = usePageTitleStore((store) => store.setPageTitle);
  useEffect(() => {
    setPageTitle(pageTitle, viewKey);
  }, [pageTitle, viewKey]);
};
