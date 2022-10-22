import { AbstractCacheService, createCacheService } from "backend/lib/cache";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError, NotFoundError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";
import { canRoleDoThisAsync } from "shared/logic/permissions";
import { isSystemRole, makeRoleId, SystemRoles } from "shared/types";

export interface IRole {
  id: string;
  permissions: string[];
}

export class RolesService implements IApplicationService {
  constructor(
    private readonly _rolesPersistenceService: AbstractConfigDataPersistenceService<IRole>,
    private readonly _cacheService: AbstractCacheService
  ) {}

  async bootstrap() {
    await this._rolesPersistenceService.setup();
    await this._cacheService.setup();
  }

  async listRoles(): Promise<string[]> {
    const roles = await this._rolesPersistenceService.getAllItems();

    return roles.map(({ id }) => id);
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    if (isSystemRole(roleId)) {
      return [];
    }
    return await this._cacheService.getItem<string[]>(roleId, async () => {
      const role = await this._rolesPersistenceService.getItem(roleId);
      if (!role) {
        throw new NotFoundError("Role Not Found");
      }
      return role.permissions;
    });
  }

  async canRoleDoThis(roleId: string, permission: string) {
    return await canRoleDoThisAsync(roleId, permission, (roleId$1: string) =>
      this.getRolePermissions(roleId$1)
    );
  }

  async createRole(input: Pick<IRole, "id">) {
    const id = makeRoleId(input.id);
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

    const madeRoleId = makeRoleId(id);

    if ((Object.values(SystemRoles) as string[]).includes(madeRoleId)) {
      throw new BadRequestError("Role already exist");
    }

    const newRole = await this._rolesPersistenceService.getItem(madeRoleId);

    if (newRole) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.removeItem(roleId);

    await this._rolesPersistenceService.upsertItem(madeRoleId, {
      ...role,
      id: madeRoleId,
    });
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
