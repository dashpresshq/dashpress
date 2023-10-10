import { INavigationMenuItem } from "shared/types/menu";

export interface IBaseNavigationMenuApiService {
  generateMenuItems(): Promise<INavigationMenuItem[]>;
  filterOutUserMenuItems(
    userRole: string,
    navItems: INavigationMenuItem[]
  ): Promise<INavigationMenuItem[]>;
}

export const FOR_CODE_COV = 1;
