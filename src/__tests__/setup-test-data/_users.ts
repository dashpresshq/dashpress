import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";
import { IAccountUser } from "shared/types";

const TEST_USERS: IAccountUser[] = [
  {
    username: "root",
    password: "$2b$10$/9tw363jvQrylf4eLisJt.afEUphLLaDSfhkweYPhC0ayTJp7Zo0a",
    name: "Root User",
    role: "creator",
    systemProfile: '{"userId": "1"}',
  },
];

export const setupUsersTestData = async (
  testUsers: IAccountUser[] | false = TEST_USERS
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IAccountUser>("users");

  await configPersistenceService.resetToEmpty();

  if (testUsers === false) {
    return;
  }

  await configPersistenceService.resetState("username", testUsers);
};
