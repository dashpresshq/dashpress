import {
  NavigationMenuApiService,
  navigationMenuApiService,
} from "./menu.service";

export class MenuApiController {
  constructor(private _navigationMenuApiService: NavigationMenuApiService) {}

  async getMenuItems(userRole: string) {
    return await this._navigationMenuApiService.getMenuItems(userRole);
  }
}

export const menuApiController = new MenuApiController(
  navigationMenuApiService
);
