import { userFriendlyCase } from "frontend/lib/strings";
import { IUpdateRoleForm } from "shared/form-schemas/roles/update";
import { makeRoleId, SystemRoles } from "shared/types";
import { DashboardService, dashboardService } from "./dashboard.service";
import { IDashboardConfig } from "./dashboard.types";

export class DashboardController {
  constructor(private _dashboardService: DashboardService) {}

  async listHomeDashboard() {
    const roles = await this._rolesService.listRoles();

    roles.push(SystemRoles.Creator, SystemRoles.Viewer);

    return roles.map((value) => ({
      value,
      label: userFriendlyCase(value),
    }));
  }

  async createDashboard(config: IDashboardConfig) {
    return await this._dashboardService.createDashboardItem(config);
  }

  async updateRoleDetails(roleId: string, { name }: IUpdateRoleForm) {
    await this._rolesService.updateRoleDetails(roleId, { id: name });

    await this.updateUsersRole(roleId, makeRoleId(name));
  }

  private async updateUsersRole(fromRole: string, toRole: string) {
    const allUsers = await this._usersService.listUsers();

    await Promise.all(
      allUsers
        .filter(({ role }) => role === fromRole)
        .map(({ username }) =>
          this._usersService.updateUser(username, { role: toRole })
        )
    );
  }

  async removeRole(roleId: string) {
    await this._rolesService.removeRole(roleId);
    await this.updateUsersRole(roleId, SystemRoles.Viewer);
  }
}

export const dashboardController = new DashboardController(dashboardService);
