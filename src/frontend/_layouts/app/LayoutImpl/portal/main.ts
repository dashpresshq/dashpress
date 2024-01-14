import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { PortalSystemLinks } from "shared/constants/portal/menu/main";

export const useConstantNavigationMenuItems = () => {
  return [
    {
      label: "Menu Settings",
      value: NAVIGATION_LINKS.SETTINGS.MENU,
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
