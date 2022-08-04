import { createStore } from "@gothicgeeks/shared";

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
  setPageTitle(pageTitle, viewKey);
};
