import { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { SystemIconsKeys } from "shared/constants/Icons";
import { PortalSystemLinks } from "shared/constants/portal/menu/main";

export const useConstantNavigationMenuItems = (): Array<{
  systemIcon: SystemIconsKeys;
  label: MessageDescriptor;
  value: string;
}> => {
  return [
    {
      label: msg`Menu Settings`,
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
