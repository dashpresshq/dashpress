import { createCacheService } from "backend/lib/cache";
import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IRole } from "backend/roles/roles.service";

const TEST_ROLES: IRole[] = [
  {
    id: "some-admin-permissions",
    permissions: ["CAN_RESET_PASSWORD", "CAN_MANAGE_PERMISSIONS"],
  },
  {
    id: "view-all-data-only",
    permissions: [],
  },
];

export const setupRolesTestData = async (testRoles: IRole[] = TEST_ROLES) => {
  const cacheService = createCacheService("permission");

  await cacheService.purge();

  const configPersistenceService =
    createConfigDomainPersistenceService<IRole>("roles");

  await configPersistenceService.resetState("id", testRoles);
};
