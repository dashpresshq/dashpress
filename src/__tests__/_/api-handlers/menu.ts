import { rest } from "msw";
import { INavigationMenuItem, NavigationMenuItemType } from "shared/types/menu";
import { BASE_TEST_URL } from "./_utils";

const MENU: INavigationMenuItem[] = [
  {
    id: "1",
    title: "Menu Item 1",
    type: NavigationMenuItemType.ExternalLink,
    link: "https://somewhere.com",
  },
];

export const menuApiHandlers = [
  rest.get(BASE_TEST_URL("/api/menu"), async (_, res, ctx) => {
    return res(ctx.json(MENU));
  }),
];
