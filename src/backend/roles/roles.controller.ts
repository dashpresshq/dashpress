import { usersApiService, UsersApiService } from "backend/users/users.service";
import { IBasePermissionForm } from "shared/form-schemas/roles/permissions/base";
import { IBaseRoleForm } from "shared/form-schemas/roles/base";
import { makeRoleId, roleLabel } from "shared/constants/user";
import { IRolesList } from "shared/types/roles";
import { SystemRoles } from "shared/types/user";
import { RolesApiService, rolesApiService } from "./roles.service";

export class RolesApiController {
  constructor(
    private _usersApiService: UsersApiService,
    private _rolesApiService: RolesApiService
  ) {}

  async listRoles(): Promise<IRolesList[]> {
    const roles = await this._rolesApiService.listRoles();

    roles.push(SystemRoles.Creator, SystemRoles.Viewer);

    return roles.map((value) => ({
      value,
      label: roleLabel(value),
    }));
  }

  async getRolePermissions(roleId: string) {
    return await this._rolesApiService.getRolePermissions(roleId);
  }

  async createRole({ name }: IBaseRoleForm) {
    return await this._rolesApiService.createRole({ id: name });
  }

  async updateRoleDetails(roleId: string, { name }: IBaseRoleForm) {
    await this._rolesApiService.updateRoleDetails(roleId, { id: name });

    await this.updateUsersRole(roleId, makeRoleId(name));
  }

  private async updateUsersRole(fromRole: string, toRole: string) {
    const allUsers = await this._usersApiService.listUsers();

    await Promise.all(
      allUsers
        .filter(({ role }) => role === fromRole)
        .map(({ username }) =>
          this._usersApiService.updateUser(username, { role: toRole })
        )
    );
  }

  async removeRole(roleId: string) {
    await this._rolesApiService.removeRole(roleId);
    await this.updateUsersRole(roleId, SystemRoles.Viewer);
  }

  async addPermissions(roleId: string, { permissions }: IBasePermissionForm) {
    for (const permission of permissions) {
      await this._rolesApiService.addPermission(roleId, permission);
    }
  }

  async removePermissions(roleId: string, permissions: string[]) {
    for (const permission of permissions) {
      await this._rolesApiService.removePermission(roleId, permission);
    }
  }
}

export const rolesApiController = new RolesApiController(
  usersApiService,
  rolesApiService
);
