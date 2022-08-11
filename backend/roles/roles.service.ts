import { StringUtils } from "@gothicgeeks/shared";
import { AbstractCacheService, createCacheService } from "backend/lib/cache";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError, NotFoundError } from "backend/lib/errors";
import {
  APPLIED_CAN_ACCESS_ENTITY,
  SystemRoles,
  USER_PERMISSIONS,
} from "shared/types";

interface IRole {
  id: string;
  permissions: string[];
}

export class RolesService {
  constructor(
    private readonly _rolesPersistenceService: AbstractConfigDataPersistenceService<IRole>,
    private readonly _cacheService: AbstractCacheService
  ) {}

  async listRoles(): Promise<string[]> {
    const roles = await this._rolesPersistenceService.getAllItems();

    return roles.map(({ id }) => id);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    return await this._cacheService.getItem<string[]>(roleId, async () => {
      const role = await this._rolesPersistenceService.getItem(roleId);
      if (!role) {
        throw new NotFoundError("Role Not Found");
      }
      return role.permissions;
    });
  }

  async canRoleDoThis(roleId: string, permission: string) {
    if (roleId === SystemRoles.Creator) {
      return true;
    }

    if (roleId === SystemRoles.Viewer) {
      return permission.startsWith(APPLIED_CAN_ACCESS_ENTITY(""));
    }

    const rolePermissions = await this.getRolePermissions(roleId);

    if (
      permission.startsWith(APPLIED_CAN_ACCESS_ENTITY("")) &&
      rolePermissions.includes(USER_PERMISSIONS.CAN_ACCESS_ALL_ENTITIES)
    ) {
      return true;
    }

    return rolePermissions.includes(permission);
  }

  async createRole(input: Pick<IRole, "id">) {
    const id = RolesService.makeRoleId(input.id);
    const role = await this._rolesPersistenceService.getItem(id);
    if (role) {
      throw new BadRequestError("Role already exist");
    }

    if ((Object.values(SystemRoles) as string[]).includes(id)) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.upsertItem(id, {
      id,
      permissions: [],
    });
  }

  async updateRoleDetails(roleId: string, { id }: Pick<IRole, "id">) {
    const role = await this._rolesPersistenceService.getItem(roleId);
    if (!role) {
      return;
    }

    const madeRoleId = RolesService.makeRoleId(id);

    if ((Object.values(SystemRoles) as string[]).includes(madeRoleId)) {
      throw new BadRequestError("Role already exist");
    }

    const newRole = await this._rolesPersistenceService.getItem(madeRoleId);

    if (newRole) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.upsertItem(roleId, {
      ...role,
      id: madeRoleId,
    });
    // TODO alert that renaming a role will cause a errors for current users and they will have to refresh their browser
  }

  static makeRoleId(roleName: string) {
    return StringUtils.sluggify(roleName);
  }

  async removeRole(roleId: string) {
    await this._rolesPersistenceService.removeItem(roleId);
    await this._cacheService.clearItem(roleId);
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
    await this._cacheService.clearItem(roleId);
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
    await this._cacheService.clearItem(roleId);
  }
}

const rolesPersistenceService =
  createConfigDomainPersistenceService<IRole>("roles");

const cacheService = createCacheService("permission");

export const rolesService = new RolesService(
  rolesPersistenceService,
  cacheService
);
