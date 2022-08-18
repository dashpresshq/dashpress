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

export const setupUsersTestData = async () => {
  const configPersistenceService =
    createConfigDomainPersistenceService<IAccountUser>("users");

  await configPersistenceService.resetToEmpty();

  await configPersistenceService.saveAllItems("username", TEST_USERS);
};
