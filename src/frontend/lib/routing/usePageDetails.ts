import { createStore } from "@hadmean/protozoa";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { META_USER_PERMISSIONS } from "shared/types";

interface IPageDetails {
  pageTitle: string;
  viewKey: string;
  pageLink: string;
  permission: string;
}

type IStore = {
  pageTitle?: string;
  viewKey?: string;
  pageLink?: string;
  permission?: string;
  setPageDetails: (details: IPageDetails) => void;
};

export const usePageDetailsStore = createStore<IStore>((set) => ({
  pageTitle: "",
  viewKey: "",
  pageLink: "/",
  permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  setPageDetails: (pageDetails: IPageDetails) => set(() => pageDetails),
}));

export const useSetPageDetails = (
  pageDetails: Omit<IPageDetails, "pageLink">
) => {
  const router = useRouter();
  const setPageDetails = usePageDetailsStore((store) => store.setPageDetails);
  useEffect(() => {
    setPageDetails({ ...pageDetails, pageLink: router.asPath });
  }, [pageDetails.pageTitle]);
};
