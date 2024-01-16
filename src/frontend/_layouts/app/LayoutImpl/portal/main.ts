import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SystemIconsKeys } from "shared/constants/Icons";
import { PortalSystemLinks } from "shared/constants/portal/menu/main";
import { ILabelValue } from "shared/types/options";

export const useConstantNavigationMenuItems = (): Array<
  ILabelValue & { systemIcon: SystemIconsKeys }
> => {
  return [
    {
      label: "Menu Settings",
      value: NAVIGATION_LINKS.SETTINGS.MENU,
      systemIcon: "List",
    },
  ];
};

export const PORTAL_SYSTEM_LINK_CONFIG_LINKS: Record<
  PortalSystemLinks,
  {
    link: string;
    permission?: string;
  }
> = {};
