import { setupAppConfigTestData } from "./_app-config";
import { setupCredentialsTestData } from "./_credentials";
import { setupRolesTestData } from "./_roles";
import { setupSchemaTestData } from "./_schema";
import { setupUsersTestData } from "./_users";

export const setupAllTestData = async () => {
  await Promise.all([
    setupCredentialsTestData(),
    setupRolesTestData(),
    setupAppConfigTestData(),
    setupUsersTestData(),
    setupSchemaTestData(),
  ]);
};
