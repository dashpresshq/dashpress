import { createStore } from "@gothicgeeks/shared";
import { useEffect } from "react";

interface IPageDetails {
  pageTitle: string;
  viewKey: string;
  permission: string;
}

type IStore = {
  pageTitle?: string;
  viewKey?: string;
  setPageDetails: (details: IPageDetails) => void;
};

export const usePageDetailsStore = createStore<IStore>((set) => ({
  pageTitle: "",
  viewKey: "",
  setPageDetails: (pageDetails: IPageDetails) => set(() => pageDetails),
}));

export const useSetPageDetails = (pageDetails: IPageDetails) => {
  const setPageDetails = usePageDetailsStore((store) => store.setPageDetails);
  useEffect(() => {
    setPageDetails(pageDetails);
  }, [pageDetails.pageTitle]);
};
