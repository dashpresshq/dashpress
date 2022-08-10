import { IBasePermissionForm } from "shared/form-schemas/roles/permissions/base";
import { RolesService, rolesService } from "./roles.service";

export class RolesController {
  constructor(private _rolesService: RolesService) {}

  async listRoles() {
    return await this._rolesService.listRoles();
  }

  async getRolePermissions(roleId: string) {
    await this._rolesService.getRolePermissions(roleId);
  }

  async createRole(name: string) {
    return await this._rolesService.createRole({ id: name });
  }

  async updateRoleDetails(roleId: string, name: string) {
    return await this._rolesService.updateRoleDetails(roleId, { id: name });
  }

  async removeRole(roleId: string) {
    await this._rolesService.removeRole(roleId);
  }

  async addPermission(roleId: string, { permission }: IBasePermissionForm) {
    await this._rolesService.addPermission(roleId, permission);
  }

  async removePermission(roleId: string, { permission }: IBasePermissionForm) {
    await this._rolesService.removePermission(roleId, permission);
  }
}

export const rolesController = new RolesController(rolesService);
