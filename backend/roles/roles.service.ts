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
    return role.permissions;
  }

  async canRoleDoThis(roleId: string, permission: string) {
    if (roleId === SystemRoles.Creator) {
      return true;
    }

    if (roleId === SystemRoles.Viewer) {
      return permission.startsWith(USER_PERMISSIONS.CAN_VIEW_ENTITY);
    }

    const role = await this._rolesPersistenceService.getItem(roleId);

    if (
      permission.startsWith(USER_PERMISSIONS.CAN_VIEW_ENTITY) &&
      role.permissions.includes(USER_PERMISSIONS.CAN_VIEW_ENTITY_ALL)
    ) {
      return true;
    }

    return role.permissions.includes(permission);
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
      StringUtils.sluggify(id)
    );

    if ((Object.values(SystemRoles) as string[]).includes(id)) {
      throw new BadRequestError("Role already exist");
    }

    if (newRole) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.upsertItem(roleId, {
      ...role,
      id: StringUtils.sluggify(id),
    });
    // alert that renaming a role will cause a errors for current users and they will have to refresh their browser
    // change all user with old role to new role
  }

  async removeRole(roleId: string) {
    await this._rolesPersistenceService.removeItem(roleId);
    // change all user with that role to SystemRole.User
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
