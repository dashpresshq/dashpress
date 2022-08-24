import { createStore } from "@hadmean/protozoa";
import { useEffect } from "react";
import { META_USER_PERMISSIONS } from "shared/types";

interface IPageDetails {
  pageTitle: string;
  viewKey: string;
  permission: string;
}

type IStore = {
  pageTitle?: string;
  viewKey?: string;
  permission?: string;
  setPageDetails: (details: IPageDetails) => void;
};

export const usePageDetailsStore = createStore<IStore>((set) => ({
  pageTitle: "",
  viewKey: "",
  permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  setPageDetails: (pageDetails: IPageDetails) => set(() => pageDetails),
}));

export const useSetPageDetails = (pageDetails: IPageDetails) => {
  const setPageDetails = usePageDetailsStore((store) => store.setPageDetails);
  useEffect(() => {
    setPageDetails(pageDetails);
  }, [pageDetails.pageTitle]);
};
