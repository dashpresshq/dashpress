import { createStore } from "@gothicgeeks/shared";

type IStore = {
  pageTitle?: string;
  setPageTitle: (pageTitle: string) => void;
};

export const usePageTitleStore = createStore<IStore>((set) => ({
  pageTitle: "",
  setPageTitle: (pageTitle: string) =>
    set(() => ({
      pageTitle,
    })),
}));

export const useSetPageTitle = (pageTitle: string) => {
  const setPageTitle = usePageTitleStore((store) => store.setPageTitle);
  setPageTitle(pageTitle);
};
