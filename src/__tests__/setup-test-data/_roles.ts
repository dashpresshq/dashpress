import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IRole } from "backend/roles/roles.service";

const TEST_ROLES: IRole[] = [
  {
    id: "hello-there",
    permissions: [
      "CAN_RESET_PASSWORD",
      "CAN_MANAGE_PERMISSIONS",
      "CAN_ACCESS_ENTITY:ALL_ENTITIES",
      "CAN_ACCESS_ENTITY:COURSES",
      "CAN_ACCESS_ENTITY:DEALVIEWS",
      "CAN_ACCESS_ENTITY:EVENTLIKES",
    ],
  },
  {
    id: "root-user",
    permissions: [
      "CAN_ACCESS_ENTITY:CONTACTUSTHREAD",
      "CAN_ACCESS_ENTITY:CONTACTUSTYPES",
      "CAN_ACCESS_ENTITY:COURSES",
      "CAN_ACCESS_ENTITY:DEALSPECS",
      "CAN_ACCESS_ENTITY:DEALVIEWS",
    ],
  },
];

export const setupRolesTestData = async () => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IRole>("roles");

  await configPersistenceService.resetToEmpty();

  await configPersistenceService.saveAllItems("id", TEST_ROLES);
};
