import { AbstractCacheService, createCacheService } from "backend/lib/cache";
import {
  createConfigDomainPersistenceService,
  AbstractConfigDataPersistenceService,
} from "backend/lib/config-persistence";
import { BadRequestError } from "backend/lib/errors";
import { IApplicationService } from "backend/types";
import { canRoleDoThisAsync } from "shared/logic/permissions";
import {
  isSystemRole,
  makeRoleId,
  META_USER_PERMISSIONS,
} from "shared/constants/user";
import { GranularEntityPermissions, SystemRoles } from "shared/types/user";

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
      const { permissions } = await this._rolesPersistenceService.getItemOrFail(
        roleId
      );
      return permissions;
    });
  }

  async canRoleDoThis(roleId: string, permission: string) {
    return await canRoleDoThisAsync(roleId, permission, (roleId$1: string) =>
      this.getRolePermissions(roleId$1)
    );
  }

  async filterPermittedEntities<T>(
    userRole: string,
    entities: T[],
    entityField: keyof T,
    applyMeta = META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY
  ): Promise<T[]> {
    const entitiesCheck = await Promise.all(
      entities.map(async (entity) => {
        const entityValue = entity[entityField] as unknown as string;
        const permissionCheck = applyMeta(
          entityValue,
          GranularEntityPermissions.Show
        );
        return {
          entity,
          hasAccess: await this.canRoleDoThis(userRole, permissionCheck),
        };
      })
    );

    return entitiesCheck
      .filter(({ hasAccess }) => hasAccess)
      .map(({ entity }) => entity);
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

    await this._rolesPersistenceService.createItem(id, {
      id,
      permissions: [],
    });
  }

  async updateRoleDetails(roleId: string, { id }: Pick<IRole, "id">) {
    const role = await this._rolesPersistenceService.getItemOrFail(roleId);

    const madeRoleId = makeRoleId(id);

    if ((Object.values(SystemRoles) as string[]).includes(madeRoleId)) {
      throw new BadRequestError("Role already exist");
    }

    const newRole = await this._rolesPersistenceService.getItem(madeRoleId);

    if (newRole) {
      throw new BadRequestError("Role already exist");
    }

    await this._rolesPersistenceService.removeItem(roleId);

    await this._rolesPersistenceService.updateItem(madeRoleId, {
      ...role,
      id: madeRoleId,
    });
  }

  async removeRole(roleId: string) {
    await this._rolesPersistenceService.removeItem(roleId);
    await this._cacheService.clearItem(roleId);
  }

  async addPermission(roleId: string, permission: string) {
    const role = await this._rolesPersistenceService.getItemOrFail(roleId);

    await this._rolesPersistenceService.updateItem(roleId, {
      ...role,
      permissions: [...role.permissions, permission],
    });
    await this._cacheService.clearItem(roleId);
  }

  async removePermission(roleId: string, permission: string) {
    const role = await this._rolesPersistenceService.getItemOrFail(roleId);

    await this._rolesPersistenceService.updateItem(roleId, {
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
