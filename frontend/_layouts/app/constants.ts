import { NAVIGATION_LINKS } from "frontend/lib/routing/links";

/*
When any of this links are pressed the bread crumns will be cleared
*/
export const ROOT_LINKS_TO_CLEAR_BREADCRUMBS = {
  HOME: NAVIGATION_LINKS.DASHBOARD,
  SETTINGS: NAVIGATION_LINKS.SETTINGS.DEFAULT,
  USERS: NAVIGATION_LINKS.USERS.LIST,
  ACCOUNT: NAVIGATION_LINKS.ACCOUNT.PASSWORD,
};
