import { IApplicationService } from "backend/types";
import { nanoid } from "nanoid";
import { canRoleDoThisSync } from "shared/logic/permissions";
import {
  INavigationMenuItem,
  NavigationMenuItemType,
  SystemLinks,
} from "shared/types/menu";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { GranularEntityPermissions } from "shared/types/user";
import {
  EntitiesApiService,
  entitiesApiService,
} from "backend/entities/entities.service";
import { noop } from "shared/lib/noop";
import {
  ConfigurationApiService,
  configurationApiService,
} from "backend/configuration/configuration.service";
import { RolesApiService, rolesApiService } from "backend/roles/roles.service";
import { ILabelValue } from "shared/types/options";
import { sortListByOrder } from "shared/lib/array/sort";
import { SYSTEM_LINKS_CONFIG_MAP } from "shared/constants/menu";
import { portalCheckIfIsMenuAllowed, getPortalMenuItems } from "./portal";
import { IBaseNavigationMenuApiService } from "./types";

export class NavigationMenuApiService
  implements IApplicationService, IBaseNavigationMenuApiService
{
  constructor(
    private readonly _entitiesApiService: EntitiesApiService,
    private readonly _configurationApiService: ConfigurationApiService,
    private readonly _rolesApiService: RolesApiService
  ) {}

  async bootstrap() {
    noop();
  }

  async getMenuItems(userRole: string) {
    const portalMenuItems = await getPortalMenuItems(userRole, this);

    if (portalMenuItems !== null) {
      return portalMenuItems;
    }

    const navItems = await this.generateMenuItems();

    return await this.filterOutUserMenuItems(userRole, navItems);
  }

  async generateMenuItems(): Promise<INavigationMenuItem[]> {
    let navItems: INavigationMenuItem[] = [];

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Home",
        icon: "Home",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Home,
      },
    ]);

    const entitiesToShow = await this.getUserEntities();

    const dictionMap = Object.fromEntries(
      await Promise.all(
        entitiesToShow.map(async (value) => [
          value.value,
          await this._configurationApiService.show(
            "entity_diction",
            value.value
          ),
        ])
      )
    );

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Entities",
        icon: "File",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Home,
        children: entitiesToShow.map((entity) => ({
          id: nanoid(),
          title:
            dictionMap[entity.value].plural || userFriendlyCase(entity.label),
          icon: "File",
          type: NavigationMenuItemType.Entities,
          link: entity.value,
        })),
      },
    ]);

    navItems = navItems.concat([
      {
        id: nanoid(),
        title: "Integrations",
        icon: "Zap",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Integrations,
      },
      {
        id: nanoid(),
        title: "Settings",
        icon: "Settings",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Settings,
        children: [],
      },

      {
        id: nanoid(),
        title: "Users",
        icon: "Users",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Users,
        children: [],
      },
      {
        id: nanoid(),
        title: "Roles",
        icon: "Shield",
        type: NavigationMenuItemType.System,
        link: SystemLinks.Roles,
        children: [],
      },
    ]);

    return navItems;
  }

  private async getUserEntities(): Promise<ILabelValue[]> {
    const [hiddenMenuEntities, entitiesOrder, activeEntities] =
      await Promise.all([
        this._configurationApiService.show("disabled_menu_entities"),
        this._configurationApiService.show("menu_entities_order"),
        this._entitiesApiService.getActiveEntities(),
      ]);

    const menuEntities: { label: string; value: string }[] = activeEntities
      .filter(({ value }) => !hiddenMenuEntities.includes(value))
      .sort((a, b) => a.value.localeCompare(b.value));

    sortListByOrder(entitiesOrder, menuEntities, "value");

    return menuEntities;
  }

  async filterOutUserMenuItems(
    userRole: string,
    navItems: INavigationMenuItem[]
  ) {
    return this.filterMenuItemsBasedOnPermissions(
      userRole,
      navItems,
      await this._rolesApiService.getRolePermissions(userRole)
    );
  }

  private filterMenuItemsBasedOnPermissions(
    userRole: string,
    menuItems: INavigationMenuItem[],
    userPermissions: string[]
  ): INavigationMenuItem[] {
    return menuItems.reduce((allowedMenuItems, menuItem) => {
      if (menuItem.children) {
        // eslint-disable-next-line no-param-reassign
        menuItem.children = this.filterMenuItemsBasedOnPermissions(
          userRole,
          menuItem.children,
          userPermissions
        );
      }
      if (this.isMenuItemAllowed(menuItem, userRole, userPermissions)) {
        return [...allowedMenuItems, menuItem];
      }
      return allowedMenuItems;
    }, []);
  }

  private async isMenuItemAllowed(
    menuItem: INavigationMenuItem,
    userRole: string,
    userPermissions: string[]
  ): Promise<boolean> {
    const isMenuAllowed = await portalCheckIfIsMenuAllowed(
      menuItem,
      userRole,
      userPermissions
    );

    if (typeof isMenuAllowed === "boolean") {
      return isMenuAllowed;
    }

    switch (menuItem.type) {
      case NavigationMenuItemType.Header:
        return true;
      case NavigationMenuItemType.System:
        return canRoleDoThisSync(
          userRole,
          SYSTEM_LINKS_CONFIG_MAP[menuItem.link as SystemLinks].permission,
          userPermissions
        );

      case NavigationMenuItemType.Entities:
        return canRoleDoThisSync(
          userRole,
          META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
            menuItem.link,
            GranularEntityPermissions.Show
          ),
          userPermissions
        );
      default:
        return false;
    }
  }
}

export const navigationMenuApiService = new NavigationMenuApiService(
  entitiesApiService,
  configurationApiService,
  rolesApiService
);
