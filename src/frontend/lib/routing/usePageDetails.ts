import { IDropDownMenuItem } from "@hadmean/chromista";
import { createStore } from "@hadmean/protozoa";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { META_USER_PERMISSIONS } from "shared/types/user";

export type IPageDetails = {
  pageTitle: string;
  viewKey: string;
  pageLink: string;
  permission: string;
  actionItems?: IDropDownMenuItem[];
  secondaryActionItems?: IDropDownMenuItem[];
};

type IStore = {
  setPageDetails: (details: IPageDetails) => void;
  setPartialPageDetails: (details: Partial<IPageDetails>) => void;
} & Partial<IPageDetails>;

export const usePageDetailsStore = createStore<IStore>((set) => ({
  pageTitle: "",
  viewKey: "",
  pageLink: "/",
  permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  setPageDetails: (pageDetails: IPageDetails) => set(() => pageDetails),
  setPartialPageDetails: (pageDetails: Partial<IPageDetails>) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(({ setPageDetails: _, ...rest }) => ({ ...rest, ...pageDetails })),
}));

export const useSetPageDetails = (
  pageDetails: Omit<
    IPageDetails,
    "pageLink" | "actionItems" | "secondaryActionItems"
  >
) => {
  const router = useRouter();
  const setPageDetails = usePageDetailsStore((store) => store.setPageDetails);
  useEffect(() => {
    setPageDetails({
      ...pageDetails,
      actionItems: [],
      secondaryActionItems: [],
      pageLink: router.asPath,
    });
  }, [pageDetails.pageTitle]);
};

export const useSetCurrentActionItems = (
  pageDetails:
    | Pick<IPageDetails, "actionItems" | "secondaryActionItems">
    | undefined
) => {
  const setPartialPageDetails = usePageDetailsStore(
    (store) => store.setPartialPageDetails
  );
  useEffect(() => {
    if (pageDetails) {
      setTimeout(() => {
        setPartialPageDetails({ ...pageDetails });
      }, 100);
    }
  }, [pageDetails]);
};
