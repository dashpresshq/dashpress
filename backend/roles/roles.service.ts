import { StringUtils } from "@gothicgeeks/shared";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError } from "backend/lib/errors";
import { SystemRoles, USER_PERMISSIONS } from "shared/types";

interface IRole {
  id: string;
  permissions: string[];
}

export class RolesService {
  constructor(
    private readonly _rolesPersistenceService: AbstractConfigDataPersistenceService<IRole>
  ) {}

  async listRoles(): Promise<string[]> {
    const roles = await this._rolesPersistenceService.getAllItems();

    return roles.map(({ id }) => id);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const role = await this._rolesPersistenceService.getItem(roleId);
    if (!role) {
      return [USER_PERMISSIONS.CAN_ACCESS_ALL_ENTITIES];
    }
    return role.permissions;
  }

  async canRoleDoThis(roleId$1: string, permission: string) {
    const roleId = roleId$1 || SystemRoles.Viewer;

    if (roleId === SystemRoles.Creator) {
      return true;
    }

    if (roleId === SystemRoles.Viewer) {
      return permission.startsWith(USER_PERMISSIONS.CAN_ACCESS_ENTITY);
    }

    const rolePermissions = await this.getRolePermissions(roleId);

    if (
      permission.startsWith(USER_PERMISSIONS.CAN_ACCESS_ENTITY) &&
      rolePermissions.includes(USER_PERMISSIONS.CAN_ACCESS_ALL_ENTITIES)
    ) {
      return true;
    }

    return rolePermissions.includes(permission);
  }

  async createRole({ id }: Pick<IRole, "id">) {
    const role = await this._rolesPersistenceService.getItem(id);
    if (role) {
      throw new BadRequestError("Role already exist");
    }

    if ((Object.values(SystemRoles) as string[]).includes(id)) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.upsertItem(id, {
      id: StringUtils.sluggify(id),
      permissions: [],
    });
  }

  async updateRoleDetails(roleId: string, { id }: Pick<IRole, "id">) {
    const role = await this._rolesPersistenceService.getItem(roleId);
    if (!role) {
      return;
    }

    const newRole = await this._rolesPersistenceService.getItem(
      RolesService.makeRoleId(id)
    );

    if ((Object.values(SystemRoles) as string[]).includes(id)) {
      throw new BadRequestError("Role already exist");
    }

    if (newRole) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.upsertItem(roleId, {
      ...role,
      id: RolesService.makeRoleId(id),
    });
    // TODO alert that renaming a role will cause a errors for current users and they will have to refresh their browser
  }

  static makeRoleId(roleName: string) {
    return StringUtils.sluggify(roleName);
  }

  async removeRole(roleId: string) {
    await this._rolesPersistenceService.removeItem(roleId);
  }

  async addPermission(roleId: string, permission: string) {
    const role = await this._rolesPersistenceService.getItem(roleId);
    if (!role) {
      return;
    }

    await this._rolesPersistenceService.upsertItem(roleId, {
      ...role,
      permissions: [...role.permissions, permission],
    });
  }

  async removePermission(roleId: string, permission: string) {
    const role = await this._rolesPersistenceService.getItem(roleId);
    if (!role) {
      return;
    }
    await this._rolesPersistenceService.upsertItem(roleId, {
      ...role,
      permissions: role.permissions.filter(
        (loopPermission) => loopPermission !== permission
      ),
    });
  }
}

const rolesPersistenceService =
  createConfigDomainPersistenceService<IRole>("roles");

export const rolesService = new RolesService(rolesPersistenceService);
