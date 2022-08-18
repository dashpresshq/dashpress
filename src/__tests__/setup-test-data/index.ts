import { setupAppConfigTestData } from "./_app-config";
import { setupRolesTestData } from "./_roles";
import { setupSchemaTestData } from "./_schema";
import { setupUsersTestData } from "./_users";

export const setupAllTestData = async () => {
  await setupRolesTestData();
  await setupAppConfigTestData();
  await setupUsersTestData();
  await setupSchemaTestData();
};
