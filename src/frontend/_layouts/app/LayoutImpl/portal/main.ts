import { NAVIGATION_LINKS } from "frontend/lib/routing/links";

export const useConstantNavigationMenuItems = () => {
  return [
    {
      label: "Menu Settings",
      value: NAVIGATION_LINKS.SETTINGS.MENU,
    },
  ];
};
