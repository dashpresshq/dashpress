import { usersService, UsersService } from "backend/users/users.service";
import { IBasePermissionForm } from "shared/form-schemas/roles/permissions/base";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId, roleLabel } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import { SystemRoles } from "shared/types/user";
import { RolesService, rolesService } from "./roles.service";

export class RolesController {
  constructor(
    private _usersService: UsersService,
    private _rolesService: RolesService
  ) {}

  async listRoles(): Promise<IRolesList[]> {
    const roles = await this._rolesService.listRoles();

    roles.push(SystemRoles.Creator, SystemRoles.Viewer);

    return roles.map((value) => ({
      value,
      label: roleLabel(value),
    }));
  }

  async getRolePermissions(roleId: string) {
    return await this._rolesService.getRolePermissions(roleId);
  }

  async createRole({ name }: IBaseRoleForm) {
    return await this._rolesService.createRole({ id: name });
  }

  async updateRoleDetails(roleId: string, { name }: IBaseRoleForm) {
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

  async addPermissions(roleId: string, { permissions }: IBasePermissionForm) {
    for (const permission of permissions) {
      await this._rolesService.addPermission(roleId, permission);
    }
  }

  async removePermissions(
    roleId: string,
    { permissions }: IBasePermissionForm
  ) {
    for (const permission of permissions) {
      await this._rolesService.removePermission(roleId, permission);
    }
  }
}

export const rolesController = new RolesController(usersService, rolesService);
